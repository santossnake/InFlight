export interface OrmItem {
  id: string;
  label: string;
  score: number;
}

export interface OrmGroup {
  id: string;
  title: string;
  color: string;
  items: {
    id: string;
    label: string;
    type: 'checkbox' | 'radio' | 'pax-multiplier' | 'select';
    options?: OrmItem[];
    score?: number; // For simple checkboxes
  }[];
}

export const ormConfig: OrmGroup[] = [
  {
    id: 'operational',
    title: 'Operational',
    color: '#d32f2f', // Red
    items: [
      {
        id: 'type',
        label: 'Type of Flight',
        type: 'radio',
        options: [
          { id: 'isr', label: 'ISR', score: 4 },
          { id: 'trq_i', label: 'TRQ/I', score: 3 },
          { id: 'mnt_accept', label: 'MNT/Accept.', score: 6 },
          { id: 'tru', label: 'TRU', score: 2 }
        ]
      },
      {
        id: 'strg',
        label: 'Strg (Surge/Strategy)',
        type: 'checkbox',
        score: 3
      },
      {
        id: 'ho',
        label: 'H/O (Handover)',
        type: 'checkbox',
        score: 3
      },
      {
        id: 'nf',
        label: 'NF (Night Flight)',
        type: 'checkbox',
        score: 4
      }
    ]
  },
  {
    id: 'human',
    title: 'Human',
    color: '#1976d2', // Blue
    items: [
      {
        id: 'out_sh',
        label: 'Out of Station (Out/SH)',
        type: 'radio',
        options: [
          { id: 'week', label: 'Week', score: 3 },
          { id: 'wknd', label: 'WKND.', score: 5 }
        ]
      },
      {
        id: 'personal',
        label: 'Personal Factor',
        type: 'pax-multiplier',
        options: [
          { id: 'punct', label: 'Punct. (2xPax)', score: 2 },
          { id: 'recurr', label: 'Recurr. (4xPax)', score: 4 }
        ]
      },
      {
        id: 'cr',
        label: 'Crew Rest (CR < 12h / ≥ 8h < 12h)',
        type: 'checkbox',
        score: 60
      },
      {
        id: 'pl_ch',
        label: 'Plan Change (Pl Ch)',
        type: 'checkbox',
        score: 4
      },
      {
        id: 'eet',
        label: 'Estimated Elapsed Time > 5h (EET +5hr)',
        type: 'checkbox',
        score: 2
      },
      {
        id: 'unexp',
        label: 'Unexpected Tasking/Crew Change (Unexp)',
        type: 'radio',
        options: [
          { id: 'pri', label: 'PRI (PIC/Internal Pilot)', score: 3 },
          { id: 'pre', label: 'PRE (External Pilot)', score: 6 }
        ]
      },
      {
        id: 'no_fly',
        label: 'No Fly Days (No Fly)',
        type: 'radio',
        options: [
          { id: 'pri_30', label: '> 30 PRI', score: 2 },
          { id: 'pre_10', label: '> 10 PRE', score: 4 }
        ]
      },
      {
        id: 'event',
        label: 'Flight Event (Event)',
        type: 'radio',
        options: [
          { id: '2nd', label: '2nd flight of the day', score: 2 },
          { id: '3rd_more', label: '3rd or more flights of the day', score: 4 }
        ]
      },
      {
        id: 'detached',
        label: 'Days Detached (Detached)',
        type: 'radio',
        options: [
          { id: 'det_5', label: '≥ 5 days', score: 3 },
          { id: 'det_8', label: '≥ 8 days', score: 6 }
        ]
      }
    ]
  },
  {
    id: 'material',
    title: 'Material',
    color: '#fbc02d', // Yellow/Amber
    items: [
      {
        id: 'rwy_l',
        label: 'Runway Length < 400m (RWY L < 400M)',
        type: 'checkbox',
        score: 4
      },
      {
        id: 'rwy_w',
        label: 'Runway Width < 15m (RWY W < 15M)',
        type: 'checkbox',
        score: 4
      },
      {
        id: 'fod',
        label: 'FOD (Foreign Object Debris Risk)',
        type: 'checkbox',
        score: 4
      },
      {
        id: 'bkp_sys',
        label: 'Missing Backup Systems (BKP SYS)',
        type: 'select',
        options: [
          { id: 'none', label: 'None', score: 0 },
          { id: 'pwr_hset', label: 'PWR or HSET down', score: 3 },
          { id: 'gcs', label: 'GCS down', score: 8 },
          { id: 'all', label: 'All backups down (PWR, GCS, HSET)', score: 38 }
        ]
      }
    ]
  },
  {
    id: 'environmental',
    title: 'Environmental',
    color: '#388e3c', // Green
    items: [
      {
        id: 'xwind',
        label: 'Crosswind (Xwind)',
        type: 'radio',
        options: [
          { id: 'xw_5', label: '≥ 5 kts', score: 3 },
          { id: 'xw_7', label: '≥ 7 kts', score: 6 }
        ]
      },
      {
        id: 'iat_to',
        label: 'Air Temp at Takeoff (IAT T/O)',
        type: 'radio',
        options: [
          { id: 'temp_lo', label: '≤ 10 ºC', score: 3 },
          { id: 'temp_hi', label: '≥ 35 ºC', score: 3 }
        ]
      },
      {
        id: 'its',
        label: 'Index of Thermal Stress (ITS) - Auto-calculated',
        type: 'radio',
        options: [
          { id: 'c', label: 'Caution (C)', score: 6 },
          { id: 'd', label: 'Danger (D)', score: 9 }
        ]
      },
      {
        id: 'rain_prob',
        label: 'Rain Probability (Rain Prob)',
        type: 'radio',
        options: [
          { id: 'rain_2', label: '≥ 0.2 mm/h', score: 3 },
          { id: 'rain_5', label: '≥ 0.5 mm/h', score: 6 }
        ]
      },
      {
        id: 'rwy_wet',
        label: 'Wet Runway (RWY WET)',
        type: 'checkbox',
        score: 3
      },
      {
        id: 'enroute_temp',
        label: 'Enroute Temperature ≤ 10 ºC',
        type: 'checkbox',
        score: 2
      },
      {
        id: 'enroute_wind',
        label: 'Enroute Wind ≥ 25 kts',
        type: 'checkbox',
        score: 2
      },
      {
        id: 'over_populated',
        label: 'Over Populated Area',
        type: 'radio',
        options: [
          { id: 'low_density', label: 'Low density', score: 2 },
          { id: 'high_density', label: 'High density', score: 5 }
        ]
      }
    ]
  }
];

// ITS lookup table
// Keys: Temp. Values: Dict of Humidities and their (Value, Zone)
export const itsTable: {
  [temp: number]: {
    [humidity: number]: { value: number; zone: 'NORMAL' | 'CAUTION' | 'DANGER' };
  };
} = {
  21: {
    10: { value: 57, zone: 'NORMAL' },
    20: { value: 70, zone: 'NORMAL' },
    30: { value: 72, zone: 'NORMAL' },
    40: { value: 74, zone: 'NORMAL' },
    50: { value: 76, zone: 'NORMAL' },
    60: { value: 78, zone: 'NORMAL' },
    70: { value: 81, zone: 'NORMAL' },
    80: { value: 83, zone: 'NORMAL' }
  },
  24: {
    10: { value: 71, zone: 'NORMAL' },
    20: { value: 74, zone: 'NORMAL' },
    30: { value: 77, zone: 'NORMAL' },
    40: { value: 79, zone: 'NORMAL' },
    50: { value: 82, zone: 'NORMAL' },
    60: { value: 84, zone: 'NORMAL' },
    70: { value: 86, zone: 'NORMAL' },
    80: { value: 88, zone: 'NORMAL' }
  },
  27: {
    10: { value: 75, zone: 'NORMAL' },
    20: { value: 79, zone: 'NORMAL' },
    30: { value: 81, zone: 'NORMAL' },
    40: { value: 84, zone: 'NORMAL' },
    50: { value: 87, zone: 'NORMAL' },
    60: { value: 89, zone: 'NORMAL' },
    70: { value: 92, zone: 'CAUTION' },
    80: { value: 94, zone: 'CAUTION' }
  },
  30: {
    10: { value: 79, zone: 'NORMAL' },
    20: { value: 83, zone: 'NORMAL' },
    30: { value: 86, zone: 'NORMAL' },
    40: { value: 89, zone: 'NORMAL' },
    50: { value: 92, zone: 'CAUTION' },
    60: { value: 95, zone: 'CAUTION' },
    70: { value: 97, zone: 'CAUTION' },
    80: { value: 99, zone: 'CAUTION' }
  },
  33: {
    10: { value: 83, zone: 'NORMAL' },
    20: { value: 87, zone: 'NORMAL' },
    30: { value: 91, zone: 'NORMAL' },
    40: { value: 94, zone: 'CAUTION' },
    50: { value: 97, zone: 'CAUTION' },
    60: { value: 100, zone: 'CAUTION' },
    70: { value: 103, zone: 'DANGER' },
    80: { value: 105, zone: 'DANGER' }
  },
  35: {
    10: { value: 87, zone: 'NORMAL' },
    20: { value: 92, zone: 'CAUTION' },
    30: { value: 96, zone: 'CAUTION' },
    40: { value: 99, zone: 'CAUTION' },
    50: { value: 102, zone: 'DANGER' },
    60: { value: 105, zone: 'DANGER' },
    70: { value: 108, zone: 'DANGER' },
    80: { value: 111, zone: 'DANGER' }
  },
  38: {
    10: { value: 91, zone: 'CAUTION' },
    20: { value: 96, zone: 'CAUTION' },
    30: { value: 100, zone: 'CAUTION' },
    40: { value: 104, zone: 'DANGER' },
    50: { value: 108, zone: 'DANGER' },
    60: { value: 111, zone: 'DANGER' },
    70: { value: 114, zone: 'DANGER' },
    80: { value: 117, zone: 'DANGER' }
  },
  40: {
    10: { value: 95, zone: 'CAUTION' },
    20: { value: 100, zone: 'CAUTION' },
    30: { value: 105, zone: 'DANGER' },
    40: { value: 109, zone: 'DANGER' },
    50: { value: 113, zone: 'DANGER' },
    60: { value: 116, zone: 'DANGER' },
    70: { value: 120, zone: 'DANGER' },
    80: { value: 122, zone: 'DANGER' }
  },
  43: {
    10: { value: 99, zone: 'CAUTION' },
    20: { value: 105, zone: 'DANGER' },
    30: { value: 110, zone: 'DANGER' },
    40: { value: 114, zone: 'DANGER' },
    50: { value: 118, zone: 'DANGER' },
    60: { value: 122, zone: 'DANGER' },
    70: { value: 125, zone: 'DANGER' },
    80: { value: 128, zone: 'DANGER' }
  },
  46: {
    10: { value: 103, zone: 'DANGER' },
    20: { value: 109, zone: 'DANGER' },
    30: { value: 115, zone: 'DANGER' },
    40: { value: 119, zone: 'DANGER' },
    50: { value: 124, zone: 'DANGER' },
    60: { value: 127, zone: 'DANGER' },
    70: { value: 130, zone: 'DANGER' },
    80: { value: 134, zone: 'DANGER' }
  },
  49: {
    10: { value: 107, zone: 'DANGER' },
    20: { value: 114, zone: 'DANGER' },
    30: { value: 119, zone: 'DANGER' },
    40: { value: 124, zone: 'DANGER' },
    50: { value: 129, zone: 'DANGER' },
    60: { value: 133, zone: 'DANGER' },
    70: { value: 136, zone: 'DANGER' },
    80: { value: 140, zone: 'DANGER' }
  }
};

export const getClosestValue = (arr: number[], val: number): number => {
  return arr.reduce((prev, curr) => {
    return Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev;
  });
};

export const calculateIts = (temp: number | '', humidity: number | ''): { value: number | null, zone: 'NORMAL' | 'CAUTION' | 'DANGER' | null } => {
  if (temp === '' || humidity === '') {
    return { value: null, zone: null };
  }
  const temps = Object.keys(itsTable).map(Number);
  const humidities = [10, 20, 30, 40, 50, 60, 70, 80];

  const closestTemp = getClosestValue(temps, temp);
  const closestHumidity = getClosestValue(humidities, humidity);

  const row = itsTable[closestTemp];
  if (row && row[closestHumidity]) {
    return row[closestHumidity];
  }
  return { value: null, zone: null };
};

export const getApprovalLevel = (score: number): { level: string; color: string; bg: string } => {
  if (score < 40) return { level: 'MC (Mission Commander)', color: '#2e7d32', bg: '#e8f5e9' }; // Green
  if (score < 50) return { level: '991 Cmdt (Esquadra)', color: '#f57f17', bg: '#fffde7' };    // Yellow
  if (score < 60) return { level: 'Cmdt GO (Grupo Operacional)', color: '#d84315', bg: '#fbe9e7' }; // Light red/orange
  return { level: 'Gen CA (General Comandante Aéreo)', color: '#c62828', bg: '#ffebee' }; // Dark Red
};
