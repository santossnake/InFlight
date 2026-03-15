import { useState, useRef } from 'react'
import { guideData, GuideItem, GuideSection } from './data/guideContent'
import './index.css'

function App() {
  const [activeSectionId, setActiveSectionId] = useState<string>('HOME')
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const activeSection = guideData.find(s => s.id === activeSectionId) || guideData[0]

  const handleSectionChange = (id: string) => {
    setActiveSectionId(id)
    // Scroll to top of content area when section changes
    const contentArea = document.querySelector('.content-area')
    if (contentArea) contentArea.scrollTop = 0
  }

  const scrollToItem = (itemId: string) => {
    const element = contentRefs.current[itemId]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Top Navigation Bar */}
      <header className="top-nav" style={{ 
        backgroundColor: 'var(--primary-color)', 
        color: 'white', 
        padding: '10px', 
        display: 'flex', 
        gap: '10px',
        overflowX: 'auto',
        flexShrink: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 10
      }}>
        {guideData.map(section => (
          <button 
            key={section.id}
            onClick={() => handleSectionChange(section.id)}
            style={{ 
              backgroundColor: activeSectionId === section.id 
                ? (section.id === 'EMERGENCY_CHECKLIST' ? '#ff1744' : 'var(--highlight-color)') 
                : (section.id === 'EMERGENCY_CHECKLIST' ? '#b71c1c' : 'rgba(255,255,255,0.1)'),
              color: activeSectionId === section.id 
                ? (section.id === 'EMERGENCY_CHECKLIST' ? 'white' : 'black') 
                : 'white',
              border: section.id === 'EMERGENCY_CHECKLIST' ? '2px solid #ff5252' : '1px solid rgba(255,255,255,0.3)',
              whiteSpace: 'nowrap',
              padding: '10px 20px',
              fontWeight: section.id === 'EMERGENCY_CHECKLIST' ? 'bold' : 'normal'
            }}
          >
            {section.label}
          </button>
        ))}
      </header>

      {/* Main Body */}
      <div className="main-body" style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        
        {/* Sidebar */}
        <aside className="sidebar" style={{ 
          width: '280px', 
          backgroundColor: '#f8f9fa', 
          borderRight: '1px solid var(--border-color)',
          overflowY: 'auto',
          padding: '10px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          zIndex: 5
        }}>
          <h3 style={{ 
            fontSize: '0.9em', 
            padding: '10px 5px', 
            borderBottom: '2px solid var(--primary-color)',
            color: 'var(--primary-color)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '10px'
          }}>
            {activeSection.title}
          </h3>
          
          <div className="sidebar-items" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {activeSection.items.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToItem(item.id)}
                style={{
                  textAlign: 'left',
                  backgroundColor: 'transparent',
                  color: '#444',
                  border: 'none',
                  borderLeft: '4px solid transparent',
                  borderRadius: '0 4px 4px 0',
                  padding: '10px',
                  fontSize: '0.9em',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eee'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {item.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="content-area" style={{ 
          flex: 1, 
          padding: '0 40px 40px 40px', 
          overflowY: 'auto',
          backgroundColor: 'white',
          scrollBehavior: 'smooth'
        }}>
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

const ImageWithFallback = ({ src, title }: { src: string, title: string }) => {
  const [extensionIdx, setExtensionIdx] = useState(0);
  const extensions = ['', '.png', '.jpg', '.jpeg']; // Try as is, then with extensions if needed
  
  // Extract base path without extension if user provided one like 'image.png'
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
            // Final error display if all extensions fail
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

function renderContent(item: GuideItem) {
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderChecklist = (content: string[]) => (
    <div className="checklist" style={{ maxWidth: '900px' }}>
      {content.map((check, idx) => {
        const isMemoryItem = check.startsWith('**') && check.endsWith('**');
        const isSpecialLine = check.startsWith('WARNING:') || check.startsWith('CAUTION:') || check.startsWith('NOTE:') || check.startsWith('---');
        
        if (isSpecialLine) {
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
          <label key={idx} style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            padding: '12px', 
            borderBottom: '1px solid #eee',
            cursor: 'pointer',
            transition: 'background-color 0.1s'
          }}
          className={`checklist-label ${isMemoryItem ? 'memory-item' : ''}`}
          >
            <input type="checkbox" style={{ 
              marginTop: '4px',
              marginRight: '15px', 
              width: '22px', 
              height: '22px',
              cursor: 'pointer'
            }} />
            <span style={{ fontSize: '1.1em', fontFamily: 'monospace' }}>
              {formatText(check)}
            </span>
          </label>
        );
      })}
    </div>
  );

  const renderTable = (tableData: { headers?: string[], rows: any[][], title?: string }, key?: any) => (
    <div key={key} style={{ overflowX: 'auto', margin: '15px 0' }}>
      {tableData.title && <h4 style={{ margin: '10px 0', color: '#555' }}>{tableData.title}</h4>}
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px', fontSize: '0.9em' }}>
        {tableData.headers && tableData.headers.length > 0 && (
          <thead>
            <tr>
              {tableData.headers.map((h, i) => (
                <th key={i} style={{ padding: '12px', backgroundColor: 'var(--primary-color)', color: 'white', border: '1px solid #ddd', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {tableData.rows.map((row, rI) => (
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

  if (item.type === 'text') {
    return (
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1.1em' }}>
        {formatText(item.content)}
      </div>
    )
  }
  
  if (item.type === 'image') {
    const images = Array.isArray(item.content) ? item.content : [item.content];
    
    const ImageWithFallback = ({ src, title }: { src: string, title: string }) => {
      const [extensionIdx, setExtensionIdx] = useState(0);
      const extensions = ['', '.png', '.jpg', '.jpeg']; // Try as is, then with extensions if needed
      
      // Extract base path without extension if user provided one like 'image.png'
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
                // Final error display if all extensions fail
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
    return renderChecklist(item.content as string[]);
  }

  if (item.type === 'table') {
    return renderTable(item.content as { headers?: string[], rows: any[][] });
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
        {content.checklist && renderChecklist(content.checklist)}
        {content.table && renderTable(content.table)}
        {content.tables && content.tables.map((t, i) => renderTable(t, i))}
      </div>
    );
  }
  
  return <div>Unknown content type</div>
}

export default App
