import { useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import publicRoutes from '@/routes/PublicRoutes'
import patientRoutes from '@/routes/PatientRoutes'
import doctorRoutes from '@/routes/DoctorRoutes'
import hospitalRoutes from '@/routes/HospitalRoutes'
import adminRoutes from '@/routes/AdminRoutes'

export default function App() {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  const routing = useRoutes([
    ...publicRoutes,
    ...patientRoutes,
    ...doctorRoutes,
    ...hospitalRoutes,
    ...adminRoutes,
  ])

  return routing
}
