import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faChartLine, faCreditCard, faExclamationTriangle, faHeartbeat, faStethoscope, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading, ErrorState } from '@/components/ui/loading'
import { useAdminStatistics } from '@/hooks/useApi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Users = (props: any) => <FontAwesomeIcon icon={faUsers} {...props} />
const Stethoscope = (props: any) => <FontAwesomeIcon icon={faStethoscope} {...props} />
const CreditCard = (props: any) => <FontAwesomeIcon icon={faCreditCard} {...props} />

const chartData = [
  { month: 'Jan', revenus: 15000, utilisateurs: 1200 },
  { month: 'Fév', revenus: 18000, utilisateurs: 1400 },
  { month: 'Mar', revenus: 16500, utilisateurs: 1600 },
  { month: 'Avr', revenus: 22000, utilisateurs: 1900 },
  { month: 'Mai', revenus: 20500, utilisateurs: 2100 },
  { month: 'Juin', revenus: 28000, utilisateurs: 2500 },
]

export default function AdminDashboard() {
  const { data: stats, isLoading, isError, refetch } = useAdminStatistics()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">Vue d'ensemble de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-blue-600" />
              </div>
              <Badge variant="success" size="sm">+12%</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">2 450</p>
            <p className="text-xs text-slate-500">Utilisateurs</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 text-teal-600" />
              </div>
              <Badge variant="success" size="sm">+3</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">156</p>
            <p className="text-xs text-slate-500">Hôpitaux</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faStethoscope} className="h-5 w-5 text-indigo-600" />
              </div>
              <Badge variant="success" size="sm">+45</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">2 580</p>
            <p className="text-xs text-slate-500">Médecins</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faCreditCard} className="h-5 w-5 text-amber-600" />
              </div>
              <Badge variant="success" size="sm">+22%</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900">82 450€</p>
            <p className="text-xs text-slate-500">Revenus mensuels</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-primary-600" />
              Croissance plateforme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="utilisateurs" stroke="#2563eb" strokeWidth={2} name="Utilisateurs" />
                  <Line type="monotone" dataKey="revenus" stroke="#14b8a6" strokeWidth={2} name="Revenus (€)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FontAwesomeIcon icon={faHeartbeat} className="h-4 w-4 text-primary-600" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                <div>
                  <p className="text-sm text-slate-700">Nouvel hôpital inscrit : CHU Bordeaux</p>
                  <p className="text-xs text-slate-400">Il y a 30 min</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                <div>
                  <p className="text-sm text-slate-700">15 nouveaux médecins ajoutés</p>
                  <p className="text-xs text-slate-400">Il y a 2h</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5" />
                <div>
                  <p className="text-sm text-slate-700">Demande de validation en attente (3)</p>
                  <p className="text-xs text-slate-400">Il y a 4h</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                <div>
                  <p className="text-sm text-slate-700">Paiement échoué - Hôpital Saint-Martin</p>
                  <p className="text-xs text-slate-400">Il y a 1j</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
