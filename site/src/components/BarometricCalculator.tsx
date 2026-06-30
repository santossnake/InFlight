import React from 'react';

interface BaroCalcProps {
  gpsAlt: string;
  setGpsAlt: (val: string) => void;
  airPress: string;
  setAirPress: (val: string) => void;
  targetQnh: string;
  setTargetQnh: (val: string) => void;
  targetBaroAlt: string;
  setTargetBaroAlt: (val: string) => void;
}

export const BarometricCalculator: React.FC<BaroCalcProps> = ({
  gpsAlt,
  setGpsAlt,
  airPress,
  setAirPress,
  targetQnh,
  setTargetQnh,
  targetBaroAlt,
  setTargetBaroAlt,
}) => {
  const gAlt = parseFloat(gpsAlt) || 0;
  const pAc = parseFloat(airPress) || 0;
  const qnh = parseFloat(targetQnh) || 0;
  const tBaro = parseFloat(targetBaroAlt) || 0;

  // Real-time calculation based on static pressure lida a bordo
  // Target Pressure (P_target) = QNH_target - (Alt_baro_target / 30)
  // Target GPS Altitude = Alt_GPS_ac - (P_target - P_static_ac) * 30
  // Which simplifies to: Alt_GPS_target = Alt_baro_target + Alt_GPS_ac - (QNH_target - P_static_ac) * 30
  const deltaP = qnh - pAc;
  const deltaAlt = deltaP * 30;
  const targetGpsAlt = tBaro + gAlt - deltaAlt;

  // Meters conversions
  const targetGpsAltMeters = Math.round(targetGpsAlt / 3.28084);
  const deltaAltMeters = Math.round(deltaAlt / 3.28084);

  return (
    <div style={{ padding: '20px 0', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: 'var(--primary-color)', borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px', marginBottom: '20px' }}>
        Barometric Calculator
      </h2>
      <p style={{ fontSize: '0.9em', opacity: 0.8, marginBottom: '20px', lineHeight: '1.4' }}>
        Calcule a altitude GPS real que a aeronave deve voar para atingir o nível barométrico pretendido, calibrado pela pressão estática real lida a bordo pelo sensor.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* INPUTS COLUMN 1 */}
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1em', color: 'var(--primary-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '5px' }}>
            Sensor de Bordo (Leitura Atual)
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '5px', opacity: 0.8 }}>
              ALTITUDE GPS ATUAL (ft)
            </label>
            <input 
              type="number" 
              value={gpsAlt} 
              onChange={e => setGpsAlt(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '5px', opacity: 0.8 }}>
              PRESSÃO ESTÁTICA LIDA (mBar)
            </label>
            <input 
              type="number" 
              value={airPress} 
              onChange={e => setAirPress(e.target.value)} 
              step="0.1"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
            />
          </div>
        </div>

        {/* INPUTS COLUMN 2 */}
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1em', color: 'var(--primary-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '5px' }}>
            Nível de Voo Desejado
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '5px', opacity: 0.8 }}>
              QNH REGIONAL / ALVO (mBar)
            </label>
            <input 
              type="number" 
              value={targetQnh} 
              onChange={e => setTargetQnh(e.target.value)} 
              step="0.1"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '5px', opacity: 0.8 }}>
              ALTITUDE BAROMÉTRICA PRETENDIDA (ft)
            </label>
            <input 
              type="number" 
              value={targetBaroAlt} 
              onChange={e => setTargetBaroAlt(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
            />
          </div>
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* MAIN TARGET PANEL */}
        <div style={{ padding: '25px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '0.85em', opacity: 0.9, letterSpacing: '1px', marginBottom: '8px', fontWeight: 'bold' }}>
            ALTITUDE GPS ALVO A VOAR
          </div>
          <div style={{ fontSize: '3.2em', fontWeight: '900', margin: '10px 0' }}>
            {Math.round(targetGpsAlt).toLocaleString()} <span style={{ fontSize: '0.45em', fontWeight: 'bold' }}>ft</span>
          </div>
          <div style={{ fontSize: '1.2em', opacity: 0.95, fontWeight: 'bold', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px', marginTop: '10px' }}>
            ≈ {targetGpsAltMeters.toLocaleString()} metros
          </div>
        </div>

        {/* DETAILS PANEL */}
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', opacity: 0.8 }}>Pressão Alvo Calculada:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
              {(qnh - (tBaro / 30)).toFixed(1)} mBar
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', opacity: 0.8 }}>Diferença de Pressão (ΔP):</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: (pAc - (qnh - (tBaro / 30))) >= 0 ? '#4caf50' : '#d32f2f' }}>
              {(pAc - (qnh - (tBaro / 30))) >= 0 ? '+' : ''}{(pAc - (qnh - (tBaro / 30))).toFixed(1)} mBar
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', opacity: 0.8 }}>Rácio de Gradiente:</span>
            <span style={{ fontFamily: 'monospace' }}>30 ft / 1 mBar</span>
          </div>
        </div>
      </div>

      {/* EXPLANATORY BOX */}
      <div style={{ padding: '15px 20px', backgroundColor: 'rgba(0, 0, 0, 0.02)', borderLeft: '4px solid var(--primary-color)', borderRadius: '0 8px 8px 0', fontSize: '0.9em', lineHeight: '1.5' }}>
        <h4 style={{ margin: '0 0 5px 0', color: 'var(--primary-color)' }}>Explicação do Ajuste:</h4>
        A aeronave voa controlada por <strong>altitude GPS</strong>. No entanto, outras aeronaves no espaço aéreo voam reguladas por pressão barométrica sob o QNH de <strong>{qnh} mBar</strong>.
        <br />
        À altitude GPS atual de <strong>{gAlt} ft</strong>, o sensor de bordo lê a pressão estática local de <strong>{pAc} mBar</strong>.
        Para atingir a pressão alvo de <strong>{(qnh - (tBaro / 30)).toFixed(1)} mBar</strong> correspondente à altitude barométrica pretendida de <strong>{tBaro} ft</strong>, a aeronave necessita de voar à altitude GPS de <strong>{Math.round(targetGpsAlt)} ft</strong>.
      </div>
    </div>
  );
};
