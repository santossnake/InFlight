import React, { useState, useEffect } from 'react';
import { calculateIts, getApprovalLevel } from '../data/ormConfig';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface FuelLog {
  zuluTime: string;
  fuel: number;
  elapsedMins: number;
}

interface MissionFolderProps {
  missionLogs: { [key: string]: string };
  fuelInit: string;
  fuelCurrent: string;
  fuelLogs: FuelLog[];
  engOnTotal: { hrs: number; mins: number; totalMins: number } | null;
  flightTotal: { hrs: number; mins: number; totalMins: number } | null;
}

interface CrewOpRow {
  trig: string;
  funcao: string;
  inicio1: string;
  fim1: string;
  inicio2: string;
  fim2: string;
  total: string;
}

interface CrewUniRow {
  trig: string;
  autoTo: boolean;
  autoLand: boolean;
  att: string | number;
  hoto: boolean;
  isr: boolean;
  lidar: boolean;
  gsTo: string;
  gsLand: string;
}

export default function MissionFolder({
  missionLogs,
  fuelInit,
  fuelCurrent,
  fuelLogs,
  engOnTotal,
  flightTotal
}: MissionFolderProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // General Info State
  const [general, setGeneral] = useState(() => {
    const saved = localStorage.getItem('mf_general');
    return saved ? JSON.parse(saved) : {
      re: '',
      missionName: '',
      folderNum: 'OP26021',
      logbook: '',
      mgoQuali: '',
      date: new Date().toISOString().split('T')[0],
      ac: '',
      tailNo: '',
      airtask: '',
      flightNo: '',
      cs: '',
      iff: '',
      from: '',
      to: '',
      alts: '',
      initAlt: '',
      qnh: '',
      mbarOffset: '',
      iat: '',
      rpmM: '',
      idle: '',
      thrMin: '',
      etd: '',
      eta: '',
      ete: '',
      atr: '',
      towerTo: '',
      towerLand: '',
      hoToStart: '',
      hoToEnd: '',
      onstationStart: '',
      onstationEnd: '',
      mcSignature: '',
      crewCount: ''
    };
  });

  // Dynamic Crew tables
  const [crewOp, setCrewOp] = useState<CrewOpRow[]>(() => {
    const saved = localStorage.getItem('mf_crew_op');
    return saved ? JSON.parse(saved) : [
      { trig: '', funcao: 'MC', inicio1: '', fim1: '', inicio2: '', fim2: '', total: '' },
      { trig: '', funcao: 'PRI', inicio1: '', fim1: '', inicio2: '', fim2: '', total: '' },
      { trig: '', funcao: 'PRE', inicio1: '', fim1: '', inicio2: '', fim2: '', total: '' },
      { trig: '', funcao: 'OS', inicio1: '', fim1: '', inicio2: '', fim2: '', total: '' }
    ];
  });

  const [crewUni, setCrewUni] = useState<CrewUniRow[]>(() => {
    const saved = localStorage.getItem('mf_crew_uni');
    return saved ? JSON.parse(saved) : [
      { trig: '', autoTo: false, autoLand: false, att: '', hoto: false, isr: false, lidar: false, gsTo: '', gsLand: '' }
    ];
  });

  // Briefings
  const [briefings, setBriefings] = useState(() => {
    const saved = localStorage.getItem('mf_briefings');
    return saved ? JSON.parse(saved) : {
      considerations: '',
      safety: '',
      to: '',
      land: '',
      meat: '',
      others: ''
    };
  });

  // ORM State
  const [ormSelections, setOrmSelections] = useState<{ [key: string]: any }>(() => {
    const saved = localStorage.getItem('mf_orm_selections');
    return saved ? JSON.parse(saved) : {
      personal_punct_pax: '0',
      personal_recurr_pax: '0'
    };
  });

  // ITS State
  const [itsInput, setItsInput] = useState(() => {
    const saved = localStorage.getItem('mf_its_input');
    return saved ? JSON.parse(saved) : { temp: '', humidity: '' };
  });

  // XWind State
  const [xwindInput, setXwindInput] = useState(() => {
    const saved = localStorage.getItem('mf_xwind_input');
    return saved ? JSON.parse(saved) : { rwy: '', windDir: '', windSpeed: '', gust: '', halfGust: false };
  });

  // Sync general values on changes
  useEffect(() => {
    localStorage.setItem('mf_general', JSON.stringify(general));
  }, [general]);

  useEffect(() => {
    localStorage.setItem('mf_crew_op', JSON.stringify(crewOp));
  }, [crewOp]);

  useEffect(() => {
    localStorage.setItem('mf_crew_uni', JSON.stringify(crewUni));
  }, [crewUni]);

  useEffect(() => {
    localStorage.setItem('mf_briefings', JSON.stringify(briefings));
  }, [briefings]);

  useEffect(() => {
    localStorage.setItem('mf_orm_selections', JSON.stringify(ormSelections));
  }, [ormSelections]);

  useEffect(() => {
    localStorage.setItem('mf_its_input', JSON.stringify(itsInput));
  }, [itsInput]);

  useEffect(() => {
    localStorage.setItem('mf_xwind_input', JSON.stringify(xwindInput));
  }, [xwindInput]);

  // Sync from parent state (missionLogs, fuel, etc.)
  useEffect(() => {
    setGeneral((prev: any) => ({
      ...prev,
      eOn: missionLogs['eng-on'] || prev.eOn || '',
      atd: missionLogs['atd'] || prev.atd || '',
      ata: missionLogs['ata'] || prev.ata || '',
      eOff: missionLogs['eng-off'] || prev.eOff || '',
      indFuel: fuelInit || prev.indFuel || ''
    }));
  }, [missionLogs, fuelInit]);

  // Calculations
  const formatTimeDiff = (diff: { hrs: number; mins: number } | null) => {
    if (!diff) return '';
    return `${diff.hrs.toString().padStart(2, '0')}:${diff.mins.toString().padStart(2, '0')}`;
  };

  const computedEOn = general.eOn || missionLogs['eng-on'] || '';
  const computedATD = general.atd || missionLogs['atd'] || '';
  const computedATA = general.ata || missionLogs['ata'] || '';
  const computedEOff = general.eOff || missionLogs['eng-off'] || '';

  const parseTime = (timeStr: string) => {
    if (!timeStr) return null;
    const clean = timeStr.replace(/[^0-9]/g, '');
    if (clean.length === 4) {
      const hrs = parseInt(clean.substring(0, 2));
      const mins = parseInt(clean.substring(2, 4));
      if (hrs >= 0 && hrs < 24 && mins >= 0 && mins < 60) {
        return { hrs, mins };
      }
    }
    if (timeStr.includes(':')) {
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        const hrs = parseInt(parts[0]);
        const mins = parseInt(parts[1]);
        if (!isNaN(hrs) && !isNaN(mins) && hrs >= 0 && hrs < 24 && mins >= 0 && mins < 60) {
          return { hrs, mins };
        }
      }
    }
    return null;
  };

  const calculateHoursTotal = (start: string, end: string) => {
    const t1 = parseTime(start);
    const t2 = parseTime(end);
    if (!t1 || !t2) return null;
    let diffMins = (t2.hrs * 60 + t2.mins) - (t1.hrs * 60 + t1.mins);
    if (diffMins < 0) diffMins += 24 * 60; // Crosses midnight
    const hrs = Math.floor(diffMins / 60);
    const mins = Math.round(diffMins % 60);
    return { hrs, mins, totalMins: diffMins };
  };

  const calculateRowTotal = (row: CrewOpRow) => {
    let totalMins = 0;
    if (row.inicio1 && row.fim1) {
      const diff1 = calculateHoursTotal(row.inicio1, row.fim1);
      if (diff1) totalMins += diff1.totalMins;
    }
    if (row.inicio2 && row.fim2) {
      const diff2 = calculateHoursTotal(row.inicio2, row.fim2);
      if (diff2) totalMins += diff2.totalMins;
    }
    if (totalMins === 0) return '';
    const hrs = Math.floor(totalMins / 60);
    const mins = Math.round(totalMins % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const computedETotal = formatTimeDiff(calculateHoursTotal(computedEOn, computedEOff)) || formatTimeDiff(engOnTotal);
  const computedATE = formatTimeDiff(calculateHoursTotal(computedATD, computedATA)) || formatTimeDiff(flightTotal);

  // Auto-calculated ITS
  const itsResult = calculateIts(parseFloat(itsInput.temp), parseFloat(itsInput.humidity));

  // Determine ITS ORM score
  useEffect(() => {
    if (itsResult.zone) {
      setOrmSelections(prev => {
        const next = { ...prev };
        if (itsResult.zone === 'CAUTION') {
          next['its'] = 'c';
        } else if (itsResult.zone === 'DANGER') {
          next['its'] = 'd';
        } else {
          delete next['its'];
        }
        return next;
      });
    }
  }, [itsResult.zone]);

  // Auto-calculated Crosswind
  const calculateCrosswindValue = () => {
    const rwyRaw = parseFloat(xwindInput.rwy);
    const windDir = parseFloat(xwindInput.windDir);
    const windSpeed = parseFloat(xwindInput.windSpeed) || 0;
    const gust = parseFloat(xwindInput.gust) || 0;

    if (isNaN(rwyRaw) || isNaN(windDir)) return null;

    let rwyAngle = rwyRaw;
    if (rwyRaw <= 36) {
      rwyAngle = rwyRaw * 10;
    }

    let effectiveWind = windSpeed;
    if (gust > windSpeed) {
      const gustFactor = gust - windSpeed;
      effectiveWind = windSpeed + (xwindInput.halfGust ? 0.5 : 1.0) * gustFactor;
    }

    const angleDiff = Math.abs(windDir - rwyAngle);
    const angleRad = (angleDiff * Math.PI) / 180;
    const crosswind = effectiveWind * Math.abs(Math.sin(angleRad));

    return Math.round(crosswind * 10) / 10;
  };

  const xwindResult = calculateCrosswindValue();

  useEffect(() => {
    if (xwindResult !== null) {
      setOrmSelections(prev => {
        const next = { ...prev };
        if (xwindResult >= 7) {
          next['xwind'] = 'xw_7';
        } else if (xwindResult >= 5) {
          next['xwind'] = 'xw_5';
        } else {
          delete next['xwind'];
        }
        return next;
      });
    }
  }, [xwindResult]);

  useEffect(() => {
    if (isGeneratingPdf) {
      setTimeout(() => {
        const element = document.querySelector('.print-mission-folder');
        if (element) {
          // Sync checkbox/radio states
          element.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((input: any) => {
            if (input.checked) {
              input.setAttribute('checked', 'true');
            } else {
              input.removeAttribute('checked');
            }
          });

          // Replace text/date inputs with spans for perfect PDF rendering
          element.querySelectorAll('input:not([type="checkbox"]):not([type="radio"])').forEach((input: any) => {
            const span = document.createElement('span');
            span.textContent = input.value;
            span.className = input.className;
            span.style.cssText = input.style.cssText;
            span.style.color = 'black';
            span.style.fontWeight = 'bold';
            span.style.display = 'inline-block';
            span.style.fontSize = '0.9em';
            input.parentNode.replaceChild(span, input);
          });

          // Replace textareas with divs
          element.querySelectorAll('textarea').forEach((textarea: any) => {
            const div = document.createElement('div');
            div.textContent = textarea.value;
            div.className = textarea.className;
            div.style.cssText = textarea.style.cssText;
            div.style.whiteSpace = 'pre-wrap';
            div.style.color = 'black';
            div.style.minHeight = textarea.style.height || '50px';
            textarea.parentNode.replaceChild(div, textarea);
          });

          // Replace selects with spans
          element.querySelectorAll('select').forEach((select: any) => {
            const span = document.createElement('span');
            span.textContent = select.options[select.selectedIndex]?.text || '';
            span.className = select.className;
            span.style.cssText = select.style.cssText;
            span.style.color = 'black';
            span.style.fontWeight = 'bold';
            select.parentNode.replaceChild(span, select);
          });

          const opt = {
            margin:       0,
            filename:     `Mission_Folder_${general.folderNum || 'OP'}_${general.date || ''}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
              scale: 2, 
              useCORS: true,
              logging: false
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: 'css' }
          };
          html2pdf().from(element).set(opt).save().then(() => {
            setIsGeneratingPdf(false);
          }).catch(() => {
            setIsGeneratingPdf(false);
          });
        } else {
          setIsGeneratingPdf(false);
        }
      }, 300);
    }
  }, [isGeneratingPdf]);

  // ORM calculation
  const calculateOrmScore = () => {
    let score = 0;
    
    // Operational
    if (ormSelections['type'] === 'isr') score += 4;
    else if (ormSelections['type'] === 'trq_i') score += 3;
    else if (ormSelections['type'] === 'mnt_accept') score += 6;
    else if (ormSelections['type'] === 'tru') score += 2;
    if (ormSelections['strg']) score += 3;
    if (ormSelections['ho']) score += 3;
    if (ormSelections['nf']) score += 4;

    // Human
    if (ormSelections['out_sh'] === 'week') score += 3;
    else if (ormSelections['out_sh'] === 'wknd') score += 5;
    
    const punctPax = parseInt(ormSelections['personal_punct_pax'] || '0') || 0;
    const recurrPax = parseInt(ormSelections['personal_recurr_pax'] || '0') || 0;
    score += 2 * punctPax;
    score += 4 * recurrPax;
    
    if (ormSelections['cr']) score += 60;
    if (ormSelections['pl_ch']) score += 4;
    if (ormSelections['eet']) score += 2;
    
    if (ormSelections['unexp_pri']) score += 3;
    if (ormSelections['unexp_pre']) score += 6;
    
    if (ormSelections['no_fly_pri']) score += 2;
    if (ormSelections['no_fly_pre']) score += 4;
    
    if (ormSelections['event'] === '2nd') score += 2;
    else if (ormSelections['event'] === '3rd_more') score += 4;
    
    if (ormSelections['detached'] === 'det_5') score += 3;
    else if (ormSelections['detached'] === 'det_8') score += 6;

    // Material
    if (ormSelections['rwy_l']) score += 4;
    if (ormSelections['rwy_w']) score += 4;
    if (ormSelections['fod']) score += 4;
    if (ormSelections['bkp_sys']) score += 38;

    // Environmental
    if (ormSelections['xwind'] === 'xw_5') score += 3;
    else if (ormSelections['xwind'] === 'xw_7') score += 6;
    
    if (ormSelections['iat_to'] === 'temp_lo') score += 3;
    else if (ormSelections['iat_to'] === 'temp_hi') score += 3;
    
    if (ormSelections['its'] === 'c') score += 6;
    else if (ormSelections['its'] === 'd') score += 9;
    
    if (ormSelections['rain_prob'] === 'rain_2') score += 3;
    else if (ormSelections['rain_prob'] === 'rain_5') score += 6;
    
    if (ormSelections['rwy_wet']) score += 3;
    if (ormSelections['enroute_temp']) score += 2;
    if (ormSelections['enroute_wind']) score += 2;
    
    if (ormSelections['over_populated'] === 'low_density') score += 2;
    else if (ormSelections['over_populated'] === 'high_density') score += 5;

    return score;
  };

  const ormScore = calculateOrmScore();
  const approval = getApprovalLevel(ormScore);

  // Toggle Checkbox
  const toggleCheckbox = (id: string) => {
    setOrmSelections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Select Radio option
  const selectRadio = (id: string, optId: string) => {
    if (id === 'its') return; // ITS is auto calculated
    setOrmSelections(prev => {
      const next = { ...prev };
      if (next[id] === optId) {
        delete next[id]; // De-select if already selected
      } else {
        next[id] = optId; // Select otherwise
      }
      return next;
    });
  };

  const isSelected = (id: string, optId?: string) => {
    if (optId) {
      return ormSelections[id] === optId;
    }
    return !!ormSelections[id];
  };

  // Dynamic row managers
  const addCrewOpRow = () => {
    setCrewOp([...crewOp, { trig: '', funcao: '', inicio1: '', fim1: '', inicio2: '', fim2: '', total: '' }]);
  };
  const removeCrewOpRow = (index: number) => {
    const next = [...crewOp];
    next.splice(index, 1);
    setCrewOp(next);
  };

  const addCrewUniRow = () => {
    setCrewUni([...crewUni, { trig: '', autoTo: false, autoLand: false, att: '', hoto: false, isr: false, lidar: false, gsTo: '', gsLand: '' }]);
  };
  const removeCrewUniRow = (index: number) => {
    const next = [...crewUni];
    next.splice(index, 1);
    setCrewUni(next);
  };

  const handlePrint = () => {
    setIsGeneratingPdf(true);
  };

  const mapFuelToY = (f: number) => 220 - (f / 16) * 200;
  const mapTimeToX = (h: number) => 40 + (h / 15) * 400;

  const uniqueCrewCount = new Set(
    crewOp.map(c => c.trig.trim().toUpperCase()).filter(t => t !== '')
  ).size;

  const initialFuel = parseFloat(fuelInit || general.indFuel) || 16;

  return (
    <div className="mission-folder-container" style={{ padding: '20px 0' }}>
      {/* UI Controls */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '15px', backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>Mission Folder Interativo (ZULU Time)</h3>
          <span style={{ fontSize: '0.85em', opacity: 0.8 }}>Preencha os campos abaixo e clique em Gerar PDF para transferir o documento.</span>
        </div>
        <button 
          onClick={handlePrint}
          disabled={isGeneratingPdf}
          style={{ padding: '10px 20px', backgroundColor: isGeneratingPdf ? '#aaa' : 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: isGeneratingPdf ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {isGeneratingPdf ? '⏳ A Gerar PDF...' : '📄 Gerar PDF (Download)'}
        </button>
      </div>

      <div className={`print-mission-folder ${isGeneratingPdf ? 'is-generating-pdf' : ''}`}>
        {/* PAGE 1 */}
        <div className="print-page page-1">
          <div className="mf-header">
            <div className="header-left">
              <div>RE: <input type="text" value={general.re} onChange={e => setGeneral({...general, re: e.target.value})} /></div>
              <div>Mission: <input type="text" value={general.missionName} onChange={e => setGeneral({...general, missionName: e.target.value})} /></div>
            </div>
            <div className="header-center">
              <h2 style={{ color: '#d32f2f', margin: 0, fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                Mission Folder - 
                <input 
                  type="text" 
                  value={general.folderNum} 
                  onChange={e => setGeneral({...general, folderNum: e.target.value})} 
                  style={{ color: '#d32f2f', border: 'none', borderBottom: '1px dashed #d32f2f', width: '90px', padding: 0, fontSize: 'inherit', fontWeight: 'bold', textAlign: 'center' }} 
                />
              </h2>
              <span className="subtitle">991SQN MISSION FOLDER</span>
            </div>
            <div className="header-right">
              <div>LOGBOOK: <input type="text" value={general.logbook} onChange={e => setGeneral({...general, logbook: e.target.value})} /></div>
              <div>MGO / Quali.: <input type="text" value={general.mgoQuali} onChange={e => setGeneral({...general, mgoQuali: e.target.value})} /></div>
            </div>
          </div>

          <div className="grid-inputs-container">
            <div className="input-row">
              <div className="col">DATE: <input type="date" value={general.date} onChange={e => setGeneral({...general, date: e.target.value})} /></div>
              <div className="col">A/C: <input type="text" value={general.ac} onChange={e => setGeneral({...general, ac: e.target.value})} /></div>
              <div className="col">TAIL Nº: <input type="text" value={general.tailNo} onChange={e => setGeneral({...general, tailNo: e.target.value})} /></div>
              <div className="col">AIRTASK: <input type="text" value={general.airtask} onChange={e => setGeneral({...general, airtask: e.target.value})} /></div>
              <div className="col">FLIGHT Nº: <input type="text" value={general.flightNo} onChange={e => setGeneral({...general, flightNo: e.target.value})} /></div>
            </div>
            <div className="input-row">
              <div className="col">C/S: <input type="text" value={general.cs} onChange={e => setGeneral({...general, cs: e.target.value})} /></div>
              <div className="col">IFF: <input type="text" value={general.iff} onChange={e => setGeneral({...general, iff: e.target.value})} /></div>
              <div className="col">FROM: <input type="text" value={general.from} onChange={e => setGeneral({...general, from: e.target.value})} /></div>
              <div className="col">TO: <input type="text" value={general.to} onChange={e => setGeneral({...general, to: e.target.value})} /></div>
              <div className="col">ALTs: <input type="text" value={general.alts} onChange={e => setGeneral({...general, alts: e.target.value})} /></div>
            </div>
            <div className="input-row">
              <div className="col">INIT ALT: <input type="text" value={general.initAlt} onChange={e => setGeneral({...general, initAlt: e.target.value})} /></div>
              <div className="col">IND FUEL: <input type="text" value={general.indFuel} onChange={e => setGeneral({...general, indFuel: e.target.value})} /></div>
              <div className="col">QNH (hPa): <input type="text" value={general.qnh} onChange={e => setGeneral({...general, qnh: e.target.value})} /></div>
              <div className="col">[mBar]Offset: <input type="text" value={general.mbarOffset} onChange={e => setGeneral({...general, mbarOffset: e.target.value})} /></div>
              <div className="col">IAT (ºC): <input type="text" value={general.iat} onChange={e => setGeneral({...general, iat: e.target.value})} /></div>
            </div>
            <div className="input-row">
              <div className="col">RPM M: <input type="text" value={general.rpmM} onChange={e => setGeneral({...general, rpmM: e.target.value})} /></div>
              <div className="col">IDLE: <input type="text" value={general.idle} onChange={e => setGeneral({...general, idle: e.target.value})} /></div>
              <div className="col">THR MIN %: <input type="text" value={general.thrMin} onChange={e => setGeneral({...general, thrMin: e.target.value})} /></div>
              <div className="col">ETD (Z): <input type="text" placeholder="--:-- Z" value={general.etd} onChange={e => setGeneral({...general, etd: e.target.value})} /></div>
              <div className="col">ETA (Z): <input type="text" placeholder="--:-- Z" value={general.eta} onChange={e => setGeneral({...general, eta: e.target.value})} /></div>
              <div className="col">ETE: <input type="text" placeholder="HH:MM" value={general.ete} onChange={e => setGeneral({...general, ete: e.target.value})} /></div>
            </div>
            <div className="input-row">
              <div className="col">Nº Tripulantes: <input type="number" value={general.crewCount !== undefined && general.crewCount !== '' ? general.crewCount : uniqueCrewCount} onChange={e => setGeneral({...general, crewCount: e.target.value})} /></div>
              <div className="col">ATR: <input type="text" value={general.atr} onChange={e => setGeneral({...general, atr: e.target.value})} /></div>
              <div className="col">ATD (Z): <input type="text" placeholder="--:-- Z" value={computedATD} onChange={e => setGeneral({...general, atd: e.target.value})} /></div>
              <div className="col">ATA (Z): <input type="text" placeholder="--:-- Z" value={computedATA} onChange={e => setGeneral({...general, ata: e.target.value})} /></div>
              <div className="col">ATE: <input type="text" placeholder="HH:MM" readOnly value={computedATE} /></div>
            </div>
            <div className="input-row">
              <div className="col">E/On (Z): <input type="text" placeholder="--:-- Z" value={computedEOn} onChange={e => setGeneral({...general, eOn: e.target.value})} /></div>
              <div className="col">Tower T/O (Z): <input type="text" placeholder="--:-- Z" value={general.towerTo} onChange={e => setGeneral({...general, towerTo: e.target.value})} /></div>
              <div className="col">Tower Land (Z): <input type="text" placeholder="--:-- Z" value={general.towerLand} onChange={e => setGeneral({...general, towerLand: e.target.value})} /></div>
              <div className="col">E/Off (Z): <input type="text" placeholder="--:-- Z" value={computedEOff} onChange={e => setGeneral({...general, eOff: e.target.value})} /></div>
              <div className="col">E/Total: <input type="text" placeholder="HH:MM" readOnly value={computedETotal} /></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
            <div style={{ flex: '1.2' }}>
              <table className="time-shifts-table">
                <tbody>
                  <tr>
                    <td className="bold">HO / TO (Z)</td>
                    <td>➔</td>
                    <td><input type="text" placeholder="--:--" value={general.hoToStart} onChange={e => setGeneral({...general, hoToStart: e.target.value})} /></td>
                    <td style={{ width: '10px', textAlign: 'center' }}>|</td>
                    <td><input type="text" placeholder="--:--" value={general.hoToEnd} onChange={e => setGeneral({...general, hoToEnd: e.target.value})} /></td>
                  </tr>
                  <tr>
                    <td className="bold">ONSTATION / OFFSTATION (Z)</td>
                    <td>➔</td>
                    <td><input type="text" placeholder="--:--" value={general.onstationStart} onChange={e => setGeneral({...general, onstationStart: e.target.value})} /></td>
                    <td style={{ width: '10px', textAlign: 'center' }}>|</td>
                    <td><input type="text" placeholder="--:--" value={general.onstationEnd} onChange={e => setGeneral({...general, onstationEnd: e.target.value})} /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ flex: '0.8', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px', backgroundColor: approval.bg }}>
              <span style={{ fontSize: '0.75em', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>ORM MATRIX RESULT:</span>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: approval.color }}>
                {ormScore} - {approval.level}
              </div>
            </div>
          </div>

          {/* SVG Endurance Chart */}
          <div className="endurance-chart-container" style={{ marginTop: '20px', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px', position: 'relative' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '0.85em', textAlign: 'center' }}>ENDURANCE REFERENCE CHART & ACTIVE FLIGHT BURN</h4>
            <svg viewBox="0 0 480 250" style={{ width: '100%', height: 'auto', backgroundColor: '#fcfcfc' }}>
              {Array.from({ length: 9 }).map((_, i) => {
                const f = i * 2;
                const y = mapFuelToY(f);
                return (
                  <g key={`y-${i}`}>
                    <line x1="40" y1={y} x2="440" y2={y} stroke="#e0e0e0" strokeWidth="0.5" />
                    <text x="35" y={y + 3} fontSize="7" textAnchor="end" fontFamily="monospace">{f.toFixed(1)}L</text>
                  </g>
                );
              })}
              {Array.from({ length: 16 }).map((_, i) => {
                const x = mapTimeToX(i);
                return (
                  <g key={`x-${i}`}>
                    <line x1={x} y1="20" x2={x} y2="220" stroke="#e0e0e0" strokeWidth="0.5" />
                    <text x={x} y="230" fontSize="7" textAnchor="middle" fontFamily="monospace">{i}h</text>
                  </g>
                );
              })}

              <line x1="40" y1={mapFuelToY(2.5)} x2="440" y2={mapFuelToY(2.5)} stroke="#d32f2f" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x="445" y={mapFuelToY(2.5) + 3} fontSize="7" fill="#d32f2f" fontWeight="bold">BINGO 2.5L</text>

              <line x1={mapTimeToX(0)} y1={mapFuelToY(initialFuel)} x2={mapTimeToX(initialFuel)} y2={mapFuelToY(0)} stroke="#1976d2" strokeWidth="1" />
              <text x={mapTimeToX(initialFuel * 0.75)} y={mapFuelToY(initialFuel * 0.25) - 5} fontSize="6" fill="#1976d2">1 L/H</text>

              <line x1={mapTimeToX(0)} y1={mapFuelToY(initialFuel)} x2={mapTimeToX(initialFuel / 1.25)} y2={mapFuelToY(0)} stroke="#388e3c" strokeWidth="1" />
              <text x={mapTimeToX(initialFuel / 1.25 * 0.75)} y={mapFuelToY(initialFuel * 0.25) - 5} fontSize="6" fill="#388e3c">1.25 L/H</text>

              <line x1={mapTimeToX(0)} y1={mapFuelToY(initialFuel)} x2={mapTimeToX(initialFuel / 1.5)} y2={mapFuelToY(0)} stroke="#fbc02d" strokeWidth="1" />
              <text x={mapTimeToX(initialFuel / 1.5 * 0.75)} y={mapFuelToY(initialFuel * 0.25) - 5} fontSize="6" fill="#fbc02d">1.5 L/H</text>

              <line x1={mapTimeToX(0)} y1={mapFuelToY(initialFuel)} x2={mapTimeToX(initialFuel / 2)} y2={mapFuelToY(0)} stroke="#d32f2f" strokeWidth="1" />
              <text x={mapTimeToX(initialFuel / 2 * 0.75)} y={mapFuelToY(initialFuel * 0.25) - 5} fontSize="6" fill="#d32f2f">2 L/H</text>

              {fuelLogs && fuelLogs.length > 0 && (
                <>
                  <path
                    d={fuelLogs.map((log, i) => {
                      const diff = calculateHoursTotal(computedEOn, log.zuluTime);
                      const elapsedMins = diff !== null ? diff.totalMins : log.elapsedMins;
                      const x = mapTimeToX(elapsedMins / 60);
                      const y = mapFuelToY(log.fuel);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#8e24aa"
                    strokeWidth="2"
                  />
                  {fuelLogs.map((log, i) => {
                    const diff = calculateHoursTotal(computedEOn, log.zuluTime);
                    const elapsedMins = diff !== null ? diff.totalMins : log.elapsedMins;
                    const x = mapTimeToX(elapsedMins / 60);
                    const y = mapFuelToY(log.fuel);
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="3.5" fill="#8e24aa" />
                        <text x={x + 5} y={y - 5} fontSize="6" fontWeight="bold" fill="#8e24aa">
                          {log.fuel.toFixed(1)}L ({log.zuluTime}Z)
                        </text>
                      </g>
                    );
                  })}
                </>
              )}
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
            <div></div>
            <div className="bold" style={{ borderBottom: '1px solid black', width: '150px', textAlign: 'center', fontSize: '0.9em' }}>
              MC: <input type="text" placeholder="Assinatura" style={{ border: 'none', width: '120px', padding: 0, textAlign: 'center' }} value={general.mcSignature} onChange={e => setGeneral({...general, mcSignature: e.target.value})} />
            </div>
            <div style={{ fontSize: '0.7em', opacity: 0.7 }}>MP 6/42</div>
          </div>
        </div>

        {/* PAGE 2 */}
        <div className="print-page page-2">
          <h3 style={{ borderBottom: '2px solid black', paddingBottom: '5px' }}>Operações</h3>
          <table className="crew-table operations-grid">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>TRIG</th>
                <th style={{ width: '120px' }}>Função</th>
                <th>Início (Z)</th>
                <th>Fim (Z)</th>
                <th>Início (Z)</th>
                <th>Fim (Z)</th>
                <th style={{ width: '80px' }}>Total</th>
                <th className="no-print" style={{ width: '50px' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {crewOp.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <input 
                      type="text" 
                      value={row.trig} 
                      onChange={e => {
                        const next = [...crewOp];
                        next[idx].trig = e.target.value.toUpperCase();
                        setCrewOp(next);
                      }} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      list="crew-functions" 
                      value={row.funcao}
                      placeholder="Função"
                      onChange={e => {
                        const next = [...crewOp];
                        next[idx].funcao = e.target.value.toUpperCase();
                        setCrewOp(next);
                      }} 
                    />
                    <datalist id="crew-functions">
                      <option value="MC" />
                      <option value="PRI" />
                      <option value="PRE" />
                      <option value="OS" />
                      <option value="TRIP" />
                      <option value="PRI-I" />
                      <option value="PRI-A" />
                      <option value="PRE-I" />
                      <option value="PRE-A" />
                    </datalist>
                  </td>
                  <td>
                    <input 
                      type="text" 
                      placeholder="--:--" 
                      value={row.inicio1} 
                      onChange={e => {
                        const next = [...crewOp];
                        next[idx].inicio1 = e.target.value;
                        setCrewOp(next);
                      }} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      placeholder="--:--" 
                      value={row.fim1} 
                      onChange={e => {
                        const next = [...crewOp];
                        next[idx].fim1 = e.target.value;
                        setCrewOp(next);
                      }} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      placeholder="--:--" 
                      value={row.inicio2} 
                      onChange={e => {
                        const next = [...crewOp];
                        next[idx].inicio2 = e.target.value;
                        setCrewOp(next);
                      }} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      placeholder="--:--" 
                      value={row.fim2} 
                      onChange={e => {
                        const next = [...crewOp];
                        next[idx].fim2 = e.target.value;
                        setCrewOp(next);
                      }} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      placeholder="HH:MM" 
                      readOnly
                      value={calculateRowTotal(row)} 
                      style={{ textAlign: 'center', fontWeight: 'bold' }}
                    />
                  </td>
                  <td className="no-print">
                    <button onClick={() => removeCrewOpRow(idx)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="no-print" onClick={addCrewOpRow} style={{ padding: '5px 10px', marginTop: '5px', cursor: 'pointer' }}>➕ Adicionar Tripulante</button>

          <h3 style={{ borderBottom: '2px solid black', paddingBottom: '5px', marginTop: '40px' }}>Uniformização</h3>
          <table className="crew-table uniformity-grid">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>TRIG</th>
                <th>Auto-T/O</th>
                <th>Auto Land</th>
                <th>ATT</th>
                <th>HO/TO</th>
                <th>ISR</th>
                <th>LIDAR</th>
                <th>GS T/O</th>
                <th>GS Land</th>
                <th className="no-print" style={{ width: '50px' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {crewUni.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <input 
                      type="text" 
                      value={row.trig} 
                      onChange={e => {
                        const next = [...crewUni];
                        next[idx].trig = e.target.value.toUpperCase();
                        setCrewUni(next);
                      }} 
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={row.autoTo} 
                      onChange={e => {
                        const next = [...crewUni];
                        next[idx].autoTo = e.target.checked;
                        setCrewUni(next);
                      }} 
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={row.autoLand} 
                      onChange={e => {
                        const next = [...crewUni];
                        next[idx].autoLand = e.target.checked;
                        setCrewUni(next);
                      }} 
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="number" 
                      min="0"
                      value={row.att} 
                      onChange={e => {
                        const next = [...crewUni];
                        next[idx].att = e.target.value;
                        setCrewUni(next);
                      }} 
                      style={{ width: '50px', border: '1px solid #ccc', borderRadius: '3px', textAlign: 'center', fontWeight: 'bold' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={row.hoto} 
                      onChange={e => {
                        const next = [...crewUni];
                        next[idx].hoto = e.target.checked;
                        setCrewUni(next);
                      }} 
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={row.isr} 
                      onChange={e => {
                        const next = [...crewUni];
                        next[idx].isr = e.target.checked;
                        setCrewUni(next);
                      }} 
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={row.lidar} 
                      onChange={e => {
                        const next = [...crewUni];
                        next[idx].lidar = e.target.checked;
                        setCrewUni(next);
                      }} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      value={row.gsTo} 
                      onChange={e => {
                        const next = [...crewUni];
                        next[idx].gsTo = e.target.value;
                        setCrewUni(next);
                      }} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      value={row.gsLand} 
                      onChange={e => {
                        const next = [...crewUni];
                        next[idx].gsLand = e.target.value;
                        setCrewUni(next);
                      }} 
                    />
                  </td>
                  <td className="no-print">
                    <button onClick={() => removeCrewUniRow(idx)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="no-print" onClick={addCrewUniRow} style={{ padding: '5px 10px', marginTop: '5px', cursor: 'pointer' }}>➕ Adicionar Uniformização</button>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid #ccc', paddingTop: '10px', position: 'absolute', bottom: '10mm', left: '10mm', right: '10mm' }}>
            <div></div>
            <div style={{ fontSize: '0.7em', opacity: 0.7 }}>MP 7/42</div>
          </div>
        </div>

        {/* PAGE 3 */}
        <div className="print-page page-3">
          <h3 className="section-title">Briefing Considerations</h3>
          <textarea 
            className="briefing-textarea"
            placeholder="Insira as considerações de Briefing..."
            value={briefings.considerations}
            onChange={e => setBriefings({...briefings, considerations: e.target.value})}
          />

          <h3 className="section-title" style={{ marginTop: '20px' }}>Debriefing Points</h3>
          <div className="debriefing-box">
            <div className="label">SAFETY</div>
            <textarea value={briefings.safety} onChange={e => setBriefings({...briefings, safety: e.target.value})} />
          </div>
          <div className="debriefing-box">
            <div className="label">T/O</div>
            <textarea value={briefings.to} onChange={e => setBriefings({...briefings, to: e.target.value})} />
          </div>
          <div className="debriefing-box">
            <div className="label">LAND</div>
            <textarea value={briefings.land} onChange={e => setBriefings({...briefings, land: e.target.value})} />
          </div>
          <div className="debriefing-box">
            <div className="label">MEAT</div>
            <textarea value={briefings.meat} onChange={e => setBriefings({...briefings, meat: e.target.value})} />
          </div>
          <div className="debriefing-box">
            <div className="label">OTHERS</div>
            <textarea value={briefings.others} onChange={e => setBriefings({...briefings, others: e.target.value})} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid #ccc', paddingTop: '10px', position: 'absolute', bottom: '10mm', left: '10mm', right: '10mm' }}>
            <div></div>
            <div style={{ fontSize: '0.7em', opacity: 0.7 }}>MP 8/42</div>
          </div>
        </div>

        {/* PAGE 4 */}
        <div className="print-page page-4">
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* ORM MATRIX TABLE */}
            <div style={{ flex: '1.2' }}>
              <h3 style={{ margin: '0 0 10px 0', borderBottom: '2px solid black' }}>ORM MATRIX</h3>
              
              <table className="orm-grid-styled-table">
                <tbody>
                  {/* Operational Section */}
                  <tr>
                    <td colSpan={5} className="group-header" style={{ backgroundColor: '#d32f2f' }}>Operational</td>
                  </tr>
                  <tr>
                    <td rowSpan={2} className="row-header align-middle">Type</td>
                    <td className={`clickable ${isSelected('type', 'isr') ? 'selected-cell' : ''}`} onClick={() => selectRadio('type', 'isr')}>
                      {isSelected('type', 'isr') && '✓ '}ISR
                    </td>
                    <td className={`clickable center bold ${isSelected('type', 'isr') ? 'selected-cell' : ''}`} onClick={() => selectRadio('type', 'isr')}>4</td>
                    <td className={`clickable ${isSelected('type', 'trq_i') ? 'selected-cell' : ''}`} onClick={() => selectRadio('type', 'trq_i')}>
                      {isSelected('type', 'trq_i') && '✓ '}TRQ/I
                    </td>
                    <td className={`clickable center bold ${isSelected('type', 'trq_i') ? 'selected-cell' : ''}`} onClick={() => selectRadio('type', 'trq_i')}>3</td>
                  </tr>
                  <tr>
                    <td className={`clickable ${isSelected('type', 'mnt_accept') ? 'selected-cell' : ''}`} onClick={() => selectRadio('type', 'mnt_accept')}>
                      {isSelected('type', 'mnt_accept') && '✓ '}MNT/Accept.
                    </td>
                    <td className={`clickable center bold ${isSelected('type', 'mnt_accept') ? 'selected-cell' : ''}`} onClick={() => selectRadio('type', 'mnt_accept')}>6</td>
                    <td className={`clickable ${isSelected('type', 'tru') ? 'selected-cell' : ''}`} onClick={() => selectRadio('type', 'tru')}>
                      {isSelected('type', 'tru') && '✓ '}TRU
                    </td>
                    <td className={`clickable center bold ${isSelected('type', 'tru') ? 'selected-cell' : ''}`} onClick={() => selectRadio('type', 'tru')}>2</td>
                  </tr>
                  <tr>
                    <td className="row-header">Strg</td>
                    <td colSpan={3}></td>
                    <td className={`clickable center bold ${isSelected('strg') ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('strg')}>
                      {isSelected('strg') ? '✓ 3' : '3'}
                    </td>
                  </tr>
                  <tr>
                    <td className="row-header">H/O</td>
                    <td colSpan={3}></td>
                    <td className={`clickable center bold ${isSelected('ho') ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('ho')}>
                      {isSelected('ho') ? '✓ 3' : '3'}
                    </td>
                  </tr>
                  <tr>
                    <td className="row-header">NF</td>
                    <td colSpan={3}></td>
                    <td className={`clickable center bold ${isSelected('nf') ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('nf')}>
                      {isSelected('nf') ? '✓ 4' : '4'}
                    </td>
                  </tr>

                  {/* Human Section */}
                  <tr>
                    <td colSpan={5} className="group-header" style={{ backgroundColor: '#1976d2' }}>Human</td>
                  </tr>
                  <tr>
                    <td className="row-header">Out/SH</td>
                    <td className={`clickable ${isSelected('out_sh', 'week') ? 'selected-cell' : ''}`} onClick={() => selectRadio('out_sh', 'week')}>
                      {isSelected('out_sh', 'week') && '✓ '}Week
                    </td>
                    <td className={`clickable center bold ${isSelected('out_sh', 'week') ? 'selected-cell' : ''}`} onClick={() => selectRadio('out_sh', 'week')}>3</td>
                    <td className={`clickable ${isSelected('out_sh', 'wknd') ? 'selected-cell' : ''}`} onClick={() => selectRadio('out_sh', 'wknd')}>
                      {isSelected('out_sh', 'wknd') && '✓ '}WKND.
                    </td>
                    <td className={`clickable center bold ${isSelected('out_sh', 'wknd') ? 'selected-cell' : ''}`} onClick={() => selectRadio('out_sh', 'wknd')}>5</td>
                  </tr>
                  <tr>
                    <td className="row-header">Personal</td>
                    <td 
                      className={`clickable ${parseInt(ormSelections['personal_punct_pax'] || '0') > 0 ? 'selected-cell' : ''}`}
                      onClick={() => {
                        const current = parseInt(ormSelections['personal_punct_pax'] || '0');
                        setOrmSelections(prev => ({
                          ...prev,
                          personal_punct_pax: current > 0 ? '0' : '1'
                        }));
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '5px' }}>
                        <span>Punct. (2x)</span>
                        <input 
                          type="number" 
                          min="0" 
                          style={{ width: '45px', padding: '1px', border: '1px solid #ccc', borderRadius: '3px', textAlign: 'center', fontWeight: 'bold' }} 
                          value={ormSelections['personal_punct_pax'] || '0'} 
                          onClick={e => e.stopPropagation()}
                          onChange={e => setOrmSelections(prev => ({
                            ...prev,
                            personal_punct_pax: e.target.value
                          }))}
                        />
                      </div>
                    </td>
                    <td 
                      className={`clickable center bold ${parseInt(ormSelections['personal_punct_pax'] || '0') > 0 ? 'selected-cell' : ''}`}
                      onClick={() => {
                        const current = parseInt(ormSelections['personal_punct_pax'] || '0');
                        setOrmSelections(prev => ({
                          ...prev,
                          personal_punct_pax: current > 0 ? '0' : '1'
                        }));
                      }}
                    >
                      {parseInt(ormSelections['personal_punct_pax'] || '0') > 0 ? 2 * (parseInt(ormSelections['personal_punct_pax']) || 0) : '0'}
                    </td>
                    <td 
                      className={`clickable ${parseInt(ormSelections['personal_recurr_pax'] || '0') > 0 ? 'selected-cell' : ''}`}
                      onClick={() => {
                        const current = parseInt(ormSelections['personal_recurr_pax'] || '0');
                        setOrmSelections(prev => ({
                          ...prev,
                          personal_recurr_pax: current > 0 ? '0' : '1'
                        }));
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '5px' }}>
                        <span>Recurr. (4x)</span>
                        <input 
                          type="number" 
                          min="0" 
                          style={{ width: '45px', padding: '1px', border: '1px solid #ccc', borderRadius: '3px', textAlign: 'center', fontWeight: 'bold' }} 
                          value={ormSelections['personal_recurr_pax'] || '0'} 
                          onClick={e => e.stopPropagation()}
                          onChange={e => setOrmSelections(prev => ({
                            ...prev,
                            personal_recurr_pax: e.target.value
                          }))}
                        />
                      </div>
                    </td>
                    <td 
                      className={`clickable center bold ${parseInt(ormSelections['personal_recurr_pax'] || '0') > 0 ? 'selected-cell' : ''}`}
                      onClick={() => {
                        const current = parseInt(ormSelections['personal_recurr_pax'] || '0');
                        setOrmSelections(prev => ({
                          ...prev,
                          personal_recurr_pax: current > 0 ? '0' : '1'
                        }));
                      }}
                    >
                      {parseInt(ormSelections['personal_recurr_pax'] || '0') > 0 ? 4 * (parseInt(ormSelections['personal_recurr_pax']) || 0) : '0'}
                    </td>
                  </tr>
                  <tr>
                    <td className="row-header">CR</td>
                    <td colSpan={2}></td>
                    <td className="center font-small">≥ 8 &lt; 12</td>
                    <td className={`clickable center bold ${isSelected('cr') ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('cr')}>
                      {isSelected('cr') ? '✓ 60' : '60'}
                    </td>
                  </tr>
                  <tr>
                    <td className="row-header">Pl Ch</td>
                    <td colSpan={3}></td>
                    <td className={`clickable center bold ${isSelected('pl_ch') ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('pl_ch')}>
                      {isSelected('pl_ch') ? '✓ 4' : '4'}
                    </td>
                  </tr>
                  <tr>
                    <td className="row-header">EET</td>
                    <td colSpan={2}></td>
                    <td className="center font-small">+5hr</td>
                    <td className={`clickable center bold ${isSelected('eet') ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('eet')}>
                      {isSelected('eet') ? '✓ 2' : '2'}
                    </td>
                  </tr>
                  <tr>
                    <td className="row-header">Unexp</td>
                    <td className={`clickable ${ormSelections['unexp_pri'] ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('unexp_pri')}>
                      {ormSelections['unexp_pri'] && '✓ '}PRI
                    </td>
                    <td className={`clickable center bold ${ormSelections['unexp_pri'] ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('unexp_pri')}>3</td>
                    <td className={`clickable ${ormSelections['unexp_pre'] ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('unexp_pre')}>
                      {ormSelections['unexp_pre'] && '✓ '}PRE
                    </td>
                    <td className={`clickable center bold ${ormSelections['unexp_pre'] ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('unexp_pre')}>6</td>
                  </tr>
                  <tr>
                    <td className="row-header">No Fly</td>
                    <td className={`clickable ${ormSelections['no_fly_pri'] ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('no_fly_pri')}>
                      {ormSelections['no_fly_pri'] && '✓ '}&gt; 30 PRI
                    </td>
                    <td className={`clickable center bold ${ormSelections['no_fly_pri'] ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('no_fly_pri')}>2</td>
                    <td className={`clickable ${ormSelections['no_fly_pre'] ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('no_fly_pre')}>
                      {ormSelections['no_fly_pre'] && '✓ '}&gt; 10 PRE
                    </td>
                    <td className={`clickable center bold ${ormSelections['no_fly_pre'] ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('no_fly_pre')}>4</td>
                  </tr>
                  <tr>
                    <td className="row-header">Event</td>
                    <td className={`clickable ${isSelected('event', '2nd') ? 'selected-cell' : ''}`} onClick={() => selectRadio('event', '2nd')}>
                      {isSelected('event', '2nd') && '✓ '}2nd
                    </td>
                    <td className={`clickable center bold ${isSelected('event', '2nd') ? 'selected-cell' : ''}`} onClick={() => selectRadio('event', '2nd')}>2</td>
                    <td className={`clickable ${isSelected('event', '3rd_more') ? 'selected-cell' : ''}`} onClick={() => selectRadio('event', '3rd_more')}>
                      {isSelected('event', '3rd_more') && '✓ '}3rd or more
                    </td>
                    <td className={`clickable center bold ${isSelected('event', '3rd_more') ? 'selected-cell' : ''}`} onClick={() => selectRadio('event', '3rd_more')}>4</td>
                  </tr>
                  <tr>
                    <td className="row-header">Detached</td>
                    <td className={`clickable ${isSelected('detached', 'det_5') ? 'selected-cell' : ''}`} onClick={() => selectRadio('detached', 'det_5')}>
                      {isSelected('detached', 'det_5') && '✓ '}≥ 5
                    </td>
                    <td className={`clickable center bold ${isSelected('detached', 'det_5') ? 'selected-cell' : ''}`} onClick={() => selectRadio('detached', 'det_5')}>3</td>
                    <td className={`clickable ${isSelected('detached', 'det_8') ? 'selected-cell' : ''}`} onClick={() => selectRadio('detached', 'det_8')}>
                      {isSelected('detached', 'det_8') && '✓ '}≥ 8
                    </td>
                    <td className={`clickable center bold ${isSelected('detached', 'det_8') ? 'selected-cell' : ''}`} onClick={() => selectRadio('detached', 'det_8')}>6</td>
                  </tr>

                  {/* Material Section */}
                  <tr>
                    <td colSpan={5} className="group-header" style={{ backgroundColor: '#fbc02d', color: '#333' }}>Material</td>
                  </tr>
                  <tr>
                    <td className="row-header">RWY L &lt; 400M</td>
                    <td colSpan={3}></td>
                    <td className={`clickable center bold ${isSelected('rwy_l') ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('rwy_l')}>
                      {isSelected('rwy_l') ? '✓ 4' : '4'}
                    </td>
                  </tr>
                  <tr>
                    <td className="row-header">RWY W &lt; 15M</td>
                    <td colSpan={3}></td>
                    <td className={`clickable center bold ${isSelected('rwy_w') ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('rwy_w')}>
                      {isSelected('rwy_w') ? '✓ 4' : '4'}
                    </td>
                  </tr>
                  <tr>
                    <td className="row-header">FOD</td>
                    <td colSpan={3}></td>
                    <td className={`clickable center bold ${isSelected('fod') ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('fod')}>
                      {isSelected('fod') ? '✓ 4' : '4'}
                    </td>
                  </tr>
                  <tr>
                    <td className="row-header">BKP SYS</td>
                    <td colSpan={2}></td>
                    <td className="center font-small">PWR, GCS , HSET</td>
                    <td className={`clickable center bold ${isSelected('bkp_sys') ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('bkp_sys')}>
                      {isSelected('bkp_sys') ? '✓ 38' : '38'}
                    </td>
                  </tr>

                  {/* Environmental Section */}
                  <tr>
                    <td colSpan={5} className="group-header" style={{ backgroundColor: '#388e3c' }}>Environmental</td>
                  </tr>
                  <tr>
                    <td className="row-header">Xwind</td>
                    <td className={`clickable ${isSelected('xwind', 'xw_5') ? 'selected-cell' : ''}`} onClick={() => selectRadio('xwind', 'xw_5')}>
                      {isSelected('xwind', 'xw_5') && '✓ '}≥ 5kts
                    </td>
                    <td className={`clickable center bold ${isSelected('xwind', 'xw_5') ? 'selected-cell' : ''}`} onClick={() => selectRadio('xwind', 'xw_5')}>3</td>
                    <td className={`clickable ${isSelected('xwind', 'xw_7') ? 'selected-cell' : ''}`} onClick={() => selectRadio('xwind', 'xw_7')}>
                      {isSelected('xwind', 'xw_7') && '✓ '}≥ 7kts
                    </td>
                    <td className={`clickable center bold ${isSelected('xwind', 'xw_7') ? 'selected-cell' : ''}`} onClick={() => selectRadio('xwind', 'xw_7')}>6</td>
                  </tr>
                  <tr>
                    <td className="row-header">IAT T/O</td>
                    <td className={`clickable ${isSelected('iat_to', 'temp_lo') ? 'selected-cell' : ''}`} onClick={() => selectRadio('iat_to', 'temp_lo')}>
                      {isSelected('iat_to', 'temp_lo') && '✓ '}≤ 10º
                    </td>
                    <td className={`clickable center bold ${isSelected('iat_to', 'temp_lo') ? 'selected-cell' : ''}`} onClick={() => selectRadio('iat_to', 'temp_lo')}>3</td>
                    <td className={`clickable ${isSelected('iat_to', 'temp_hi') ? 'selected-cell' : ''}`} onClick={() => selectRadio('iat_to', 'temp_hi')}>
                      {isSelected('iat_to', 'temp_hi') && '✓ '}≥ 35º
                    </td>
                    <td className={`clickable center bold ${isSelected('iat_to', 'temp_hi') ? 'selected-cell' : ''}`} onClick={() => selectRadio('iat_to', 'temp_hi')}>3</td>
                  </tr>
                  <tr>
                    <td className="row-header">ITS</td>
                    <td className={`clickable ${isSelected('its', 'c') ? 'selected-cell' : ''}`} style={{ pointerEvents: 'none' }}>
                      {isSelected('its', 'c') && '✓ '}C
                    </td>
                    <td className={`clickable center bold ${isSelected('its', 'c') ? 'selected-cell' : ''}`} style={{ pointerEvents: 'none' }}>6</td>
                    <td className={`clickable ${isSelected('its', 'd') ? 'selected-cell' : ''}`} style={{ pointerEvents: 'none' }}>
                      {isSelected('its', 'd') && '✓ '}D
                    </td>
                    <td className={`clickable center bold ${isSelected('its', 'd') ? 'selected-cell' : ''}`} style={{ pointerEvents: 'none' }}>9</td>
                  </tr>
                  <tr>
                    <td className="row-header">Rain Prob</td>
                    <td className={`clickable ${isSelected('rain_prob', 'rain_2') ? 'selected-cell' : ''}`} onClick={() => selectRadio('rain_prob', 'rain_2')}>
                      {isSelected('rain_prob', 'rain_2') && '✓ '}≥ 0.2 mm
                    </td>
                    <td className={`clickable center bold ${isSelected('rain_prob', 'rain_2') ? 'selected-cell' : ''}`} onClick={() => selectRadio('rain_prob', 'rain_2')}>3</td>
                    <td className={`clickable ${isSelected('rain_prob', 'rain_5') ? 'selected-cell' : ''}`} onClick={() => selectRadio('rain_prob', 'rain_5')}>
                      {isSelected('rain_prob', 'rain_5') && '✓ '}≥ 0.5 mm
                    </td>
                    <td className={`clickable center bold ${isSelected('rain_prob', 'rain_5') ? 'selected-cell' : ''}`} onClick={() => selectRadio('rain_prob', 'rain_5')}>6</td>
                  </tr>
                  <tr>
                    <td className="row-header">RWY</td>
                    <td colSpan={2}></td>
                    <td className="center font-small">WET</td>
                    <td className={`clickable center bold ${isSelected('rwy_wet') ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('rwy_wet')}>
                      {isSelected('rwy_wet') ? '✓ 3' : '3'}
                    </td>
                  </tr>
                  <tr>
                    <td rowSpan={2} className="row-header align-middle">Enroute</td>
                    <td colSpan={2}></td>
                    <td className="center font-small">Temp ≤ 10º</td>
                    <td className={`clickable center bold ${isSelected('enroute_temp') ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('enroute_temp')}>
                      {isSelected('enroute_temp') ? '✓ 2' : '2'}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}></td>
                    <td className="center font-small">Wind ≥ 25</td>
                    <td className={`clickable center bold ${isSelected('enroute_wind') ? 'selected-cell' : ''}`} onClick={() => toggleCheckbox('enroute_wind')}>
                      {isSelected('enroute_wind') ? '✓ 2' : '2'}
                    </td>
                  </tr>
                  <tr>
                    <td className="row-header">Over Populated</td>
                    <td className={`clickable ${isSelected('over_populated', 'low_density') ? 'selected-cell' : ''}`} onClick={() => selectRadio('over_populated', 'low_density')}>
                      {isSelected('over_populated', 'low_density') && '✓ '}{'<300H/km2'}
                    </td>
                    <td className={`clickable center bold ${isSelected('over_populated', 'low_density') ? 'selected-cell' : ''}`} onClick={() => selectRadio('over_populated', 'low_density')}>2</td>
                    <td className={`clickable ${isSelected('over_populated', 'high_density') ? 'selected-cell' : ''}`} onClick={() => selectRadio('over_populated', 'high_density')}>
                      {isSelected('over_populated', 'high_density') && '✓ '}{'>= 300H/km2'}
                    </td>
                    <td className={`clickable center bold ${isSelected('over_populated', 'high_density') ? 'selected-cell' : ''}`} onClick={() => selectRadio('over_populated', 'high_density')}>5</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid black', paddingTop: '8px', marginTop: '10px', fontWeight: 'bold' }}>
                <span>TOTAL:</span>
                <span>{ormScore}</span>
              </div>
            </div>

            {/* ITS CALCULATOR & LEGEND */}
            <div style={{ flex: '0.8', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="its-calculator-box" style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '4px', backgroundColor: 'var(--card-bg)' }}>
                <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '3px' }}>ITS Calculator (Stress Térmico)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', fontSize: '0.85em' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '3px' }}>Temperatura (ºC):</label>
                    <input 
                      type="number" 
                      value={itsInput.temp} 
                      onChange={e => setItsInput({ ...itsInput, temp: e.target.value })} 
                      style={{ width: '100%', padding: '5px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '3px' }}>Humidade Relativa (%):</label>
                    <input 
                      type="number" 
                      value={itsInput.humidity} 
                      onChange={e => setItsInput({ ...itsInput, humidity: e.target.value })} 
                      style={{ width: '100%', padding: '5px' }} 
                    />
                  </div>
                  {itsResult.value !== null && (
                    <div style={{ marginTop: '10px', padding: '8px', borderRadius: '4px', backgroundColor: itsResult.zone === 'NORMAL' ? '#e8f5e9' : itsResult.zone === 'CAUTION' ? '#fffde7' : '#ffebee', border: '1px solid #ccc', textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold' }}>Valor ITS: {itsResult.value}</div>
                      <div style={{ fontSize: '0.8em', fontWeight: 'bold', color: itsResult.zone === 'NORMAL' ? 'green' : itsResult.zone === 'CAUTION' ? 'orange' : 'red' }}>
                        ZONA: {itsResult.zone}
                      </div>
                      <span style={{ fontSize: '0.7em', opacity: 0.8 }}>(O risco ORM correspondente foi marcado na tabela)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ITS REFERENCE RANGES */}
              <div style={{ border: '1px solid var(--border-color)', padding: '8px', borderRadius: '4px', backgroundColor: 'var(--card-bg)', fontSize: '0.75em' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>ITS Zones</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px', backgroundColor: '#e8f5e9', color: 'green', fontWeight: 'bold' }}>
                    <span>NORMAL (ITS &lt; 92)</span>
                    <span>Score 0</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px', backgroundColor: '#fffde7', color: 'orange', fontWeight: 'bold' }}>
                    <span>CAUTION (ITS 92-100)</span>
                    <span>Score 6 (C)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px', backgroundColor: '#ffebee', color: 'red', fontWeight: 'bold' }}>
                    <span>DANGER (ITS &gt; 100)</span>
                    <span>Score 9 (D)</span>
                  </div>
                </div>
              </div>

              {/* CROSSWIND CALCULATOR */}
              <div className="xwind-calculator-box" style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '4px', backgroundColor: 'var(--card-bg)' }}>
                <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '3px' }}>Calculador de Crosswind</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85em' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '3px' }}>Direção Pista:</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 09 ou 090"
                      value={xwindInput.rwy} 
                      onChange={e => setXwindInput({ ...xwindInput, rwy: e.target.value })} 
                      style={{ width: '100%', padding: '5px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '3px' }}>Direção Vento (º):</label>
                    <input 
                      type="number" 
                      placeholder="0-360"
                      value={xwindInput.windDir} 
                      onChange={e => setXwindInput({ ...xwindInput, windDir: e.target.value })} 
                      style={{ width: '100%', padding: '5px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '3px' }}>Vento Médio (kt):</label>
                    <input 
                      type="number" 
                      placeholder="Ex: 10"
                      value={xwindInput.windSpeed} 
                      onChange={e => setXwindInput({ ...xwindInput, windSpeed: e.target.value })} 
                      style={{ width: '100%', padding: '5px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '3px' }}>Rajada (kt):</label>
                    <input 
                      type="number" 
                      placeholder="Ex: 15"
                      value={xwindInput.gust} 
                      onChange={e => setXwindInput({ ...xwindInput, gust: e.target.value })} 
                      style={{ width: '100%', padding: '5px' }} 
                    />
                  </div>
                </div>
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85em' }}>
                  <input 
                    type="checkbox" 
                    id="halfGustCheckbox"
                    checked={xwindInput.halfGust} 
                    onChange={e => setXwindInput({ ...xwindInput, halfGust: e.target.checked })} 
                  />
                  <label htmlFor="halfGustCheckbox" style={{ cursor: 'pointer', userSelect: 'none' }}>Só contabilizar 50% da rajada</label>
                </div>
                {xwindResult !== null && (
                  <div style={{ marginTop: '10px', padding: '8px', borderRadius: '4px', backgroundColor: xwindResult < 5 ? '#e8f5e9' : xwindResult < 7 ? '#fffde7' : '#ffebee', border: '1px solid #ccc', textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold' }}>Vento Cruzado: {xwindResult} kt</div>
                    <div style={{ fontSize: '0.8em', fontWeight: 'bold', color: xwindResult < 5 ? 'green' : xwindResult < 7 ? 'orange' : 'red' }}>
                      ORM: {xwindResult < 5 ? 'NORMAL' : xwindResult < 7 ? '≥ 5kts (Score 3)' : '≥ 7kts (Score 6)'}
                    </div>
                    <span style={{ fontSize: '0.7em', opacity: 0.8 }}>(O risco ORM correspondente foi marcado na tabela)</span>
                  </div>
                )}
              </div>

              {/* APPROVAL LEVEL LEGEND */}
              <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '4px', backgroundColor: 'var(--card-bg)', fontSize: '0.85em' }}>
                <h4 style={{ margin: '0 0 8px 0', borderBottom: '1px solid var(--border-color)' }}>Nível de Aprovação Requerido</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
                  <tbody>
                    <tr style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold' }}>
                      <td style={{ padding: '6px' }}>&lt; 40</td>
                      <td style={{ padding: '6px' }}>MC (Mission Commander)</td>
                    </tr>
                    <tr style={{ backgroundColor: '#fffde7', color: '#f57f17', fontWeight: 'bold' }}>
                      <td style={{ padding: '6px' }}>40 - 49</td>
                      <td style={{ padding: '6px' }}>991 Cmdt (Esquadra)</td>
                    </tr>
                    <tr style={{ backgroundColor: '#fbe9e7', color: '#d84315', fontWeight: 'bold' }}>
                      <td style={{ padding: '6px' }}>50 - 59</td>
                      <td style={{ padding: '6px' }}>Cmdt GO (Grupo Oper.)</td>
                    </tr>
                    <tr style={{ backgroundColor: '#ffebee', color: '#c62828', fontWeight: 'bold' }}>
                      <td style={{ padding: '6px' }}>&ge; 60</td>
                      <td style={{ padding: '6px' }}>Gen CA (C. Aéreo)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid #ccc', paddingTop: '10px', position: 'absolute', bottom: '10mm', left: '10mm', right: '10mm' }}>
            <div></div>
            <div style={{ fontSize: '0.7em', opacity: 0.7 }}>MP 9/42</div>
          </div>
        </div>
      </div>
    </div>
  );
}
