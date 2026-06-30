import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faChartLine, faCreditCard, faHeartbeat, faStethoscope, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const TrendingUp = (props: any) => <FontAwesomeIcon icon={faChartLine} {...props} />
const Users = (props: any) => <FontAwesomeIcon icon={faUsers} {...props} />
const Building2 = (props: any) => <FontAwesomeIcon icon={faBuilding} {...props} />
const Stethoscope = (props: any) => <FontAwesomeIcon icon={faStethoscope} {...props} />
const CreditCard = (props: any) => <FontAwesomeIcon icon={faCreditCard} {...props} />
const Activity = (props: any) => <FontAwesomeIcon icon={faHeartbeat} {...props} />

const monthlyGrowth = [
  { month: 'Jan', users: 200, revenue: 12000 },
  { month: 'Fév', users: 350, revenue: 15000 },
  { month: 'Mar', users: 500, revenue: 18000 },
  { month: 'Avr', users: 750, revenue: 22000 },
  { month: 'Mai', users: 900, revenue: 25000 },
  { month: 'Juin', users: 1200, revenue: 32000 },
]

const userByRole = [
  { name: 'Patients', value: 15000 },
  { name: 'Médecins', value: 2580 },
  { name: 'Hôpitaux', value: 156 },
  { name: 'Admins', value: 12 },
]

const monthlyAppointments = [
  { month: 'Jan', count: 1200 },
  { month: 'Fév', count: 1450 },
  { month: 'Mar', count: 1320 },
  { month: 'Avr', count: 1680 },
  { month: 'Mai', count: 1550 },
  { month: 'Juin', count: 1800 },
]

const COLORS = ['#2563eb', '#14b8a6', '#6366f1', '#f59e0b']

const statsCards = [
  { label: 'Croissance mensuelle', value: '+22%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Total utilisateurs', value: '17 748', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Hôpitaux actifs', value: '156', icon: Building2, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Médecins actifs', value: '2 580', icon: Stethoscope, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Revenu total', value: '124 000€', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Rendez-vous', value: '1 800/m', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
]

export default function AdminStatisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Statistiques</h1>
        <p className="text-slate-500 mt-1">Analyse détaillée de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {statsCards.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <p className="text-lg font-bold text-slate-900">{s.value}</p>
                <p className="text-[10px] text-slate-500">{s.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Croissance utilisateurs & revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} name="Utilisateurs" />
                  <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} name="Revenus (€)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Répartition par rôle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie data={userByRole} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={3}>
                    {userByRole.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 ml-4">
                {userByRole.map((r, i) => (
                  <div key={r.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-slate-600">{r.name}</span>
                    <span className="font-medium text-slate-900">{r.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Rendez-vous mensuels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAppointments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Rendez-vous" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
