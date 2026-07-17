export const DEFAULT_BUSINESS_HOURS = {
  MONDAY: { start: '09:00', end: '18:00' },
  TUESDAY: { start: '09:00', end: '18:00' },
  WEDNESDAY: { start: '09:00', end: '18:00' },
  THURSDAY: { start: '09:00', end: '18:00' },
  FRIDAY: { start: '09:00', end: '18:00' },
  SATURDAY: { start: '09:00', end: '16:00' },
  SUNDAY: null,
};

export const TIME_SLOT_INTERVAL = 30;

export const DEFAULT_SERVICES = [
  {
    name: 'Corte Masculino',
    description: 'Corte clássico para cavalheiros',
    duration: 45,
    price: '45.00',
    icon: 'Scissors',
  },
  {
    name: 'Barba',
    description: 'Aparagem e modelagem de barba',
    duration: 30,
    price: '30.00',
    icon: 'Zap',
  },
  {
    name: 'Corte e Barba',
    description: 'Serviço completo de corte e barba',
    duration: 60,
    price: '65.00',
    icon: 'Sparkles',
  },
  {
    name: 'Tratamento Capilar',
    description: 'Tratamento profissional para o cabelo',
    duration: 45,
    price: '55.00',
    icon: 'Droplets',
  },
  {
    name: 'Acabamento',
    description: 'Finalização e ajustes de detalhes',
    duration: 20,
    price: '20.00',
    icon: 'Check',
  },
];

export const APPOINTMENT_STATUSES = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
} as const;

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'E-mail ou senha incorretos',
  UNAUTHORIZED: 'Não autorizado',
  SERVICE_NOT_FOUND: 'Serviço não encontrado',
  SERVICE_INACTIVE: 'Serviço indisponível',
  APPOINTMENT_NOT_FOUND: 'Agendamento não encontrado',
  TIME_SLOT_UNAVAILABLE: 'Horário indisponível',
  INVALID_DATE: 'Data inválida',
  INVALID_PHONE: 'Telefone inválido',
  CONFLICT: 'Conflito de dados',
  INTERNAL_ERROR: 'Erro interno do servidor',
};