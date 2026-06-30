import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faChartBar, faChartLine, faCreditCard, faDownload, faStethoscope, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const consultationData = [
  { month: 'Jan', consultations: 120 },
  { month: 'Fév', consultations: 145 },
  { month: 'Mar', consultations: 132 },
  { month: 'Avr', consultations: 168 },
  { month: 'Mai', consultations: 155 },
  { month: 'Juin', consultations: 180 },
]

const specialtyData = [
  { name: 'Cardiologie', value: 35 },
  { name: 'Pédiatrie', value: 25 },
  { name: 'Généraliste', value: 40 },
  { name: 'Ophtalmo', value: 20 },
]

const COLORS = ['#2563eb', '#14b8a6', '#6366f1', '#f59e0b']

const reports = [
  { title: 'Rapport mensuel - Juin 2024', date: '30/06/2024', type: 'PDF', size: '2.4 MB' },
  { title: 'Rapport financier Q2 2024', date: '01/07/2024', type: 'XLSX', size: '1.8 MB' },
  { title: 'Statistiques d\'activité', date: '15/06/2024', type: 'PDF', size: '3.1 MB' },
  { title: 'Rapport de performance', date: '01/06/2024', type: 'PDF', size: '1.5 MB' },
]

export default function HospitalReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Rapports</h1>
        <p className="text-slate-500 mt-1">Analyses et statistiques détaillées</p>
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
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consultationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="consultations" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FontAwesomeIcon icon={faStethoscope} className="h-4 w-4 text-primary-600" />
              Répartition par spécialité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={specialtyData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                    {specialtyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 ml-2">
                {specialtyData.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-slate-600">{s.name}</span>
                    <span className="font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FontAwesomeIcon icon={faChartBar} className="h-4 w-4 text-primary-600" />
            Rapports disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <FontAwesomeIcon icon={faChartBar} className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{r.title}</p>
                    <p className="text-xs text-slate-500">{r.date} • {r.type} • {r.size}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-1" />
                  Télécharger
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
