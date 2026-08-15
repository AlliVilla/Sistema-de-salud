// Landing page content. Solo describe capacidades reales del producto:
// signos vitales, alertas con IA y un historial verificable. No se
// mencionan tecnologías internas ni se usan datos inventados de mock.

export interface FeatureItem {
  key: string
  title: string
  description: string
  accent: string
}

export const LANDING = {
  product: 'VitaCore',
  productSubline: 'Monitor',
  headline: 'Tu salud, monitoreada y protegida.',
  description:
    'Conecta tu wearable por Bluetooth y lleva tus signos vitales, alertas con IA y un historial verificable a un solo lugar.',
} as const

export const FEATURES: FeatureItem[] = [
  {
    key: 'vitals',
    title: 'Signos vitales en tiempo real',
    description: 'Frecuencia cardíaca, saturación de oxígeno y temperatura corporal con conexión Bluetooth.',
    accent: '#2DD4BF',
  },
  {
    key: 'ia',
    title: 'Alertas con nota de IA',
    description: 'Cada anomalía se acompaña de una explicación clínica generada por IA.',
    accent: '#A78BFA',
  },
  {
    key: 'blockchain',
    title: 'Historial verificable',
    description: 'Mediciones y alertas quedan registradas con un historial inmutable de eventos.',
    accent: '#FFB454',
  },
  {
    key: 'perfil',
    title: 'Perfil médico',
    description: 'Datos del paciente, dispositivo vinculado y ajustes de privacidad en un solo lugar.',
    accent: '#34D399',
  },
]