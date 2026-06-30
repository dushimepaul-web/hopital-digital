import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots, faEnvelope, faMapMarkerAlt, faPaperPlane, faPhone, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import toast from 'react-hot-toast'

const Phone = (props: any) => <FontAwesomeIcon icon={faPhone} {...props} />
const Mail = (props: any) => <FontAwesomeIcon icon={faEnvelope} {...props} />
const MapPin = (props: any) => <FontAwesomeIcon icon={faMapMarkerAlt} {...props} />

const contactInfo = [
  { icon: Phone, label: 'Téléphone', value: '+33 1 23 45 67 89', href: 'tel:+33123456789' },
  { icon: Mail, label: 'Email', value: 'contact@hopitaldigital.fr', href: 'mailto:contact@hopitaldigital.fr' },
  { icon: MapPin, label: 'Adresse', value: '42 Avenue de la Santé, 75012 Paris' },
]

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Message envoyé ! Nous vous répondrons rapidement.')
    setSubmitting(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <Badge variant="secondary" size="lg" className="mb-4">Contact</Badge>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Contactez-nous
        </h1>
        <p className="text-lg text-slate-600">
          Une question ? Notre équipe est là pour vous répondre
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Prénom" placeholder="Jean" required />
                  <Input label="Nom" placeholder="Dupont" required />
                </div>
                <Input label="Email" type="email" placeholder="jean@exemple.com" required />
                <Input label="Sujet" placeholder="Objet de votre message" />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Votre message..."
                    className="flex w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4 mr-2" />
                  )}
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {contactInfo.map((item) => {
            const Icon = item.icon
            const Wrapper = item.href ? 'a' : 'div'
            return (
              <Card key={item.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <Wrapper
                    href={item.href as any}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="text-sm font-medium text-slate-900">{item.value}</p>
                    </div>
                  </Wrapper>
                </CardContent>
              </Card>
            )
          })}

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Horaires</h3>
              <div className="space-y-1 text-sm text-slate-600">
                <p>Lun - Ven : 9h00 - 19h00</p>
                <p>Sam : 10h00 - 17h00</p>
                <p className="text-xs text-slate-400 mt-1">Fermé le dimanche</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
