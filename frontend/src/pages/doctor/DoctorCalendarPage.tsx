import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faChevronLeft, faChevronRight, faClock, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loading, EmptyState } from '@/components/ui/loading'
import { useAppointments } from '@/hooks/useApi'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function DoctorCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const { data: appointments } = useAppointments()
  const aptList = Array.isArray(appointments) ? appointments : appointments?.data ?? []

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDay = getDay(monthStart)

  const dayAppointments = aptList.filter((apt: any) =>
    isSameDay(new Date(apt.date), selectedDate)
  )

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Calendrier</h1>
        <p className="text-slate-500 mt-1">Visualisez et gérez votre agenda</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  {format(currentDate, 'MMMM yyyy', { locale: fr })}
                </h2>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                    <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                    <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-slate-500 py-2">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {days.map((day) => {
                  const hasAppointment = aptList.some((apt: any) =>
                    isSameDay(new Date(apt.date), day)
                  )
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`p-2 text-sm rounded-lg transition-colors text-center relative ${
                        isSameDay(day, selectedDate)
                          ? 'bg-primary-600 text-white'
                          : isSameDay(day, new Date())
                          ? 'bg-primary-50 text-primary-700'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {format(day, 'd')}
                      {hasAppointment && (
                        <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                          isSameDay(day, selectedDate) ? 'bg-white' : 'bg-primary-600'
                        }`} />
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 text-primary-600" />
                {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
              </h3>

              {dayAppointments.length === 0 ? (
                <EmptyState
                  icon={<FontAwesomeIcon icon={faCalendarAlt} className="h-6 w-6" />}
                  title="Aucun rendez-vous"
                  description="Ce jour est libre."
                />
              ) : (
                <div className="space-y-2">
                  {dayAppointments.map((apt: any) => (
                    <div key={apt.id} className="p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <FontAwesomeIcon icon={faClock} className="h-3 w-3 text-slate-400" />
                        {apt.time}
                      </div>
                      <p className="text-sm mt-1">
                        {apt.patientFirstName} {apt.patientLastName}
                      </p>
                      <p className="text-xs text-slate-500">{apt.reason || 'Consultation'}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                        statusColors[apt.status] || 'bg-slate-100 text-slate-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
