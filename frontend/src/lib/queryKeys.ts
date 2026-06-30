export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  users: {
    all: ['users'] as const,
    list: (params?: Record<string, unknown>) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', id] as const,
  },
  doctors: {
    all: ['doctors'] as const,
    list: (params?: Record<string, unknown>) => ['doctors', 'list', params] as const,
    detail: (id: string) => ['doctors', id] as const,
    search: (query: string) => ['doctors', 'search', query] as const,
  },
  hospitals: {
    all: ['hospitals'] as const,
    list: (params?: Record<string, unknown>) => ['hospitals', 'list', params] as const,
    detail: (id: string) => ['hospitals', id] as const,
    pending: ['hospitals', 'pending'] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    list: (params?: Record<string, unknown>) => ['appointments', 'list', params] as const,
    detail: (id: string) => ['appointments', id] as const,
    myAppointments: ['appointments', 'my'] as const,
  },
  medicalRecords: {
    all: ['medicalRecords'] as const,
    list: (patientId?: string) => ['medicalRecords', 'list', patientId] as const,
    detail: (id: string) => ['medicalRecords', id] as const,
  },
  prescriptions: {
    all: ['prescriptions'] as const,
    list: (params?: Record<string, unknown>) => ['prescriptions', 'list', params] as const,
    detail: (id: string) => ['prescriptions', id] as const,
  },
  messages: {
    all: ['messages'] as const,
    list: (conversationId: string) => ['messages', conversationId] as const,
    conversations: ['messages', 'conversations'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: ['notifications', 'list'] as const,
  },
  payments: {
    all: ['payments'] as const,
    list: (params?: Record<string, unknown>) => ['payments', 'list', params] as const,
    detail: (id: string) => ['payments', id] as const,
    revenue: ['payments', 'revenue'] as const,
  },
  subscriptions: {
    all: ['subscriptions'] as const,
    list: ['subscriptions', 'list'] as const,
    plans: ['subscriptions', 'plans'] as const,
  },
  statistics: {
    admin: ['statistics', 'admin'] as const,
    hospital: (id: string) => ['statistics', 'hospital', id] as const,
    doctor: (id: string) => ['statistics', 'doctor', id] as const,
    patient: (id: string) => ['statistics', 'patient', id] as const,
  },
  services: {
    all: ['services'] as const,
    list: (hospitalId?: string) => ['services', 'list', hospitalId] as const,
  },
  departments: {
    all: ['departments'] as const,
    list: (hospitalId?: string) => ['departments', 'list', hospitalId] as const,
  },
}
