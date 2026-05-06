import { useState, useRef, useEffect } from 'react'
import { guideData, GuideItem } from './data/guideContent'
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

      return (
        <label key={idx} className={`checklist-label ${isMemoryItem ? 'memory-item' : ''}`} style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', padding: '10px', transition: 'background-color 0.2s' }}>
          <input 
            type="checkbox" 
            checked={!!progress[idx]}
            onChange={() => onToggle(itemId, idx)}
            style={{ 
              marginTop: '4px',
              marginRight: '15px', 
              width: '22px', 
              height: '22px',
              cursor: 'pointer',
              flexShrink: 0
            }} 
          />
          <span style={{ textDecoration: progress[idx] ? 'line-through' : 'none', color: progress[idx] ? '#888' : 'inherit' }}>
            {formatText(check)}
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
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Bingo Calculator State
  const [fuelInit, setFuelInit] = useState<string>(localStorage.getItem('fuelInit') || '13')
  const [burnRate, setBurnRate] = useState<string>(localStorage.getItem('burnRate') || '1.5')
  const [engineOnManual, setEngineOnManual] = useState<string>('')

  const [missionLogs, setMissionLogs] = useState<{ [key: string]: string }>(() => {
    const saved = localStorage.getItem('missionLogs');
    return saved ? JSON.parse(saved) : {};
  });

  const [checklistProgress, setChecklistProgress] = useState<{ [itemId: string]: { [index: number]: boolean } }>(() => {
    const saved = localStorage.getItem('checklistProgress');
    return saved ? JSON.parse(saved) : {};
  });

  const contentRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

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
    localStorage.setItem('burnRate', burnRate);
  }, [fuelInit, burnRate]);

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
    setSearchQuery('')
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

  const resetMissionEvent = (id: string) => {
    if (window.confirm(`Resetar tempo de ${id.toUpperCase()}?`)) {
      setMissionLogs(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }

  const logEvent = (event: string) => {
    const timeStr = new Date().toLocaleTimeString('pt-PT', { hour12: false });
    setMissionLogs(prev => ({ ...prev, [event]: timeStr }));
  }

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
    if (window.confirm('Resetar TODOS os checklists e logs de missão?')) {
      setChecklistProgress({});
      setMissionLogs({});
      setFuelInit('13');
      setBurnRate('1.5');
      setEngineOnManual('');
    }
  };

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
    if (item.id === 'bingo-calc') {
      const f = parseFloat(fuelInit) || 0;
      const b = parseFloat(burnRate) || 0;
      
      // Calculate elapsed time since Engine ON
      let elapsedMinutes = 0;
      const engOnStr = engineOnManual || missionLogs['eng-on'];
      if (engOnStr) {
        const [h, m] = engOnStr.split(':').map(Number);
        const engOnDate = new Date();
        engOnDate.setHours(h, m, 0);
        
        const now = new Date();
        // Handle crossover (if eng on was yesterday)
        if (now < engOnDate) engOnDate.setDate(engOnDate.getDate() - 1);
        
        elapsedMinutes = (now.getTime() - engOnDate.getTime()) / (1000 * 60);
      }

      const fuelConsumed = (elapsedMinutes / 60) * b;
      const currentFuel = Math.max(0, f - fuelConsumed);
      const fuelToBingo = Math.max(0, currentFuel - 2.5);
      
      const enduranceToBingo = b > 0 ? fuelToBingo / b : 0;
      const hours = Math.floor(enduranceToBingo);
      const mins = Math.round((enduranceToBingo - hours) * 60);
      
      const fuelPercentage = (currentFuel / f) * 100 || 0;

      return (
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75em', marginBottom: '5px', opacity: 0.8 }}>FUEL INICIAL (L)</label>
              <input type="number" value={fuelInit} onChange={e => setFuelInit(e.target.value)} style={{ width: '100%', padding: '10px', fontSize: '1.1em', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75em', marginBottom: '5px', opacity: 0.8 }}>CONSUMO (L/H)</label>
              <input type="number" value={burnRate} onChange={e => setBurnRate(e.target.value)} step="0.1" style={{ width: '100%', padding: '10px', fontSize: '1.1em', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75em', marginBottom: '5px', opacity: 0.8 }}>ENGINE ON (HH:MM)</label>
              <input type="text" placeholder="--:--" value={engineOnManual || missionLogs['eng-on'] || ''} onChange={e => setEngineOnManual(e.target.value)} style={{ width: '100%', padding: '10px', fontSize: '1.1em', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8em', marginBottom: '5px' }}>
              <span>CONSUMO ESTIMADO</span>
              <span>{currentFuel.toFixed(1)}L / {f}L</span>
            </div>
            <div style={{ height: '25px', width: '100%', backgroundColor: '#eee', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ccc' }}>
              <div style={{ 
                height: '100%', 
                width: `${fuelPercentage}%`, 
                backgroundColor: fuelPercentage < 20 ? 'var(--accent-color)' : (fuelPercentage < 40 ? '#facc15' : '#4caf50'),
                transition: 'width 0.5s ease-in-out',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7em', fontWeight: 'bold'
              }}>
                {fuelPercentage.toFixed(0)}%
              </div>
            </div>
          </div>

          <div style={{ padding: '25px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '0.85em', opacity: 0.9, letterSpacing: '1px' }}>TEMPO RESTANTE ATÉ 2.5L (BINGO)</div>
            <div style={{ fontSize: '3.5em', fontWeight: 'bold', margin: '5px 0' }}>{hours}h {mins}m</div>
            <div style={{ fontSize: '0.75em', opacity: 0.7 }}>Baseado em {burnRate} L/H e {elapsedMinutes.toFixed(0)}m de operação.</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '15px', backgroundColor: 'rgba(250, 204, 21, 0.1)', color: '#856404', borderRadius: '8px', textAlign: 'center', border: '1px solid #facc15' }}>
              <div style={{ fontSize: '0.75em', fontWeight: 'bold' }}>BINGO 25%</div>
              <div style={{ fontSize: '1.4em', fontWeight: 'bold' }}>{(f * 0.25).toFixed(1)} L</div>
            </div>
            <div style={{ padding: '15px', backgroundColor: 'rgba(255, 77, 77, 0.1)', color: 'var(--accent-color)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.75em', fontWeight: 'bold' }}>BINGO 15%</div>
              <div style={{ fontSize: '1.4em', fontWeight: 'bold' }}>{(f * 0.15).toFixed(1)} L</div>
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

  const filteredItems = searchQuery 
    ? activeSection.items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (typeof item.content === 'string' && item.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : activeSection.items;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      {/* HEADER SUPERIOR */}
      <header style={{ 
        backgroundColor: 'var(--header-bg)', color: 'white', padding: '5px 15px', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5em', cursor: 'pointer' }}>☰</button>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>INFLIGHT GUIDE OGS42</div>
            <div style={{ fontSize: '0.6em', opacity: 0.7 }}>Last Update: 06 MAY 2026</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right', fontFamily: 'monospace' }}>
            <div style={{ fontSize: '0.8em' }}>LCL: {currentTime.toLocaleTimeString('pt-PT')}</div>
            <div style={{ fontSize: '0.8em', color: 'var(--highlight-color)' }}>ZULU: {currentTime.toISOString().substr(11, 8)}</div>
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', width: isMobile ? '80px' : '150px', fontSize: '0.8em' }}
          />
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid white', color: 'white', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
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
        <div style={{ fontSize: '0.7em', fontWeight: 'bold', opacity: 0.7, whiteSpace: 'nowrap' }}>MISSION LOG:</div>
        {[
          { id: 'eng-on', label: 'ENGINE ON' },
          { id: 'atd', label: 'ATD' },
          { id: 'ata', label: 'ATA' },
          { id: 'eng-off', label: 'ENGINE OFF' }
        ].map(evt => (
          <button 
            key={evt.id}
            onClick={() => logEvent(evt.id)}
            onDoubleClick={() => resetMissionEvent(evt.id)}
            title="Clique para registar, Duplo-Clique para resetar"
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
        <div style={{ fontSize: '0.6em', opacity: 0.5, fontStyle: 'italic', whiteSpace: 'nowrap' }}>(Duplo-clique para reset)</div>
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

          if (section.id === 'BINGOS') { sectionColor = '#455a64'; activeBg = '#cfd8dc'; activeTextColor = 'black'; }
          else if (section.id === 'EMERGENCY_CHECKLIST') { sectionColor = '#b71c1c'; activeBg = '#ff1744'; activeTextColor = 'white'; }
          else if (section.id === 'NORMAL_PROCEDURES') { sectionColor = '#0d47a1'; activeBg = '#2979ff'; activeTextColor = 'white'; }
          else if (section.id === 'SENSOR_OPERATOR') { sectionColor = '#1b5e20'; activeBg = '#00c853'; activeTextColor = 'white'; }
          else if (section.id === 'MISSION_PLANNING') { sectionColor = '#37474f'; activeBg = '#90a4ae'; activeTextColor = 'black'; }
          else if (section.id === 'HANDOVER_TAKEOVER') { sectionColor = '#f57f17'; activeBg = '#ffea00'; activeTextColor = 'black'; }
          else if (section.id === 'CRASH_RESPONSE') { sectionColor = '#4e342e'; activeBg = '#d84315'; activeTextColor = 'white'; }

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
          {activeSectionId === 'EMERGENCY_CHECKLIST' && !searchQuery && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', padding: '20px 0', borderBottom: '2px solid var(--accent-color)' }}>
              {activeSection.items.filter(i => i.id.startsWith('ec-')).map(item => (
                <button 
                  key={item.id} onClick={() => scrollToItem(item.id)}
                  style={{ padding: '10px', fontSize: '0.7em', backgroundColor: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {item.title.split('. ')[1] || item.title}
                </button>
              ))}
            </div>
          )}

          {filteredItems.map((item) => (
            <section key={item.id} id={item.id} ref={el => contentRefs.current[item.id] = el} style={{ padding: '30px 0', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ color: 'var(--primary-color)', marginBottom: '15px', fontSize: '1.5em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.title}
              </h2>
              <div className="content-render">{renderContent(item)}</div>
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}

export default App
