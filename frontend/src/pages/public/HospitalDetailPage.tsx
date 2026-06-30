import { useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBuilding, faCalendarAlt, faEnvelope, faGlobe, faMapMarkerAlt, faPhone, faShieldAlt, faSpinner, faStethoscope, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loading, ErrorState } from '@/components/ui/loading'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useHospital, useDoctors, useDepartments } from '@/hooks/useApi'

export default function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>()

  const {
    data: hospital,
    isLoading: hospitalLoading,
    isError: hospitalError,
    refetch: refetchHospital,
  } = useHospital(id!)
  const {
    data: doctors,
    isLoading: doctorsLoading,
  } = useDoctors({ hospitalId: id })
  const {
    data: departments,
  } = useDepartments(id)

  if (hospitalLoading) return <Loading fullPage text="Chargement de l'hôpital..." />
  if (hospitalError) return <ErrorState onRetry={refetchHospital} />
  if (!hospital) return null

  const doctorList = Array.isArray(doctors) ? doctors : doctors?.data ?? []
  const departmentList = Array.isArray(departments) ? departments : departments?.data ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/hospitals"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
        Retour aux hôpitaux
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faBuilding} className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {hospital.name}
                  </h1>
                  {hospital.isVerified && (
                    <Badge variant="success">
                      <FontAwesomeIcon icon={faShieldAlt} className="h-3 w-3 mr-1" />
                      Vérifié
                    </Badge>
                  )}
                </div>
                <p className="text-slate-600">{hospital.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-slate-600">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 text-slate-400" />
                {hospital.address}, {hospital.city}, {hospital.country || 'France'}
              </span>
              {hospital.phone && (
                <span className="flex items-center gap-1.5 text-slate-600">
                  <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-slate-400" />
                  {hospital.phone}
                </span>
              )}
              {hospital.email && (
                <span className="flex items-center gap-1.5 text-slate-600">
                  <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 text-slate-400" />
                  {hospital.email}
                </span>
              )}
              {hospital.website && (
                <span className="flex items-center gap-1.5 text-slate-600">
                  <FontAwesomeIcon icon={faGlobe} className="h-4 w-4 text-slate-400" />
                  {hospital.website}
                </span>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="h-5 w-5" />
                Services & Départements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {departmentList.length === 0 ? (
                <p className="text-sm text-slate-500">Aucun service renseigné</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {departmentList.map((dept: any) => (
                    <div
                      key={dept.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faBuilding} className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{dept.name}</p>
                        <p className="text-xs text-slate-500">{dept.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FontAwesomeIcon icon={faStethoscope} className="h-5 w-5" />
                Médecins ({doctorList.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {doctorsLoading ? (
                <Loading text="Chargement des médecins..." />
              ) : doctorList.length === 0 ? (
                <p className="text-sm text-slate-500">Aucun médecin pour le moment</p>
              ) : (
                <div className="space-y-3">
                  {doctorList.map((doctor: any) => (
                    <Link
                      key={doctor.id}
                      to={`/doctors?id=${doctor.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary-100 text-primary-700">
                          {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {doctor.specialty || 'Médecin généraliste'}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Voir le profil
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Prendre rendez-vous
                  </p>
                  <p className="text-xs text-slate-500">
                    Consultez les disponibilités
                  </p>
                </div>
              </div>
              <Link to={`/doctors?hospitalId=${id}`}>
                <Button className="w-full">
                  Voir les médecins disponibles
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-900 mb-3">Informations</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Médecins</span>
                  <span className="font-medium">{doctorList.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Services</span>
                  <span className="font-medium">{departmentList.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-slate-500">Statut</span>
                  <Badge variant={hospital.isActive ? 'success' : 'warning'} size="sm">
                    {hospital.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-xl overflow-hidden border bg-slate-100 h-48 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Carte interactive</p>
              <p className="text-xs">{hospital.city}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
