import { Navigate, Outlet } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuthStore } from '@/stores/authStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faClipboardList, faCommentDots, faPills, faThLarge, faUsers, faVideo } from '@fortawesome/free-solid-svg-icons'


import DoctorDashboard from '@/pages/doctor/DoctorDashboard'
import DoctorPatientsPage from '@/pages/doctor/DoctorPatientsPage'
import DoctorConsultationsPage from '@/pages/doctor/DoctorConsultationsPage'
import DoctorPrescriptionsPage from '@/pages/doctor/DoctorPrescriptionsPage'
import DoctorCalendarPage from '@/pages/doctor/DoctorCalendarPage'
import DoctorMessagesPage from '@/pages/doctor/DoctorMessagesPage'

const LayoutDashboard = (props: any) => <FontAwesomeIcon icon={faThLarge} {...props} />
const Users = (props: any) => <FontAwesomeIcon icon={faUsers} {...props} />
const ClipboardList = (props: any) => <FontAwesomeIcon icon={faClipboardList} {...props} />
const Video = (props: any) => <FontAwesomeIcon icon={faVideo} {...props} />
const Pill = (props: any) => <FontAwesomeIcon icon={faPills} {...props} />
const Calendar = (props: any) => <FontAwesomeIcon icon={faCalendarAlt} {...props} />
const MessageSquare = (props: any) => <FontAwesomeIcon icon={faCommentDots} {...props} />

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
  { label: 'Tableau de bord', path: '/doctor', icon: LayoutDashboard },
  { label: 'Mes patients', path: '/doctor/patients', icon: Users },
  { label: 'Consultations', path: '/doctor/consultations', icon: ClipboardList },
  { label: 'Vidéo', path: '/doctor/video-call', icon: Video },
  { label: 'Prescriptions', path: '/doctor/prescriptions', icon: Pill },
  { label: 'Calendrier', path: '/doctor/calendar', icon: Calendar },
  { label: 'Messages', path: '/doctor/messages', icon: MessageSquare },
]

export default [
  {
    element: <AuthGuard roles={['DOCTOR']} />,
    children: [
      {
        element: <DashboardLayout sidebarItems={sidebarItems} />,
        children: [
          { path: '/doctor', element: <DoctorDashboard /> },
          { path: '/doctor/patients', element: <DoctorPatientsPage /> },
          { path: '/doctor/consultations', element: <DoctorConsultationsPage /> },
          { path: '/doctor/prescriptions', element: <DoctorPrescriptionsPage /> },
          { path: '/doctor/calendar', element: <DoctorCalendarPage /> },
          { path: '/doctor/video-call', element: <DoctorMessagesPage /> },
          { path: '/doctor/messages', element: <DoctorMessagesPage /> },
        ],
      },
    ],
  },
]
