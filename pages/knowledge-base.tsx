import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useTranslation } from '../contexts/TranslationContext'
import { 
  BookOpenIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  XMarkIcon,
  ChevronRightIcon,
  HashtagIcon,
  CommandLineIcon,
  SparklesIcon,
  RocketLaunchIcon,
  BeakerIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

// Sidebar sections with nested articles
const getSections = (t) => [
  {
    id: 'getting-started',
    title: t('knowledgeBase.categories.gettingStarted'),
    icon: RocketLaunchIcon,
    color: 'bg-green-50 text-green-600',
    articles: [
      { id: 'welcome', title: t('knowledgeBase.articles.welcome'), icon: SparklesIcon },
      { id: 'first-restaurant', title: t('knowledgeBase.articles.firstRestaurant'), icon: BookOpenIcon },
      { id: 'team-roles', title: t('knowledgeBase.articles.teamRoles'), icon: ShieldCheckIcon },
    ]
  },
  {
    id: 'onboarding',
    title: t('knowledgeBase.categories.restaurants'),
    icon: AcademicCapIcon,
    color: 'bg-purple-50 text-purple-700',
    articles: [
      { id: 'onboard-guide', title: t('knowledgeBase.articles.onboardGuide'), icon: ClipboardDocumentCheckIcon },
      { id: 'personnel-setup', title: t('knowledgeBase.articles.personnelSetup'), icon: UserGroupIcon },
      { id: 'stripe-connect', title: t('knowledgeBase.articles.stripeSetup'), icon: CreditCardIcon },
      { id: 'pos-integration', title: t('knowledgeBase.articles.posIntegration'), icon: DevicePhoneMobileIcon },
    ]
  },
  {
    id: 'pos-systems',
    title: t('knowledgeBase.categories.posSystems'),
    icon: DevicePhoneMobileIcon,
    color: 'bg-cyan-50 text-cyan-700',
    articles: [
      { id: 'untill-setup', title: t('knowledgeBase.articles.untillSetup'), icon: CommandLineIcon },
      { id: 'lightspeed-setup', title: t('knowledgeBase.articles.lightspeedSetup'), icon: CommandLineIcon },
      { id: 'pos-troubleshooting', title: t('knowledgeBase.articles.posTroubleshooting'), icon: ExclamationTriangleIcon },
    ]
  },
  {
    id: 'payments',
    title: t('knowledgeBase.categories.payments'),
    icon: CreditCardIcon,
    color: 'bg-pink-50 text-pink-700',
    articles: [
      { id: 'payment-flow', title: t('knowledgeBase.articles.paymentFlow'), icon: ArrowRightIcon },
      { id: 'stripe-dashboard', title: t('knowledgeBase.articles.stripeDashboard'), icon: DocumentTextIcon },
      { id: 'refunds', title: t('knowledgeBase.articles.refunds'), icon: ExclamationTriangleIcon },
    ]
  },
  {
    id: 'support',
    title: t('knowledgeBase.categories.supportProcedures'),
    icon: ChatBubbleLeftRightIcon,
    color: 'bg-red-50 text-red-700',
    articles: [
      { id: 'ticket-system', title: t('knowledgeBase.articles.ticketSystem'), icon: HashtagIcon },
      { id: 'escalation', title: t('knowledgeBase.articles.escalation'), icon: ArrowRightIcon },
      { id: 'common-issues', title: t('knowledgeBase.articles.commonIssues'), icon: BeakerIcon },
    ]
  },
  {
    id: 'faq',
    title: t('knowledgeBase.categories.faqTips'),
    icon: QuestionMarkCircleIcon,
    color: 'bg-yellow-50 text-yellow-700',
    articles: [
      { id: 'restaurant-faq', title: t('knowledgeBase.articles.restaurantFaq'), icon: QuestionMarkCircleIcon },
      { id: 'technical-faq', title: t('knowledgeBase.articles.technicalFaq'), icon: CommandLineIcon },
      { id: 'best-practices', title: t('knowledgeBase.articles.bestPractices'), icon: LightBulbIcon },
    ]
  },
]

// Article content mapping
const articleContent = {
  'welcome': {
    title: 'Welcome to Splitty Knowledge Base',
    content: `# Welkom bij de Splitty Knowledge Base

Dit is je centrale hub voor alle informatie over Splitty operations. Hier vind je alles wat je nodig hebt om restaurants succesvol te onboarden en te ondersteunen.

## Waar te beginnen?

### Voor nieuwe teamleden
1. Lees eerst de **Team Rollen & Permissies** guide
2. Doorloop de **Getting Started** sectie
3. Bekijk de **Common Issues** voor veel voorkomende problemen

### Voor ervaren teamleden
- Check regelmatig de **Best Practices** voor updates
- Gebruik de zoekfunctie voor specifieke onderwerpen
- Draag bij aan de KB door feedback te geven

## Quick Links
- **Urgent Support**: Check de Escalatie Procedures
- **Nieuwe Restaurant**: Start met Complete Onboarding Guide
- **POS Issues**: Ga direct naar POS Troubleshooting

💡 **Pro Tip**: Gebruik Cmd/Ctrl + K voor snelle zoekacties!`
  },
  'first-restaurant': {
    title: 'Je Eerste Restaurant Toevoegen',
    content: `# Je Eerste Restaurant Toevoegen

## Stap 1: Restaurant Basis Informatie
1. Ga naar **Restaurants** in het hoofdmenu
2. Klik op **Nieuw Restaurant**
3. Vul de basis informatie in:
   - Restaurant naam
   - Adres gegevens
   - Contact informatie
   - Upload logo (optioneel)

## Stap 2: Service Fee Instellen
- Standaard: 3% per transactie
- Premium restaurants: 2.5%
- High-volume: Onderhandelbaar

## Stap 3: Start Onboarding
Na het toevoegen van het restaurant:
1. Klik op **Start Onboarding**
2. Volg de 3-stap wizard
3. Zorg dat alle stappen groen zijn

## Belangrijk
- Test altijd met een kleine transactie
- Verifieer alle gegevens dubbel
- Documenteer speciale afspraken`
  },
  'onboard-guide': {
    title: 'Complete Onboarding Guide',
    content: `# Restaurant Onboarding Guide

## Overzicht
Het onboarden van een nieuw restaurant bestaat uit 3 hoofdstappen die in volgorde moeten worden uitgevoerd.

## Stap 1: Personeel Toevoegen
1. Ga naar het restaurant profiel
2. Klik op "Beheer Personeel"
3. Voeg minimaal één restaurant manager toe
4. Voeg eventueel extra staff toe

### Tips:
- Zorg dat de manager een sterk wachtwoord krijgt
- Noteer alle toegevoegde gebruikers

## Stap 2: Stripe Koppelen
1. Zorg dat je de Stripe account gegevens hebt
2. Klik op "Stripe Koppelen" in de onboarding
3. Volg de Stripe Connect flow
4. Verifieer dat de koppeling succesvol is

## Stap 3: POS API Configureren
1. Vraag de POS credentials op bij het restaurant
2. Selecteer het juiste POS systeem (Untill, Lightspeed, etc.)
3. Vul de API gegevens in
4. Test de verbinding

## Belangrijk
- Voltooi alle stappen voordat het restaurant live gaat
- Test altijd een proef bestelling
- Documenteer alle instellingen`
  },
  'stripe-connect': {
    title: 'Stripe Connect Setup',
    content: `# Stripe Setup Guide

## Voorbereidingen
1. Zorg dat het restaurant een Stripe account heeft
2. Verzamel de benodigde documenten:
   - KvK uittreksel
   - Bank gegevens
   - ID bewijs eigenaar

## Stripe Connect Flow
1. Start de Stripe Connect onboarding
2. Vul bedrijfsgegevens in
3. Voeg bank informatie toe
4. Voltooi identity verification
5. Wacht op Stripe goedkeuring

## Service Fees Instellen
- Standaard: 3% van elke transactie
- Premium restaurants: 2.5%
- High-volume: Onderhandelbaar

## Troubleshooting
- **Error: Account not verified**
  - Check document uploads
  - Verify bank account
  
- **Error: Payments disabled**
  - Contact Stripe support
  - Check for compliance issues`
  },
  'untill-setup': {
    title: 'Untill API Setup',
    content: `# Untill POS Integration

## API Credentials
Voor Untill heb je nodig:
- Base URL (bijv: https://api.untill.com/v2/)
- Username
- Password
- API Code (unieke identifier)

## Configuratie Stappen
1. Log in op Untill backoffice
2. Ga naar API Settings
3. Genereer nieuwe API credentials
4. Kopieer de gegevens naar Splitty

## API Endpoints
- **/orders** - Haal bestellingen op
- **/tables** - Tafel informatie
- **/payments** - Betaalstatus

## Common Issues
- **401 Unauthorized**: Check credentials
- **500 Server Error**: Untill server issue
- **Timeout**: Check base URL`
  },
  'common-issues': {
    title: 'Veelvoorkomende Issues',
    content: `# Troubleshooting Guide

## Betaal Problemen

### "Betaling Mislukt"
1. Check Stripe dashboard
2. Verifieer restaurant Stripe status
3. Controleer service fee settings

### "Kan niet splitten"
1. Check tafel status
2. Verifieer POS sync
3. Clear browser cache

## POS Sync Issues

### "Orders komen niet binnen"
1. Test POS connectie
2. Check API credentials
3. Verify webhook URLs
4. Monitor error logs

### "Tafel status incorrect"
1. Force sync vanaf POS
2. Check table mapping
3. Clear local cache

## Login Problemen

### "Kan niet inloggen"
1. Reset wachtwoord
2. Check user status
3. Verify restaurant active
4. Clear cookies`
  },
  'best-practices': {
    title: 'Best Practices',
    content: `# Best Practices voor Splitty Team

## Onboarding
- Plan altijd een demo na onboarding
- Maak een test bestelling voor go-live
- Documenteer speciale configuraties
- Deel tips voor piekmomenten

## Support
- Respond altijd binnen SLA
- Escaleer tijdig bij complexe issues
- Documenteer oplossingen in KB
- Vraag feedback na oplossing

## Relatiebeheer
- Maandelijkse check-ins met grote klanten
- Quarterly business reviews
- Proactief nieuwe features delen
- Verzamel continue feedback

## Security
- Deel nooit wachtwoorden via email
- Gebruik altijd 2FA waar mogelijk
- Rotate API keys regelmatig
- Monitor verdachte activiteit`
  },
}

const KnowledgeBase: NextPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSection, setSelectedSection] = useState('getting-started')
  const [selectedArticle, setSelectedArticle] = useState('welcome')
  const [expandedSections, setExpandedSections] = useState(['getting-started'])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  // Get current article content
  const currentArticle = articleContent[selectedArticle] || articleContent['welcome']

  const sections = getSections(t)
  
  // Filter sections and articles based on search
  const filteredSections = sections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.articles.length > 0
  )

  const renderArticleContent = (content) => {
    return content.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={index} className={`text-2xl font-bold mb-4 mt-6 ${false ? 'text-white' : 'text-gray-900'}`}>{line.substring(2)}</h1>
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className={`text-xl font-semibold mb-3 mt-5 ${false ? 'text-white' : 'text-gray-900'}`}>{line.substring(3)}</h2>
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className={`text-lg font-medium mb-2 mt-4 ${false ? 'text-white' : 'text-gray-900'}`}>{line.substring(4)}</h3>
      }
      
      // Bold text
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <p key={index} className={`mb-2 ${false ? 'text-[#BBBECC]' : 'text-gray-600'}`}>
            {parts.map((part, i) => 
              i % 2 === 0 ? part : <strong key={i} className={`font-semibold ${false ? 'text-white' : 'text-gray-900'}`}>{part}</strong>
            )}
          </p>
        )
      }
      
      // Bullet points
      if (line.startsWith('- ')) {
        return (
          <li key={index} className={`mb-1 ml-6 list-disc ${false ? 'text-[#BBBECC]' : 'text-gray-600'}`}>
            {line.substring(2)}
          </li>
        )
      }
      
      // Numbered lists
      if (line.match(/^\d+\. /)) {
        return (
          <li key={index} className={`mb-1 ml-6 list-decimal ${false ? 'text-[#BBBECC]' : 'text-gray-600'}`}>
            {line.substring(line.indexOf('. ') + 2)}
          </li>
        )
      }
      
      // Code blocks
      if (line.startsWith('`') && line.endsWith('`') && line.length > 2) {
        return (
          <code key={index} className={`inline-block px-2 py-1 rounded text-sm mb-2 ${
            false ? 'bg-[#0A0B0F] text-[#2BE89A]' : 'bg-gray-100 text-green-600'
          }`}>
            {line.substring(1, line.length - 1)}
          </code>
        )
      }
      
      // Regular paragraphs
      if (line.trim()) {
        return <p key={index} className={`mb-2 ${false ? 'text-[#BBBECC]' : 'text-gray-600'}`}>{line}</p>
      }
      
      return <br key={index} />
    })
  }

  return (
    <Layout>
      <div className={`min-h-screen ${false ? 'bg-[#0A0B0F]' : 'bg-[#F9FAFB]'}`}>
        {/* Mobile header */}
        <div className={`lg:hidden p-4 border-b ${
          false ? 'bg-[#1c1e27] border-[#2a2d3a]' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold flex items-center ${
              false ? 'text-white' : 'text-gray-900'
            }`}>
              <BookOpenIcon className={`h-6 w-6 mr-2 ${
                false ? 'text-[#2BE89A]' : 'text-green-600'
              }`} />
              {t('knowledgeBase.title')}
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg border transition-colors ${
                false 
                  ? 'bg-[#0A0B0F] border-[#2a2d3a] hover:bg-[#1c1e27]'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ChevronRightIcon className={`h-5 w-5 transition-transform ${
                false ? 'text-white' : 'text-gray-600'
              } ${sidebarOpen ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex relative" style={{ height: 'calc(100vh - 72px)' }}>
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-80 flex-shrink-0 h-full overflow-y-auto border-r ${
            false 
              ? 'bg-[#1c1e27] border-[#2a2d3a]'
              : 'bg-white border-gray-200'
          }`}>
            <div className="p-4 lg:p-6">
              {/* Header - verberg op mobile want we hebben al een header */}
              <div className="mb-6 hidden lg:block">
                <h2 className={`text-xl font-bold flex items-center ${
                  false ? 'text-white' : 'text-gray-900'
                }`}>
                  <BookOpenIcon className={`h-6 w-6 mr-2 ${
                    false ? 'text-[#2BE89A]' : 'text-green-600'
                  }`} />
                  {t('knowledgeBase.title')}
                </h2>
                <p className={`text-sm mt-1 ${
                  false ? 'text-[#BBBECC]' : 'text-gray-600'
                }`}>{t('knowledgeBase.subtitle')}</p>
              </div>

            {/* Search */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className={`h-4 w-4 ${
                  false ? 'text-[#BBBECC]' : 'text-gray-400'
                }`} />
              </div>
              <input
                type="search"
                className={`block w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition ${
                  false
                    ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
                }`}
                placeholder={t('knowledgeBase.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Navigation Sections */}
            <nav className="space-y-2">
              {filteredSections.map((section) => (
                <div key={section.id} className="mb-1">
                  <button
                    onClick={() => {
                      setSelectedSection(section.id)
                      toggleSection(section.id)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                      selectedSection === section.id
                        ? section.color
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
{section.icon && React.createElement(section.icon, { className: `h-5 w-5 mr-3 ${selectedSection === section.id ? '' : 'text-gray-500'}` })}
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                    <ChevronRightIcon className={`h-4 w-4 transition-transform ${
                      expandedSections.includes(section.id) ? 'rotate-90' : ''
                    }`} />
                  </button>
                  
                  {/* Articles */}
                  {expandedSections.includes(section.id) && (
                    <div className="mt-1 ml-4 space-y-0.5">
                      {section.articles.map((article) => (
                        <button
                          key={article.id}
                          onClick={() => {
                            setSelectedArticle(article.id)
                            setSidebarOpen(false)
                          }}
                          className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition ${
                            selectedArticle === article.id
                              ? false
                                ? 'bg-[#0A0B0F] text-white'
                                : 'bg-gray-100 text-gray-900'
                              : false
                                ? 'text-[#BBBECC] hover:bg-[#0A0B0F] hover:text-white'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
{article.icon && React.createElement(article.icon, { className: "h-4 w-4 mr-2.5" })}
                          <span>{article.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Quick Stats */}
            <div className={`mt-8 p-4 rounded-lg border ${
              false 
                ? 'bg-[#0A0B0F] border-[#2a2d3a]'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`text-xs mb-3 ${
                false ? 'text-[#BBBECC]' : 'text-gray-600'
              }`}>{t('knowledgeBase.quickStats.title')}</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${
                    false ? 'text-[#BBBECC]' : 'text-gray-500'
                  }`}>{t('knowledgeBase.quickStats.totalArticles')}</span>
                  <span className={`text-sm font-medium ${
                    false ? 'text-white' : 'text-gray-900'
                  }`}>
                    {sections.reduce((acc, s) => acc + s.articles.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${
                    false ? 'text-[#BBBECC]' : 'text-gray-500'
                  }`}>{t('knowledgeBase.quickStats.categories')}</span>
                  <span className={`text-sm font-medium ${
                    false ? 'text-white' : 'text-gray-900'
                  }`}>{sections.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${
                    false ? 'text-[#BBBECC]' : 'text-gray-500'
                  }`}>{t('knowledgeBase.quickStats.lastUpdate')}</span>
                  <span className={`text-sm font-medium ${
                    false ? 'text-[#2BE89A]' : 'text-green-600'
                  }`}>{t('knowledgeBase.quickStats.today')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Main Content */}
          <div className={`flex-1 overflow-y-auto ${
            false ? 'bg-[#0A0B0F]' : 'bg-[#F9FAFB]'
          }`}>
            <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className={`text-3xl font-bold mb-2 ${
                    false ? 'text-white' : 'text-gray-900'
                  }`}>
                    {currentArticle.title}
                  </h1>
                  <div className={`flex items-center space-x-4 text-sm ${
                    false ? 'text-[#BBBECC]' : 'text-gray-600'
                  }`}>
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {t('knowledgeBase.readingTime')}
                    </span>
                    <span className="flex items-center">
                      <CheckCircleIcon className={`h-4 w-4 mr-1 ${
                        false ? 'text-[#2BE89A]' : 'text-green-600'
                      }`} />
                      {t('knowledgeBase.lastUpdated')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className={`p-2 rounded-lg border transition ${
                    false
                      ? 'bg-[#1c1e27] border-[#2a2d3a] hover:bg-[#2a2d3a]'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}>
                    <BookOpenIcon className={`h-5 w-5 ${
                      false ? 'text-[#BBBECC]' : 'text-gray-500'
                    }`} />
                  </button>
                  <button className={`p-2 rounded-lg border transition ${
                    false
                      ? 'bg-[#1c1e27] border-[#2a2d3a] hover:bg-[#2a2d3a]'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}>
                    <ArrowRightIcon className={`h-5 w-5 ${
                      false ? 'text-[#BBBECC]' : 'text-gray-500'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

              {/* Article Content */}
              <div className={`rounded-xl border overflow-hidden ${
                false
                  ? 'bg-[#1c1e27] border-[#2a2d3a]'
                  : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="p-6 lg:p-8">
                  <div className="prose max-w-none">
                  {renderArticleContent(currentArticle.content)}
                </div>
              </div>
              
              {/* Article Footer */}
              <div className={`p-6 border-t ${
                false
                  ? 'bg-[#0A0B0F] border-[#2a2d3a]'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${
                    false ? 'text-[#BBBECC]' : 'text-gray-600'
                  }`}>
                    {t('knowledgeBase.wasUseful')}
                  </p>
                  <div className="flex items-center space-x-4">
                    <button className={`flex items-center transition ${
                      false
                        ? 'text-[#2BE89A] hover:text-[#4FFFB0]'
                        : 'text-green-600 hover:text-green-700'
                    }`}>
                      <CheckCircleIcon className="h-5 w-5 mr-1" />
                      <span className="text-sm">{t('knowledgeBase.yes')}</span>
                    </button>
                    <button className={`flex items-center transition ${
                      false
                        ? 'text-[#BBBECC] hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}>
                      <XCircleIcon className="h-5 w-5 mr-1" />
                      <span className="text-sm">{t('knowledgeBase.no')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

              {/* Related Articles */}
              <div className="mt-8 mb-12">
                <h3 className={`text-lg font-semibold mb-4 ${
                  false ? 'text-white' : 'text-gray-900'
                }`}>{t('knowledgeBase.relatedArticles')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections
                  .find(s => s.id === selectedSection)
                  ?.articles.filter(a => a.id !== selectedArticle)
                  .slice(0, 4)
                  .map((article) => (
                    <button
                      key={article.id}
                      onClick={() => {
                        setSelectedArticle(article.id)
                        window.scrollTo(0, 0)
                      }}
                      className={`p-4 rounded-lg border transition text-left ${
                        false
                          ? 'bg-[#1c1e27] border-[#2a2d3a] hover:border-[#2BE89A]/30'
                          : 'bg-white border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start">
{article.icon && React.createElement(article.icon, { className: `h-5 w-5 mr-3 mt-0.5 ${false ? 'text-[#2BE89A]' : 'text-green-600'}` })}
                        <div>
                          <h4 className={`font-medium mb-1 ${
                            false ? 'text-white' : 'text-gray-900'
                          }`}>{article.title}</h4>
                          <p className={`text-sm ${
                            false ? 'text-[#BBBECC]' : 'text-gray-600'
                          }`}>{t('knowledgeBase.readMore')}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default KnowledgeBase
