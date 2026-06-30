import { create } from 'zustand'
import api from '@/lib/axios'

export type UserRole = 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN' | 'ADMIN' | 'SUPER_ADMIN'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
  isActive: boolean
  isVerified: boolean
  avatar?: string
  createdAt: string
  hospitalId?: string
  specialty?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  register: (data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    role: UserRole
  }) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  loadUser: () => Promise<void>
  initialize: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    const token = localStorage.getItem('accessToken')
    const refresh = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')

    if (token && refresh && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User
        set({
          accessToken: token,
          refreshToken: refresh,
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        set({ isLoading: false })
      }
    } else {
      set({ isLoading: false })
    }
  },

  login: async (email: string, password: string, role: UserRole) => {
    const response = await api.post('/auth/login', { email, password, role })
    const { user, accessToken, refreshToken } = response.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))

    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    })
  },

  register: async (data) => {
    const response = await api.post('/auth/register', data)
    const { user, accessToken, refreshToken } = response.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))

    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    })

    window.location.href = '/login'
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },

  loadUser: async () => {
    try {
      const response = await api.get('/auth/me')
      const user = response.data as User
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, isAuthenticated: true })
    } catch {
      get().logout()
    }
  },
}))
