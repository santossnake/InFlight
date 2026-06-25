import { useState, useRef, useEffect } from 'react'
import { guideData, GuideItem } from './data/guideContent'
import MissionFolder from './components/MissionFolder'
import './index.css'

// Image component with Fullscreen and Zoom support
const ImageWithFallback = ({ src, title }: { src: string, title: string }) => {
  const [extensionIdx, setExtensionIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const extensions = ['', '.png', '.jpg', '.jpeg']; 
  
  const basePath = src.replace(/\.(png|jpg|jpeg)$/i, '');
  const currentSrc = extensionIdx === 0 ? src : `${basePath}${extensions[extensionIdx]}`;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setZoom(1);
  };

  return (
    <>
      <div 
        style={{ border: '1px solid var(--border-color)', padding: '10px', backgroundColor: 'var(--card-bg)', marginBottom: '10px', cursor: 'zoom-in' }}
        onClick={toggleFullscreen}
      >
        <img 
          src={currentSrc} 
          alt={title} 
          style={{ maxWidth: '100%', display: 'block', margin: '0 auto', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          onError={() => {
            if (extensionIdx < extensions.length - 1) {
              setExtensionIdx(extensionIdx + 1);
            }
          }}
        />
        <p style={{ fontSize: '0.7em', color: '#888', marginTop: '5px', textAlign: 'center' }}>Clique para ampliar</p>
      </div>

      {isFullscreen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
            <button onClick={() => setZoom(z => Math.min(z + 0.5, 4))} style={{ padding: '10px', fontSize: '1.2em' }}>+</button>
            <button onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))} style={{ padding: '10px', fontSize: '1.2em' }}>-</button>
            <button onClick={toggleFullscreen} style={{ padding: '10px', fontSize: '1.2em', backgroundColor: 'var(--accent-color)', color: 'white', border: 'none' }}>X</button>
          </div>
          <div style={{ overflow: 'auto', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={currentSrc} 
              alt={title} 
              style={{ 
                transform: `scale(${zoom})`, 
                transition: 'transform 0.2s',
                maxHeight: zoom > 1 ? 'none' : '90vh',
                maxWidth: zoom > 1 ? 'none' : '90vw'
              }} 
            />
          </div>
        </div>
      )}
    </>
  );
};

const formatText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const ChecklistRenderer = ({ itemId, content, progress, onToggle }: { 
  itemId: string, 
  content: string[], 
  progress: { [index: number]: boolean },
  onToggle: (itemId: string, index: number) => void
}) => (
  <div className="checklist" style={{ maxWidth: '900px' }}>
    {content.map((check, idx) => {
      const isMemoryItem = check.startsWith('**') && check.endsWith('**');
      const isSpecialLine = !check.trim() || check.startsWith('WARNING:') || check.startsWith('CAUTION:') || check.startsWith('NOTE:') || check.startsWith('---');
      
      if (isSpecialLine) {
        if (!check.trim()) return <div key={idx} style={{ height: '10px' }} />;
        return (
          <div key={idx} style={{ 
            textAlign: 'center', 
            padding: '15px', 
            color: check.startsWith('WARNING') ? 'var(--accent-color)' : '#888',
            fontSize: '1em',
            fontStyle: 'italic',
            borderBottom: '1px solid var(--border-color)'
          }}>
            {formatText(check)}
          </div>
        );
      }

      const indentMatch = check.match(/^(\s+)(?:[•\-*]\s*)?(.*)/);
      const isIndented = !!indentMatch;
      const labelText = indentMatch ? `• ${indentMatch[2]}` : check;

      return (
        <label 
          key={idx} 
          className={`checklist-label ${isMemoryItem ? 'memory-item' : ''}`} 
          style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            cursor: 'pointer', 
            padding: '10px', 
            paddingLeft: isIndented ? '40px' : '12px',
            backgroundColor: isIndented ? 'rgba(0,0,0,0.015)' : 'transparent',
            transition: 'background-color 0.2s',
            opacity: isIndented ? 0.9 : 1,
            fontSize: isIndented ? '0.95em' : '1.1em'
          }}
        >
          <input 
            type="checkbox" 
            checked={!!progress[idx]}
            onChange={() => onToggle(itemId, idx)}
            style={{ 
              marginTop: '4px',
              marginRight: '15px', 
              width: isIndented ? '18px' : '22px', 
              height: isIndented ? '18px' : '22px',
              cursor: 'pointer',
              flexShrink: 0
            }} 
          />
          <span style={{ textDecoration: progress[idx] ? 'line-through' : 'none', color: progress[idx] ? '#888' : 'inherit' }}>
            {formatText(labelText)}
          </span>
        </label>
      );
    })}
  </div>
);

const TableRenderer = ({ tableData, keyPrefix }: { tableData: any, keyPrefix?: any }) => (
  <div key={keyPrefix} style={{ overflowX: 'auto', margin: '15px 0' }}>
    {tableData.title && <h4 style={{ margin: '10px 0', color: 'var(--primary-color)' }}>{tableData.title}</h4>}
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px', fontSize: '0.9em' }}>
      {tableData.headers && tableData.headers.length > 0 && (
        <thead>
          <tr>
            {tableData.headers.map((h: string, i: number) => (
              <th key={i} style={{ padding: '12px', backgroundColor: 'var(--primary-color)', color: 'white', border: '1px solid var(--border-color)', textAlign: 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {tableData.rows.map((row: any[], rI: number) => (
          <tr key={rI}>
            {row.map((cell, cI) => {
              const isObject = typeof cell === 'object' && cell !== null;
              const bgColor = isObject ? cell.bg : 'transparent';
              const textColor = isObject ? (cell.color || 'inherit') : 'inherit';
              const value = isObject ? cell.text : cell;
              const colSpan = isObject ? cell.colSpan : 1;
              
              return (
                <td key={cI} 
                  colSpan={colSpan}
                  style={{ 
                    padding: '12px 8px', 
                    border: '1px solid var(--border-color)',
                    backgroundColor: bgColor,
                    color: textColor,
                    fontWeight: isObject && cell.bold ? 'bold' : (cI === 0 ? 'bold' : 'normal'),
                    textAlign: isObject && cell.center ? 'center' : 'left',
                    minWidth: cI === 0 ? '150px' : 'auto',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {value}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

function App() {
  const [activeSectionId, setActiveSectionId] = useState<string>('NORMAL_PROCEDURES')
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(window.innerWidth > 1024)
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768)
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('darkMode') === 'true')
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Endurance Calculator State
  const [fuelInit, setFuelInit] = useState<string>(localStorage.getItem('fuelInit') || '16')
  const [fuelCurrent, setFuelCurrent] = useState<string>(localStorage.getItem('fuelCurrent') || '16')
  const [gs, setGs] = useState<string>(localStorage.getItem('gs') || '50')
  const [distHome, setDistHome] = useState<string>(localStorage.getItem('distHome') || '10')
  const [engineOnManual, setEngineOnManual] = useState<string>('')
  const [editingTimer, setEditingTimer] = useState<{ id: string, label: string } | null>(null)
  const [modalValue, setModalValue] = useState('')

  const [missionLogs, setMissionLogs] = useState<{ [key: string]: string }>(() => {
    const saved = localStorage.getItem('missionLogs');
    return saved ? JSON.parse(saved) : {};
  });

  const [checklistProgress, setChecklistProgress] = useState<{ [itemId: string]: { [index: number]: boolean } }>(() => {
    const saved = localStorage.getItem('checklistProgress');
    return saved ? JSON.parse(saved) : {};
  });

  const [fuelLogs, setFuelLogs] = useState<{ zuluTime: string; fuel: number; elapsedMins: number }[]>(() => {
    const saved = localStorage.getItem('fuelLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const contentRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('fuelLogs', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('checklistProgress', JSON.stringify(checklistProgress));
  }, [checklistProgress]);

  useEffect(() => {
    localStorage.setItem('missionLogs', JSON.stringify(missionLogs));
    if (missionLogs['eng-on'] && !engineOnManual) {
      setEngineOnManual(missionLogs['eng-on']);
    }
  }, [missionLogs]);
  
  useEffect(() => {
    localStorage.setItem('fuelInit', fuelInit);
    localStorage.setItem('fuelCurrent', fuelCurrent);
    localStorage.setItem('gs', gs);
    localStorage.setItem('distHome', distHome);
  }, [fuelInit, fuelCurrent, gs, distHome]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && window.innerWidth > 1024) setIsSidebarVisible(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeSection = guideData.find(s => s.id === activeSectionId) || guideData[0]

  const handleSectionChange = (id: string) => {
    setActiveSectionId(id)
    if (isMobile) setIsSidebarVisible(false)
    const contentArea = document.querySelector('.content-area')
    if (contentArea) contentArea.scrollTop = 0
  }

  const scrollToItem = (itemId: string) => {
    const element = contentRefs.current[itemId]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (isMobile) setIsSidebarVisible(false)
    }
  }

  const openEditModal = (id: string, label: string) => {
    setEditingTimer({ id, label });
    setModalValue(missionLogs[id] || '');
  }

  const saveTimerValue = () => {
    if (!editingTimer) return;
    if (modalValue === '' || /^([01]\d|2[0-3]):([0-5]\d)$/.test(modalValue)) {
      setMissionLogs(prev => {
        const next = { ...prev };
        if (modalValue === '') delete next[editingTimer.id];
        else next[editingTimer.id] = modalValue;
        return next;
      });
      setEditingTimer(null);
    } else {
      alert('Formato inválido. Use HH:MM (ex: 14:30)');
    }
  }

  const resetTimerValue = () => {
    if (!editingTimer) return;
    setMissionLogs(prev => {
      const next = { ...prev };
      delete next[editingTimer.id];
      return next;
    });
    setEditingTimer(null);
  }

  const logEvent = (event: string) => {
    if (!missionLogs[event]) {
      const now = new Date();
      const timeStr = now.getUTCHours().toString().padStart(2, '0') + ':' + now.getUTCMinutes().toString().padStart(2, '0');
      setMissionLogs(prev => ({ ...prev, [event]: timeStr }));
    }
  }

  const logFuelEntry = () => {
    const now = new Date();
    const zuluTime = now.getUTCHours().toString().padStart(2, '0') + ':' + now.getUTCMinutes().toString().padStart(2, '0');
    const fuel = parseFloat(fuelCurrent) || 0;
    const engOnStr = engineOnManual || missionLogs['eng-on'];
    const timeData = getDiffTime(engOnStr || '');
    const elapsedMins = timeData ? timeData.totalMins : 0;
    setFuelLogs(prev => [...prev, { zuluTime, fuel, elapsedMins }]);
  };

  const lastTapRef = useRef<{ [key: string]: number }>({});

  const handleToggle = (itemId: string, index: number) => {
    const key = `${itemId}-${index}`;
    const isCurrentlyChecked = !!checklistProgress[itemId]?.[index];
    
    if (isCurrentlyChecked) {
      const now = Date.now();
      const lastTap = lastTapRef.current[key] || 0;
      if (now - lastTap < 500) {
        setChecklistProgress(prev => ({
          ...prev,
          [itemId]: { ...(prev[itemId] || {}), [index]: false }
        }));
        delete lastTapRef.current[key];
      } else {
        lastTapRef.current[key] = now;
      }
    } else {
      setChecklistProgress(prev => ({
        ...prev,
        [itemId]: { ...(prev[itemId] || {}), [index]: true }
      }));
    }
  };

  const resetCurrentChecklists = () => {
    if (window.confirm('Resetar todos os checklists da secção atual?')) {
      const newProgress = { ...checklistProgress };
      activeSection.items.forEach(item => { delete newProgress[item.id]; });
      setChecklistProgress(newProgress);
    }
  };


  const resetAllChecklists = () => {
    if (window.confirm('Resetar TODOS os checklists, logs de missão e matriz ORM?')) {
      setChecklistProgress({});
      setMissionLogs({});
      setFuelInit('16');
      setFuelCurrent('16');
      setEngineOnManual('');
      setFuelLogs([]);
      localStorage.removeItem('mf_orm_selections');
      localStorage.removeItem('mf_its_input');
      localStorage.removeItem('mf_xwind_input');
      localStorage.removeItem('mf_general');
      localStorage.removeItem('mf_crew_op');
      localStorage.removeItem('mf_crew_uni');
      localStorage.removeItem('mf_briefings');
      window.location.reload();
    }
  };

  const getDiffTime = (startStr: string, endStr?: string) => {
    if (!startStr) return null;
    const [h1, m1] = startStr.split(':').map(Number);
    const startDate = new Date();
    startDate.setUTCHours(h1, m1, 0, 0);
    
    const endDate = new Date();
    if (endStr) {
      const [h2, m2] = endStr.split(':').map(Number);
      endDate.setUTCHours(h2, m2, 0, 0);
    } else {
      endDate.setUTCSeconds(0, 0);
    }
    
    if (endDate.getTime() < startDate.getTime()) {
      endDate.setUTCDate(endDate.getUTCDate() + 1);
    }
    
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);
    return { hrs: diffHrs, mins: diffMins, totalMins: diffMs / 60000 };
  }

  const isItemComplete = (item: GuideItem) => {
    let checklist: string[] | undefined;
    if (item.type === 'checklist') checklist = item.content as string[];
    else if (item.type === 'mixed') checklist = (item.content as any).checklist;
    if (!checklist) return false;
    const progress = checklistProgress[item.id] || {};
    return checklist.every((line, index) => {
      const isSpecialLine = !line.trim() || line.startsWith('WARNING:') || line.startsWith('CAUTION:') || line.startsWith('NOTE:') || line.startsWith('---');
      if (isSpecialLine) return true;
      return !!progress[index];
    });
  };

  const renderContent = (item: GuideItem) => {
    if (item.id === 'endurance-calc') {
      const fInit = parseFloat(fuelInit) || 0;
      const fCurr = parseFloat(fuelCurrent) || 0;
      const groundSpeed = parseFloat(gs) || 0;
      const distance = parseFloat(distHome) || 0;
      
      const engOnStr = engineOnManual || missionLogs['eng-on'];
      const timeData = getDiffTime(engOnStr || '');
      
      let burnRateCalculated = 0;
      let hours = 0, mins = 0;
      let range = 0;
      let fuelAtHome = 0;
      let timeToHomeMins = 0;
      let timeRemainingOnStationMins = 0;
      let bingoTimeStr = '---';

      if (timeData && timeData.totalMins > 2) {
        const fuelUsed = Math.max(0, fInit - fCurr);
        burnRateCalculated = (fuelUsed / timeData.totalMins) * 60;
        
        if (burnRateCalculated > 0.1) {
          const fuelAvailableForBingo = Math.max(0, fCurr - 2.5);
          const totalEnduranceMins = (fuelAvailableForBingo / burnRateCalculated) * 60;
          hours = Math.floor(totalEnduranceMins / 60);
          mins = Math.round(totalEnduranceMins % 60);
          
          if (groundSpeed > 0) {
            range = (fCurr / burnRateCalculated) * groundSpeed;
            timeToHomeMins = (distance / groundSpeed) * 60;
            fuelAtHome = fCurr - ((timeToHomeMins / 60) * burnRateCalculated);
            
            const fuelNeededForTrip = (timeToHomeMins / 60) * burnRateCalculated;
            const fuelAvailableOnStation = fCurr - 2.5 - fuelNeededForTrip;
            
            // Allow negative value to show how much time has passed since bingo
            timeRemainingOnStationMins = (fuelAvailableOnStation / burnRateCalculated) * 60;
            
            // Calculate Bingo Time (Clock time now + Remaining on Station)
            const bingoDate = new Date(currentTime.getTime() + timeRemainingOnStationMins * 60000);
            bingoTimeStr = bingoDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
          }
        }
      }

      const fuelPercentage = fInit > 0 ? (fCurr / fInit) * 100 : 0;

      const formatDuration = (totalMins: number) => {
        const isNeg = totalMins < 0;
        const absMins = Math.abs(totalMins);
        const h = Math.floor(absMins / 60);
        const m = Math.round(absMins % 60);
        return `${isNeg ? '-' : ''}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      };

      return (
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75em', marginBottom: '5px', opacity: 0.8 }}>INITIAL FUEL (L)</label>
              <input type="number" value={fuelInit} onChange={e => setFuelInit(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: '1.2em', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75em', marginBottom: '5px', opacity: 0.8 }}>CURRENT FUEL (L)</label>
              <input type="number" value={fuelCurrent} onChange={e => setFuelCurrent(e.target.value)} step="0.1" style={{ width: '100%', padding: '12px', fontSize: '1.2em', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75em', marginBottom: '5px', opacity: 0.8 }}>GROUND SPEED (GS)</label>
              <input type="number" value={gs} onChange={e => setGs(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: '1.2em', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75em', marginBottom: '5px', opacity: 0.8 }}>DIST TO HOME (NM)</label>
              <input type="number" value={distHome} onChange={e => setDistHome(e.target.value)} step="0.1" style={{ width: '100%', padding: '12px', fontSize: '1.2em', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.75em', marginBottom: '5px', opacity: 0.8 }}>ENGINE ON (HH:MM)</label>
            <input type="text" placeholder="--:--" value={engOnStr || ''} onChange={e => setEngineOnManual(e.target.value)} style={{ width: '100%', padding: '10px', fontSize: '1.1em', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              onClick={logFuelEntry}
              style={{ flex: 1, padding: '12px', backgroundColor: '#8e24aa', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9em' }}
            >
              REGISTAR CONSUMO (ZULU)
            </button>
            {fuelLogs.length > 0 && (
              <button 
                onClick={() => setFuelLogs([])}
                style={{ padding: '12px', backgroundColor: 'transparent', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9em' }}
              >
                Limpar
              </button>
            )}
          </div>

          {fuelLogs.length > 0 && (
            <div style={{ marginBottom: '20px', fontSize: '0.8em', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.02)' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Pontos Registados:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {fuelLogs.map((log, i) => (
                  <span key={i} style={{ backgroundColor: 'rgba(142, 36, 170, 0.1)', color: '#8e24aa', padding: '3px 8px', borderRadius: '12px', border: '1px solid rgba(142, 36, 170, 0.2)', fontWeight: 'bold' }}>
                    {log.zuluTime}Z: {log.fuel}L ({Math.round(log.elapsedMins)} min)
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9em', marginBottom: '10px', fontWeight: 'bold' }}>
              <span>AVG BURN RATE: {burnRateCalculated > 0 ? burnRateCalculated.toFixed(1) : '--.-'} L/H</span>
              <span style={{ color: fuelPercentage < 20 ? 'var(--accent-color)' : 'inherit' }}>{fCurr.toFixed(1)}L / {fInit}L</span>
            </div>
            <div style={{ height: '20px', width: '100%', backgroundColor: '#ddd', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${fuelPercentage}%`, 
                backgroundColor: fuelPercentage < 20 ? 'var(--accent-color)' : (fuelPercentage < 40 ? '#facc15' : '#4caf50'),
                transition: 'width 0.5s ease-in-out'
              }}>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
            <div style={{ padding: '20px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85em', opacity: 0.9, letterSpacing: '1px', marginBottom: '5px' }}>TOTAL ENDURANCE (TO 2.5L)</div>
              <div style={{ fontSize: '3em', fontWeight: 'bold' }}>{burnRateCalculated > 0.1 ? `${hours}h ${mins}m` : '--:--'}</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#455a64', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7em', opacity: 0.9, marginBottom: '5px' }}>TOTAL RANGE (GS)</div>
                <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{range > 0 ? `${range.toFixed(0)} NM` : '---'}</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: fuelAtHome < 2.5 ? 'var(--accent-color)' : '#2e7d32', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7em', opacity: 0.9, marginBottom: '5px' }}>FUEL AT HOME</div>
                <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{fuelAtHome !== 0 ? `${fuelAtHome.toFixed(1)} L` : '---'}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#1976d2', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7em', opacity: 0.9, marginBottom: '5px' }}>TIME TO HOME</div>
                <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{timeToHomeMins > 0 ? formatDuration(timeToHomeMins) : '---'}</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#d32f2f', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7em', opacity: 0.9, marginBottom: '5px' }}>BINGO TIME (RTB)</div>
                <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>
                  {bingoTimeStr}
                  {timeRemainingOnStationMins < 0 && (
                    <span style={{ fontSize: '0.5em', display: 'block', opacity: 0.8 }}>
                      ({Math.floor(timeRemainingOnStationMins)} min)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ padding: '15px', backgroundColor: timeRemainingOnStationMins < 5 ? 'var(--accent-color)' : '#546e7a', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7em', opacity: 0.9, marginBottom: '5px' }}>REMAINING ON STATION</div>
              <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>
                {burnRateCalculated > 0.1 ? formatDuration(timeRemainingOnStationMins) : '00:00'}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (item.type === 'text') {
      return (
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1.1em' }}>
          {formatText(item.content)}
        </div>
      )
    }
    
    if (item.type === 'image') {
      const images = Array.isArray(item.content) ? item.content : [item.content];
      return (
        <div style={{ textAlign: 'center', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {images.map((src, i) => (
            <ImageWithFallback key={i} src={src} title={`${item.title} ${i + 1}`} />
          ))}
        </div>
      )
    }
    
    if (item.type === 'checklist') {
      return <ChecklistRenderer 
        itemId={item.id} 
        content={item.content as string[]} 
        progress={checklistProgress[item.id] || {}}
        onToggle={handleToggle}
      />;
    }

    if (item.type === 'table') {
      return <TableRenderer tableData={item.content} />;
    }

    if (item.type === 'mixed') {
      const content = item.content as { checklist?: string[], table?: any, tables?: any[], image?: string | string[] };
      const images = content.image ? (Array.isArray(content.image) ? content.image : [content.image]) : [];
      
      return (
        <div>
          {images.length > 0 && (
            <div style={{ textAlign: 'center', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {images.map((src, i) => (
                <ImageWithFallback key={i} src={src} title={`${item.title} ${i + 1}`} />
              ))}
            </div>
          )}
          {content.checklist && <ChecklistRenderer 
            itemId={item.id} 
            content={content.checklist} 
            progress={checklistProgress[item.id] || {}}
            onToggle={handleToggle}
          />}
          {content.table && <TableRenderer tableData={content.table} />}
          {content.tables && content.tables.map((t: any, i: number) => <TableRenderer tableData={t} keyPrefix={i} />)}
        </div>
      );
    }
    return <div>Unknown content type</div>
  }

  const engOnTotal = getDiffTime(missionLogs['eng-on'] || '', missionLogs['eng-off']);
  const flightTotal = getDiffTime(missionLogs['atd'] || '', missionLogs['ata']);

  return (
    <div className="app-wrapper">
      {/* HEADER SUPERIOR */}
      <header style={{ 
        backgroundColor: 'var(--header-bg)', color: 'white', padding: '10px 20px', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.1)', minHeight: '60px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.8em', cursor: 'pointer' }}>☰</button>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.1em', letterSpacing: '1px' }}>INFLIGHT GUIDE OGS42</div>
            <div style={{ fontSize: '0.7em', opacity: 0.7 }}>Last Update: 06 MAY 2026</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right', fontFamily: 'monospace', display: 'flex', gap: '25px', fontWeight: 'bold' }}>
            <div style={{ fontSize: '1.1em' }}>LCL: {currentTime.toLocaleTimeString('pt-PT')}</div>
            <div style={{ fontSize: '1.1em', color: 'var(--highlight-color)' }}>ZULU: {currentTime.toISOString().substr(11, 8)}</div>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid white', color: 'white', borderRadius: '50%', width: '35px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* MISSION CONTROL PANEL */}
      <div style={{ 
        backgroundColor: darkMode ? '#1a1a1a' : '#f0f4f8', 
        padding: '8px 15px', display: 'flex', gap: '10px', overflowX: 'auto', flexShrink: 0,
        borderBottom: '2px solid var(--primary-color)', alignItems: 'center'
      }}>
        <div style={{ fontSize: '0.7em', fontWeight: 'bold', opacity: 0.7, whiteSpace: 'nowrap' }}>LOG:</div>
        {[
          { id: 'eng-on', label: 'ENG ON' },
          { id: 'atd', label: 'ATD' },
          { id: 'ata', label: 'ATA' },
          { id: 'eng-off', label: 'ENG OFF' }
        ].map(evt => (
          <button 
            key={evt.id}
            onClick={() => logEvent(evt.id)}
            onDoubleClick={() => openEditModal(evt.id, evt.label)}
            title="Clique para registar, Duplo-Clique para editar"
            style={{ 
              padding: '5px 10px', fontSize: '0.75em', borderRadius: '4px', border: '1px solid var(--primary-color)',
              backgroundColor: missionLogs[evt.id] ? 'var(--primary-color)' : 'transparent',
              color: missionLogs[evt.id] ? 'white' : 'var(--primary-color)',
              cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 'bold'
            }}
          >
            {evt.label}: {missionLogs[evt.id] || '--:--'}
          </button>
        ))}
        
        <div style={{ borderLeft: '1px solid #ccc', height: '20px', margin: '0 5px' }}></div>
        
        <div style={{ display: 'flex', gap: '15px', fontSize: '0.75em', whiteSpace: 'nowrap' }}>
          <span>ENG TOTAL: <strong style={{ color: 'var(--primary-color)' }}>{engOnTotal ? `${engOnTotal.hrs}h ${engOnTotal.mins}m` : '--:--'}</strong></span>
          <span>FLIGHT: <strong style={{ color: 'var(--primary-color)' }}>{flightTotal ? `${flightTotal.hrs}h ${flightTotal.mins}m` : '--:--'}</strong></span>
        </div>
      </div>

      {/* SECTION NAVIGATION */}
      <nav style={{ 
        backgroundColor: 'var(--sidebar-bg)', display: 'flex', gap: '5px', overflowX: 'auto', 
        padding: '5px 10px', borderBottom: '1px solid var(--border-color)', flexShrink: 0
      }}>
        {guideData.map(section => {
          let sectionColor = '#003366';
          let activeBg = 'var(--highlight-color)';
          let textColor = 'white';
          let activeTextColor = 'black';

          if (section.id === 'ENDURANCE') { sectionColor = '#455a64'; activeBg = '#cfd8dc'; activeTextColor = 'black'; }
          else if (section.id === 'EMERGENCY_CHECKLIST') { sectionColor = '#d32f2f'; activeBg = '#ff1744'; activeTextColor = 'white'; }
          else if (section.id === 'NORMAL_PROCEDURES') { sectionColor = '#0d47a1'; activeBg = '#2979ff'; activeTextColor = 'white'; }
          else if (section.id === 'SENSOR_OPERATOR') { sectionColor = '#1b5e20'; activeBg = '#00c853'; activeTextColor = 'white'; }
          else if (section.id === 'MISSION_PLANNING') { sectionColor = '#37474f'; activeBg = '#90a4ae'; activeTextColor = 'black'; }
          else if (section.id === 'HANDOVER_TAKEOVER') { sectionColor = '#f57f17'; activeBg = '#ffea00'; activeTextColor = 'black'; }
          else if (section.id === 'CRASH_RESPONSE') { sectionColor = '#4e342e'; activeBg = '#d84315'; activeTextColor = 'white'; }
          else if (section.id === 'MISSION_FOLDER') { sectionColor = '#6a1b9a'; activeBg = '#ba68c8'; activeTextColor = 'white'; }

          const isActive = activeSectionId === section.id;
          return (
            <button 
              key={section.id} onClick={() => handleSectionChange(section.id)}
              style={{ 
                backgroundColor: isActive ? activeBg : sectionColor, color: isActive ? activeTextColor : 'white',
                border: 'none', whiteSpace: 'nowrap', padding: '8px 12px', fontSize: '0.8em',
                fontWeight: isActive ? 'bold' : 'normal', borderRadius: '4px', cursor: 'pointer'
              }}
            >
              {section.label}
            </button>
          );
        })}
        <div style={{ borderLeft: '1px solid var(--border-color)', marginLeft: '10px', paddingLeft: '10px', display: 'flex', gap: '5px' }}>
          <button onClick={resetCurrentChecklists} style={{ fontSize: '0.7em', padding: '5px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'none', color: 'inherit', cursor: 'pointer' }}>Reset Secção</button>
          <button onClick={resetAllChecklists} style={{ fontSize: '0.7em', padding: '5px', backgroundColor: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reset Total</button>
        </div>
      </nav>

      <div className="main-body" style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <aside className="sidebar" style={{ 
          width: isSidebarVisible ? '280px' : '0px', backgroundColor: 'var(--sidebar-bg)', 
          borderRight: isSidebarVisible ? '1px solid var(--border-color)' : 'none',
          overflowY: 'auto', padding: isSidebarVisible ? '10px' : '0px', flexShrink: 0,
          transition: 'width 0.3s ease', position: isMobile ? 'absolute' : 'relative',
          height: '100%', zIndex: 50, boxShadow: (isSidebarVisible && isMobile) ? '4px 0 10px rgba(0,0,0,0.3)' : 'none'
        }}>
          {isSidebarVisible && (
            <div className="sidebar-items" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {activeSection.items.map(item => {
                const complete = isItemComplete(item);
                return (
                  <button
                    key={item.id} onClick={() => scrollToItem(item.id)}
                    style={{
                      textAlign: 'left', backgroundColor: complete ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                      color: complete ? '#4caf50' : 'inherit', border: 'none', borderLeft: complete ? '4px solid #4caf50' : '4px solid transparent',
                      padding: '10px', fontSize: '0.85em', cursor: 'pointer', fontWeight: complete ? 'bold' : 'normal'
                    }}
                  >
                    {complete && '✓ '} {item.title}
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <main className="content-area" style={{ flex: 1, padding: '0 20px 40px 20px', overflowY: 'auto', backgroundColor: 'var(--bg-color)', scrollBehavior: 'smooth' }}>
          {isSidebarVisible && isMobile && <div onClick={() => setIsSidebarVisible(false)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 45 }} />}
          
          {/* EMERGENCY DASHBOARD */}
          {activeSectionId === 'EMERGENCY_CHECKLIST' && (
            <div style={{ padding: '20px 0', borderBottom: '2px solid var(--accent-color)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: 'AIRCRAFT (1-10)', items: activeSection.items.filter(i => {
                  if (!i.id.startsWith('ec-') || i.id.includes('limit') || i.id === 'ec-electrical') return false;
                  const num = parseInt(i.title.split('.')[0]);
                  return num >= 1 && num <= 10;
                })},
                { label: 'GCS (11-13)', items: activeSection.items.filter(i => {
                  if (!i.id.startsWith('ec-')) return false;
                  const num = parseInt(i.title.split('.')[0]);
                  return num >= 11 && num <= 13;
                })},
                { label: 'EXTERNAL PILOT (14-15)', items: activeSection.items.filter(i => {
                  if (!i.id.startsWith('ec-')) return false;
                  const num = parseInt(i.title.split('.')[0]);
                  return num >= 14 && num <= 15;
                })},
                { label: 'LIMITATIONS', items: activeSection.items.filter(i => i.id === 'ec-limitations' || i.id === 'ec-engine-limits' || i.id === 'ec-electrical')}
              ].map(group => (
                <div key={group.label}>
                  <div style={{ fontSize: '0.8em', fontWeight: 'bold', marginBottom: '10px', opacity: 0.8, color: 'var(--accent-color)' }}>{group.label}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                    {group.items.map(item => (
                      <button 
                        key={item.id} onClick={() => scrollToItem(item.id)}
                        style={{ padding: '10px', fontSize: '0.7em', backgroundColor: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        {item.title.includes('.') ? item.title.split('.')[0] + '.' + item.title.split('.')[1].split('  ')[0] : item.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSectionId === 'MISSION_FOLDER' ? (
            <MissionFolder 
              missionLogs={missionLogs}
              fuelInit={fuelInit}
              fuelCurrent={fuelCurrent}
              fuelLogs={fuelLogs}
              engOnTotal={getDiffTime(missionLogs['eng-on'] || '', missionLogs['eng-off'])}
              flightTotal={getDiffTime(missionLogs['atd'] || '', missionLogs['ata'])}
            />
          ) : (
            activeSection.items.map((item) => (
              <section key={item.id} id={item.id} ref={el => contentRefs.current[item.id] = el} style={{ padding: '30px 0', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ color: 'var(--primary-color)', marginBottom: '15px', fontSize: '1.5em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.title}
                  {(item.type === 'checklist' || item.type === 'mixed') && (
                    <div className="no-print" style={{ display: 'inline-flex', gap: '5px', marginLeft: '15px' }}>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Marcar todos os passos de "${item.title}" como feitos?`)) {
                            setChecklistProgress(prev => {
                              const next = { ...prev };
                              let checklist: string[] | undefined;
                              if (item.type === 'checklist') {
                                checklist = item.content as string[];
                              } else if (item.type === 'mixed') {
                                checklist = (item.content as any).checklist;
                              }
                              if (checklist) {
                                const itemProgress = { ...(next[item.id] || {}) };
                                checklist.forEach((line, index) => {
                                  const isSpecialLine = !line.trim() || line.startsWith('WARNING:') || line.startsWith('CAUTION:') || line.startsWith('NOTE:') || line.startsWith('---');
                                  if (!isSpecialLine) {
                                    itemProgress[index] = true;
                                  }
                                });
                                next[item.id] = itemProgress;
                              }
                              return next;
                            });
                          }
                        }}
                        style={{ 
                          fontSize: '0.45em', 
                          padding: '4px 8px', 
                          backgroundColor: '#2e7d32', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        ✓ Check All
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Resetar o checklist "${item.title}"?`)) {
                            setChecklistProgress(prev => {
                              const next = { ...prev };
                              delete next[item.id];
                              return next;
                            });
                          }
                        }}
                        style={{ 
                          fontSize: '0.45em', 
                          padding: '4px 8px', 
                          backgroundColor: 'var(--accent-color)', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        🔄 Reset
                      </button>
                    </div>
                  )}
                </h2>
                <div className="content-render">{renderContent(item)}</div>
              </section>
            ))
          )}
        </main>
      </div>

      {/* TIMER EDIT MODAL */}
      {editingTimer && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ 
            backgroundColor: 'var(--card-bg)', padding: '25px', borderRadius: '12px', 
            width: '100%', maxWidth: '350px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--primary-color)', textAlign: 'center' }}>
              EDITAR {editingTimer.label}
            </h3>
            
            <input 
              type="text" 
              value={modalValue}
              onChange={(e) => setModalValue(e.target.value)}
              placeholder="HH:MM"
              autoFocus
              style={{ 
                width: '100%', padding: '15px', fontSize: '1.5em', textAlign: 'center',
                borderRadius: '8px', border: '2px solid var(--primary-color)',
                backgroundColor: 'var(--bg-color)', color: 'var(--text-color)',
                marginBottom: '20px'
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              <button 
                onClick={saveTimerValue}
                style={{ padding: '12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                GUARDAR
              </button>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button 
                  onClick={resetTimerValue}
                  style={{ padding: '12px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  RESET (ZERO)
                </button>
                <button 
                  onClick={() => setEditingTimer(null)}
                  style={{ padding: '12px', backgroundColor: '#546e7a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
