import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faChevronRight, faEnvelope, faPhone, faSearch, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { usePatients } from '@/hooks/useApi'

export default function DoctorPatientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: patients, isLoading, isError, refetch } = usePatients({ search: searchQuery || undefined })
  const patientList = Array.isArray(patients) ? patients : patients?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mes patients</h1>
        <p className="text-slate-500 mt-1">Gérez votre liste de patients</p>
      </div>

      <div className="relative max-w-md">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un patient..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {isLoading && <Loading text="Chargement des patients..." />}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && patientList.length === 0 && (
        <EmptyState
          icon={<FontAwesomeIcon icon={faUser} className="h-8 w-8" />}
          title="Aucun patient"
          description="La liste de vos patients apparaîtra ici."
        />
      )}

      {!isLoading && !isError && patientList.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {patientList.map((patient: any) => (
            <Card key={patient.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {patient.firstName?.[0]}{patient.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-slate-900">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                      {patient.email && (
                        <span className="flex items-center gap-1"><FontAwesomeIcon icon={faEnvelope} className="h-3 w-3" /> {patient.email}</span>
                      )}
                      {patient.phone && (
                        <span className="flex items-center gap-1"><FontAwesomeIcon icon={faPhone} className="h-3 w-3" /> {patient.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" className="h-8 text-xs">
                        <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3 mr-1" /> RDV
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        Dossier
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs">
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
