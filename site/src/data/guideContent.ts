export type SectionId = 'MISSION_PLANNING' | 'NORMAL_PROCEDURES' | 'SENSOR_OPERATOR' | 'HANDOVER_TAKEOVER' | 'CRASH_RESPONSE' | 'EMERGENCY_CHECKLIST';

export interface GuideItem {
  id: string;
  title: string;
  type: 'text' | 'checklist' | 'table' | 'image' | 'mixed';
  content?: string | string[] | any;
}

export interface GuideSection {
  id: SectionId;
  label: string;
  title: string;
  items: GuideItem[];
}

export const guideData: GuideSection[] = [
  {
    id: 'MISSION_PLANNING',
    label: 'MISSION PLANNING',
    title: 'Mission Planning',
    items: [
      {
        id: 'mp-briefing-guide',
        title: 'BRIEFING GUIDE',
        type: 'image',
        content: ['/assets/briefing-guide-1.png', '/assets/briefing-guide-2.png']
      },
      {
        id: 'mp-mission-folder',
        title: 'MISSION FOLDER',
        type: 'image',
        content: [
          '/assets/mission-folder-1.png',
          '/assets/mission-folder-2.png',
          '/assets/mission-folder-3.png',
          '/assets/mission-folder-4.png'
        ]
      },
      {
        id: 'mp-wind-chart',
        title: 'WIND CHART',
        type: 'image',
        content: ['/assets/wind-chart.png']
      },
      {
        id: 'mp-config-icao',
        title: 'OGS42 CONFIGURATION & ICAO CODES',
        type: 'table',
        content: {
          headers: ['PRT', 'ICAO CODE', 'AC NAME', 'BAT', 'FUEL'],
          rows: [
            ['PRT001', '497CD->0', 'ABRANTES01', '2H', '16L'],
            ['PRT002', '497CD->1', 'BEJA02', '2H', '11L'],
            ['PRT003', '497CD->2', 'COIMBRA03', '2H', '16L'],
            ['PRT004', '497CD->3', 'DIVOR04', '2H', '16L'],
            ['PRT005', '497CD->4', 'ESPINHO05', '2H', '11L'],
            ['PRT006', '497CD->5', 'FARO06', '2H', '16L'],
            ['PRT007', '497CD->6', 'GAIA07', '1H', '11L'],
            ['PRT008', '497CD->7', 'HORTA08', '1H', '11L'],
            ['PRT009', '497CD->8', 'ILHAVO09', '1H', '11L'],
            ['PRT010', '497CD->9', 'JUROMENHA10', '1H', '11L'],
            ['PRT011', '497CD->A', 'LAJES11', '1H', '11L'],
            ['PRT012', '497CD->B', 'MACHICO12', '1H', '16L']
          ]
        }
      },
      {
        id: 'mp-callsign-cnl',
        title: 'CALLSIGN & CNL',
        type: 'mixed',
        content: {
          table: {
            headers: ['LOCAL', 'CALLSIGN (Day)', 'IFF (Day)', 'CALLSIGN (Night)', 'IFF (Night)'],
            rows: [
              ['LPOT', 'SHADW72', '5672', 'SHADW73', '5673'],
              ['LPBJ', 'SPOOK74', '5674', 'SPOOK75', '5675'],
              ['LPMI', 'KNIGT76', '5676', 'KNIGT77', '5677']
            ]
          },
          tables: [
            {
              title: 'CÓDIGOS DE CANCELAMENTO (CNL)',
              rows: [
                ['CNL 11', 'INDISPONIBILIDADE DE MATERIAL - AERONAVE'],
                ['CNL 12', 'INDISPONIBILIDADE DE MATERIAL - Eq. MISSÃO / SENSORES'],
                ['CNL 13', 'INDISPONIBILIDADE DE MATERIAL - ARMAMENTO'],
                ['CNL 20', 'INDISPONIBILIDADE DE PESSOAL - TRIPULAÇÃO'],
                ['CNL 31', 'CONDIÇÕES METEO - AERÓDROMO PARTIDA'],
                ['CNL 32', 'CONDIÇÕES METEO - AERÓDROMO CHEGADA'],
                ['CNL 33', 'CONDIÇÕES METEO - AERÓDROMO ROTA'],
                ['CNL 34', 'CONDIÇÕES METEO - ÁREA DE OPERAÇÕES'],
                ['CNL 35', 'CONDIÇÕES METEO - ALVO'],
                ['CNL 40', 'PELA ENTIDADE BENEFICIÁRIA DA MISSÃO'],
                ['CNL 51', 'RAZÕES OPERACIONAIS - AERÓDROMO DE PARTIDA'],
                ['CNL 52', 'RAZÕES OPERACIONAIS - COORDENAÇÃO TÁCTICA'],
                ['CNL 53', 'RAZÕES OPERACIONAIS - RESTRIÇÕES DE ESPAÇO AÉREO'],
                ['CNL 55', 'RAZÕES OPERACIONAIS - OUTRAS'],
                ['CNL 60', 'FALTA DE AUTORIZAÇÃO DE SOBREVOO E/OU ATERRAGEM']
              ]
            }
          ]
        }
      },
      {
        id: 'mp-airtasks',
        title: 'AIRTASKS',
        type: 'table',
        content: {
          headers: ['Code', 'Description'],
          rows: [
            [{text: 'TIPO DE MISSÃO', colSpan: 2, bg: '#eee', bold: true}],
            ['00U / 80U / 90U', 'Treino / Manutenção / Instrução na base mãe'],
            ['00A / 80A / 90A', 'Treino / Manutenção / Instrução fora da base mãe'],
            ['40A', 'Operacional VTER'],
            ['45A', 'Operacional VMAR'],
            [{text: 'MODALIDADES DE ACÇÃO', colSpan: 2, bg: '#eee', bold: true}],
            ['AQUAL', 'Aircraft Qualification'],
            ['INST', 'Instruction'],
            ['ISR', 'Intelligence Surveillance & Reconnaissance'],
            ['MNT', 'Maintenance'],
            ['AMOV', 'Air Movement'],
            ['ADEM', 'Air Demostration'],
            [{text: 'TIPO DE MODALIDADE', colSpan: 2, bg: '#eee', bold: true}],
            ['INST', 'Instrução'],
            ['OPER', 'Operacional'],
            ['TRM', 'Treino De Manutenção De Qualificação'],
            ['TRQ', 'Treino De Qualificação'],
            ['TRU', 'Treino De Uniformização'],
            [{text: 'DESIGNADORES DE MISSÃO', colSpan: 2, bg: '#eee', bold: true}],
            ['00', 'Teste Ou Treino'],
            ['20', 'Caça'],
            ['25', 'Caça (Marítimo)'],
            ['30', 'Ataque'],
            ['35', 'Ataque (Marítimo)'],
            ['40', 'Reconhecimento'],
            ['45', 'Reconhecimento (Marítimo)'],
            ['50', 'Transporte'],
            ['55', 'Transporte (Marítimo)'],
            ['60', 'Apoio Ao Combate Sar'],
            ['65', 'Apoio Ao Combate Sar (Marítimo)'],
            ['70', 'Treino'],
            ['75', 'Treino (Marítimo)'],
            ['80', 'Manutenção'],
            ['90', 'Instrução']
          ]
        }
      },
      {
        id: 'mp-flight-plan',
        title: 'FLIGHT PLAN',
        type: 'mixed',
        content: {
          image: '/assets/flight-plan.png',
          checklist: [
            '--- SUBMISSION & AREAS ACTIVATION ---',
            'Texto a introduzir no email para LPPPARO@NAV.PT:',
            '',
            '(FPL-SPRTN40-IM',
            '-1ZZZZ/L-GV/E',
            '-LPMI1000',
            '-N0051A050 DCT ZOPS DCT',
            '-LPOT0700',
            '-DOF/251203 REG/PRT004 CODE/497CD3 TYP/OGS42N PER/A',
            'STS/STATE OPR/PRT AIR FORCE NAV/GPS ADS B',
            'RMK/SSR3040 00A4658 UNMANNED AIRCRAFT RTE DCT',
            'N DCT N9 DCT N4 DCT N9 DCT N DCT N DCT',
            '-E/0900 P/TBN R/UE',
            '-A/GREY)',
            '',
            '• Sempre que houver atividade na área R73 (N, C ou S), enviar email no dia anterior para: CA.SECGEA@EMFA.GOV.PT',
            '• Se houver necessidade imediata de ativar a área pode ser em coordenação tática com a EITA'
          ]
        }
      },
      {
        id: 'mp-restricted-danger',
        title: 'RESTRICTED & DANGER AREAS',
        type: 'image',
        content: ['/assets/restricted-danger-1.png', '/assets/restricted-danger-2.png']
      },
      {
        id: 'mp-op-areas-pt',
        title: 'OPERATIONAL AREAS - PT',
        type: 'image',
        content: ['/assets/op-area-pt.png']
      },
      {
        id: 'mp-mef-north',
        title: 'OPERATIONAL AREAS - NORTH PT',
        type: 'mixed',
        content: {
          image: '/assets/op-area-north.png',
          table: {
            headers: ['AREA', 'MEF (ft)', 'AREA', 'MEF (ft)'],
            rows: [
              ['N', '4000\'', 'N10', '4000\''],
              ['N1', '3000\'', 'N11', '3400\''],
              ['N2', '4800\'', 'N12', '4800\''],
              ['N3', '4900\'', 'N13', '3200\''],
              ['N4', '5200\'', 'N14', '3100\''],
              ['N5', '3500\'', 'N15', '3200\''],
              ['N6', '5000\'', 'N16', '4600\''],
              ['N7', '4800\'', 'N17', '3700\''],
              ['N8', '4500\'', 'N18', '3700\''],
              ['N9', '3900\'', 'N19', '3700\''],
              [{text: 'Transition Altitude: 5000FT AMSL', colSpan: 4, center: true, italic: true}]
            ]
          }
        }
      },
      {
        id: 'mp-mef-center',
        title: 'OPERATIONAL AREAS - CENTER PT',
        type: 'mixed',
        content: {
          image: '/assets/op-area-center.png',
          table: {
            headers: ['AREA', 'MEF (ft)', 'AREA', 'MEF (ft)'],
            rows: [
              ['C', '4100\'', 'C13', '3100\''],
              ['C1', '3600\'', 'C14', '2100\''],
              ['C2', '3600\'', 'C15', '2400\''],
              ['C3', '5800\'', 'C16', '1200\''],
              ['C4', '600\'', 'C17', '2200\''],
              ['C5', '4100\'', 'C18', '2200\''],
              ['C6', '4500\'', 'C19', '3200\''],
              ['C7', '6700\'', 'C20', '600\''],
              ['C8', '4100\'', 'C9', '4100\''],
              ['C10', '4100\'', 'C11', '1900\''],
              ['C12', '1800\'', 'C21', '900\''],
              ['C22', '2800\'', 'C23', '900\''],
              ['C24', '1600\'', '', ''],
              [{text: 'Transition Altitude: 4000FT AMSL', colSpan: 4, center: true, italic: true}]
            ]
          }
        }
      },
      {
        id: 'mp-mef-south',
        title: 'OPERATIONAL AREAS - SOUTH PT',
        type: 'mixed',
        content: {
          image: '/assets/op-area-south.png',
          table: {
            headers: ['AREA', 'MEF (ft)', 'AREA', 'MEF (ft)'],
            rows: [
              ['S', '3100\'', 'S16', '300\''],
              ['S1', '1600\'', 'S17', '1300\''],
              ['S2', '2300\'', 'S18', '1400\''],
              ['S3', '1500\'', 'S19', '100\''],
              ['S6', '100\'', 'S20', '3000\''],
              ['S7', '500\'', 'S21', '100\''],
              ['S8', '1200\'', 'S22', '100\''],
              ['S9', '800\'', 'S23', '300\''],
              ['S10', '100\'', 'S24', '100\''],
              ['S11', '400\'', 'S12', '1300\''],
              ['S13', '1400\'', 'S14', '100\''],
              ['S15', '300\'', '', ''],
              [{text: 'Transition Altitude: 4000FT AMSL', colSpan: 4, center: true, italic: true}]
            ]
          }
        }
      },
      {
        id: 'mp-working-areas',
        title: 'WORKING AREAS - LPBJ',
        type: 'image',
        content: ['/assets/work-aerea-lpbj.png']
      },
      {
        id: 'mp-airspace',
        title: 'AIRSPACE - CLASS G',
        type: 'table',
        content: {
          headers: ['Provision', 'IFR (GAT)', 'VFR (GAT)', 'Operational and Training Low Level Flights (OAT)'],
          rows: [
            ['SEPARATION PROVIDED', 'NIL', 'NIL', 'NIL'],
            ['SERVICE PROVIDED', 'Flight Information Service (FIS)', 'FIS', 'Flight Information Service'],
            ['VMC MINIMA', 'Not Applicable', 
              'At and above FL100:\n• 8 Km visibility\n• 1500 m horizontal and 300 m vertical distance from clouds\n\n' +
              'Below FL100 and above 3000 ft AMSL or 1000 ft AGL whichever is higher:\n• 5 Km visibility\n• 1500 m horizontal and 300 m vertical distance from clouds\n\n' +
              'At and below 3000 ft AMSL or 1000 ft AGL whichever is higher:\n• 5 Km* visibility\n• Clear of cloud and in sight of ground or water', 
              'Not Applicable'
            ],
            ['SPEED LIMITATION**', '250 Kt IAS below 3050 m (10000 ft AMSL)', '250 Kt IAS below 3050 m (10000 ft AMSL)', 'MACH 0.7'],
            ['RADIO COMMUNICATION', 'Continuous two-way', 
              'Within Lisbon FIR:\n• Civilian ACFT not required***;\n• MIL ACFT required with Lisboa INFORMATION.\n\n' +
              'Within Santa Maria Oceanic FIR:\n• Required.', 
              'Continuous two-way'
            ],
            ['FLIGHT PLAN', 'Required for MIL ACFT', 'Required for MIL ACFT', 'Required'],
            [{text: '* Helicopters at or below 3000 ft AMSL and in sight of the surface may operate at a speed which, having regard to the visibility, is reasonable.\n' +
                    '** When the height of transition altitude is lower than 3050 m (10000 ft AMSL), FL100 should be used in lieu of 10000 ft.\n' +
                    '*** Except in LPBG (AIP PORTUGAL AD 2.17), LPVR (AIP PORTUGAL AD 2.17), LPCH and LPPM (AIP PORTUGAL ENR 2.2.1.4.) ATZ.\n\n' +
                    'Class G Airspace comprises: All airspace not covered by classes "A", "C" and "D" within Lisboa FIR and Santa Maria Oceanic FIR.', colSpan: 4, italic: true}]
          ]
        }
      },
      {
        id: 'mp-sar-signals',
        title: 'SAR SIGNALS & TRANSITION',
        type: 'table',
        content: {
          headers: ['Message', 'Symbol', 'Message', 'Symbol'],
          rows: [
            [{text: 'SEARCH AND RESCUE SIGNALS', colSpan: 4, bg: '#eee', bold: true, center: true}],
            ['Require Assistance', 'V', 'Yes or Affirmative', 'Y'],
            ['Require Medical Assist.', 'X', 'Proceeding in this dir.', '↑'],
            ['No or Negative', 'N', 'IF IN DOUBT USE', 'SOS'],
            [{text: 'FOR RESCUE UNITS', colSpan: 4, bg: '#ddd', bold: true, center: true}],
            ['Operation Completed', 'LLL', 'Found all personnel', 'LL'],
            ['Found only some pers.', '++', 'We are not able to cont.', 'XX'],
            [{text: 'TRANSITION ALTITUDES', colSpan: 4, bg: '#eee', bold: true, center: true}],
            ['LPOT / LPBJ / Cascais / Lisboa / Porto / Beja / Évora', '4000 ft', 'LPMI / Madeira / Porto Santo', '5000 ft'],
            ['Bragança / Vila Real', '8000 ft', '', '']
          ]
        }
      },
      {
        id: 'mp-antenna-coverage',
        title: 'MAXIMUM ANTENNAS COVERAGE (43NM)',
        type: 'image',
        content: ['/assets/antenas-coverage.png']
      },
      {
        id: 'mp-aerodrome-charts',
        title: 'AERODROME CHARTS',
        type: 'image',
        content: [
          '/assets/lpot.png',
          '/assets/lpmi.png',
          '/assets/lpbj.jpg'
        ]
      },
      {
        id: 'mp-contacts',
        title: 'CONTACTS',
        type: 'table',
        content: {
          headers: ['LOCAL', 'POSITION', 'TLM / EXT', 'OUTLOOK'],
          rows: [
            [{text: 'LPMI', colSpan: 1, bold: true}, 'MC', '590 465 / 912 741 812', 'e991.ao.adj@emfa.gov.pt'],
            ['', 'OPS', '590 424 / 912 741 864', ''],
            ['', 'COCKPIT', '509 555 / 217 716 106', ''],
            ['', 'GNR', '278 201 000', '-'],
            ['', 'Diretor AD', '932 657 050', 'dir.aerodromo.lpmi@gmail.com'],
            [{text: 'LPOT', colSpan: 1, bold: true}, 'MC', '590 481 / 912 573 229', 'e991.ao.adj@emfa.gov.pt'],
            ['', 'OPS', '590 457 / 912 741 326', ''],
            ['', 'COCKPIT', '502 981', ''],
            ['', 'CCSD', '502 033 / 263 740 147', '-'],
            [{text: 'LPBJ', colSpan: 1, bold: true}, 'MC', '590 455 / 912 741 767', 'e991.ao.adj@emfa.gov.pt'],
            ['', 'OPS', '590 458 / 912 741 842', ''],
            ['', 'COCKPIT', '550 554', ''],
            ['', 'CCSD', '550 092 / 284 314 692', '-'],
            [{text: 'OUTROS', colSpan: 1, bold: true}, 'EITA', '509 335 / 217 716 175', '-'],
            ['', 'OPS CA', '529 305 / 217 708 205', '-'],
            ['', 'CMDT GO21', '590 066 / 915 064 366', 'cfmta.go.cmdt@emfa.gov.pt'],
            ['', 'CMDT E991', '590 920 / 913 874 429', 'e991.cmdt@emfa.gov.pt'],
            ['', 'OFOPS E991', '590 874 / 919 425 747', 'e991.esqlhao@emfa.gov.pt']
          ]
        }
      },
      {
        id: 'mp-detach-general',
        title: 'GENERAL DETACHMENTS CHECKLIST',
        type: 'checklist',
        content: [
          '1. Pedir NOTAM(s) (10 dias úteis antecedência)',
          '2. Pedir "tasking" da missão',
          '3. Solicitar à EMA Aeronaves para a missão',
          '4. Solicitar à EMA GCS Móvel/Portátil (se nec.)',
          '5. Solicitar à EMA 1 kit de PRE completo',
          '6. Pedir Guias de Marcha',
          '7. Reservar dormidas militares (e-mail dat.spmissoes)',
          '8. Fazer reserva no restaurante',
          '9. Solicitar kit de transmissões (Telemóvel, Comms 1/2, Rádio Aero)',
          '10. Solicitar kit noturno (se nec.)',
          '11. Solicitar viatura(s) para a operação',
          '12. Verificar níveis óleo, água, adblue e combustível',
          '13. Verificar boletim das viaturas',
          '14. Confirmar cartão Galp frota',
          '15. Pedir atrelado e matrícula (se nec.)'
        ]
      },
      {
        id: 'mp-detach-lpbj',
        title: 'LPBJ (BEJA) CHECKLIST',
        type: 'checklist',
        content: [
          '1. Coordenar atividade aérea com as Operações de Beja',
          '2. Pedir NOTAM(s) (10 dias úteis antecedência)',
          '3. Pedir "tasking" da missão',
          '4. Solicitar à EMA Aeronaves para a missão',
          '5. Solicitar à EMA GCS Móvel/Portátil (se nec.)',
          '6. Solicitar à EMA 1 kit de PRE completo',
          '7. Pedir Guias de Marcha',
          '8. Reservar Alojamento',
          '9. Marcar Refeições',
          '10. Solicitar kit de transmissões (Telemóvel, Comms 1/2, Rádio Aero)',
          '11. Solicitar kit noturno (se nec.)',
          '12. Solicitar viatura(s) para a operação',
          '13. Verificar níveis óleo, água, adblue e combustível',
          '14. Verificar boletim das viaturas',
          '15. Confirmar cartão Galp frota',
          '16. Pedir atrelado e matrícula (se nec.)'
        ]
      },
      {
        id: 'mp-detach-lpmi',
        title: 'LPMI (MIRANDELA) CHECKLIST',
        type: 'checklist',
        content: [
          '1. Pedir NOTAM(s) (10 dias úteis antecedência)',
          '2. Pedir "tasking" da missão',
          '3. Solicitar à EMA Aeronaves para a missão',
          '4. Solicitar à EMA GCS Móvel/Portátil (se nec.)',
          '5. Solicitar à EMA 1 kit de PRE completo',
          '6. Pedir Guias de Marcha',
          '7. Reservar dormidas militares',
          '8. Fazer reserva no restaurante',
          '9. Solicitar a chave do cockpit',
          '10. Solicitar kit de transmissões (Telemóvel, Comms 1/2, Rádio Aero)',
          '11. Solicitar kit noturno (se nec.)',
          '12. Solicitar viatura(s) para a operação',
          '13. Verificar níveis óleo, água, adblue e combustível',
          '14. Verificar boletim das viaturas',
          '15. Confirmar cartão Galp frota',
          '16. Pedir atrelado e matrícula (se nec.)',
          '17. Contactar Diretor Aeródromo (Sr. João Vinhais - 932657050)',
          '18. Contactar CA antes de entrar e após sair',
          '19. Utilizar aplicação "SALTO" para abertura de portas'
        ]
      },
      {
        id: 'mp-night-flight',
        title: 'NIGHT FLIGHT SETUP',
        type: 'mixed',
        content: {
          image: '/assets/nf-lights.png',
          table: {
            headers: ['Posição', 'Localização', 'Finalidade'],
            rows: [
              ['Tripé 1', '10m antes da posição do PRE', 'Iluminação de zona de toque'],
              ['Tripé 2', '25m antes da posição do PRE', 'Iluminação de aproximação'],
              ['Tripé 3', '50m antes da posição do PRE', 'Iluminação de aproximação inicial'],
              ['Tripé 4', '10m depois da posição do PRE', 'Iluminação de zona de travagem'],
              [{text: 'As luzes devem ser colocadas de 25 em 25m nos limites laterais da pista, até aos 100m.', colSpan: 3, italic: true, center: true}]
            ]
          }
        }
      },
      {
        id: 'mp-emergency-day',
        title: 'EMERGENCY OF THE DAY',
        type: 'table',
        content: {
          headers: ['DAY', 'MONTH (1,3,5,7,9,11)', 'DAY', 'MONTH (2,4,6,8,10,12)'],
          rows: [
            ['1', 'ENGINE FAILURE FAR FROM AERODROME', '1', 'FIRE, SMOKE OR FUMES IN THE COCKPIT'],
            ['2', 'ENGINE FAILURE NEAR THE AERODROME', '2', 'COMMS FAILURE BETWEEN EXTERNAL AND INTERNAL PILOT'],
            ['3', 'ON BOARD FIRE', '3', 'EXTERNAL PILOT LOST CONTROL'],
            ['4', 'STRUCTURAL PROBLEM (WITHOUT C2)', '4', 'AIRSPEED LIMITATIONS'],
            ['5', 'STRUCTURAL PROBLEM (WITH C2)', '5', 'OPERATIONAL LIMITS'],
            ['6', 'ONBOARD GENERATOR FAILURE', '6', 'EVENTS FOR MANDATORY INSPECTION'],
            ['7', 'ERRATIC BEHAVIOUR', '7', 'ENGINE LIMITATIONS'],
            ['8', 'GPS FAILURE', '8', 'ENGINE FAILURE FAR FROM AERODROME'],
            ['9', 'BAROMETRIC ALTITUDE DEVIATION', '9', 'ENGINE FAILURE NEAR THE AERODROME'],
            ['10', 'LINK LOSS', '10', 'ON BOARD FIRE'],
            ['11', 'COCKPIT ENERGY FAILURE', '11', 'STRUCTURAL PROBLEM (WITHOUT C2)'],
            ['12', 'GCS FAILURE', '12', 'STRUCTURAL PROBLEM (WITH C2)'],
            ['13', 'FIRE, SMOKE OR FUMES IN THE COCKPIT', '13', 'ONBOARD GENERATOR FAILURE'],
            ['14', 'COMMS FAILURE BETWEEN EXTERNAL AND INTERNAL PILOT', '14', 'ERRATIC BEHAVIOUR'],
            ['15', 'EXTERNAL PILOT LOST CONTROL', '15', 'GPS FAILURE'],
            ['16', 'AIRSPEED LIMITATIONS', '16', 'BAROMETRIC ALTITUDE DEVIATION'],
            ['17', 'OPERATIONAL LIMITS', '17', 'LINK LOSS'],
            ['18', 'EVENTS FOR MANDATORY INSPECTION', '18', 'COCKPIT ENERGY FAILURE'],
            ['19', 'ENGINE LIMITATIONS', '19', 'GCS FAILURE'],
            ['20', 'ENGINE FAILURE FAR FROM AERODROME', '20', 'FIRE, SMOKE OR FUMES IN THE COCKPIT'],
            ['21', 'ENGINE FAILURE NEAR THE AERODROME', '21', 'COMMS FAILURE BETWEEN EXTERNAL AND INTERNAL PILOT'],
            ['22', 'ON BOARD FIRE', '22', 'EXTERNAL PILOT LOST CONTROL'],
            ['23', 'STRUCTURAL PROBLEM (WITHOUT C2)', '23', 'AIRSPEED LIMITATIONS'],
            ['24', 'STRUCTURAL PROBLEM (WITH C2)', '24', 'OPERATIONAL LIMITS'],
            ['25', 'ONBOARD GENERATOR FAILURE', '25', 'EVENTS FOR MANDATORY INSPECTION'],
            ['26', 'ERRATIC BEHAVIOUR', '26', 'ENGINE LIMITATIONS'],
            ['27', 'GPS FAILURE', '27', 'ENGINE FAILURE FAR FROM AERODROME'],
            ['28', 'BAROMETRIC ALTITUDE DEVIATION', '28', 'ENGINE FAILURE NEAR THE AERODROME'],
            ['29', 'LINK LOSS', '29', 'ON BOARD FIRE'],
            ['30', 'COCKPIT ENERGY FAILURE', '30', 'STRUCTURAL PROBLEM (WITHOUT C2)'],
            ['31', 'GCS FAILURE', '31', 'STRUCTURAL PROBLEM (WITH C2)']
          ]
        }
      },
      {
        id: 'mp-mmel',
        title: 'MASTER MINIMUM EQUIPMENT LIST (MMEL)',
        type: 'checklist',
        content: [
          '1. UAV',
          '2. GCS (Principal, Backup, EO Station, Server, VHF, UPS, Generator)',
          '3. Sensor EO (Gimbal) ou Gimbal Dummy',
          '4. AIS',
          '5. Kit PRE (Comandos, Power, Comms, Starter, Extintor)',
          '6. Antena STC',
          '7. Antena Omni / Omni Amplificada',
          '8. Estação Meteorológica',
          '9. Iluminação de Pista (Noite)'
        ]
      },
      {
        id: 'mp-mel',
        title: 'MINIMUM EQUIPMENT LIST (MEL)',
        type: 'table',
        content: {
          headers: ['EQUIPMENT', 'TRQ', 'ISR', 'HO / TO'],
          rows: [
            ['UAV', 'X', 'X', 'X'],
            ['COCKPIT / PORTÁTIL', 'X', 'X', 'X2'],
            ['SENSOR EO (GIMBAL)', {text: 'X', colSpan: 1, center: true}, 'X', 'X'],
            ['GIMBAL DUMMY', 'X', '', ''],
            ['KIT PRE', 'X', 'X', 'X'],
            ['ANTENA STC', 'X', 'X', 'X2'],
            ['ANTENA OMNI / OMNI AMP', 'X', 'X', 'X2'],
            ['ESTAÇÃO METEOROLÓGICA', 'X', 'X', 'X']
          ]
        }
      },
      {
        id: 'mp-system-status',
        title: 'SYSTEM STATUS INDICATORS',
        type: 'mixed',
        content: {
          image: '/assets/status-systems.png',
          table: {
            headers: ['#', 'System Component'],
            rows: [
              ['1', 'ONBOARD PC'],
              ['2/3', 'EXTERNAL TO SERIAL CONVERTER 1/2'],
              ['4', 'ONBOARD ROUTER'],
              ['5', 'STORM COMM COMMUNICATION BOARD'],
              ['6/7', 'ANTENNA OMNI / OMNI AMP'],
              ['8', 'STORM COMM'],
              ['9', 'EMERGENCY RECOVERY'],
              ['11', 'ADSB'],
              ['12', 'TRANSPONDER COMMUNICATION'],
              ['13', 'LINK TO PC SERVER'],
              ['14/15', 'LINK TO STORM COMM COMMUNICATOR'],
              ['16', 'LINK TO LINK CONTROLLER']
            ]
          }
        }
      }
    ]
  },
  {
    id: 'NORMAL_PROCEDURES',
    label: 'NORMAL PROCEDURES',
    title: 'Normal Procedures Checklist',
    items: [
      { 
        id: 'mobile-gcs-1', 
        title: 'MOBILE GCS SETUP (1/3) - Power', 
        type: 'checklist', 
        content: [
          '1. FIRE EXTINGUISHER ................. ON POSITION',
          '2. PS BACKUP ......................... ON',
          '3. PS MAIN ........................... ON',
          '4. GCS SOCKET TO PS MAIN ............. CONNECT',
          '5. PS MAIN AC BUTTON ................. ON',
          '6. GENERATOR ......................... TEST',
          '7. GEN TO SYSTEM (BLUE SOCKET) ....... CONNECT (AS REQUIRED)',
          '--- If grid energy is available ---',
          '8. GRID TO SYSTEM .................... CONNECT',
          '9. UPS ............................... ON',
          '10. EMERGENCY CIRCUIT BREAKER ........ CONFIRM ON',
          '11. SWITCH 1 ......................... ON',
          '12. SWITCH 2 ......................... ON'
        ] 
      },
      { 
        id: 'mobile-gcs-2', 
        title: 'MOBILE GCS SETUP (2/3) - External', 
        type: 'checklist', 
        content: [
          '1. STC ANTENNA (POINTING NORTH) ...... IN POSITION',
          '2. STC CABLES ........................ CONNECT',
          '3. TRIDENT ANTENNAS .................. IN POSITION',
          '4. TRIDENT CABLES .................... CONNECT',
          '5. WEATHER STATION (VANE NORTH) ...... IN POSITION & ON',
          '6. REAR MAST SWITCH (STC) ............ UP',
          '7. FRONT MAST SWITCH (TRIDENT) ....... UP',
          '8. STC SWITCH ........................ ON',
          '9. OMNIAMP SWITCH .................... ON',
          '10. OMNI SWITCH ...................... ON',
          '11. RADIO SWITCH ..................... ON',
          '12. WEATHER STATION (USB) ............ PRESS "DONE"'
        ] 
      },
      { 
        id: 'mobile-gcs-3', 
        title: 'MOBILE GCS SETUP (3/3) - Internal', 
        type: 'checklist', 
        content: [
          '1. MAIN, BACKUP GCS & PAYLOAD PC ..... ON',
          '2. EXTERNAL DISK TO PAYLOAD PC ....... CONNECT (AS REQUIRED)',
          '3. COMMS 2 ........................... CHECK (PRI / PRE)',
          '4. COMMS 1 HUB ....................... ON & IN POSITION',
          '5. SOUND ............................. TEST',
          '6. INTERNET .......................... TEST',
          '7. PC SERVER ......................... ON',
          '--- If PC Server is a virtual machine ---',
          'Wait until OS Computer is On, then open VMWare software and start Virtual PC Server.',
          '8. GRAFANA SCRIPT (PC SERVER) ........ CHECK ON',
          '9. AIRCRAFT SSID SCRIPT (PC SERVER) ... SELECT',
          '10. STC CONTROL CONFIG.TXT ........... SET (ON Server - Pos & Alt)',
          '    • TRACKER CONTROL ................ CLOSE',
          '    • DESIGNATED STC FOLDER .......... OPEN (Ex: "STC_CONTROL_1")',
          '    • "CONNECTIONS" FILE ............. EDIT (COORDINATES & ALTITUDE)',
          '    • "STC_CONTROL" FILE ............. OPEN',
          '11. STC CONTROL (PC SERVER) .......... SELECT & ON',
          '12. UAVISION ANTENAS CONTROL ......... ON (PC SERVER)'
        ] 
      },
      { 
        id: 'portable-gcs-1', 
        title: 'PORTABLE GCS SETUP (1/3) - Power', 
        type: 'checklist', 
        content: [
          '1. FIRE EXTINGUISHER ................. ON POSITION',
          '2. EMERGENCY POWER GENERATOR ......... FUELLED / TEST (OS)',
          '3. GRID ENERGY ....................... TEST (OS)',
          '4. UPS ............................... ON',
          '5. GENERATOR/PS 1 .................... TEST',
          '--- If grid energy is unavailable ---',
          '6. GENERATOR/PS 2 .................... ON'
        ] 
      },
      { 
        id: 'portable-gcs-2', 
        title: 'PORTABLE GCS SETUP (2/3) - Network', 
        type: 'checklist', 
        content: [
          '1. STC ANTENNA (POINTING NORTH) ...... IN POSITION',
          '2. STC CABLES ........................ CONNECT',
          '3. OMNI/OMNI AMP ANTENNA ............. IN POSITION',
          '4. OMNI/OMNI AMP CABLES .............. CONNECT',
          '5. WEATHER STATION (VANE NORTH) ...... IN POSITION & ON',
          '6. WEATHER STATION (USB) ............ PRESS "DONE"'
        ] 
      },
      { 
        id: 'portable-gcs-3', 
        title: 'PORTABLE GCS SETUP (3/3) - Computer', 
        type: 'checklist', 
        content: [
          '1. MAIN, BACKUP GCS & PAYLOAD PC ..... ON',
          '2. EXTERNAL DISK TO PAYLOAD PC ....... CONNECT (AS REQUIRED)',
          '3. COMMS 2 ........................... CHECK (PRI / PRE)',
          '4. COMMS 1 HUB ....................... ON & IN POSITION',
          '5. SOUND ............................. TEST',
          '6. INTERNET .......................... TEST',
          '7. PC SERVER ......................... ON',
          '--- If PC Server is a virtual machine ---',
          'Wait until OS Computer is On, then open VMWare software and start Virtual PC Server.',
          '8. GRAFANA SCRIPT (PC SERVER) ........ CHECK ON',
          '9. AIRCRAFT SSID SCRIPT (PC SERVER) ... SELECT',
          '10. STC CONTROL CONFIG.TXT ........... SET',
          '11. STC CONTROL (PC SERVER) .......... SELECT & ON',
          '12. UAVISION ANTENAS CONTROL ......... ON (PC SERVER)'
        ] 
      },
      { 
        id: 'cockpit-gcs', 
        title: 'COCKPIT GCS SETUP', 
        type: 'checklist', 
        content: [
          '1. FIRE EXTINGUISHER ................. ON POSITION',
          '2. EMERGENCY POWER GENERATOR ......... FUELLED / TEST (OS)',
          '3. GRID ENERGY ....................... TEST (OS)',
          '4. MAIN, BACKUP GCS & PAYLOAD PC ..... ON (PRI / OS)',
          '5. EXTERNAL DISK TO PAYLOAD PC ....... CONNECT (AS REQUIRED)',
          '6. COMMS 2 ........................... CHECK (PRI / PRE)',
          '7. COMMS 1 HUB ....................... ON & IN POSITION (OS)',
          '8. SOUND ............................. TEST',
          '9. INTERNET .......................... TEST',
          '10. PC SERVER ........................ ON (OS)',
          '11. GRAFANA SCRIPT (PC SERVER) ....... CHECK ON (OS)',
          '12. AIRCRAFT SSID SCRIPT (PC SERVER) .. SELECT (OS)',
          '13. STC CONTROL (PC SERVER) .......... SELECT & ON (OS)',
          '14. UAVISION ANTENAS CONTROL ......... ON (OS)'
        ] 
      },
      { 
        id: 'backup-gcs-config', 
        title: 'BACKUP GCS MISSION CONFIGURATION', 
        type: 'checklist', 
        content: [
          '1. KVM SWITCH ........................ SET TO BACKUP',
          '2. ETHERNET CABLE .................... SET TO BACKUP',
          '3. MC CHECKS (A/C, SQK, ANT) ......... SELECT',
          '4. ANTENNA ........................... CONNECT OMNI',
          '5. SOFTWARE .......................... CONNECT',
          '6. GREEN LIGHT ....................... CONFIRM STEADY',
          '7. HOME POINT ........................ SET',
          '8. SHOW AREAS ........................ SET',
          '9. TRANSPONDER SQUAWK CODES .......... CHECK',
          '10. CALLSIGN ......................... SET',
          '11. FLY HOME (CRUISE SETTINGS) ....... SET',
          '12. ALT GUIDED (CRUISE SETTINGS) ...... SET',
          '13. SAFETY ALTITUDES (CRUISE) ........ SET'
        ] 
      },
      { 
        id: 'main-gcs-config-1', 
        title: 'MAIN GCS MISSION CONFIGURATION (1/2)', 
        type: 'checklist', 
        content: [
          '1. KVM SWITCH ........................ SET TO MAIN',
          '2. ETHERNET CABLE .................... CONNECT MAIN',
          '3. MONITORS SCRIPT ................... EXECUTE',
          '4. MC CHECKS (A/C, SQK, ANT) ......... SELECT',
          '5. SOFTWARE .......................... CONNECT',
          '6. GREEN LIGHT ....................... CONFIRM STEADY',
          '7. ANTENNA ........................... BEST AVAILABLE',
          '8. NAV LIGHTS ........................ ON',
          '9. HOME POINT ........................ SET',
          '10. SHOW AREAS ....................... SET',
          '11. TRANSPONDER SQUAWK CODES ......... CHECK',
          '12. CALLSIGN ......................... SET',
          '13. CONFIGURATION VALUES ............. SET (Speed, Timeout, Offset, Radius, Alt Guided, Fly home)',
          '14. IAT .............................. REGISTER (MC)',
          '15. FUEL QUANTITY .................... REGISTER (MC)',
          '16. INITIAL HOME ALT ................. REGISTER (MC)',
          '17. SAFETY ALTITUDES ................. SET',
          '18. PSU VALUES (23-25 V) ............. CHECK',
          '19. GPS SATS ......................... >10',
          '20. GPS HDOP ......................... <1'
        ] 
      },
      { 
        id: 'main-gcs-config-2', 
        title: 'MAIN GCS MISSION CONFIGURATION (2/2)', 
        type: 'checklist', 
        content: [
          '1. RESTART MISSION ................... ON',
          '2. RWY FOR DEPARTURE (ATC/PRE) ....... REQUEST',
          '3. GIMBAL INITIAL CHECKS ............. PERFORM (OS)',
          '4. MISSIONS .......................... UPLOAD (PRI / MC)',
          '5. EMERGENCY MISSIONS ................ UPLOAD (PRI / MC)',
          '6. ON-BOARD PC CHECKS ................ EXECUTE (OS)',
          '   • Emergency missions UPLOADED',
          '   • Emergency mission Active',
          '   • Callsign / Squawk / Lat/Long',
          '   • Link lost squawk - 7400',
          '   • Link lost time - 120 000'
        ] 
      },
      { 
        id: 'before-start', 
        title: 'BEFORE START', 
        type: 'mixed', 
        content: {
          checklist: [
            '1. VOICE COMMS 1 ..................... CHECK (PRI / PRE)',
            '2. NAV LIGHTS ........................ CONFIRM (PRE)',
            '3. EXTER SETUP .................... CONFIRM (PRE)',
            '4. HANDSET ........................... ON (PRE)',
            '5. GREEN BOX CHANNEL ................. CONFIRM CHANNEL (PRE)',
            '6. 433MHZ ............................ ON / TEST (PRE)',
            '7. 868MHZ ............................ ON (PRE)',
            '8. SERVO & BRAKE TEST ................ REQUEST AND CONFIRM CH (PRI/PRE)',
            '9. STABILIZE AP CONTROL .............. TEST (PRI / PRE)',
            '10. PITOT COVER ON ................... CONFIRM (PRE)',
            '11. AIR SPEED CALIBRATION (<5 kt) .... PERFORM',
            '12. PITOT COVER ...................... REMOVE (PRE)',
            '13. IAS (>40 kt) ..................... TEST (PRI / PRE)',
            '14. ARM .............................. CONFIRM (MC), SET (PRI) & TEST (PRE)',
            '15. QNH .............................. SET (PRI) & REGISTER (MC)',
            '16. mBAR OFFSET ...................... SET (PRI) & REGISTER (MC)'
          ],
          table: {
            headers: ['Alt Rel (ft)', '60', '30', '15', '6', '3', '-3', '-6', '-15', '-30', '-60'],
            rows: [
              ['mBar offset', '-2.0', '-1.0', '-0.5', '-0.2', '-0.1', '0.1', '0.2', '0.5', '1.0', '2.0']
            ]
          }
        } 
      },
      { 
        id: 'engine-start', 
        title: 'ENGINE START', 
        type: 'checklist', 
        content: [
          '1. ELETRO OPTICAL & IR CAMERA CHK .... CONFIRM (OS)',
          '2. ENGINE SWITCH ..................... ON (PRI / MC)',
          '3. STARTER TRIGGER SWITCH ............ CONFIRM CLOCKWISE (PRE)',
          '4. STARTUP CLEARANCE (MC / ATC) ...... REQUEST',
          '5. ENGINE START ...................... PERFORM (PRE)',
          '6. CLOCK ............................. START (PRI) & REGISTER (MC)',
          '7. DEPARTURE BRIEFING (NPC 17/26) .... PERFORM'
        ] 
      },
      {
        id: 'departure-briefing',
        title: 'DEPARTURE BRIEFING',
        type: 'text',
        content: `**If Manual T/Off:**
• Descolagem manual na pista ___. PRE reporta "brakes off" e "airborn". PRI reporta "full throttle". OS vai reportando a IAS até indicação do PRE.
• Após T/O, volta pela dir/esq, transição em ___ a ___ pés, saída por ___ a ___ pés.

**Sem comunicações:** Antes dos 40kts, PRE aborta. Após 40kts, vai para o ar. OS reestabelece COMMS.
**PRE sem comandos:** Antes dos 40kts, PRE pede ”KILL ENGINE, KILL ENGINE, KILL ENGINE”. Após 40kts, à voz do PRE de “SEM COMANDOS, SEM COMANDOS, SEM COMANDOS”, farei FTH para a frente da aeronave.
**Outras anomalias:** Antes dos 40kts, à voz de “ABORT, ABORT, ABORT”, PRE faz idle e aplica travões. Preparo-me para cortar motor à voz do PRE de “KILL ENGINE, KILL ENGINE, KILL ENGINE”. Depois dos 40kts, se emergência de motor ou fogo, o PRE aterra na pista remanescente ou faz teardrop e aterra na pista contraria. Caso seja outra emergência, avalia-se no ar.

**If Auto T/Off:**
• Descolagem automática na pista ___, subida até ___ pés, volta pela dir/esq , saída por ___ a ___ pés. Farei o countdown 3 2 1 e “mission”. PRI reporta “full throttle”, PRE “brakes off” e “airborn”.
**Fogo, falha de motor ou potência (<5800 RPM):** À voz de “ABORT, ABORT, ABORT”, faço stabilize, o PRE controla a aeronave.`
      },
      { 
        id: 'engine-test', 
        title: 'ENGINE TEST', 
        type: 'checklist', 
        content: [
          '1. ENGINE TEST ....................... PERFORM (PRE) & REGISTER (MC)',
          '   • Ideal WOT: 5800-6200 RPM',
          '   • GEN: >34V',
          '   • Recommended idle: 2200-2600 RPM',
          '2. MIN THRT SETTING .................. ADJUST (PRI) & REGISTER (MC)'
        ] 
      },
      { 
        id: 'before-takeoff', 
        title: 'BEFORE TAKE OFF', 
        type: 'checklist', 
        content: [
          '1. GPU ............................... DISCONNECT (PRE)',
          '2. LINE UP ........................... PERFORM (PRE)',
          '3. AREA CLEAR ........................ CONFIRM (PRE)',
          '4. TRANSPONDER ....................... ON',
          '5. AMP RF ............................ ON',
          '6. DEPARTURE CHECKS .................. PERFORM',
          '7. T/OFF MISSION (IF AUTO) ........... UPLOAD & CONFIRM (MC)',
          '8. DEPARTURE CLEARANCE (ATC / MC) .... REQUEST',
          '9. BRAKES ............................ ON (PRE)'
        ] 
      },
      { 
        id: 'after-takeoff', 
        title: 'AFTER TAKE OFF', 
        type: 'checklist', 
        content: [
          '1. FLIGHT PARAMETERS ................. MONITOR',
          '2. ENGINE PARAMETERS ................. MONITOR',
          '3. ALT GUIDED ........................ AS REQUIRED',
          '4. FLY HOME .......................... AS REQUIRED',
          '5. PMU ............................... MONITOR',
          '6. IFF (ADSB) ........................ CONFIRM',
          '7. PS3 CHECKLIST ..................... AS REQUIRED (OS)',
          '8. STREAMING CHECKLIST ............... AS REQUIRED (OS)',
          '9. EXTERNAL SET UP ................... AS REQUIRED',
          '10. COMMS ............................ AS REQUIRED'
        ] 
      },
      { 
        id: 'enroute', 
        title: 'ENROUTE', 
        type: 'checklist', 
        content: [
          '1. FLIGHT PARAMETERS ................. MONITOR',
          '2. ENGINE PARAMETERS ................. MONITOR',
          '3. FUEL QTY .......................... MONITOR (PRI) & REGISTER (MC)',
          '4. TIMEOUT ........................... AS REQUIRED',
          '5. QNH ............................... AS REQUIRED',
          '6. ALT GUIDED ........................ AS REQUIRED',
          '7. FLY HOME .......................... AS REQUIRED',
          '8. PMU ............................... MONITOR',
          '9. ANTENNAS .......................... AS REQUIRED',
          '10. EMERGENCY MISSIONS ............... AS REQUIRED',
          '11. RESTART MISSION .................. AS REQUIRED',
          '12. SAFETY/MIN ALT ................... AS REQUIRED',
          '13. GPS .............................. MONITOR'
        ] 
      },
      { 
        id: 'approach', 
        title: 'APPROACH', 
        type: 'checklist', 
        content: [
          '1. RWY FOR LANDING ................... REQUEST (PRE / ATC)',
          '2. QNH ............................... CONFIRM (MC) & SET (PRI)',
          '3. APP MISSION ....................... AS REQUIRED (PRI / MC)',
          '4. TIMEOUT ........................... AS REQUIRED',
          '5. RADIUS ............................ <= 300',
          '6. RESTART MISSION .................. ON',
          '7. COMMS 1 ........................... CHECK (PRI / PRE)',
          '8. EXTERNAL SETUP .................... CONFIRM (PRE)',
          '9. CHT ............................... MONITOR',
          '10. ALT GUIDED ....................... AS REQUIRED',
          '11. FLY HOME ......................... AS REQUIRED',
          '12. ANTENNAS ......................... MANAGE',
          '13. EMERGENCY MISSIONS ............... DISABLE',
          '14. SAFETY/MIN ALT ................... OFF',
          '15. BRAKES TEST ...................... REQUEST AND CONFIRM CH (PRI/PRE)',
          '16. ARRIVAL BRIEFING (NPC 23/26) ..... PERFORM'
        ] 
      },
      {
        id: 'arrival-briefing',
        title: 'ARRIVAL BRIEFING',
        type: 'text',
        content: `**If Manual Landing:**
• A aproximação será feita por ___ a ___ ft. Aterragem manual na pista ___, transição ___ a ___ ft.
• OS reportará IAS e “pista”. PRE reportará “touchdown” e “safe on the ground”.

**PRE sem comandos:** Antes da aterragem, à voz do PRE de “SEM COMANDOS, SEM COMANDOS, SEM COMANDOS” farei FTH para a frente da aeronave. Após aterragem à voz do PRE de ”KILL ENGINE, KILL ENGINE, KILL ENGINE” farei kill engine.
**Falha de comunicações:** Na base, final ou abaixo dos 400ft AGL, o PRE prossegue com a aterragem ou aborta. Acima dos 400ft AGL farei FTH para a frente da aeronave. OS reestabelecerá as comunicações.
• Vento de ___ º / ___ kts.

**If Automatic Landing:**
• A aproximação será feita por ___ a ___ ft. Aterragem automatica na pista ___.
• OS reportará IAS e “pista”. PRE reportará “touchdown” e “safe on the ground”, após isso farei a transição para stabilized.

**PRE sem comandos:** Antes da aterragem, à voz do PRE de “SEM COMANDOS, SEM COMANDOS, SEM COMANDOS” e farei ABORT LAND. Após aterragem à voz do PRE de KILL ENGINE, KILL ENGINE, KILL ENGINE” farei kill engine.
**Falha de comunicações:** Farei ABORT LAND. OS reestabece as comunicações.
• Vento de ___ º / ___ kts.`
      },
      { 
        id: 'before-manual-landing', 
        title: 'BEFORE MANUAL LANDING', 
        type: 'checklist', 
        content: [
          '1. APP MISSION ....................... EXECUTE',
          '2. ALT GUIDED ........................ AS REQUIRED',
          '3. LANDING CLEARANCE (ATC / MC) ...... REQUEST',
          '4. TRANSITION ........................ INFORM AND EXECUTE (PRI / PRE)'
        ] 
      },
      { 
        id: 'before-auto-landing', 
        title: 'BEFORE AUTOMATIC LANDING', 
        type: 'mixed', 
        content: {
          checklist: [
            '1. LIDAR ............................. UPLOAD & EXECUTE (PRI / MC)',
            '2. LIDAR & REL Alt (HP) .............. REGISTER (MC)',
            '3. mBAR OFF SET ...................... ADJUST',
            '4. ABORT LAND ........................ ENABLE',
            '5. FLARE ANGLE (7-8) ................. ADJUST',
            '6. PRE FLARE ......................... OFF',
            '7. AHL ............................... 600ft',
            '8. ALT GUIDED ........................ AS REQUIRED',
            '9. THROTTLE .......................... CONFIRM IDLE (PRE)',
            '10. BRAKES ........................... CONFIRM OFF (PRE)',
            '11. LAND MISSION ..................... UPLOAD & EXECUTE (PRI / MC)'
          ],
          tables: [
            {
              title: 'LIDAR SETUP',
              headers: ['ID', 'TYPE', 'ALT TYPE', 'ALT / OTHERS', 'POSITION', 'DIST'],
              rows: [
                ['1', 'Normal', 'Relative to home', '>50 ft', 'CENTER LINE', '600m before HP'],
                ['2', 'Normal', 'Relative to home', '>50 ft', 'CENTER LINE', '600m after HP']
              ]
            },
            {
              title: 'mBAR OFFSET',
              headers: ['Δ Lidar (ft)', '-15', '-12', '-9', '-6', '-3', '3', '6', '9', '12', '15'],
              rows: [
                ['Ajuste (mBar)', '-0.5', '-0.4', '-0.3', '-0.2', '-0.1', '0.1', '0.2', '0.3', '0.4', '0.5']
              ]
            },
            {
              title: 'LAND MISSION',
              headers: ['ID', 'TYPE', 'ALT TYPE', 'ALT / OTHERS', 'POSITION', 'DIST'],
              rows: [
                ['1', 'Normal', 'AMSL', 'HP Alt + 450ft', 'Base', '750m before final'],
                ['2', 'Normal', 'AMSL', 'HP Alt + 350ft', 'Final', '2000m before HP'],
                ['3', 'Normal', 'Relative to home', '100 ft', 'CENTER LINE', '600m before HP'],
                ['4', 'Land', 'Relative to home', '0 ft', 'CENTER LINE', '-']
              ]
            }
          ]
        } 
      },
      { 
        id: 'after-land', 
        title: 'AFTER LAND', 
        type: 'checklist', 
        content: [
          '1. KILL ENGINE ....................... ON REQUEST',
          '2. CLOCK ............................. STOP',
          '3. LANDING TIME ...................... REGISTER (MC)',
          '4. DISARM ............................ CONFIRM (MC) & SET (PRI)',
          '5. TRANSPONDER ....................... OFF',
          '6. GIMBAL ............................ OFF',
          '7. AMP RF ............................ OFF & INFORM',
          '8. FUEL .............................. REGISTER (MC)',
          '9. ANTENNAS .......................... DISCONNECT',
          '10. STC .............................. SET LOW POWER',
          '11. UAV .............................. OFF (PRE)',
          '12. EXTERNAL SETUP ................... OFF (PRE)',
          '13. GCS VIDEO FILE ................... AS REQUIRED',
          '14. GCS / GIMBAL / AC LOGBOOKS ....... REGISTER'
        ] 
      }
    ]
  },
  {
    id: 'SENSOR_OPERATOR',
    label: 'SENSOR OPERATOR',
    title: 'Sensor Operator Normal Procedures',
    items: [
      { 
        id: 'gimbal-checks', 
        title: 'GIMBAL INITIAL CHECKS', 
        type: 'checklist', 
        content: [
          '1. GIMBAL ............................ ON',
          '2. UAVISION CAM VIEWER ............... OPEN',
          '3. IP ................................ REFRESH & CONNECT',
          '4. GIMBAL CONTROLS ................... CHECK',
          '   • Right/Left Movement',
          '   • Up/Down Movement',
          '   • Zoom In & Out',
          '5. GIMBAL OFF ........................ AS REQUIRED',
          'NOTE: Switch off if ETA > 10 min or IAT > 25ºC.'
        ] 
      },
      { 
        id: 'onboard-pc', 
        title: 'ONBOARD PC CHECKS', 
        type: 'checklist', 
        content: [
          '1. VNC VIEWER ........................ OPEN',
          '2. ON-BOARD PC ....................... CHECK VALUES (OS)',
          '   • Emergency missions UPLOADED',
          '   • Emergency mission Active',
          '   • Callsign',
          '   • Squawk',
          '   • Lat / Long',
          '   • Link lost squawk - 7400',
          '   • Link lost time - 120 000',
          '3. VNC VIEWER ........................ CLOSE'
        ] 
      },
      { 
        id: 'eo-ir-camera', 
        title: 'ELECTRO OPTICAL & IR CAMERA', 
        type: 'checklist', 
        content: [
          '1. UAVISION CAMVIEWER ................ IP REFRESH & CONNECT',
          '2. FILE LOCATION ..................... MANAGE',
          '3. PHOTO / VIDEO FILE NAME ........... AS REQUIRED (AAMMMDD_...)',
          '4. PHOTO FOLDER ...................... CREATE & SELECT',
          '5. VIDEO FOLDER ...................... CREATE & SELECT',
          '--- Electro Optical ---',
          '6. SCREEN SIZE ....................... 1920x1080',
          '7. NAT RESOLUTION .................... AS REQUIRED',
          '8. FIT RESOLUTION .................... PERFORM',
          '9. ADVANCED BIT RATE ................. AS REQUIRED',
          '10. FILTERS .......................... AS REQUIRED',
          '--- IR Camera ---',
          '11. SCREEN SIZE ...................... 640x480',
          '12. NAT RESOLUTION ................... 640x480',
          'NOTE: 1. Video parameters may change. 2. Calibrate filter as needed.'
        ] 
      },
      { 
        id: 'streaming-ps3', 
        title: 'STREAMING & PS3', 
        type: 'checklist', 
        content: [
          '--- STREAMING ---',
          '1. OBS SOFTWARE ...................... OPEN',
          '2. IMAGE ............................. CHECK',
          '3. STREAMING ......................... AS REQUIRED',
          '4. RECEPTION ......................... CHECK',
          '--- PS3 ---',
          '1. LOG IN ............................ PERFORM',
          '2. AIRBORNE / ATD .................... INFORM',
          '3. STREAMING ON ...................... INFORM',
          '4. ON STATION ........................ INFORM',
          '5. CHAT COMS ......................... MANAGE',
          '6. OFF STATION ....................... INFORM',
          '7. STREAMING OFF ..................... INFORM',
          '8. CHAT COMS ......................... CLOSE',
          '   • Info: Callsign, ATD, ATA, ON/OFF STATION',
          '9. LOG OFF ........................... PERFORM'
        ] 
      },
      {
        id: 'controller-config',
        title: 'STANDART CONTROLLER CONFIGURATIONS',
        type: 'table',
        content: {
          headers: ['Input', 'Action'],
          rows: [
            ['Button 1 (A)', 'Clear target'],
            ['Button 2 (B)', 'Record vídeo'],
            ['Button 3 (X)', 'Stow'],
            ['Button 4 (Y)', 'Look to front'],
            ['Button 5', 'Filter selector'],
            ['Button 6 (R1)', 'Snapshot'],
            ['Button 7 (L1)', 'Mark target'],
            ['Axes 1 (L3)', 'Cam pitch'],
            ['Axes 2 (L3)', 'Cam yaw'],
            ['Axes 5 (R3)', 'Zoom']
          ]
        }
      }
    ]
  },
  {
    id: 'HANDOVER_TAKEOVER',
    label: 'HANDOVER / TAKEOVER',
    title: 'Handover / Takeover Checklist',
    items: [
      {
        id: 'hoto-coord',
        title: 'COORDINATION BEFORE FLIGHT',
        type: 'checklist',
        content: [
          'HANDOVER/TAKEOVER POSITION',
          'EMERGENCY MISSIONS',
          'AREA FILES',
          'HOME POINT'
        ]
      },
      {
        id: 'hoto-handover',
        title: 'HANDOVER GCS',
        type: 'checklist',
        content: [
          '1. GCS CONFIGS FOR HANDOVER ........... CHECK',
          '2. READY TO TRANSMIT FLIGHT DATA ...... CONFIRM'
        ]
      },
      {
        id: 'hoto-takeover',
        title: 'TAKEOVER GCS',
        type: 'checklist',
        content: [
          '1. GCS SITE SETUP ..................... PREFORM',
          '2. ADSB & PS3 ......................... MONITOR',
          '3. COCKPIT SOFTWARE ................... RUN',
          '4. COMMS MECHANICAL CONTROL (STC) ..... SET HIGH POWER',
          '5. STC AUTO MODE ...................... OFF',
          '6. POINT STC TO HANDOVER AZIMUTE ...... PREFORM',
          '7. STC AUTO MODE ...................... ON',
          '8. SOFTWARE CONNECT ................... ENGAGE',
          '9. SAFETY & MIN ALTITUDE .............. ACTIVATE',
          '10. READY TO RECEIVE FLIGHT DATA ...... CONFIRM'
        ]
      },
      {
        id: 'hoto-voice',
        title: 'VOICE COORDINATION',
        type: 'checklist',
        content: [
          '1. TIMERS ............................. SINCHRONIZE',
          '2. FLIGHT DATA ........................ SHARE AND REGISTER',
          '3. HANDOVER COCKPIT ................... DISCONNECT FROM UAV',
          '4. HANDOVER COCKPIT ................... INFORM "COMMUNICATION LOST"',
          '5. TAKEOVER COCKPIT ................... CONNECT ANTENA TO UAV',
          '6. TAKEOVER COCKPIT ................... CONFIRM CONNETED TO UAV',
          '7. TAKEOVER COCKPIT ................... UPDATE PARAMETERS',
          '8. TAKEOVER COCKPIT ................... APPLY FLIGHT DATA',
          '9. SET HOME POINT @ "PRE" POSITION',
          '10. DOWNLOAD NORMAL MISSION AS REQUIRED',
          '--- HANDOVER / TAKEOVER CONFIRMED ---',
          '• HANDOVER / TAKEOVER TIME ............ REGISTER',
          '• ADSB & ANTENNA SIGNAL ............... MONITOR',
          '• FLIGHT PLAN/REPORT & FILL LOGS ...... COMPLETE'
        ]
      },
      {
        id: 'hoto-data',
        title: 'FLIGHT DATA (HO/TO)',
        type: 'table',
        content: {
          headers: ['Parameter', 'Value (HO)', 'Value (TO)'],
          rows: [
            ['SQUAWK & LOST LINK 7400', '', ''],
            ['SAFETY ALT\'S', '', ''],
            ['THROTTLE MIN', '', ''],
            ['CRUISE SPEED', '', ''],
            ['TIMEOUT 120s', '', ''],
            ['QNH / mBar OFFSET', '', ''],
            ['RADIUS / ALT GUIDED', '', ''],
            ['FLY HOME ALT AMSL', '', ''],
            ['FUEL QTY / AUTONOMY', '', '']
          ]
        }
      }
    ]
  },
  {
    id: 'CRASH_RESPONSE',
    label: 'CRASH RESPONSE',
    title: 'Crash Response Plans',
    items: [
      {
        id: 'crp-controlled',
        title: 'AERODROMO MILITAR CONTROLADO',
        type: 'checklist',
        content: [
          'NOTE: Manter a calma. Passar info Curta, Clara e Concisa.',
          '1. Informar a TWR por rádio (O quê? Quando? Onde?)',
          '2. Informar OFOPS (502 985 / 590 874)',
          '3. Deslocação até ao local com EMA (coord. com chefe socorro)',
          '4. Preservar o local do incidente (EPR:EMA)',
          '5. Reporte DIVOC no sistema SIPA'
        ]
      },
      {
        id: 'crp-uncontrolled',
        title: 'AERODROMO MILITAR NÃO CONTROLADO',
        type: 'checklist',
        content: [
          '1. Informar o CCSD (LPOT: 502 033 / 263 740 147)',
          '2. Informar LISBOA INF. (509 335 / 590 710)',
          '3. Informar OFOPS (502 985 / 590 874)',
          '4. Coordenar canal rádio para busca (1 rádio por viatura)',
          '5. Deslocação até ao local com EMA, seguindo CCSD',
          '6. Preservar o local do incidente',
          '7. Reporte DIVOC no sistema SIPA'
        ]
      },
      {
        id: 'crp-civil',
        title: 'PROXIMIDADES CIVIL / LONGE AERODROMO',
        type: 'checklist',
        content: [
          '1. Informar Forças Segurança Locais (GNR/PSP)',
          '2. Informar frequência local',
          '3. Informar LISBOA INF (509 335 / 590 710)',
          '4. Informar OFOPS (502 985 / 590 874)',
          '5. Deslocação ao local com EMA (coord. chefe socorro)',
          '6. Preservar o local do incidente',
          '7. Reporte DIVOC no sistema SIPA'
        ]
      }
    ]
  },
  {
    id: 'EMERGENCY_CHECKLIST',
    label: 'EMERGENCY CHECKLIST',
    title: 'Emergency Checklist',
    items: [
      {
        id: 'ec-engine-far',
        title: '1. ENGINE FAILURE FAR FROM AERODROME',
        type: 'checklist',
        content: [
          '**1. FTH ................................. AWAY FROM POPULATED AREAS**',
          '**2. TIMEOUT ............................ X10**',
          '3. PROPELLER .......................... CHECK ROTATION (OS)',
          '--- If external pilot have handset range (~7NM) ---',
          '4. STABILIZE MODE ..................... ENGAGE',
          '5. THROTTLE ........................... IDLE (PRE)',
          '6. GUIDED OR MISSION .................. ENGAGE',
          '--- If external pilot do NOT have handset range ---',
          '7. RADIUS ............................. 200M',
          '8. CRASH SITE ......................... SEARCH (OS)',
          '9. IFF ................................ 7700'
        ]
      },
      {
        id: 'ec-engine-near',
        title: '2. ENGINE FAILURE NEAR THE AERODROME',
        type: 'checklist',
        content: [
          '**1. FTH ................................. INTO THE AIRFIELD**',
          '**2. TRANSITION .......................... EXECUTE**',
          'NOTE: If unable to glide to the RWY execute engine failure far from aerodrome.'
        ]
      },
      {
        id: 'ec-fire-board',
        title: '3. ON BOARD FIRE',
        type: 'checklist',
        content: [
          '**1. RTB ................................. INITIATE**',
          '**2. MAXIMUM SPEED ...................... SET**',
          'WARNING: LOSS OF CONTROL MAY HAPPEN. AVOID POPULATED AREAS.',
          '3. FIRE OR SMOKE ON AIRCRAFT ........... MONITOR (OS)',
          '4. IFF ................................. 7700',
          '5. TRANSITION .......................... EXECUTE',
          '6. KILL ENGINE (GROUND) ................ SET AND CONFIRM (MC)',
          '7. FIRE EXTINGUISHER .................. USE'
        ]
      },
      {
        id: 'ec-structural-no-c2',
        title: '4. STRUCTURAL PROBLEM WITHOUT C2',
        type: 'checklist',
        content: [
          '**1. TIMEOUT ............................ X10**',
          '**2. RADIUS ............................. 200M**',
          '3. CRASH SITE ......................... SEARCH (OS)',
          '4. IFF ................................. 7700',
          '5. KILL ENGINE ........................ SET AND CONFIRM (MC)'
        ]
      },
      {
        id: 'ec-structural-with-c2',
        title: '5. STRUCTURAL PROBLEM WITH C2',
        type: 'checklist',
        content: [
          '**1. RTB ................................. INITIATE**',
          '2. AIRCRAFT STRUCTURE .................. CHECK (OS)',
          '3. IFF ................................. 7700',
          'CAUTION: Unstable behavior is expected. Maintain speed. Avoid populated areas.'
        ]
      },
      {
        id: 'ec-energy-failure',
        title: '6. ONBOARD ENERGY FAILURE',
        type: 'checklist',
        content: [
          '**1. RTB ................................. INITIATE**',
          '**2. GIMBAL .............................. OFF**',
          '**3. MAXIMUM SPEED ...................... SET**',
          '4. IFF ................................. 7700',
          'WARNING: IF BACKUP BATTERY < 22V CONSIDER CONTROLLED CRASH.'
        ]
      },
      {
        id: 'ec-erratic',
        title: '7. ERRATIC BEHAVIOUR',
        type: 'checklist',
        content: [
          '**1. MODE ................................ REFRESH**',
          '**2. CHANNELS ............................ CHECK**',
          '3. EMERGENCY MISSION .................. CONFIRM ACTIVE',
          '4. RETURN TO PREVIOUS AREA ............ PERFORM',
          '--- If normal behavior is regained ---',
          '5. RTB ................................. INITIATE',
          '--- If normal behavior NOT regained ---',
          '6. RTL/EM .............................. ENGAGE',
          '7. ADSB ................................ MONITOR (OS)',
          '8. EXTERNAL PILOT ..................... OVERRIDE WHEN POSSIBLE'
        ]
      },
      {
        id: 'ec-gps-fail',
        title: '8. GPS FAILURE',
        type: 'checklist',
        content: [
          '**1. CIRCLE MODE ........................ ENGAGE**',
          '2. E/O & ADSB ......................... CORRELATE POS AND MONITOR (OS)',
          '3. ONBOARD COMPUTER .................. VERIFY GPS ALTITUDE (OS)',
          '4. IFF ................................. 7700',
          '--- Low GPS error (<2NM) ---',
          '5. RTB ................................. DEAD RECKONING WITH ADSB',
          '--- Medium GPS error (>2NM) ---',
          '6. RTB ................................. "NO GYRO" VECTORS WITH ATC'
        ]
      },
      {
        id: 'ec-baro',
        title: '9. BAROMETRIC ALTITUDE DEVIATION',
        type: 'checklist',
        content: [
          '**1. LOITER MODE ........................ ENGAGE**',
          '2. AIRCRAFT QNH ........................ CHECK',
          '3. ADSB (GPS ALTITUDE) ................ MONITOR (OS)',
          '4. ALTITUDE ............................ SET (IAW EVALUATION)',
          '5. IFF ................................. 7700',
          '6. RTB ................................. INITIATE',
          'WARNING: AUTOLAND IS NOT PERMITTED.'
        ]
      },
      {
        id: 'ec-link-loss',
        title: '10. LINK LOSS',
        type: 'checklist',
        content: [
          '1. ANTENNAS ........................... CHECK SIGNAL AND CONNECT',
          '--- If link not restored ---',
          '2. ADSB ............................... MONITOR (7400 ACTIVATION)',
          '3. ANTENNAS SERVER .................... CONFIRM STATUS (OS)',
          '4. DATA SWITCH ........................ CONFIRM STATUS',
          '5. ANTENNAS POE ....................... CONFIRM POWERED (OS)',
          '6. STC ................................ CONFIRM HIGH POWER AND AUTO',
          '--- If STC is pointing wrong direction ---',
          '7. STC ................................ MAN',
          '8. STC AZIMUTH ........................ SET (CHECK ADSB)',
          '9. STC ELEVATION ...................... BETWEEN 1 AND 5º'
        ]
      },
      {
        id: 'ec-cockpit-energy',
        title: '11. COCKPIT ENERGY FAILURE',
        type: 'checklist',
        content: [
          '**1. BACKUP GENERATOR ................... ON (OS)**',
          '**2. AVAILABLE POWER SOURCE ............. CONNECT (OS)**',
          'NOTE: RTB unless tactical situation dictates otherwise.'
        ]
      },
      {
        id: 'ec-gcs-failure',
        title: '12. GCS FAILURE',
        type: 'checklist',
        content: [
          '--- Software Failure ---',
          '**1. COCKPIT SOFTWARE ................... ON**',
          '**2. SOFTWARE ........................... CONNECT**',
          '--- Computer Failure ---',
          '**3. KVM ................................ SWITCH TO BACKUP**',
          '**4. ETHERNET CABLE ..................... SWITCH TO BACKUP**',
          '--- After control regained ---',
          '5. LOITER MODE ........................ ENGAGE (IF REQUIRED)',
          '6. EMERGENCY MISSIONS ................. RE-SET AND ACTIVATE',
          '7. FLY HOME ALTITUDE .................. RE-SET',
          '8. TRANSPONDER ........................ VERIFY',
          '9. UPDATE PARAMETERS .................. ENGAGE'
        ]
      },
      {
        id: 'ec-fire-smoke',
        title: '13. FIRE, SMOKE OR FUMES IN COCKPIT',
        type: 'checklist',
        content: [
          '**1. RTL/EM ............................. ENGAGE**',
          '**2. POWER SUPPLY ....................... OFF**',
          '**3. EMERGENCY ALARM/DISCHARGE .......... ACTIVATE**',
          '4. COCKPIT ............................ EVACUATE (IF NECESSARY)',
          'WARNING: DO NOT VENTILATE COCKPIT UNLESS REQUIRED FOR SURVIVABILITY.'
        ]
      },
      {
        id: 'ec-comms-fail',
        title: '14. COMMS FAILURE (EXT/INT PILOT)',
        type: 'checklist',
        content: [
          '--- On final or below 400ft AGL ---',
          '**1. EXTERNAL PILOT ..................... LAND APPROVED**',
          '2. COMMS .............................. RE-ESTABLISH (OS)',
          '--- Above 400ft AGL or go-around ---',
          '**3. FTH ................................. EXECUTE**',
          '4. COMMS .............................. RE-ESTABLISH (OS)'
        ]
      },
      {
        id: 'ec-ext-pilot-lost',
        title: '15. EXTERNAL PILOT LOST CONTROL',
        type: 'checklist',
        content: [
          '**1. FTH ................................. EXECUTE**',
          '2. HANDSET ............................ STATUS (PRE)',
          '3. POWER CONTROL BOX .................. POWERED (PRE)',
          '4. COMMUNICATION BOX .................. CONNECTED (PRE)',
          '5. CABLES ............................. STATUS (PRE)',
          '--- If control not regained ---',
          '6. COMMUNICATION BOX .................. RECONFIGURE AND TEST (PRE)',
          '7. EXTERNAL BACKUP SETUP .............. USE (PRE)',
          '--- If unsuccessful ---',
          '8. AUTOLAND ........................... PERFORM (IF POSSIBLE)'
        ]
      },
      {
        id: 'ec-limitations',
        title: 'AIRCRAFT LIMITATIONS',
        type: 'table',
        content: {
          headers: ['Parameter', 'Value'],
          rows: [
            ['Vne (Never Exceed)', '76 Kts'],
            ['Vmin', '42 Kts'],
            ['Vcruise', '51 - 57 Kts'],
            ['Vstall', '39.5 Kts'],
            ['MTOW', '40 Kg'],
            ['MIN RUNWAY SIZE', '300x10 m'],
            ['MAX CEILING', '10100 ft'],
            ['HEAD WIND', '20 Kts'],
            ['CROSS WIND', '10 Kts'],
            ['IAT', '5 to 40 Cº'],
            ['HUMIDITY', '≤ 98%'],
            ['RAIN', '0,9 mm/h'],
            ['VISIBILITY', '600 m']
          ]
        }
      },
      {
        id: 'ec-engine-limits',
        title: 'ENGINE LIMITATIONS',
        type: 'table',
        content: {
          rows: [
            [{text: 'ENGINE LIMITATIONS', bg: '#0056b3', color: 'white', bold: true, center: true, colSpan: 6}],
            ['RPM IDLE (GND)', {text: '<1800', bg: '#ff4d4d', center: true}, {text: '1800 - 3500', bg: '#4ade80', center: true, colSpan: 3}, {text: '>3500', bg: '#ff4d4d', center: true}],
            ['RPM WOT (GND)', {text: '<5800', bg: '#ff4d4d', center: true}, {text: '5800 - 6700', bg: '#4ade80', center: true, colSpan: 3}, {text: '>6700', bg: '#ff4d4d', center: true}],
            ['WOT TIME LIMITATION', {text: '• GROUND - LESS THAN 5 SECONDS (IF CHT IS LESS THAN 115ºC)\n• AIR - TWO MINUTES', colSpan: 5}],
            ['RPM', {text: '<1800', bg: '#ff4d4d', center: true}, {text: '1800 - 2750', bg: '#facc15', center: true}, {text: '2750 - 6750', bg: '#4ade80', center: true}, {text: '6750 - 7000', bg: '#facc15', center: true}, {text: '>7700', bg: '#ff4d4d', center: true}],
            ['CHT (Cº)', {text: '<70', bg: '#ff4d4d', center: true}, {text: '70 - 80', bg: '#facc15', center: true}, {text: '80 - 120', bg: '#4ade80', center: true}, {text: '120 - 130', bg: '#facc15', center: true}, {text: '>130', bg: '#ff4d4d', center: true}]
          ]
        }
      },
      {
        id: 'ec-electrical',
        title: 'ELECTRICAL SYSTEM',
        type: 'table',
        content: {
          rows: [
            [{text: 'ELECTRICAL SYSTEM', bg: '#0056b3', color: 'white', bold: true, center: true, colSpan: 6}],
            ['MAIN (V)', {text: '<21.6', bg: '#ff4d4d', center: true}, {text: '21.6 - 23.5', bg: '#facc15', center: true}, {text: '23.5 - 25.1', bg: '#4ade80', center: true}, {text: '25.1 - 26', bg: '#facc15', center: true}, {text: '>26', bg: '#ff4d4d', center: true}],
            ['EMERGENCY (V)', {text: '<21.6', bg: '#ff4d4d', center: true}, {text: '21.6 - 22.2', bg: '#facc15', center: true}, {text: '22.2 - 25.1', bg: '#4ade80', center: true}, {text: '25.1 - 26', bg: '#facc15', center: true}, {text: '>26', bg: '#ff4d4d', center: true}],
            ['EFI (V)', {text: '<10', bg: '#ff4d4d', center: true}, {text: '10 - 10.4', bg: '#facc15', center: true}, {text: '10.4 - 13.4', bg: '#4ade80', center: true}, {text: '13.4 - 14', bg: '#facc15', center: true}, {text: '>14', bg: '#ff4d4d', center: true}],
            ['EXT (V)', {text: '<22.2', bg: '#ff4d4d', center: true}, {text: '22.2 - 23', bg: '#facc15', center: true}, {text: '23 - 24.5', bg: '#4ade80', center: true}, {text: '24.5 - 26', bg: '#facc15', center: true}, {text: '>26', bg: '#ff4d4d', center: true}],
            ['PAYLOAD (V)', {text: '<21.6', bg: '#ff4d4d', center: true}, {text: '21.6 - 22.2', bg: '#facc15', center: true}, {text: '22.2 - 25.1', bg: '#4ade80', center: true}, {text: '25.1 - 26', bg: '#facc15', center: true}, {text: '>26', bg: '#ff4d4d', center: true}],
            ['COMMS (V)', {text: '<27.7', bg: '#ff4d4d', center: true}, {text: '27.7 - 28.3', bg: '#4ade80', center: true, colSpan: 3}, {text: '>28.3', bg: '#ff4d4d', center: true}]
          ]
        }
      }
    ]
  }
];
