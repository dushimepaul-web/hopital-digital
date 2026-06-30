import PublicLayout from '@/components/layout/PublicLayout'
import HomePage from '@/pages/public/HomePage'
import LoginPage from '@/pages/public/LoginPage'
import RegisterPage from '@/pages/public/RegisterPage'
import HospitalsListPage from '@/pages/public/HospitalsListPage'
import HospitalDetailPage from '@/pages/public/HospitalDetailPage'
import DoctorsListPage from '@/pages/public/DoctorsListPage'
import AboutPage from '@/pages/public/AboutPage'
import HowItWorksPage from '@/pages/public/HowItWorksPage'
import ContactPage from '@/pages/public/ContactPage'
import FAQPage from '@/pages/public/FAQPage'

export default [
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/how-it-works', element: <HowItWorksPage /> },
      { path: '/hospitals', element: <HospitalsListPage /> },
      { path: '/hospitals/:id', element: <HospitalDetailPage /> },
      { path: '/doctors', element: <DoctorsListPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/faq', element: <FAQPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
]
