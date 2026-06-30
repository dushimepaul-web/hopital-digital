import { Navigate, Outlet } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuthStore } from '@/stores/authStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faChartBar, faCheckSquare, faCog, faCreditCard, faGlobe, faStethoscope, faThLarge, faUsers } from '@fortawesome/free-solid-svg-icons'


import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminUsersPage from '@/pages/admin/AdminUsersPage'
import AdminHospitalsPage from '@/pages/admin/AdminHospitalsPage'
import AdminHospitalValidationPage from '@/pages/admin/AdminHospitalValidationPage'
import AdminDoctorsPage from '@/pages/admin/AdminDoctorsPage'
import AdminPaymentsPage from '@/pages/admin/AdminPaymentsPage'
import AdminSubscriptionsPage from '@/pages/admin/AdminSubscriptionsPage'
import AdminStatisticsPage from '@/pages/admin/AdminStatisticsPage'
import AdminSystemPage from '@/pages/admin/AdminSystemPage'

const LayoutDashboard = (props: any) => <FontAwesomeIcon icon={faThLarge} {...props} />
const Users = (props: any) => <FontAwesomeIcon icon={faUsers} {...props} />
const Building2 = (props: any) => <FontAwesomeIcon icon={faBuilding} {...props} />
const CheckSquare = (props: any) => <FontAwesomeIcon icon={faCheckSquare} {...props} />
const Stethoscope = (props: any) => <FontAwesomeIcon icon={faStethoscope} {...props} />
const CreditCard = (props: any) => <FontAwesomeIcon icon={faCreditCard} {...props} />
const Globe = (props: any) => <FontAwesomeIcon icon={faGlobe} {...props} />
const BarChart3 = (props: any) => <FontAwesomeIcon icon={faChartBar} {...props} />
const Settings = (props: any) => <FontAwesomeIcon icon={faCog} {...props} />

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
  { label: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
  { label: 'Utilisateurs', path: '/admin/users', icon: Users },
  { label: 'Hôpitaux', path: '/admin/hospitals', icon: Building2 },
  { label: 'Validations', path: '/admin/validations', icon: CheckSquare },
  { label: 'Médecins', path: '/admin/doctors', icon: Stethoscope },
  { label: 'Paiements', path: '/admin/payments', icon: CreditCard },
  { label: 'Abonnements', path: '/admin/subscriptions', icon: Globe },
  { label: 'Statistiques', path: '/admin/statistics', icon: BarChart3 },
  { label: 'Système', path: '/admin/system', icon: Settings },
]

export default [
  {
    element: <AuthGuard roles={['ADMIN', 'SUPER_ADMIN']} />,
    children: [
      {
        element: <DashboardLayout sidebarItems={sidebarItems} />,
        children: [
          { path: '/admin', element: <AdminDashboard /> },
          { path: '/admin/users', element: <AdminUsersPage /> },
          { path: '/admin/hospitals', element: <AdminHospitalsPage /> },
          { path: '/admin/validations', element: <AdminHospitalValidationPage /> },
          { path: '/admin/doctors', element: <AdminDoctorsPage /> },
          { path: '/admin/payments', element: <AdminPaymentsPage /> },
          { path: '/admin/subscriptions', element: <AdminSubscriptionsPage /> },
          { path: '/admin/statistics', element: <AdminStatisticsPage /> },
          { path: '/admin/system', element: <AdminSystemPage /> },
        ],
      },
    ],
  },
]
