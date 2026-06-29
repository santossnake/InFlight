import { useState, useRef, useEffect } from 'react'
import { guideData, GuideItem } from './data/guideContent'
import MissionFolder from './components/MissionFolder'
import html2pdf from 'html2pdf.js'
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
      const isSpecialLine = !check.trim() || check.startsWith('WARNING:') || check.startsWith('CAUTION:') || check.startsWith('NOTE:') || check.startsWith('---') || check.startsWith('EXAMPLE:');
      
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

const Ar5NocChecklistRenderer = ({ 
  itemId, 
  content, 
  progress, 
  inputs, 
  onToggle, 
  onInputChange
}: { 
  itemId: string, 
  content: { num: string, item: string, action: string, redRisk: boolean }[], 
  progress: { [index: number]: boolean },
  inputs: { [index: number]: string },
  onToggle: (itemId: string, index: number) => void,
  onInputChange: (itemId: string, index: number, value: string) => void
}) => (
  <div style={{ overflowX: 'auto', margin: '15px 0', maxWidth: '900px' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em', border: '1px solid var(--border-color)' }}>
      <thead>
        <tr style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
          <th style={{ padding: '10px', border: '1px solid var(--border-color)', width: '50px', textAlign: 'center' }}>Nº</th>
          <th style={{ padding: '10px', border: '1px solid var(--border-color)', width: '200px', textAlign: 'left' }}>Item</th>
          <th style={{ padding: '10px', border: '1px solid var(--border-color)', textAlign: 'left' }}>Procedimento / Ação</th>
          <th style={{ padding: '10px', border: '1px solid var(--border-color)', width: '200px', textAlign: 'center' }}>Estado / Valor</th>
        </tr>
      </thead>
      <tbody>
        {content.map((row, idx) => {
          const isChecked = !!progress[idx];
          const textVal = inputs[idx] || '';
          const isStep1 = itemId === 'ar5-noc-pre-flight' && row.num === '1';
          const isFilled = isStep1 ? (isChecked && !!textVal.trim()) : (row.redRisk ? isChecked : (!!textVal.trim()));
          
          return (
            <tr key={idx} style={{ 
              backgroundColor: isFilled ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
              textDecoration: isFilled ? 'line-through' : 'none',
              color: isFilled ? '#888' : 'inherit',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <td style={{ padding: '8px', border: '1px solid var(--border-color)', textAlign: 'center', fontWeight: 'bold' }}>
                {row.num}
              </td>
              <td style={{ padding: '8px', border: '1px solid var(--border-color)', fontWeight: '500' }}>
                {row.item}
              </td>
              <td style={{ padding: '8px', border: '1px solid var(--border-color)', whiteSpace: 'pre-wrap' }}>
                {row.action}
              </td>
              <td style={{ padding: '8px', border: '1px solid var(--border-color)', textAlign: 'center', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'nowrap' }}>
                  {(row.redRisk || isStep1) && (
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => onToggle(itemId, idx)}
                      style={{ 
                        width: '20px', 
                        height: '20px', 
                        cursor: 'pointer',
                        flexShrink: 0
                      }} 
                    />
                  )}
                  {(!row.redRisk || isStep1) && (
                    <input 
                      type="text" 
                      value={textVal}
                      onChange={(e) => onInputChange(itemId, idx, e.target.value)}
                      maxLength={100}
                      placeholder={isStep1 ? "Nome do ficheiro" : "max 15 chars"}
                      style={{
                        padding: '4px 6px',
                        fontSize: '0.85em',
                        width: '120px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        backgroundColor: 'var(--input-bg, transparent)',
                        color: 'inherit'
                      }}
                    />
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const Ar5NocResumeForm = ({
  data,
  onChange
}: {
  data: any,
  onChange: (newData: any) => void
}) => {
  const updateField = (field: string, val: any) => {
    onChange({ ...data, [field]: val });
  };

  const updateCrew = (idx: number, field: string, val: string) => {
    const newCrew = [...(data.crew || [])];
    if (!newCrew[idx]) newCrew[idx] = { name: '', role: '' };
    newCrew[idx] = { ...newCrew[idx], [field]: val };
    onChange({ ...data, crew: newCrew });
  };

  return (
    <div className="ar5-noc-resume-form" style={{ maxWidth: '900px', margin: '0 auto', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--card-bg, rgba(255,255,255,0.02))' }}>
      {/* Top 5x2 Fields */}
      <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px', borderBottom: '2px solid var(--primary-color)', paddingBottom: '5px' }}>Informação Geral</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        {[
          { label: 'Aircraft ID', field: 'aircraftId', maxLength: 50 },
          { label: 'Date', field: 'date', maxLength: 50 },
          { label: 'fGCS ID/Version', field: 'fgcsId', maxLength: 50 },
          { label: 'Location', field: 'location', maxLength: 50 },
          { label: 'mGCS ID/Version', field: 'mgcsId', maxLength: 50 },
          { label: 'Mission type', field: 'missionType', maxLength: 100 },
          { label: 'Tracker / DL ID', field: 'trackerId', maxLength: 50 },
          { label: 'Night / Day', field: 'nightDay', maxLength: 50 },
          { label: 'SP Control ID', field: 'spControlId', maxLength: 50 },
          { label: 'RPIC', field: 'rpic', maxLength: 100 },
        ].map((item) => (
          <div key={item.field} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9em' }}>{item.label}</label>
            <input
              type="text"
              value={data[item.field] || ''}
              onChange={(e) => updateField(item.field, e.target.value)}
              maxLength={item.maxLength}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--input-bg, transparent)',
                color: 'inherit'
              }}
            />
          </div>
        ))}
      </div>

      {/* Crew Table */}
      <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px', borderBottom: '2px solid var(--primary-color)', paddingBottom: '5px' }}>Flight Crew</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '0.9em', border: '1px solid var(--border-color)' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
            <th style={{ padding: '8px', border: '1px solid var(--border-color)', width: '50px', textAlign: 'center' }}>Tripulante</th>
            <th style={{ padding: '8px', border: '1px solid var(--border-color)', textAlign: 'left' }}>Nome</th>
            <th style={{ padding: '8px', border: '1px solid var(--border-color)', textAlign: 'left' }}>Função</th>
          </tr>
        </thead>
        <tbody>
          {Array(7).fill(null).map((_, idx) => (
            <tr key={idx}>
              <td style={{ padding: '6px', border: '1px solid var(--border-color)', textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
              <td style={{ padding: '6px', border: '1px solid var(--border-color)' }}>
                <input
                  type="text"
                  value={data.crew?.[idx]?.name || ''}
                  onChange={(e) => updateCrew(idx, 'name', e.target.value)}
                  maxLength={100}
                  placeholder="Nome do Tripulante"
                  style={{
                    width: '100%',
                    padding: '6px',
                    boxSizing: 'border-box',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'inherit'
                  }}
                />
              </td>
              <td style={{ padding: '6px', border: '1px solid var(--border-color)' }}>
                <input
                  type="text"
                  value={data.crew?.[idx]?.role || ''}
                  onChange={(e) => updateCrew(idx, 'role', e.target.value)}
                  maxLength={100}
                  placeholder="Função (ex: RPIC, OS, External Pilot)"
                  style={{
                    width: '100%',
                    padding: '6px',
                    boxSizing: 'border-box',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'inherit'
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Flight Resume Parameters */}
      <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px', borderBottom: '2px solid var(--primary-color)', paddingBottom: '5px' }}>Flight Resume / Parâmetros</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        {[
          { label: 'Take-off Direction', field: 'takeoffDir', maxLength: 100 },
          { label: 'Take-off Wind', field: 'takeoffWind', maxLength: 100 },
          { label: 'Take-off Weather', field: 'takeoffWeather', maxLength: 200 },
          { label: 'Take-off Weight', field: 'takeoffWeight', maxLength: 100 },
          { label: 'Landing Direction', field: 'landingDir', maxLength: 100 },
          { label: 'Landing Wind', field: 'landingWind', maxLength: 100 },
          { label: 'Landing Weather', field: 'landingWeather', maxLength: 200 },
          { label: 'Landing Weight/Fuel', field: 'landingWeightFuel', maxLength: 100 },
        ].map((item) => (
          <div key={item.field} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9em' }}>{item.label}</label>
            <input
              type="text"
              value={data[item.field] || ''}
              onChange={(e) => updateField(item.field, e.target.value)}
              maxLength={item.maxLength}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--input-bg, transparent)',
                color: 'inherit'
              }}
            />
          </div>
        ))}
      </div>

      {/* Textareas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
        {[
          { label: 'System configuration', field: 'systemConfig', maxLength: 500, rows: 3 },
          { label: 'Mission Description / Observations', field: 'missionDesc', maxLength: 500, rows: 3 },
          { label: 'Aircraft Condition', field: 'aircraftCondition', maxLength: 200, rows: 2 },
          { label: 'Faults Detected', field: 'faultsDetected', maxLength: 300, rows: 2 },
          { label: 'Safety Occurrences', field: 'safetyOccurrences', maxLength: 300, rows: 2 },
          { label: 'Bottom Observations', field: 'bottomObservations', maxLength: 500, rows: 3 },
        ].map((item) => (
          <div key={item.field} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9em' }}>{item.label}</label>
            <textarea
              value={data[item.field] || ''}
              onChange={(e) => updateField(item.field, e.target.value)}
              maxLength={item.maxLength}
              rows={item.rows}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--input-bg, transparent)',
                color: 'inherit',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        {[
          { label: 'Bottom Date', field: 'bottomDate', maxLength: 50 },
          { label: 'Bottom Time', field: 'bottomTime', maxLength: 50 },
          { label: 'RPIC Print', field: 'bottomRpicPrint', maxLength: 100 },
          { label: 'RPIC Sign', field: 'bottomRpicSign', maxLength: 100 },
        ].map((item) => (
          <div key={item.field} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9em' }}>{item.label}</label>
            <input
              type="text"
              value={data[item.field] || ''}
              onChange={(e) => updateField(item.field, e.target.value)}
              maxLength={item.maxLength}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--input-bg, transparent)',
                color: 'inherit'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  
  // Endurance Calculator State
  const [fuelInit, setFuelInit] = useState<string>(localStorage.getItem('fuelInit') || '16')
  const [fuelCurrent, setFuelCurrent] = useState<string>(localStorage.getItem('fuelCurrent') || '16')
  const [gs, setGs] = useState<string>(localStorage.getItem('gs') || '50')
  const [distHome, setDistHome] = useState<string>(localStorage.getItem('distHome') || '10')
  const [engineOnManual, setEngineOnManual] = useState<string>('')
  const [editingTimer, setEditingTimer] = useState<{ id: string, label: string } | null>(null)
  const [modalValue, setModalValue] = useState('')
  const [editingFuelLogIndex, setEditingFuelLogIndex] = useState<number | null>(null)
  const [editingFuelLog, setEditingFuelLog] = useState<{ zuluTime: string; fuel: string; elapsedMins: string } | null>(null)

  const [missionLogs, setMissionLogs] = useState<{ [key: string]: string }>(() => {
    const saved = localStorage.getItem('missionLogs');
    return saved ? JSON.parse(saved) : {};
  });

  const [checklistProgress, setChecklistProgress] = useState<{ [itemId: string]: { [index: number]: boolean } }>(() => {
    const saved = localStorage.getItem('checklistProgress');
    return saved ? JSON.parse(saved) : {};
  });

  const [checklistInputs, setChecklistInputs] = useState<{ [itemId: string]: { [index: number]: string } }>(() => {
    const saved = localStorage.getItem('checklistInputs');
    return saved ? JSON.parse(saved) : {};
  });

  const [ar5NocResume, setAr5NocResume] = useState<{ [key: string]: any }>(() => {
    const saved = localStorage.getItem('ar5NocResume');
    return saved ? JSON.parse(saved) : {
      aircraftId: '', date: '', fgcsId: '', location: '', mgcsId: '', missionType: '',
      trackerId: '', nightDay: '', spControlId: '', rpic: '',
      crew: Array(7).fill(null).map(() => ({ name: '', role: '' })),
      takeoffDir: '', takeoffWind: '', takeoffWeather: '', takeoffWeight: '',
      systemConfig: '', missionDesc: '', landingDir: '', landingWind: '',
      landingWeather: '', landingWeightFuel: '', aircraftCondition: '',
      faultsDetected: '', safetyOccurrences: '',
      bottomObservations: '', bottomRpicPrint: '', bottomRpicSign: '',
      bottomDate: '', bottomTime: ''
    };
  });

  const [jsonFileName, setJsonFileName] = useState('AR5_NOC_Data');

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
    localStorage.setItem('checklistInputs', JSON.stringify(checklistInputs));
  }, [checklistInputs]);

  useEffect(() => {
    localStorage.setItem('ar5NocResume', JSON.stringify(ar5NocResume));
  }, [ar5NocResume]);

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

  const exportAr5NocPdf = () => {
    setIsGeneratingPdf(true);
  };

  useEffect(() => {
    if (isGeneratingPdf) {
      setTimeout(() => {
        const element = document.querySelector('.main-body');
        if (element) {
          const clone = element.cloneNode(true) as HTMLElement;
          
          // Copy live input values (text and check states) from page to the clone
          const origInputs = element.querySelectorAll('input, textarea');
          const cloneInputs = clone.querySelectorAll('input, textarea');
          origInputs.forEach((orig: any, i) => {
            const cloneInput = cloneInputs[i] as any;
            if (cloneInput && orig) {
              if (orig.type === 'checkbox') {
                cloneInput.checked = orig.checked;
              } else {
                cloneInput.value = orig.value;
              }
            }
          });

          // Inject page break rules for clean PDF output
          const style = document.createElement('style');
          style.textContent = `
            section {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 25px !important;
              display: block !important;
            }
            tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .ar5-noc-resume-form {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .tekever-header-box {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 30px !important;
            }
            table {
              page-break-inside: auto !important;
            }
          `;
          clone.appendChild(style);

          clone.querySelectorAll('.sidebar, .no-print').forEach(el => el.remove());
          
          clone.querySelectorAll('input[type="text"]').forEach((input: any) => {
            const span = document.createElement('span');
            span.textContent = input.value || ' ';
            span.style.padding = '2px 4px';
            span.style.borderBottom = '1px solid #333';
            span.style.fontSize = '0.95em';
            span.style.minWidth = '80px';
            span.style.display = 'inline-block';
            input.parentNode.replaceChild(span, input);
          });

          clone.querySelectorAll('textarea').forEach((textarea: any) => {
            const div = document.createElement('div');
            div.textContent = textarea.value || ' ';
            div.style.padding = '6px';
            div.style.border = '1px solid #ddd';
            div.style.borderRadius = '4px';
            div.style.minHeight = '40px';
            div.style.whiteSpace = 'pre-wrap';
            div.style.fontSize = '0.95em';
            textarea.parentNode.replaceChild(div, textarea);
          });

          clone.querySelectorAll('input[type="checkbox"]').forEach((checkbox: any) => {
            const span = document.createElement('span');
            span.textContent = checkbox.checked ? ' [✓] ' : ' [ ] ';
            span.style.fontFamily = 'monospace';
            span.style.fontWeight = 'bold';
            span.style.fontSize = '1.2em';
            checkbox.parentNode.replaceChild(span, checkbox);
          });

          clone.style.width = '210mm';
          clone.style.padding = '15mm';
          clone.style.backgroundColor = 'white';
          clone.style.color = 'black';
          clone.style.overflow = 'visible';
          clone.style.height = 'auto';

          clone.querySelectorAll('*').forEach((el: any) => {
            el.style.color = 'black';
            el.style.backgroundColor = 'transparent';
            if (el.tagName === 'TH') {
              el.style.backgroundColor = '#f2f2f2';
            }
          });

          const customFn = checklistInputs['ar5-noc-pre-flight']?.[1] || '';
          const finalPdfName = customFn.trim() 
            ? `${customFn.trim()}.pdf` 
            : `AR5_NOC_Checklist_${ar5NocResume.aircraftId || 'AR5'}_${ar5NocResume.date || ''}.pdf`;

          const opt = {
            margin:       10,
            filename:     finalPdfName,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
              scale: 2, 
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff'
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['css', 'legacy'] }
          };

          html2pdf().from(clone).set(opt).save().then(() => {
            setIsGeneratingPdf(false);
          }).catch(() => {
            setIsGeneratingPdf(false);
          });
        } else {
          setIsGeneratingPdf(false);
        }
      }, 500);
    }
  }, [isGeneratingPdf]);

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

  const saveFuelLogEdit = () => {
    if (editingFuelLogIndex === null || !editingFuelLog) return;
    const fuelVal = parseFloat(editingFuelLog.fuel) || 0;
    const minsVal = parseFloat(editingFuelLog.elapsedMins) || 0;
    setFuelLogs(prev => {
      const next = [...prev];
      next[editingFuelLogIndex] = {
        zuluTime: editingFuelLog.zuluTime,
        fuel: fuelVal,
        elapsedMins: minsVal
      };
      return next;
    });
    setEditingFuelLogIndex(null);
    setEditingFuelLog(null);
  };

  const deleteFuelLogEntry = () => {
    if (editingFuelLogIndex === null) return;
    if (window.confirm('Eliminar esta leitura de combustível?')) {
      setFuelLogs(prev => prev.filter((_, idx) => idx !== editingFuelLogIndex));
      setEditingFuelLogIndex(null);
      setEditingFuelLog(null);
    }
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

  const handleInputChange = (itemId: string, index: number, value: string) => {
    setChecklistInputs(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [index]: value.slice(0, 15) // limit to 15 chars
      }
    }));
  };

  const resetCurrentChecklists = () => {
    if (activeSectionId === 'MISSION_FOLDER') {
      if (window.confirm('Resetar todos os dados do Mission Folder?')) {
        localStorage.removeItem('mf_orm_selections');
        localStorage.removeItem('mf_its_input');
        localStorage.removeItem('mf_xwind_input');
        localStorage.removeItem('mf_general');
        localStorage.removeItem('mf_crew_op');
        localStorage.removeItem('mf_crew_uni');
        localStorage.removeItem('mf_briefings');
        window.location.reload();
      }
    } else {
      if (window.confirm('Resetar todos os checklists da secção atual?')) {
        const newProgress = { ...checklistProgress };
        const newInputs = { ...checklistInputs };
        activeSection.items.forEach(item => { 
          delete newProgress[item.id]; 
          delete newInputs[item.id];
        });
        setChecklistProgress(newProgress);
        setChecklistInputs(newInputs);
        if (activeSectionId === 'AR5_NOC') {
          setAr5NocResume({
            aircraftId: '', date: '', fgcsId: '', location: '', mgcsId: '', missionType: '',
            trackerId: '', nightDay: '', spControlId: '', rpic: '',
            crew: Array(7).fill(null).map(() => ({ name: '', role: '' })),
            takeoffDir: '', takeoffWind: '', takeoffWeather: '', takeoffWeight: '',
            systemConfig: '', missionDesc: '', landingDir: '', landingWind: '',
            landingWeather: '', landingWeightFuel: '', aircraftCondition: '',
            faultsDetected: '', safetyOccurrences: '',
            bottomObservations: '', bottomRpicPrint: '', bottomRpicSign: '',
            bottomDate: '', bottomTime: ''
          });
        }
      }
    }
  };


  const resetAllChecklists = () => {
    if (window.confirm('Resetar TODOS os checklists, logs de missão e matriz ORM?')) {
      setChecklistProgress({});
      setChecklistInputs({});
      setAr5NocResume({
        aircraftId: '', date: '', fgcsId: '', location: '', mgcsId: '', missionType: '',
        trackerId: '', nightDay: '', spControlId: '', rpic: '',
        crew: Array(7).fill(null).map(() => ({ name: '', role: '' })),
        takeoffDir: '', takeoffWind: '', takeoffWeather: '', takeoffWeight: '',
        systemConfig: '', missionDesc: '', landingDir: '', landingWind: '',
        landingWeather: '', landingWeightFuel: '', aircraftCondition: '',
        faultsDetected: '', safetyOccurrences: '',
        bottomObservations: '', bottomRpicPrint: '', bottomRpicSign: '',
        bottomDate: '', bottomTime: ''
      });
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
    if (item.type === 'ar5_noc_resume') {
      const keys = ['aircraftId', 'date', 'fgcsId', 'location', 'mgcsId', 'missionType', 'trackerId', 'nightDay', 'spControlId', 'rpic', 'takeoffDir', 'takeoffWind', 'takeoffWeather', 'takeoffWeight', 'systemConfig', 'missionDesc', 'landingDir', 'landingWind', 'landingWeather', 'landingWeightFuel', 'aircraftCondition', 'faultsDetected', 'safetyOccurrences', 'bottomObservations', 'bottomRpicPrint', 'bottomRpicSign', 'bottomDate', 'bottomTime'];
      const hasMainData = keys.some(k => !!ar5NocResume[k]?.trim());
      const hasCrewData = ar5NocResume.crew?.some((c: any) => !!c.name?.trim() || !!c.role?.trim());
      return hasMainData || hasCrewData;
    }
    if (item.type === 'ar5_noc_checklist') {
      const list = item.content as { num: string, item: string, action: string, redRisk: boolean }[];
      const progress = checklistProgress[item.id] || {};
      const inputs = checklistInputs[item.id] || {};
      return list.every((row, index) => {
        const isStep1 = item.id === 'ar5-noc-pre-flight' && row.num === '1';
        if (isStep1) {
          return !!progress[index] && !!inputs[index] && inputs[index].trim().length > 0;
        }
        if (row.redRisk) {
          return !!progress[index];
        } else {
          return !!inputs[index] && inputs[index].trim().length > 0;
        }
      });
    }
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
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Pontos Registados (Clique para editar):</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {fuelLogs.map((log, i) => (
                  <span 
                    key={i} 
                    onClick={() => {
                      setEditingFuelLogIndex(i);
                      setEditingFuelLog({
                        zuluTime: log.zuluTime,
                        fuel: log.fuel.toString(),
                        elapsedMins: log.elapsedMins.toString()
                      });
                    }}
                    style={{ 
                      backgroundColor: 'rgba(142, 36, 170, 0.1)', 
                      color: '#8e24aa', 
                      padding: '5px 10px', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(142, 36, 170, 0.3)', 
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    {log.zuluTime}Z: {log.fuel}L ({Math.round(log.elapsedMins)} min) ✏️
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

    if (item.type === 'ar5_noc_checklist') {
      return <Ar5NocChecklistRenderer 
        itemId={item.id} 
        content={item.content} 
        progress={checklistProgress[item.id] || {}}
        inputs={checklistInputs[item.id] || {}}
        onToggle={handleToggle}
        onInputChange={handleInputChange}
      />;
    }

    if (item.type === 'ar5_noc_resume') {
      return <Ar5NocResumeForm 
        data={ar5NocResume}
        onChange={setAr5NocResume}
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
            <div style={{ fontSize: '0.7em', opacity: 0.7 }}>Last Update: 25 Junho 2026</div>
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
          else if (section.id === 'COMUNICATIONS') { sectionColor = '#008080'; activeBg = '#40e0d0'; activeTextColor = 'black'; }
          else if (section.id === 'MISSION_PLANNING') { sectionColor = '#37474f'; activeBg = '#90a4ae'; activeTextColor = 'black'; }
          else if (section.id === 'HANDOVER_TAKEOVER') { sectionColor = '#f57f17'; activeBg = '#ffea00'; activeTextColor = 'black'; }
          else if (section.id === 'CRASH_RESPONSE') { sectionColor = '#4e342e'; activeBg = '#d84315'; activeTextColor = 'white'; }
          else if (section.id === 'MISSION_FOLDER') { sectionColor = '#6a1b9a'; activeBg = '#ba68c8'; activeTextColor = 'white'; }
          else if (section.id === 'AR5_NOC') { sectionColor = '#1a237e'; activeBg = '#3f51b5'; activeTextColor = 'white'; }

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
            <div>
              {activeSectionId === 'AR5_NOC' && (
                <div style={{ padding: '20px 0 10px 0' }}>
                  {/* Export Button */}
                  <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                    <button 
                      onClick={exportAr5NocPdf} 
                      style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#1b5e20', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: 'bold',
                        fontSize: '0.95em',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Exportar Checklist AR5 NOC (PDF)
                    </button>
                  </div>

                  {/* Tekever Header layout */}
                  <div className="tekever-header-box" style={{ 
                    display: 'flex', 
                    border: '1.5px solid #000', 
                    fontFamily: 'Arial, sans-serif',
                    color: '#000',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      flex: '1', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      padding: '12px 15px',
                      borderRight: '1.5px solid #000',
                      minWidth: '120px',
                      backgroundColor: '#fff'
                    }}>
                      <span style={{ fontSize: '1.8em', fontWeight: '900', color: '#d32f2f', letterSpacing: '1px' }}>TEKEVER</span>
                    </div>
                    <div style={{ 
                      flex: '2.5', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      padding: '10px',
                      borderRight: '1.5px solid #000',
                      textAlign: 'center',
                      backgroundColor: '#fff'
                    }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1em', letterSpacing: '0.5px' }}>Normal Operations Checklist</div>
                      <div style={{ fontSize: '0.9em', fontWeight: 'bold', marginTop: '2px' }}>TEKEVER AR5 (MK2.3)</div>
                    </div>
                    <div style={{ 
                      flex: '1.5', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      fontSize: '0.85em',
                      padding: '8px 12px',
                      justifyContent: 'center',
                      gap: '4px',
                      backgroundColor: '#fff'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '2px' }}>
                        <span style={{ fontWeight: 'bold' }}>Version:</span>
                        <span>12</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '2px' }}>
                        <span style={{ fontWeight: 'bold' }}>Date:</span>
                        <span>08-Oct-2024</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold' }}>Reference:</span>
                        <span style={{ fontSize: '0.95em' }}>TAS-AR5-ETN-009_00</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeSection.items.map((item) => (
              <section key={item.id} id={item.id} ref={el => contentRefs.current[item.id] = el} style={{ padding: '30px 0', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ color: 'var(--primary-color)', marginBottom: '15px', fontSize: '1.5em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.title}
                  {(item.type === 'checklist' || item.type === 'mixed' || item.type === 'ar5_noc_checklist') && (
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
                              
                              if (item.type === 'ar5_noc_checklist') {
                                const itemProgress = { ...(next[item.id] || {}) };
                                (item.content as any[]).forEach((_, index) => {
                                  itemProgress[index] = true;
                                });
                                next[item.id] = itemProgress;
                              } else if (checklist) {
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
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          fontSize: '0.45em', 
                          padding: '4px 8px', 
                          backgroundColor: '#2e7d32', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          height: '22px',
                          verticalAlign: 'middle'
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Check All
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Resetar o checklist "${item.title}"?`)) {
                            setChecklistProgress(prev => {
                              const next = { ...prev };
                              delete next[item.id];
                              return next;
                            });
                            setChecklistInputs(prev => {
                              const next = { ...prev };
                              delete next[item.id];
                              return next;
                            });
                          }
                        }}
                        style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          fontSize: '0.45em', 
                          padding: '4px 8px', 
                          backgroundColor: 'var(--accent-color)', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          height: '22px',
                          verticalAlign: 'middle'
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                          <polyline points="3 3 3 8 8 8" />
                        </svg>
                        Reset
                      </button>
                    </div>
                  )}
                </h2>
                <div className="content-render">{renderContent(item)}</div>
              </section>
            ))
            }
            </div>
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

      {/* FUEL LOG EDIT MODAL */}
      {editingFuelLog && (
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
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#8e24aa', textAlign: 'center' }}>
              EDITAR LEITURA
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85em', marginBottom: '5px', opacity: 0.8 }}>HORA ZULU (HH:MM)</label>
                <input 
                  type="text" 
                  value={editingFuelLog.zuluTime}
                  onChange={(e) => {
                    const val = e.target.value;
                    const nextLog = { ...editingFuelLog, zuluTime: val };
                    const engOnStr = engineOnManual || missionLogs['eng-on'];
                    if (engOnStr && val.includes(':')) {
                      const [h1, m1] = engOnStr.split(':').map(Number);
                      const [h2, m2] = val.split(':').map(Number);
                      if (!isNaN(h1) && !isNaN(m1) && !isNaN(h2) && !isNaN(m2)) {
                        let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
                        if (diff < 0) diff += 24 * 60;
                        nextLog.elapsedMins = diff.toString();
                      }
                    }
                    setEditingFuelLog(nextLog);
                  }}
                  placeholder="HH:MM"
                  style={{ 
                    width: '100%', padding: '10px', fontSize: '1.2em', textAlign: 'center',
                    borderRadius: '6px', border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85em', marginBottom: '5px', opacity: 0.8 }}>COMBUSTÍVEL (L)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={editingFuelLog.fuel}
                  onChange={(e) => setEditingFuelLog({ ...editingFuelLog, fuel: e.target.value })}
                  placeholder="L"
                  style={{ 
                    width: '100%', padding: '10px', fontSize: '1.2em', textAlign: 'center',
                    borderRadius: '6px', border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85em', marginBottom: '5px', opacity: 0.8 }}>MINUTOS DECORRIDOS (ENGINE ON)</label>
                <input 
                  type="number" 
                  value={editingFuelLog.elapsedMins}
                  onChange={(e) => {
                    const val = e.target.value;
                    const nextLog = { ...editingFuelLog, elapsedMins: val };
                    const engOnStr = engineOnManual || missionLogs['eng-on'];
                    const mins = parseFloat(val);
                    if (engOnStr && !isNaN(mins)) {
                      const [h1, m1] = engOnStr.split(':').map(Number);
                      if (!isNaN(h1) && !isNaN(m1)) {
                        let totalMins = h1 * 60 + m1 + mins;
                        if (totalMins < 0) totalMins += 24 * 60 * Math.ceil(Math.abs(totalMins) / 1440);
                        const hours = Math.floor(totalMins / 60) % 24;
                        const minutes = Math.round(totalMins % 60);
                        nextLog.zuluTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                      }
                    }
                    setEditingFuelLog(nextLog);
                  }}
                  placeholder="minutos"
                  style={{ 
                    width: '100%', padding: '10px', fontSize: '1.2em', textAlign: 'center',
                    borderRadius: '6px', border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              <button 
                onClick={saveFuelLogEdit}
                style={{ padding: '12px', backgroundColor: '#8e24aa', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                GUARDAR
              </button>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button 
                  onClick={deleteFuelLogEntry}
                  style={{ padding: '12px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  APAGAR
                </button>
                <button 
                  onClick={() => {
                    setEditingFuelLogIndex(null);
                    setEditingFuelLog(null);
                  }}
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
