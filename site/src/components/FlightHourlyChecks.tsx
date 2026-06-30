import React, { useState, useEffect } from 'react';

interface FlightHourlyChecksProps {
  hourlyColumns: string[];
  setHourlyColumns: React.Dispatch<React.SetStateAction<string[]>>;
  hourlyGrid: { [col: string]: { [row: string]: any } };
  setHourlyGrid: React.Dispatch<React.SetStateAction<{ [col: string]: { [row: string]: any } }>>;
  hourlyActiveOverride: string | null;
  setHourlyActiveOverride: (val: string | null) => void;
  pilotHandoverEntries: any[];
  setPilotHandoverEntries: React.Dispatch<React.SetStateAction<any[]>>;
  atdTime?: string;
  ataTime?: string;
}

const hourlyRows = [
  { id: 'schedule', label: 'Schedule (hh:mm)', type: 'time' },
  { id: 'fuelLog', label: 'Fuel Log complete', type: 'checkbox' },
  { id: 'weather', label: 'Weather checks', type: 'checkbox' },
  { id: 'temp', label: 'Outside temperature', type: 'checkbox' },
  { id: 'icing', label: 'Icing condition', type: 'checkbox' },
  { id: 'rain', label: 'Rain', type: 'checkbox' },
  { id: 'wind', label: 'Wind', type: 'checkbox' },
  { id: 'rpm', label: 'Engine status RPM', type: 'checkbox' },
  { id: 'tps', label: 'Engine status TPS', type: 'checkbox' },
  { id: 'engTemp', label: 'Engine status temp', type: 'checkbox' },
  { id: 'battery', label: 'Battery status', type: 'checkbox' },
  { id: 'mass', label: 'Aircraft mass', type: 'checkbox' },
  { id: 'geozones', label: 'Check UAS Geozones dnt.anac.pt', type: 'checkbox' },
  { id: 'prociv', label: 'Check ProCiv for Emergency Situations (**)', type: 'checkbox' }
];

export const FlightHourlyChecks: React.FC<FlightHourlyChecksProps> = ({
  hourlyColumns,
  setHourlyColumns,
  hourlyGrid,
  setHourlyGrid,
  hourlyActiveOverride,
  setHourlyActiveOverride,
  pilotHandoverEntries,
  setPilotHandoverEntries,
  atdTime,
  ataTime
}) => {
  const [activeColCalculated, setActiveColCalculated] = useState<string>('Engine Start');
  const [newHandover, setNewHandover] = useState({
    time: '',
    callsign: '',
    outgoingPilot: '',
    incomingPilot: '',
    remarks: '',
    aircraftStatus: '',
    commsStatus: ''
  });
  const [showHandoverForm, setShowHandoverForm] = useState(false);

  // Auto-calculate the active column based on ATD and ZULU time
  useEffect(() => {
    const timer = setInterval(() => {
      if (ataTime) {
        setActiveColCalculated('Land');
        return;
      }
      if (!atdTime) {
        setActiveColCalculated('Engine Start');
        return;
      }

      try {
        const [atdHrs, atdMins] = atdTime.split(':').map(Number);
        const now = new Date();
        const nowZuluHrs = now.getUTCHours();
        const nowZuluMins = now.getUTCMinutes();

        let atdDate = new Date();
        atdDate.setUTCHours(atdHrs, atdMins, 0, 0);

        let nowDate = new Date();
        nowDate.setUTCHours(nowZuluHrs, nowZuluMins, 0, 0);

        // Handle day roll-over
        if (nowDate.getTime() < atdDate.getTime()) {
          nowDate.setUTCDate(nowDate.getUTCDate() + 1);
        }

        const elapsedMs = nowDate.getTime() - atdDate.getTime();
        const elapsedHrs = elapsedMs / 3600000;

        // Hour 1 is 0 to 1 hour, Hour 2 is 1 to 2, etc.
        const currentHourIndex = Math.floor(elapsedHrs) + 1;
        const colCandidate = currentHourIndex.toString();

        if (hourlyColumns.includes(colCandidate)) {
          setActiveColCalculated(colCandidate);
        } else {
          // If elapsed is greater than maximum hour column in list, use the highest normal hour column
          const numericCols = hourlyColumns.map(Number).filter(n => !isNaN(n));
          if (numericCols.length > 0) {
            const maxHour = Math.max(...numericCols);
            if (currentHourIndex > maxHour) {
              setActiveColCalculated(maxHour.toString());
            } else {
              setActiveColCalculated('1');
            }
          } else {
            setActiveColCalculated('1');
          }
        }
      } catch (err) {
        setActiveColCalculated('Engine Start');
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [atdTime, ataTime, hourlyColumns]);

  const activeColId = hourlyActiveOverride || activeColCalculated;

  // Determine state of a column relative to the active column: 'past' | 'active' | 'future'
  const getColumnState = (colId: string): 'past' | 'active' | 'future' => {
    if (colId === activeColId) return 'active';

    // Index-based order comparison
    const idxCol = hourlyColumns.indexOf(colId);
    const idxActive = hourlyColumns.indexOf(activeColId);

    if (idxCol === -1 || idxActive === -1) return 'future';
    return idxCol < idxActive ? 'past' : 'future';
  };

  const handleCellChange = (colId: string, rowId: string, value: any) => {
    setHourlyGrid(prev => ({
      ...prev,
      [colId]: {
        ...(prev[colId] || {}),
        [rowId]: value
      }
    }));
  };

  const addHourColumn = () => {
    // Find numeric columns and increment the max
    const numericCols = hourlyColumns.map(Number).filter(n => !isNaN(n));
    const nextHour = numericCols.length > 0 ? Math.max(...numericCols) + 1 : 13;
    const nextColName = nextHour.toString();

    setHourlyColumns(prev => {
      const list = [...prev];
      const landIdx = list.indexOf('Land');
      if (landIdx !== -1) {
        list.splice(landIdx, 0, nextColName);
      } else {
        list.push(nextColName);
      }
      return list;
    });
  };

  const addHandoverColumn = () => {
    // Find number of handover columns already present
    const hoCount = hourlyColumns.filter(c => c.startsWith('HO/TO')).length;
    const colName = `HO/TO ${hoCount + 1}`;

    setHourlyColumns(prev => {
      const list = [...prev];
      const landIdx = list.indexOf('Land');
      if (landIdx !== -1) {
        list.splice(landIdx, 0, colName);
      } else {
        list.push(colName);
      }
      return list;
    });
  };

  const resetHourlyGrid = () => {
    if (window.confirm('Tem a certeza que deseja limpar toda a tabela de Hourly Checks?')) {
      setHourlyGrid({});
      setHourlyActiveOverride(null);
      setHourlyColumns(['Engine Start', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Land']);
    }
  };

  const handleAddHandoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandover.time || !newHandover.outgoingPilot || !newHandover.incomingPilot) {
      alert('Por favor preencha Hora, Piloto Piloto Outgoing e Piloto Incoming.');
      return;
    }
    setPilotHandoverEntries(prev => [...prev, { ...newHandover, id: Date.now() }]);
    setNewHandover({
      time: '',
      callsign: '',
      outgoingPilot: '',
      incomingPilot: '',
      remarks: '',
      aircraftStatus: '',
      commsStatus: ''
    });
    setShowHandoverForm(false);
  };

  const removeHandoverEntry = (id: number) => {
    if (window.confirm('Eliminar este registo de Handover?')) {
      setPilotHandoverEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div style={{ margin: '20px 0', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary-color)' }}>
        Flight Checks (Hourly Log)
      </h3>
      <p style={{ fontSize: '0.85em', opacity: 0.8, marginBottom: '15px' }}>
        Hora ativa calculada: <strong style={{ color: '#eab308' }}>{activeColCalculated}</strong>. 
        {hourlyActiveOverride && <span> Seleção manual: <strong style={{ color: '#eab308' }}>{hourlyActiveOverride}</strong>.</span>}
        <br />
        <span style={{ fontSize: '0.9em', color: 'var(--primary-color)' }}>
          * Clique no cabeçalho de uma coluna para ativá-la manualmente (amarelo). Clique duplo para remover a seleção manual.
        </span>
      </p>

      {/* Grid Controls */}
      <div className="no-print" style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <button onClick={addHourColumn} style={{ padding: '6px 12px', fontSize: '0.8em', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Adicionar Hora (13h+)
        </button>
        <button onClick={addHandoverColumn} style={{ padding: '6px 12px', fontSize: '0.8em', backgroundColor: '#f57f17', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Adicionar Pilot Handover
        </button>
        <button onClick={resetHourlyGrid} style={{ padding: '6px 12px', fontSize: '0.8em', backgroundColor: 'transparent', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Limpar Tabela
        </button>
      </div>

      {/* Hourly Table Grid */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '35px', backgroundColor: 'var(--card-bg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82em', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '12px 10px', borderRight: '1px solid var(--border-color)', textAlign: 'left', minWidth: '180px', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                Flight Time (h)
              </th>
              {hourlyColumns.map(col => {
                const state = getColumnState(col);
                let bgColor = 'transparent';
                let textColor = 'inherit';
                
                if (state === 'active') {
                  bgColor = '#fef08a'; // Yellow
                  textColor = '#854d0e';
                } else if (state === 'past') {
                  bgColor = '#fee2e2'; // Red
                  textColor = '#991b1b';
                } else {
                  bgColor = 'rgba(0,0,0,0.05)'; // Gray
                  textColor = '#6b7280';
                }

                return (
                  <th 
                    key={col} 
                    onClick={() => setHourlyActiveOverride(col)}
                    onDoubleClick={() => setHourlyActiveOverride(null)}
                    title="Clique para ativar manualmente, clique duplo para reverter para automático"
                    style={{ 
                      padding: '12px 6px', 
                      minWidth: '70px',
                      cursor: 'pointer',
                      backgroundColor: bgColor,
                      color: textColor,
                      fontWeight: 'bold',
                      borderRight: '1px solid var(--border-color)',
                      transition: 'background-color 0.2s',
                      userSelect: 'none'
                    }}
                  >
                    {col}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {hourlyRows.map(row => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 10px', borderRight: '1px solid var(--border-color)', textAlign: 'left', fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  {row.label}
                </td>
                {hourlyColumns.map(col => {
                  const cellVal = hourlyGrid[col]?.[row.id];
                  const state = getColumnState(col);
                  
                  let cellBg = 'transparent';
                  if (state === 'active') cellBg = 'rgba(254, 240, 138, 0.2)';
                  else if (state === 'past') cellBg = 'rgba(254, 226, 226, 0.15)';
                  else cellBg = 'rgba(0,0,0,0.02)';

                  return (
                    <td 
                      key={col} 
                      style={{ 
                        padding: '6px 4px', 
                        borderRight: '1px solid var(--border-color)',
                        backgroundColor: cellBg
                      }}
                    >
                      {row.type === 'time' ? (
                        <input 
                          type="time" 
                          value={cellVal || ''} 
                          onChange={e => handleCellChange(col, row.id, e.target.value)}
                          style={{
                            padding: '3px 4px',
                            fontSize: '0.95em',
                            border: '1px solid var(--border-color)',
                            borderRadius: '3px',
                            width: '65px',
                            textAlign: 'center',
                            backgroundColor: 'var(--input-bg, transparent)',
                            color: 'inherit'
                          }}
                        />
                      ) : (
                        <input 
                          type="checkbox" 
                          checked={!!cellVal}
                          onChange={e => handleCellChange(col, row.id, e.target.checked)}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer'
                          }}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pilot Handover logs (Page 9) */}
      <div style={{ marginTop: '20px', borderTop: '2px solid var(--border-color)', paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.1em' }}>
            Pilot Handover logs (Histórico de Handovers)
          </h4>
          <button 
            className="no-print"
            onClick={() => setShowHandoverForm(!showHandoverForm)}
            style={{ padding: '6px 12px', fontSize: '0.8em', backgroundColor: '#f57f17', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {showHandoverForm ? 'Fechar Form' : '+ Registar Handover'}
          </button>
        </div>

        {/* New Handover Log Form */}
        {showHandoverForm && (
          <form onSubmit={handleAddHandoverSubmit} className="no-print" style={{ backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '25px' }}>
            <h5 style={{ margin: '0 0 15px 0', fontSize: '0.95em', color: 'var(--primary-color)' }}>Novo Registo de Handover</h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75em', fontWeight: 'bold', marginBottom: '5px' }}>ZULU TIME</label>
                <input type="time" required value={newHandover.time} onChange={e => setNewHandover(prev => ({ ...prev, time: e.target.value }))} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75em', fontWeight: 'bold', marginBottom: '5px' }}>CALLSIGN / AIRSPACE</label>
                <input type="text" placeholder="e.g. KNIGT74" value={newHandover.callsign} onChange={e => setNewHandover(prev => ({ ...prev, callsign: e.target.value }))} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75em', fontWeight: 'bold', marginBottom: '5px' }}>OUTGOING PILOT</label>
                <input type="text" required placeholder="Nome do piloto saindo" value={newHandover.outgoingPilot} onChange={e => setNewHandover(prev => ({ ...prev, outgoingPilot: e.target.value }))} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75em', fontWeight: 'bold', marginBottom: '5px' }}>INCOMING PILOT</label>
                <input type="text" required placeholder="Nome do piloto entrando" value={newHandover.incomingPilot} onChange={e => setNewHandover(prev => ({ ...prev, incomingPilot: e.target.value }))} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75em', fontWeight: 'bold', marginBottom: '5px' }}>AIRCRAFT STATUS (Fuel, Engine, Limits)</label>
                <textarea rows={2} placeholder="e.g. Fuel 45L, Engine sensors OK, no limitations." value={newHandover.aircraftStatus} onChange={e => setNewHandover(prev => ({ ...prev, aircraftStatus: e.target.value }))} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75em', fontWeight: 'bold', marginBottom: '5px' }}>COMMS STATUS (Datalinks, AWS, RLOS)</label>
                <textarea rows={2} placeholder="e.g. AWS connected, RLOS 100%, Satcom service active." value={newHandover.commsStatus} onChange={e => setNewHandover(prev => ({ ...prev, commsStatus: e.target.value }))} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', fontFamily: 'inherit' }} />
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '0.75em', fontWeight: 'bold', marginBottom: '5px' }}>REMARKS / OBSERVATIONS</label>
              <input type="text" placeholder="Observações adicionais..." value={newHandover.remarks} onChange={e => setNewHandover(prev => ({ ...prev, remarks: e.target.value }))} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
            </div>
            <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Submeter Registo de Handover
            </button>
          </form>
        )}

        {/* Handover History Render */}
        {pilotHandoverEntries.length === 0 ? (
          <p style={{ fontSize: '0.85em', opacity: 0.6, fontStyle: 'italic' }}>Nenhum registo de handover adicionado.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {pilotHandoverEntries.map((entry) => (
              <div key={entry.id} style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '15px', backgroundColor: 'var(--card-bg)', position: 'relative' }}>
                <button 
                  className="no-print"
                  onClick={() => removeHandoverEntry(entry.id)} 
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '1.2em', cursor: 'pointer' }}
                  title="Eliminar este registo"
                >
                  ✕
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.75em', opacity: 0.7, display: 'block' }}>ZULU TIME:</span>
                    <strong>{entry.time}Z</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75em', opacity: 0.7, display: 'block' }}>CALLSIGN:</span>
                    <strong>{entry.callsign || '---'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75em', opacity: 0.7, display: 'block' }}>OUTGOING PILOT:</span>
                    <strong>{entry.outgoingPilot}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75em', opacity: 0.7, display: 'block' }}>INCOMING PILOT:</span>
                    <strong>{entry.incomingPilot}</strong>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.9em', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.75em', opacity: 0.7, display: 'block' }}>AIRCRAFT STATUS:</span>
                    <span>{entry.aircraftStatus || 'Sem anomalias registadas.'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75em', opacity: 0.7, display: 'block' }}>COMMS STATUS:</span>
                    <span>{entry.commsStatus || 'Sem anomalias registadas.'}</span>
                  </div>
                </div>
                {entry.remarks && (
                  <div style={{ fontSize: '0.9em', borderTop: '1px dashed var(--border-color)', paddingTop: '6px', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.75em', opacity: 0.7, display: 'block' }}>REMARKS / OBSERVATIONS:</span>
                    <span>{entry.remarks}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
