import { Navigate, Outlet } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuthStore } from '@/stores/authStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faCalendarAlt, faChartBar, faCreditCard, faStethoscope, faThLarge, faUsers } from '@fortawesome/free-solid-svg-icons'


import HospitalDashboard from '@/pages/hospital/HospitalDashboard'
import HospitalDoctorsPage from '@/pages/hospital/HospitalDoctorsPage'
import HospitalPatientsPage from '@/pages/hospital/HospitalPatientsPage'
import HospitalServicesPage from '@/pages/hospital/HospitalServicesPage'
import HospitalAppointmentsPage from '@/pages/hospital/HospitalAppointmentsPage'
import HospitalPaymentsPage from '@/pages/hospital/HospitalPaymentsPage'
import HospitalReportsPage from '@/pages/hospital/HospitalReportsPage'

const LayoutDashboard = (props: any) => <FontAwesomeIcon icon={faThLarge} {...props} />
const Stethoscope = (props: any) => <FontAwesomeIcon icon={faStethoscope} {...props} />
const Users = (props: any) => <FontAwesomeIcon icon={faUsers} {...props} />
const Building2 = (props: any) => <FontAwesomeIcon icon={faBuilding} {...props} />
const Calendar = (props: any) => <FontAwesomeIcon icon={faCalendarAlt} {...props} />
const CreditCard = (props: any) => <FontAwesomeIcon icon={faCreditCard} {...props} />
const FileBarChart = (props: any) => <FontAwesomeIcon icon={faChartBar} {...props} />

function AuthGuard({ roles }: { roles: string[] }) {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)

  if (isLoading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />
  return <Outlet />
}

const sidebarItems = [
  { label: 'Tableau de bord', path: '/hospital', icon: LayoutDashboard },
  { label: 'Médecins', path: '/hospital/doctors', icon: Stethoscope },
  { label: 'Patients', path: '/hospital/patients', icon: Users },
  { label: 'Services', path: '/hospital/services', icon: Building2 },
  { label: 'Rendez-vous', path: '/hospital/appointments', icon: Calendar },
  { label: 'Paiements', path: '/hospital/payments', icon: CreditCard },
  { label: 'Rapports', path: '/hospital/reports', icon: FileBarChart },
]

export default [
  {
    element: <AuthGuard roles={['HOSPITAL_ADMIN']} />,
    children: [
      {
        element: <DashboardLayout sidebarItems={sidebarItems} />,
        children: [
          { path: '/hospital', element: <HospitalDashboard /> },
          { path: '/hospital/doctors', element: <HospitalDoctorsPage /> },
          { path: '/hospital/patients', element: <HospitalPatientsPage /> },
          { path: '/hospital/services', element: <HospitalServicesPage /> },
          { path: '/hospital/appointments', element: <HospitalAppointmentsPage /> },
          { path: '/hospital/payments', element: <HospitalPaymentsPage /> },
          { path: '/hospital/reports', element: <HospitalReportsPage /> },
        ],
      },
    ],
  },
]
