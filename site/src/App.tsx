import { useState, useRef, useEffect } from 'react'
import { guideData, GuideItem } from './data/guideContent'
import './index.css'

// Image component moved outside to avoid hook issues
const ImageWithFallback = ({ src, title }: { src: string, title: string }) => {
  const [extensionIdx, setExtensionIdx] = useState(0);
  const extensions = ['', '.png', '.jpg', '.jpeg']; 
  
  const basePath = src.replace(/\.(png|jpg|jpeg)$/i, '');
  const currentSrc = extensionIdx === 0 ? src : `${basePath}${extensions[extensionIdx]}`;

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f9f9f9', marginBottom: '10px' }}>
      <img 
        src={currentSrc} 
        alt={title} 
        style={{ maxWidth: '100%', display: 'block', margin: '0 auto', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
        onError={() => {
          if (extensionIdx < extensions.length - 1) {
            setExtensionIdx(extensionIdx + 1);
          } else {
            console.error(`Falha ao carregar imagem em todas as extensões: ${basePath}`);
          }
        }}
      />
      {extensionIdx === extensions.length - 1 && (
        <p style={{ color: 'red', padding: '10px', fontSize: '0.8em' }}>
          Erro ao carregar: {basePath} (tentado .png, .jpg, .jpeg)
        </p>
      )}
    </div>
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
            color: check.startsWith('WARNING') ? 'var(--accent-color)' : '#666',
            fontSize: '1em',
            fontStyle: 'italic',
            borderBottom: '1px solid #eee'
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
    {tableData.title && <h4 style={{ margin: '10px 0', color: '#555' }}>{tableData.title}</h4>}
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px', fontSize: '0.9em' }}>
      {tableData.headers && tableData.headers.length > 0 && (
        <thead>
          <tr>
            {tableData.headers.map((h: string, i: number) => (
              <th key={i} style={{ padding: '12px', backgroundColor: 'var(--primary-color)', color: 'white', border: '1px solid #ddd', textAlign: 'left' }}>{h}</th>
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
                    border: '1px solid #ccc',
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
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(window.innerWidth > 768)
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768)
  const [checklistProgress, setChecklistProgress] = useState<{ [itemId: string]: { [index: number]: boolean } }>(() => {
    const saved = localStorage.getItem('checklistProgress');
    return saved ? JSON.parse(saved) : {};
  });
  const contentRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    localStorage.setItem('checklistProgress', JSON.stringify(checklistProgress));
  }, [checklistProgress]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarVisible(true);
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

  const handleToggle = (itemId: string, index: number) => {
    setChecklistProgress(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [index]: !prev[itemId]?.[index]
      }
    }));
  };

  const resetCurrentChecklists = () => {
    if (window.confirm('Resetar todos os checklists da secção atual?')) {
      const newProgress = { ...checklistProgress };
      activeSection.items.forEach(item => {
        delete newProgress[item.id];
      });
      setChecklistProgress(newProgress);
    }
  };

  const resetAllChecklists = () => {
    if (window.confirm('Resetar TODOS os checklists do guia?')) {
      setChecklistProgress({});
    }
  };

  const isItemComplete = (item: GuideItem) => {
    let checklist: string[] | undefined;
    if (item.type === 'checklist') {
      checklist = item.content as string[];
    } else if (item.type === 'mixed') {
      checklist = (item.content as any).checklist;
    }

    if (!checklist) return false;

    const progress = checklistProgress[item.id] || {};
    return checklist.every((line, index) => {
      const isSpecialLine = !line.trim() || line.startsWith('WARNING:') || line.startsWith('CAUTION:') || line.startsWith('NOTE:') || line.startsWith('---');
      if (isSpecialLine) return true;
      return !!progress[index];
    });
  };

  const renderContent = (item: GuideItem) => {
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
        <div style={{ textAlign: 'center', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {images.map((src, i) => (
            <ImageWithFallback key={i} src={src} title={`${item.title} ${i + 1}`} />
          ))}
          <p style={{ color: '#666', marginTop: '10px', fontStyle: 'italic' }}>Imagens do Guia: {item.title}</p>
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
            <div style={{ textAlign: 'center', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <header className="top-nav" style={{ 
        backgroundColor: 'var(--primary-color)', 
        color: 'white', 
        padding: '10px', 
        display: 'flex', 
        alignItems: 'center',
        gap: '10px',
        flexShrink: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 10
      }}>
        <button 
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '1.2em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginRight: '5px',
            minWidth: '44px'
          }}
          title={isSidebarVisible ? "Esconder Menu" : "Mostrar Menu"}
        >
          {isSidebarVisible ? '✕' : '☰'}
        </button>

        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', flex: 1, paddingBottom: '2px', alignItems: 'center' }}>
          {guideData.map(section => {
            // Determine section color based on PDF borders
            let sectionColor = '#003366'; // Default
            let activeBg = 'var(--highlight-color)';
            let textColor = 'white';
            let activeTextColor = 'black';

            if (section.id === 'EMERGENCY_CHECKLIST') {
              sectionColor = '#b71c1c'; // Red
              activeBg = '#ff1744';
              activeTextColor = 'white';
            } else if (section.id === 'NORMAL_PROCEDURES') {
              sectionColor = '#0d47a1'; // Blue
              activeBg = '#2979ff';
              activeTextColor = 'white';
            } else if (section.id === 'SENSOR_OPERATOR') {
              sectionColor = '#1b5e20'; // Green
              activeBg = '#00c853';
              activeTextColor = 'white';
            } else if (section.id === 'MISSION_PLANNING') {
              sectionColor = '#37474f'; // Grey/Blue
              activeBg = '#90a4ae';
              activeTextColor = 'black';
            } else if (section.id === 'HANDOVER_TAKEOVER') {
              sectionColor = '#f57f17'; // Yellow/Orange
              activeBg = '#ffea00';
              activeTextColor = 'black';
            } else if (section.id === 'CRASH_RESPONSE') {
              sectionColor = '#4e342e'; // Brown/Red
              activeBg = '#d84315';
              activeTextColor = 'white';
            }

            const isActive = activeSectionId === section.id;

            return (
              <button 
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                style={{ 
                  backgroundColor: isActive ? activeBg : sectionColor,
                  color: isActive ? activeTextColor : 'white',
                  border: isActive ? `2px solid white` : '1px solid rgba(255,255,255,0.3)',
                  whiteSpace: 'nowrap',
                  padding: '8px 15px',
                  fontSize: '0.9em',
                  fontWeight: isActive ? 'bold' : 'normal',
                  borderRadius: '4px',
                  boxShadow: isActive ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {section.label}
              </button>
            );
          })}
          
          <div style={{ display: 'flex', gap: '5px', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '10px', marginLeft: '5px' }}>
            <button 
              onClick={resetCurrentChecklists}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.5)',
                padding: '6px 10px',
                borderRadius: '4px',
                fontSize: '0.8em',
                fontWeight: 'bold',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Reset Secção
            </button>
            <button 
              onClick={resetAllChecklists}
              style={{
                backgroundColor: 'var(--accent-color)',
                color: 'white',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '4px',
                fontSize: '0.8em',
                fontWeight: 'bold',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              Reset Total
            </button>
          </div>
        </div>
      </header>

      <div className="main-body" style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <aside className="sidebar" style={{ 
          width: isSidebarVisible ? '280px' : '0px', 
          backgroundColor: '#f8f9fa', 
          borderRight: isSidebarVisible ? '1px solid var(--border-color)' : 'none',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: isSidebarVisible ? '10px' : '0px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          zIndex: 5,
          transition: 'width 0.3s ease, padding 0.3s ease',
          position: isMobile ? 'absolute' : 'relative',
          height: '100%',
          boxShadow: (isSidebarVisible && isMobile) ? '4px 0 10px rgba(0,0,0,0.1)' : 'none'
        }}>
          {isSidebarVisible && (
            <>
              <h3 style={{ 
                fontSize: '0.9em', 
                padding: '10px 5px', 
                borderBottom: '2px solid var(--primary-color)',
                color: 'var(--primary-color)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '10px',
                whiteSpace: 'nowrap'
              }}>
                {activeSection.title}
              </h3>
              
              <div className="sidebar-items" style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '260px' }}>
                {activeSection.items.map(item => {
                  const complete = isItemComplete(item);
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToItem(item.id)}
                      style={{
                        textAlign: 'left',
                        backgroundColor: complete ? '#e8f5e9' : 'transparent',
                        color: complete ? '#2e7d32' : '#444',
                        border: 'none',
                        borderLeft: complete ? '4px solid #4caf50' : '4px solid transparent',
                        borderRadius: '0 4px 4px 0',
                        padding: '10px',
                        fontSize: '0.9em',
                        transition: 'all 0.2s',
                        fontWeight: complete ? 'bold' : 'normal'
                      }}
                      onMouseOver={(e) => { if (!complete) e.currentTarget.style.backgroundColor = '#eee'; }}
                      onMouseOut={(e) => { if (!complete) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {complete && <span style={{ marginRight: '5px' }}>✓</span>}
                      {item.title}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </aside>

        <main className="content-area" style={{ 
          flex: 1, 
          padding: isMobile ? '0 15px 40px 15px' : '0 40px 40px 40px', 
          overflowY: 'auto',
          backgroundColor: 'white',
          scrollBehavior: 'smooth'
        }}>
          {isSidebarVisible && isMobile && (
            <div 
              onClick={() => setIsSidebarVisible(false)}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.1)',
                zIndex: 4
              }}
            />
          )}
          {activeSection.items.map((item) => (
            <section 
              key={item.id} 
              id={item.id}
              ref={el => contentRefs.current[item.id] = el}
              style={{ padding: '40px 0', borderBottom: '1px solid #f0f0f0' }}
            >
              <h2 style={{ 
                color: 'var(--primary-color)',
                marginBottom: '20px',
                fontSize: '1.8em',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6em' }}>
                  {activeSection.label}
                </span>
                {item.title}
              </h2>
              <div className="content-render">
                {renderContent(item)}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}

export default App
