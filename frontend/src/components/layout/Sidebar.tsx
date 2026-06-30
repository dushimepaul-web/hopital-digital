import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export interface SidebarItem {
  label: string
  path: string
  icon: React.ElementType
  badge?: number | string
}

interface SidebarProps {
  items: SidebarItem[]
  collapsed?: boolean
  onClose?: () => void
}

export default function Sidebar({ items, collapsed, onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <nav className="space-y-1 px-3">
      {items.map((item) => {
        const isActive = location.pathname === item.path ||
          location.pathname.startsWith(item.path + '/')
        const Icon = item.icon

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            )}
          >
            <Icon className={cn(
              'h-5 w-5 flex-shrink-0',
              isActive ? 'text-primary-600' : 'text-slate-400'
            )} />
            {!collapsed && (
              <>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <Badge variant={isActive ? 'default' : 'secondary'} size="sm">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
