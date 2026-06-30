import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faEnvelope, faPhone, faSearch, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { usePatients } from '@/hooks/useApi'

export default function HospitalPatientsPage() {
  const [search, setSearch] = useState('')
  const { data: patients, isLoading, isError, refetch } = usePatients({ search: search || undefined })
  const list = Array.isArray(patients) ? patients : patients?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
        <p className="text-slate-500 mt-1">Liste des patients de votre établissement</p>
      </div>

      <div className="relative max-w-md">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un patient..." className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      {isLoading && <Loading text="Chargement..." />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && list.length === 0 && (
        <EmptyState icon={<FontAwesomeIcon icon={faUser} className="h-8 w-8" />} title="Aucun patient" description="Aucun patient n'est encore inscrit dans votre établissement." />
      )}

      {!isLoading && !isError && list.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((p: any) => (
            <Card key={p.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {p.firstName?.[0]}{p.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900">{p.firstName} {p.lastName}</h3>
                    <div className="text-xs text-slate-500 space-y-0.5 mt-1">
                      {p.email && <span className="flex items-center gap-1"><FontAwesomeIcon icon={faEnvelope} className="h-3 w-3" />{p.email}</span>}
                      {p.phone && <span className="flex items-center gap-1"><FontAwesomeIcon icon={faPhone} className="h-3 w-3" />{p.phone}</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Inscrit le {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                    </p>
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
