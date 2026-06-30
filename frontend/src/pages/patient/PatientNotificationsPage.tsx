import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCalendarAlt, faCheckDouble, faCommentDots, faCreditCard, faFileAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useNotifications, useMarkNotificationRead } from '@/hooks/useApi'
import { cn } from '@/lib/utils'

const Calendar = (props: any) => <FontAwesomeIcon icon={faCalendarAlt} {...props} />
const MessageSquare = (props: any) => <FontAwesomeIcon icon={faCommentDots} {...props} />
const FileText = (props: any) => <FontAwesomeIcon icon={faFileAlt} {...props} />
const CreditCard = (props: any) => <FontAwesomeIcon icon={faCreditCard} {...props} />
const BellIcon = (props: any) => <FontAwesomeIcon icon={faBell} {...props} />

const typeIcons: Record<string, React.ElementType> = {
  APPOINTMENT: Calendar,
  MESSAGE: MessageSquare,
  MEDICAL_RECORD: FileText,
  PAYMENT: CreditCard,
}

const typeColors: Record<string, string> = {
  APPOINTMENT: 'text-primary-600 bg-primary-50',
  MESSAGE: 'text-indigo-600 bg-indigo-50',
  MEDICAL_RECORD: 'text-emerald-600 bg-emerald-50',
  PAYMENT: 'text-amber-600 bg-amber-50',
}

export default function PatientNotificationsPage() {
  const { data: notifications, isLoading, isError, refetch } = useNotifications()
  const markRead = useMarkNotificationRead()

  const notificationList = Array.isArray(notifications) ? notifications : notifications?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">Restez informé de vos activités</p>
        </div>
        {notificationList.some((n: any) => !n.read) && (
          <Button variant="outline" size="sm">
            <FontAwesomeIcon icon={faCheckDouble} className="h-4 w-4 mr-1" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {isLoading && <Loading text="Chargement des notifications..." />}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && notificationList.length === 0 && (
        <EmptyState
          icon={<FontAwesomeIcon icon={faBell} className="h-8 w-8" />}
          title="Aucune notification"
          description="Vous serez notifié ici des activités importantes."
        />
      )}

      {!isLoading && !isError && notificationList.length > 0 && (
        <div className="space-y-2">
          {notificationList.map((notif: any) => {
            const Icon = typeIcons[notif.type] || BellIcon
            return (
              <Card
                key={notif.id}
                className={cn(
                  'border transition-shadow cursor-pointer hover:shadow-sm',
                  !notif.read && 'border-l-4 border-l-primary-500 bg-primary-50/30'
                )}
                onClick={() => {
                  if (!notif.read) markRead.mutate(notif.id)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      typeColors[notif.type] || 'bg-slate-100 text-slate-600'
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm',
                        !notif.read ? 'font-semibold text-slate-900' : 'text-slate-600'
                      )}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(notif.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0 mt-2" />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
