import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faChartLine, faCreditCard, faHeartbeat, faStethoscope, faUsers } from '@fortawesome/free-solid-svg-icons'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const Stethoscope = (props: any) => <FontAwesomeIcon icon={faStethoscope} {...props} />
const Users = (props: any) => <FontAwesomeIcon icon={faUsers} {...props} />
const Calendar = (props: any) => <FontAwesomeIcon icon={faCalendarAlt} {...props} />
const CreditCard = (props: any) => <FontAwesomeIcon icon={faCreditCard} {...props} />

const stats = [
  { label: 'Médecins', value: '15', icon: Stethoscope, change: '+2', color: 'text-primary-600', bg: 'bg-primary-50' },
  { label: 'Patients', value: '342', icon: Users, change: '+28', color: 'text-secondary-600', bg: 'bg-secondary-50' },
  { label: 'Rendez-vous', value: '48', icon: Calendar, change: '+12%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Revenus', value: '12 450€', icon: CreditCard, change: '+18%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
]

const chartData = [
  { name: 'Jan', consultations: 45, revenus: 4200 },
  { name: 'Fév', consultations: 52, revenus: 4800 },
  { name: 'Mar', consultations: 48, revenus: 4500 },
  { name: 'Avr', consultations: 61, revenus: 5600 },
  { name: 'Mai', consultations: 55, revenus: 5100 },
  { name: 'Juin', consultations: 68, revenus: 6200 },
]

export default function HospitalDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">Vue d'ensemble de votre établissement</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <Badge variant="success" size="sm">{s.change}</Badge>
                </div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-primary-600" />
              Évolution des consultations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="consultations" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb' }} />
                  <Line type="monotone" dataKey="revenus" stroke="#14b8a6" strokeWidth={2} dot={{ fill: '#14b8a6' }} />
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
              {[
                { text: 'Nouveau médecin inscrit : Dr. Martin', time: 'Il y a 2h' },
                { text: '3 nouveaux rendez-vous confirmés', time: 'Il y a 4h' },
                { text: 'Paiement reçu : 120€', time: 'Il y a 6h' },
                { text: 'Patient Mme Dubois a annulé son RDV', time: 'Il y a 1j' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-600 mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{item.text}</p>
                    <p className="text-xs text-slate-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
