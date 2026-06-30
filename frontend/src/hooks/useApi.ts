import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import toast from 'react-hot-toast'

export function useHospitals(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.hospitals.list(params),
    queryFn: async () => {
      const response = await api.get('/hospitals', { params })
      return response.data
    },
  })
}

export function useHospital(id: string) {
  return useQuery({
    queryKey: queryKeys.hospitals.detail(id),
    queryFn: async () => {
      const response = await api.get(`/hospitals/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useDoctors(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.doctors.list(params),
    queryFn: async () => {
      const response = await api.get('/doctors', { params })
      return response.data
    },
  })
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: queryKeys.doctors.detail(id),
    queryFn: async () => {
      const response = await api.get(`/doctors/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useSearchDoctors(query: string) {
  return useQuery({
    queryKey: queryKeys.doctors.search(query),
    queryFn: async () => {
      const response = await api.get('/doctors/search', { params: { q: query } })
      return response.data
    },
    enabled: query.length > 0,
  })
}

export function useAppointments(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.appointments.list(params),
    queryFn: async () => {
      const response = await api.get('/appointments', { params })
      return response.data
    },
  })
}

export function useMyAppointments() {
  return useQuery({
    queryKey: queryKeys.appointments.myAppointments,
    queryFn: async () => {
      const response = await api.get('/appointments/my')
      return response.data
    },
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      doctorId: string
      hospitalId: string
      date: string
      time: string
      reason: string
    }) => {
      const response = await api.post('/appointments', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all })
      toast.success('Rendez-vous créé avec succès')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création')
    },
  })
}

export function useCancelAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/appointments/${id}/cancel`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all })
      toast.success('Rendez-vous annulé')
    },
  })
}

export function useMedicalRecords(patientId?: string) {
  return useQuery({
    queryKey: queryKeys.medicalRecords.list(patientId),
    queryFn: async () => {
      const response = await api.get('/medical-records', {
        params: patientId ? { patientId } : undefined,
      })
      return response.data
    },
  })
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: queryKeys.messages.list(conversationId),
    queryFn: async () => {
      const response = await api.get(`/messages/${conversationId}`)
      return response.data
    },
    enabled: !!conversationId,
  })
}

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.messages.conversations,
    queryFn: async () => {
      const response = await api.get('/messages/conversations')
      return response.data
    },
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      conversationId: string
      content: string
    }) => {
      const response = await api.post('/messages', data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.list(variables.conversationId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.conversations,
      })
    },
  })
}

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.list,
    queryFn: async () => {
      const response = await api.get('/notifications')
      return response.data
    },
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })
}

export function usePayments(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.payments.list(params),
    queryFn: async () => {
      const response = await api.get('/payments', { params })
      return response.data
    },
  })
}

export function useRevenue() {
  return useQuery({
    queryKey: queryKeys.payments.revenue,
    queryFn: async () => {
      const response = await api.get('/payments/revenue')
      return response.data
    },
  })
}

export function usePatients(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: async () => {
      const response = await api.get('/users/patients', { params })
      return response.data
    },
  })
}

export function usePendingHospitals() {
  return useQuery({
    queryKey: queryKeys.hospitals.pending,
    queryFn: async () => {
      const response = await api.get('/hospitals/pending')
      return response.data
    },
  })
}

export function useValidateHospital() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string
      action: 'approve' | 'reject'
    }) => {
      const response = await api.patch(`/hospitals/${id}/validate`, { action })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hospitals.all })
      toast.success('Hôpital mis à jour')
    },
  })
}

export function useUsers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: async () => {
      const response = await api.get('/users', { params })
      return response.data
    },
  })
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/users/${id}/toggle-status`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      toast.success('Statut mis à jour')
    },
  })
}

export function useAdminStatistics() {
  return useQuery({
    queryKey: queryKeys.statistics.admin,
    queryFn: async () => {
      const response = await api.get('/statistics/admin')
      return response.data
    },
  })
}

export function useServices(hospitalId?: string) {
  return useQuery({
    queryKey: queryKeys.services.list(hospitalId),
    queryFn: async () => {
      const response = await api.get('/services', {
        params: hospitalId ? { hospitalId } : undefined,
      })
      return response.data
    },
  })
}

export function useDepartments(hospitalId?: string) {
  return useQuery({
    queryKey: queryKeys.departments.list(hospitalId),
    queryFn: async () => {
      const response = await api.get('/departments', {
        params: hospitalId ? { hospitalId } : undefined,
      })
      return response.data
    },
  })
}

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: queryKeys.subscriptions.plans,
    queryFn: async () => {
      const response = await api.get('/subscriptions/plans')
      return response.data
    },
  })
}

export function useSubscriptions() {
  return useQuery({
    queryKey: queryKeys.subscriptions.list,
    queryFn: async () => {
      const response = await api.get('/subscriptions')
      return response.data
    },
  })
}
