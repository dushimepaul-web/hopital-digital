import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBell, faChevronDown, faChevronLeft, faCog, faSignOutAlt, faStethoscope, faTimes, faUser } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Sidebar, { type SidebarItem } from './Sidebar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface DashboardLayoutProps {
  sidebarItems: SidebarItem[]
}

export default function DashboardLayout({ sidebarItems }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '??'

  const roleLabels: Record<string, string> = {
    PATIENT: 'Patient',
    DOCTOR: 'Médecin',
    HOSPITAL_ADMIN: 'Hôpital Admin',
    ADMIN: 'Admin',
    SUPER_ADMIN: 'Super Admin',
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r shadow-sm transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          'hidden lg:flex'
        )}
      >
        <div className={cn(
          'flex h-16 items-center border-b px-4',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500">
                <FontAwesomeIcon icon={faStethoscope} className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-sm text-slate-900">
                HDN
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faChevronLeft} className={cn(
              'h-4 w-4 transition-transform',
              collapsed && 'rotate-180'
            )} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <Sidebar items={sidebarItems} collapsed={collapsed} />
        </div>

        <div className={cn(
          'border-t p-3',
          collapsed ? 'flex justify-center' : ''
        )}>
          <Dialog>
            <DialogTrigger asChild>
              <button className={cn(
                'flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors w-full',
                collapsed && 'justify-center'
              )}>
                <Avatar className="h-8 w-8">
                  {user?.avatar && <AvatarImage src={user.avatar} />}
                  <AvatarFallback className="text-xs bg-primary-100 text-primary-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user ? roleLabels[user.role] : ''}
                    </p>
                  </div>
                )}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[280px]">
              <DialogHeader>
                <DialogTitle className="text-center">
                  {user?.firstName} {user?.lastName}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                >
                  <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                  Mon profil
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                >
                  <FontAwesomeIcon icon={faCog} className="h-4 w-4" />
                  Paramètres
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      <div className={cn(
        'transition-all duration-300',
        'lg:ml-64',
        collapsed && 'lg:ml-16'
      )}>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-500">
                {user ? roleLabels[user.role] : ''}
              </p>
            </div>
            <Avatar className="h-9 w-9">
              {user?.avatar && <AvatarImage src={user.avatar} />}
              <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500">
                  <FontAwesomeIcon icon={faStethoscope} className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-sm">HôpitalDigital</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto py-4">
              <Sidebar
                items={sidebarItems}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
