import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const faqs = [
  {
    category: 'Général',
    items: [
      {
        q: 'Qu\'est-ce que Hôpital Digital Network ?',
        a: 'Hôpital Digital Network est une plateforme qui connecte patients, médecins et hôpitaux pour simplifier le parcours de soins. Vous pouvez rechercher des professionnels de santé, prendre rendez-vous en ligne, communiquer avec votre médecin et accéder à vos dossiers médicaux.',
      },
      {
        q: 'Est-ce que le service est gratuit pour les patients ?',
        a: 'Oui, l\'inscription et la recherche de professionnels de santé sont entièrement gratuites pour les patients. Seules les consultations et services optionnels peuvent être payants.',
      },
      {
        q: 'Mes données de santé sont-elles sécurisées ?',
        a: 'Absolument. Nous utilisons un chiffrement de bout en bout et respectons les normes RGPD et hébergeons nos données en France. Votre vie privée est notre priorité.',
      },
    ],
  },
  {
    category: 'Compte & Inscription',
    items: [
      {
        q: 'Comment créer un compte ?',
        a: 'Cliquez sur "S\'inscrire" en haut de la page, choisissez votre profil (patient, médecin ou hôpital), et remplissez le formulaire d\'inscription. La création de compte ne prend que 2 minutes.',
      },
      {
        q: 'J\'ai oublié mon mot de passe, que faire ?',
        a: 'Sur la page de connexion, cliquez sur "Mot de passe oublié". Vous recevrez un email avec un lien pour réinitialiser votre mot de passe en toute sécurité.',
      },
      {
        q: 'Puis-je modifier mes informations personnelles ?',
        a: 'Oui, vous pouvez modifier vos informations à tout moment depuis votre espace personnel, dans la section "Mon profil".',
      },
    ],
  },
  {
    category: 'Rendez-vous',
    items: [
      {
        q: 'Comment prendre un rendez-vous ?',
        a: 'Recherchez un médecin ou un hôpital, consultez les disponibilités, choisissez un créneau qui vous convient et confirmez. Vous recevrez une confirmation immédiate.',
      },
      {
        q: 'Puis-je annuler ou modifier un rendez-vous ?',
        a: 'Oui, depuis votre espace patient, vous pouvez annuler ou modifier un rendez-vous jusqu\'à 24h avant la date prévue. Des frais peuvent s\'appliquer pour les annulations tardives.',
      },
      {
        q: 'Comment se passe une téléconsultation ?',
        a: 'Au moment du rendez-vous, connectez-vous à votre espace et cliquez sur le lien de visioconférence. Vous serez mis en relation avec votre médecin en vidéo.',
      },
    ],
  },
  {
    category: 'Médecins & Hôpitaux',
    items: [
      {
        q: 'Comment devenir médecin partenaire ?',
        a: 'Inscrivez-vous en tant que médecin, complétez votre profil professionnel et soumettez vos documents pour vérification. Une fois approuvé, vous pourrez recevoir des patients.',
      },
      {
        q: 'Comment ajouter mon hôpital sur la plateforme ?',
        a: 'Créez un compte hôpital et suivez le processus d\'inscription. Notre équipe validera votre établissement après vérification des documents requis.',
      },
      {
        q: 'Y a-t-il des frais pour les professionnels ?',
        a: 'Des formules d\'abonnement sont disponibles pour les médecins et hôpitaux, avec différents niveaux de fonctionnalités. Consultez notre page des tarifs pour plus d\'informations.',
      },
    ],
  },
  {
    category: 'Paiements',
    items: [
      {
        q: 'Quels moyens de paiement sont acceptés ?',
        a: 'Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal et les virements bancaires pour les abonnements professionnels.',
      },
      {
        q: 'Comment fonctionne le remboursement ?',
        a: 'Les consultations prises via la plateforme sont remboursées selon les conditions de votre assurance maladie. Une facture est générée automatiquement pour chaque consultation.',
      },
    ],
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(
      i =>
        i.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <Badge variant="secondary" size="lg" className="mb-4">FAQ</Badge>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Questions fréquentes
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Tout ce que vous devez savoir sur Hôpital Digital Network
        </p>

        <div className="relative max-w-md mx-auto">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une question..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="space-y-8">
        {filteredFaqs.map((category) => (
          <div key={category.category}>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {category.category}
            </h2>
            <div className="space-y-2">
              {category.items.map((faq, idx) => {
                const globalIdx = faqs.findIndex(c => c.category === category.category) * 100 + idx
                const isOpen = openIndex === globalIdx

                return (
                  <Card
                    key={idx}
                    className={cn(
                      'border transition-all duration-200 cursor-pointer',
                      isOpen ? 'shadow-md border-primary-200' : 'hover:shadow-sm'
                    )}
                    onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-5">
                        <h3 className="text-sm font-medium text-slate-900 pr-4">
                          {faq.q}
                        </h3>
                        <FontAwesomeIcon icon={faChevronDown}
                          className={cn(
                            'h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </div>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <div className="h-px bg-slate-100 mb-4" />
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
