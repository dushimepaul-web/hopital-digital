import { Navigate, Outlet } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuthStore } from '@/stores/authStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCalendarAlt, faCommentDots, faCreditCard, faFileAlt, faSearch, faThLarge } from '@fortawesome/free-solid-svg-icons'

import PatientDashboard from '@/pages/patient/PatientDashboard'
import DoctorSearchPage from '@/pages/patient/DoctorSearchPage'
import PatientAppointmentsPage from '@/pages/patient/PatientAppointmentsPage'
import PatientChatPage from '@/pages/patient/PatientChatPage'
import PatientMedicalRecordsPage from '@/pages/patient/PatientMedicalRecordsPage'
import PatientPaymentsPage from '@/pages/patient/PatientPaymentsPage'
import PatientNotificationsPage from '@/pages/patient/PatientNotificationsPage'

const LayoutDashboard = (props: any) => <FontAwesomeIcon icon={faThLarge} {...props} />
const Search = (props: any) => <FontAwesomeIcon icon={faSearch} {...props} />
const Calendar = (props: any) => <FontAwesomeIcon icon={faCalendarAlt} {...props} />
const MessageSquare = (props: any) => <FontAwesomeIcon icon={faCommentDots} {...props} />
const FileText = (props: any) => <FontAwesomeIcon icon={faFileAlt} {...props} />
const CreditCard = (props: any) => <FontAwesomeIcon icon={faCreditCard} {...props} />
const Bell = (props: any) => <FontAwesomeIcon icon={faBell} {...props} />

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
  { label: 'Tableau de bord', path: '/patient', icon: LayoutDashboard },
  { label: 'Rechercher', path: '/patient/search', icon: Search },
  { label: 'Rendez-vous', path: '/patient/appointments', icon: Calendar },
  { label: 'Messagerie', path: '/patient/chat', icon: MessageSquare },
  { label: 'Dossiers médicaux', path: '/patient/records', icon: FileText },
  { label: 'Paiements', path: '/patient/payments', icon: CreditCard },
  { label: 'Notifications', path: '/patient/notifications', icon: Bell },
]

export default [
  {
    element: <AuthGuard roles={['PATIENT']} />,
    children: [
      {
        element: <DashboardLayout sidebarItems={sidebarItems} />,
        children: [
          { path: '/patient', element: <PatientDashboard /> },
          { path: '/patient/search', element: <DoctorSearchPage /> },
          { path: '/patient/appointments', element: <PatientAppointmentsPage /> },
          { path: '/patient/chat', element: <PatientChatPage /> },
          { path: '/patient/records', element: <PatientMedicalRecordsPage /> },
          { path: '/patient/payments', element: <PatientPaymentsPage /> },
          { path: '/patient/notifications', element: <PatientNotificationsPage /> },
        ],
      },
    ],
  },
]
