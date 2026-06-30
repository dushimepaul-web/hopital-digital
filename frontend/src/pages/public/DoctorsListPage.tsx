import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faChevronRight, faFilter, faMapMarkerAlt, faSearch, faSpinner, faStar, faStethoscope } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useDoctors } from '@/hooks/useApi'

const specialties = [
  'Cardiologue',
  'Dermatologue',
  'Généraliste',
  'Gynécologue',
  'Ophtalmologue',
  'ORL',
  'Pédiatre',
  'Psychiatre',
  'Radiologue',
  'Rhumatologue',
  'Chirurgien',
  'Neurologue',
]

export default function DoctorsListPage() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState<string>('')

  const { data: doctors, isLoading, isError, refetch } = useDoctors({
    search: searchQuery || undefined,
    specialty: specialtyFilter || undefined,
    minRating: ratingFilter || undefined,
  })

  const doctorList = Array.isArray(doctors) ? doctors : doctors?.data ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Trouver un médecin
        </h1>
        <p className="text-slate-600">
          Recherchez parmi des milliers de professionnels de santé
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
                Filtres
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    Spécialité
                  </label>
                  <select
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Toutes les spécialités</option>
                    {specialties.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    Note minimum
                  </label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Toutes les notes</option>
                    <option value="5">5 étoiles</option>
                    <option value="4">4+ étoiles</option>
                    <option value="3">3+ étoiles</option>
                  </select>
                </div>

                {(specialtyFilter || ratingFilter) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      setSpecialtyFilter('')
                      setRatingFilter('')
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <div className="relative mb-6">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, spécialité..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {isLoading && <Loading text="Recherche des médecins..." />}

          {isError && <ErrorState onRetry={refetch} />}

          {!isLoading && !isError && doctorList.length === 0 && (
            <EmptyState
              icon={<FontAwesomeIcon icon={faStethoscope} className="h-8 w-8" />}
              title="Aucun médecin trouvé"
              description="Essayez de modifier vos critères de recherche."
            />
          )}

          {!isLoading && !isError && doctorList.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                {doctorList.length} médecin{doctorList.length > 1 ? 's' : ''} trouvé{doctorList.length > 1 ? 's' : ''}
              </p>
              {doctorList.map((doctor: any) => (
                <Card key={doctor.id} className="hover:shadow-md transition-all duration-200 border-0 shadow-sm">
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
                            <h3 className="text-lg font-semibold text-slate-900">
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
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                          {doctor.hospitalName && (
                            <span className="flex items-center gap-1">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3.5 w-3.5" />
                              {doctor.hospitalName}
                            </span>
                          )}
                          {doctor.city && (
                            <span>{doctor.city}</span>
                          )}
                          {doctor.experience && (
                            <span>{doctor.experience} ans d'expérience</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Button size="sm">
                            <FontAwesomeIcon icon={faCalendarAlt} className="h-3.5 w-3.5 mr-1.5" />
                            Prendre RDV
                          </Button>
                          <Button variant="outline" size="sm">
                            Voir le profil
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
      </div>
    </div>
  )
}
