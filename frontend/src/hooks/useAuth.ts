import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const store = useAuthStore()

  useEffect(() => {
    store.initialize()
  }, [])

  return store
}

export function useUser() {
  const user = useAuthStore((state) => state.user)
  return user
}

export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated)
}

export function useHasRole(...roles: string[]) {
  const user = useAuthStore((state) => state.user)
  if (!user) return false
  return roles.includes(user.role)
}
