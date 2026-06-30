import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faDatabase, faHdd, faHeartbeat, faServer, faShieldAlt, faSpinner, faSync, faWifi } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const systemMetrics = [
  { label: 'CPU', value: '23%', status: 'success' as const },
  { label: 'RAM', value: '4.2 GB / 16 GB', status: 'success' as const },
  { label: 'Disque', value: '45 GB / 200 GB', status: 'success' as const },
  { label: 'Base de données', value: 'Connectée', status: 'success' as const },
  { label: 'Redis', value: 'Connecté', status: 'success' as const },
  { label: 'API Status', value: '200 OK', status: 'success' as const },
]

const services = [
  { name: 'API REST', status: 'Opérationnel', uptime: '99.9%' },
  { name: 'Base de données', status: 'Opérationnel', uptime: '99.95%' },
  { name: 'File d\'attente', status: 'Opérationnel', uptime: '99.8%' },
  { name: 'Stockage fichiers', status: 'Opérationnel', uptime: '99.9%' },
  { name: 'WebSocket', status: 'Opérationnel', uptime: '99.7%' },
  { name: 'Email Service', status: 'Opérationnel', uptime: '99.5%' },
]

const recentLogs = [
  { level: 'INFO', message: 'Synchronisation base de données terminée', time: '12:34:22' },
  { level: 'WARN', message: 'Tentative de connexion échouée - IP bloquée', time: '11:15:03' },
  { level: 'INFO', message: 'Nouvel hôpital inscrit : CHU Nantes', time: '10:45:18' },
  { level: 'ERROR', message: 'Paiement échoué - timeout API bancaire', time: '09:22:45' },
  { level: 'INFO', message: 'Sauvegarde quotidienne terminée (2.4 GB)', time: '06:00:12' },
]

const levelColors: Record<string, 'default' | 'warning' | 'success' | 'destructive' | 'info'> = {
  INFO: 'info',
  WARN: 'warning',
  ERROR: 'destructive',
}

export default function AdminSystemPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Système</h1>
          <p className="text-slate-500 mt-1">Surveillance et configuration de la plateforme</p>
        </div>
        <Button variant="outline" size="sm">
          <FontAwesomeIcon icon={faSync} className="h-4 w-4 mr-1" />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {systemMetrics.map((m) => (
          <Card key={m.label} className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Badge variant={m.status} size="sm" className="mb-2">{m.label}</Badge>
              <p className="text-sm font-semibold text-slate-900">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FontAwesomeIcon icon={faServer} className="h-4 w-4 text-primary-600" />
              Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((s) => (
                <div key={s.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">Uptime: {s.uptime}</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">{s.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FontAwesomeIcon icon={faHeartbeat} className="h-4 w-4 text-primary-600" />
              Logs récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50">
                  <Badge variant={levelColors[log.level] || 'default'} size="sm" className="w-14 text-center">
                    {log.level}
                  </Badge>
                  <p className="text-xs text-slate-700 flex-1">{log.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FontAwesomeIcon icon={faCog} className="h-4 w-4 text-primary-600" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs font-medium text-slate-500 mb-1">Version</p>
              <p className="text-sm font-semibold text-slate-900">v1.0.0</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs font-medium text-slate-500 mb-1">Environnement</p>
              <p className="text-sm font-semibold text-slate-900">Production</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs font-medium text-slate-500 mb-1">Région</p>
              <p className="text-sm font-semibold text-slate-900">France (Paris)</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs font-medium text-slate-500 mb-1">Base de données</p>
              <p className="text-sm font-semibold text-slate-900">PostgreSQL 16</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs font-medium text-slate-500 mb-1">Cache</p>
              <p className="text-sm font-semibold text-slate-900">Redis 7.2</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs font-medium text-slate-500 mb-1">Dernière sauvegarde</p>
              <p className="text-sm font-semibold text-slate-900">{new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
