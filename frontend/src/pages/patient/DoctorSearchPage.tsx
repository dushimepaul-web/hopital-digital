import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faChevronRight, faMapMarkerAlt, faSearch, faSpinner, faStar, faStethoscope } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useDoctors } from '@/hooks/useApi'

const specialties = [
  'Cardiologue', 'Dermatologue', 'Généraliste', 'Gynécologue',
  'Ophtalmologue', 'ORL', 'Pédiatre', 'Psychiatre', 'Chirurgien',
]

export default function DoctorSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const { data: doctors, isLoading, isError, refetch } = useDoctors({
    search: searchQuery || undefined,
    specialty: specialty || undefined,
  })

  const doctorList = Array.isArray(doctors) ? doctors : doctors?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Rechercher un médecin</h1>
        <p className="text-slate-500 mt-1">Trouvez le professionnel de santé qu'il vous faut</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom, spécialité..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full sm:w-44 rounded-lg border border-input bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Toutes spécialités</option>
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <Loading text="Recherche en cours..." />}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && doctorList.length === 0 && (
        <EmptyState
          icon={<FontAwesomeIcon icon={faStethoscope} className="h-8 w-8" />}
          title="Aucun résultat"
          description="Essayez de modifier vos critères de recherche."
        />
      )}

      {!isLoading && !isError && doctorList.length > 0 && (
        <div className="space-y-3">
          {doctorList.map((doctor: any) => (
            <Card key={doctor.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 flex-shrink-0">
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                      {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-sm text-primary-600 font-medium">
                          {doctor.specialty || 'Médecin généraliste'}
                        </p>
                      </div>
                      {doctor.rating && (
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faStar} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                      {doctor.hospitalName && (
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3" /> {doctor.hospitalName}
                        </span>
                      )}
                      {doctor.city && <span>{doctor.city}</span>}
                      {doctor.experience && <span>{doctor.experience} ans exp.</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" className="h-8 text-xs">
                        <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3 mr-1" />
                        Prendre RDV
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Voir profil
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
