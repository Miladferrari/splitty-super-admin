import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import OnboardingSidebar from '../../../components/OnboardingSidebar'
import { useRestaurants } from '../../../contexts/RestaurantsContext'
import { useUsers } from '../../../contexts/UsersContext'
import { useTranslation } from '../../../contexts/TranslationContext'
import { 
  BuildingStorefrontIcon,
  UserGroupIcon,
  CreditCardIcon,
  WifiIcon,
  CheckCircleIcon,
  StarIcon,
  QrCodeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  LockClosedIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const RestaurantOnboarding: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { t } = useTranslation()
  const { getRestaurant, updateRestaurant, restoreRestaurant } = useRestaurants()
  const { updateRestaurantUsersFromOnboarding } = useUsers()
  const [restaurant, setRestaurant] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [showWelcome, setShowWelcome] = useState(true)
  const [isLocked, setIsLocked] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Step data states
  const [personnelData, setPersonnelData] = useState([])
  const [stripeData, setStripeData] = useState({ connected: false })
  const [posData, setPosData] = useState({ 
    posType: '', 
    username: '', 
    password: '', 
    baseUrl: '',
    environment: 'production',
    isActive: true
  })
  const [googleReviewData, setGoogleReviewData] = useState({ 
    reviewLink: '',
    placeId: '',
    isConfigured: false 
  })
  const [telegramData, setTelegramData] = useState({
    restaurantName: '',
    groupCreated: false,
    groupLink: '',
    isCreating: false,
    isConfigured: false
  })
  const [qrStandData, setQrStandData] = useState({
    selectedDesign: '',
    tableCount: '',
    tableSections: {
      bar: '',
      binnen: '',
      terras: '',
      lounge: ''
    },
    floorPlans: [],
    isConfigured: false
  })
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  
  // Personnel form states
  const [showPersonForm, setShowPersonForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [newPerson, setNewPerson] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    role: 'manager'
  })

  useEffect(() => {
    if (id) {
      const rest = getRestaurant(id)
      if (rest) {
        setRestaurant(rest)
        // Check if restaurant is deleted/archived
        setIsLocked(rest.deleted === true)
        
        // Load saved onboarding data from localStorage
        const savedData = localStorage.getItem(`onboarding_${id}`)
        let validCompletedSteps = [];
        
        if (savedData) {
          const parsed = JSON.parse(savedData)
          
          // Only load personnel data if it exists
          if (parsed.personnelData && parsed.personnelData.length > 0) {
            setPersonnelData(parsed.personnelData)
          }
          
          // Only load completed steps that match actual progress
          if (parsed.completedSteps) {
            // Validate each completed step
            if (parsed.completedSteps.includes(1) && parsed.personnelData && parsed.personnelData.filter(p => p.role === 'manager').length > 0) {
              validCompletedSteps.push(1);
            }
            if (parsed.completedSteps.includes(2) && parsed.stripeData && parsed.stripeData.connected) {
              validCompletedSteps.push(2);
            }
            if (parsed.completedSteps.includes(3) && parsed.posData && parsed.posData.posType && parsed.posData.username && parsed.posData.password && parsed.posData.baseUrl) {
              validCompletedSteps.push(3);
            }
            if (parsed.completedSteps.includes(4)) {
              validCompletedSteps.push(4);
            }
            if (parsed.completedSteps.includes(5)) {
              validCompletedSteps.push(5);
            }
            if (parsed.completedSteps.includes(6)) {
              validCompletedSteps.push(6);
            }
            
            setCompletedSteps(validCompletedSteps);
          }
          
          if (parsed.stripeData) setStripeData(parsed.stripeData)
          if (parsed.posData) setPosData(parsed.posData)
          if (parsed.googleReviewData) {
            // Backwards compatibility: extract placeId from reviewLink if not present
            if (!parsed.googleReviewData.placeId && parsed.googleReviewData.reviewLink) {
              const match = parsed.googleReviewData.reviewLink.match(/placeid=(.+)$/);
              if (match) {
                parsed.googleReviewData.placeId = match[1];
              }
            }
            setGoogleReviewData(parsed.googleReviewData)
          }
          if (parsed.telegramData) setTelegramData(parsed.telegramData)
          if (parsed.qrStandData) {
            // Ensure tableSections exists for backwards compatibility
            if (!parsed.qrStandData.tableSections) {
              parsed.qrStandData.tableSections = {
                bar: '',
                binnen: '',
                terras: '',
                lounge: ''
              }
            }
            // Convert old floorPlan to new floorPlans array
            if (parsed.qrStandData.floorPlan && !parsed.qrStandData.floorPlans) {
              parsed.qrStandData.floorPlans = [parsed.qrStandData.floorPlan];
              delete parsed.qrStandData.floorPlan;
            }
            // Ensure floorPlans is an array
            if (!parsed.qrStandData.floorPlans) {
              parsed.qrStandData.floorPlans = [];
            }
            setQrStandData(parsed.qrStandData)
          }
          
          // Only set to next uncompleted step on initial page load
          if (!hasInitialized) {
            // Determine the next uncompleted step
            let nextStep = 0; // Start with welcome by default
            if (validCompletedSteps.includes(1) && !validCompletedSteps.includes(2)) {
              nextStep = 2;
            } else if (validCompletedSteps.includes(1) && validCompletedSteps.includes(2) && !validCompletedSteps.includes(3)) {
              nextStep = 3;
            } else if (validCompletedSteps.includes(1) && validCompletedSteps.includes(2) && validCompletedSteps.includes(3) && !validCompletedSteps.includes(4)) {
              nextStep = 4;
            } else if (validCompletedSteps.includes(1) && validCompletedSteps.includes(2) && validCompletedSteps.includes(3) && validCompletedSteps.includes(4) && !validCompletedSteps.includes(5)) {
              nextStep = 5;
            } else if (validCompletedSteps.length === 5) {
              // All steps completed, show the last step
              nextStep = 5;
            } else if (validCompletedSteps.length > 0 || (parsed.personnelData && parsed.personnelData.length > 0)) {
              // If there's any progress, go to the first incomplete step
              nextStep = 1;
            }
            
            setCurrentStep(nextStep);
            setHasInitialized(true);
          }
          
          // Only skip welcome if they have completed at least one step with actual data
          // This ensures new onboardings always see the welcome screen
          if (validCompletedSteps.length > 0 && parsed.personnelData && parsed.personnelData.length > 0) {
            setShowWelcome(false)
          }
        } else {
          // No saved data, start at welcome (step 0)
          if (!hasInitialized) {
            setCurrentStep(0);
            setHasInitialized(true);
          }
        }
      }
    }
  }, [id, getRestaurant, hasInitialized])

  if (!restaurant) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-900">Restaurant niet gevonden...</div>
        </div>
      </Layout>
    )
  }

  const saveProgress = (updatedData = {}) => {
    const dataToSave = {
      personnelData: updatedData.personnelData || personnelData,
      stripeData: updatedData.stripeData || stripeData,
      posData: updatedData.posData || posData,
      googleReviewData: updatedData.googleReviewData || googleReviewData,
      telegramData: updatedData.telegramData || telegramData,
      qrStandData: updatedData.qrStandData || qrStandData,
      completedSteps: updatedData.completedSteps || completedSteps,
      currentStep: updatedData.currentStep || currentStep,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem(`onboarding_${id}`, JSON.stringify(dataToSave))
    
    // Also update the restaurant's onboardingStep - only count first 3 steps as required
    const requiredStepsCompleted = (updatedData.completedSteps || completedSteps).filter(step => step <= 3).length;
    updateRestaurant(id, { 
      onboardingStep: Math.min(requiredStepsCompleted, 3)
    });
  }

  const handleStepChange = (step) => {
    // If going to welcome screen (step 0)
    if (step === 0) {
      setShowWelcome(true)
      setCurrentStep(0)
    } else {
      // Going to any other step, hide welcome
      setShowWelcome(false)
      setCurrentStep(step)
    }
    
    // Only save progress if not locked and not welcome screen
    if (!isLocked && step !== 0) {
      saveProgress({
        personnelData,
        stripeData,
        posData,
        googleReviewData,
        qrStandData,
        completedSteps,
        currentStep: step
      })
    }
  }

  const handleAddPerson = () => {
    // Reset errors
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    
    // Check if passwords match
    if (newPerson.password !== newPerson.passwordConfirm) {
      setPasswordError('Wachtwoorden komen niet overeen');
      return;
    }
    
    // Check if password is strong enough
    if (newPerson.password.length < 8) {
      setPasswordError('Wachtwoord moet minimaal 8 karakters bevatten');
      return;
    }
    
    // Check if email is already in use
    const emailExists = personnelData.some(p => p.email.toLowerCase() === newPerson.email.toLowerCase());
    if (emailExists) {
      setEmailError('Dit e-mailadres is al in gebruik');
      return;
    }
    
    // Check if phone is already in use (if provided)
    if (newPerson.phone) {
      const phoneExists = personnelData.some(p => p.phone && p.phone === newPerson.phone);
      if (phoneExists) {
        setPhoneError('Dit telefoonnummer is al in gebruik');
        return;
      }
    }
    
    // Get all existing users from database to check globally
    const db = typeof window !== 'undefined' ? require('../../../utils/database').default : null;
    if (db) {
      const allUsers = db.getUsers() || [];
      const globalEmailExists = allUsers.some(u => u.email.toLowerCase() === newPerson.email.toLowerCase());
      if (globalEmailExists) {
        setEmailError('Dit e-mailadres is al geregistreerd in het systeem');
        return;
      }
      
      if (newPerson.phone) {
        const globalPhoneExists = allUsers.some(u => u.phone && u.phone === newPerson.phone);
        if (globalPhoneExists) {
          setPhoneError('Dit telefoonnummer is al geregistreerd in het systeem');
          return;
        }
      }
    }
    
    if (newPerson.firstName && newPerson.lastName && newPerson.email && newPerson.password) {
      const updatedPersonnelData = [...personnelData, { ...newPerson, id: Date.now() }];
      setPersonnelData(updatedPersonnelData);
      setNewPerson({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: '',
        role: 'manager'
      });
      setShowPersonForm(false);
      setEmailError('');
      setPhoneError('');
      setPasswordError('');
      
      // If this is a manager, mark step 1 as completed
      let newCompletedSteps = [...completedSteps];
      if (newPerson.role === 'manager' && updatedPersonnelData.filter(p => p.role === 'manager').length > 0) {
        if (!newCompletedSteps.includes(1)) {
          newCompletedSteps.push(1);
          setCompletedSteps(newCompletedSteps);
        }
      }
      
      // Save progress with updated personnel data
      saveProgress({
        personnelData: updatedPersonnelData,
        stripeData,
        posData,
        googleReviewData,
        qrStandData,
        completedSteps: newCompletedSteps,
        currentStep
      });
    }
  }

  const handleRemovePerson = (personId) => {
    const updatedPersonnelData = personnelData.filter(p => p.id !== personId);
    setPersonnelData(updatedPersonnelData);
    
    // Save progress with updated personnel data
    saveProgress({
      personnelData: updatedPersonnelData,
      stripeData,
      posData,
      googleReviewData,
      qrStandData,
      completedSteps,
      currentStep
    });
  }

  const handleCompleteStep = () => {
    // For now, just navigate to next step without marking as complete
    // Completion logic will be added later when API connections are implemented
    
    if (currentStep < 6) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Save progress with updated values
      saveProgress({
        completedSteps: completedSteps, // Keep existing completed steps
        currentStep: nextStep,
        personnelData,
        stripeData,
        posData,
        googleReviewData,
        telegramData,
        qrStandData
      });
    } else if (currentStep === 6) {
      // Complete onboarding - this is the final step
      updateRestaurant(id, { 
        isOnboarded: true,
        onboardingStep: 5,
        googleReviewLink: googleReviewData.reviewLink || null,
        qrStandConfig: qrStandData.isConfigured ? qrStandData : null
      })
      
      // Also update users if personnel were added
      if (personnelData.length > 0) {
        updateRestaurantUsersFromOnboarding(id, personnelData)
      }
      
      // Clear onboarding data from localStorage
      localStorage.removeItem(`onboarding_${id}`)
      
      router.push(`/restaurants/${id}`)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Main Content Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{t('restaurants.onboarding.steps.personnel.title')}</h3>
                  <p className="text-sm text-gray-500">
                    {t('restaurants.onboarding.steps.personnel.subtitle')} • {t('restaurants.onboarding.steps.personnel.usersAdded', { count: personnelData.length })}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-gray-400" />
                </div>
              </div>

              {/* Personnel List */}
              {personnelData.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-600 mb-4">Toegevoegde gebruikers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personnelData.map((person) => (
                      <div key={person.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-green-400/30 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] flex items-center justify-center text-black font-bold mr-4">
                              {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold">{person.firstName} {person.lastName}</p>
                              <p className="text-sm text-gray-600">{person.email}</p>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${
                                person.role === 'manager' 
                                  ? 'bg-green-100 text-green-500' 
                                  : 'bg-blue-100 text-blue-500'
                              }`}>
                                {person.role === 'manager' ? t('restaurants.onboarding.steps.personnel.form.manager') : t('restaurants.onboarding.steps.personnel.form.staff')}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemovePerson(person.id)}
                            className="text-gray-600 hover:text-red-500 transition p-2"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Person Form */}
              {showPersonForm ? (
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="text-base font-medium text-gray-900">{t('restaurants.onboarding.steps.personnel.addNewUserForm')}</h4>
                    <button
                      onClick={() => {
                        setShowPersonForm(false);
                        setNewPerson({
                          firstName: '',
                          lastName: '',
                          email: '',
                          phone: '',
                          password: '',
                          passwordConfirm: '',
                          role: 'manager'
                        });
                        setEmailError('');
                        setPhoneError('');
                        setPasswordError('');
                        setShowPassword(false);
                        setShowPasswordConfirm(false);
                      }}
                      className="text-gray-500 hover:text-gray-700 transition p-1.5 hover:bg-white rounded-lg"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.onboarding.steps.personnel.form.firstName')}</label>
                        <input
                          type="text"
                          value={newPerson.firstName}
                          onChange={(e) => setNewPerson({...newPerson, firstName: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder={t('restaurants.onboarding.steps.personnel.form.firstNamePlaceholder')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.onboarding.steps.personnel.form.lastName')}</label>
                        <input
                          type="text"
                          value={newPerson.lastName}
                          onChange={(e) => setNewPerson({...newPerson, lastName: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder={t('restaurants.onboarding.steps.personnel.form.lastNamePlaceholder')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.onboarding.steps.personnel.form.email')}</label>
                      <input
                        type="email"
                        value={newPerson.email}
                        onChange={(e) => {
                          setNewPerson({...newPerson, email: e.target.value});
                          setEmailError('');
                        }}
                        className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                          emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500'
                        }`}
                        placeholder={t('restaurants.onboarding.steps.personnel.form.emailPlaceholder')}
                      />
                      {emailError && (
                        <p className="mt-1 text-sm text-red-600">{emailError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.onboarding.steps.personnel.form.phone')}</label>
                      <input
                        type="tel"
                        value={newPerson.phone}
                        onChange={(e) => {
                          setNewPerson({...newPerson, phone: e.target.value});
                          setPhoneError('');
                        }}
                        className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                          phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500'
                        }`}
                        placeholder={t('restaurants.onboarding.steps.personnel.form.phonePlaceholder')}
                      />
                      {phoneError && (
                        <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.onboarding.steps.personnel.form.password')}</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPerson.password}
                          onChange={(e) => {
                            setNewPerson({...newPerson, password: e.target.value});
                            setPasswordError('');
                          }}
                          className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent pr-12 ${
                            passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500'
                          }`}
                          placeholder={t('restaurants.onboarding.steps.personnel.form.passwordPlaceholder')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
                        >
                          {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                      {passwordError && (
                        <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{t('restaurants.onboarding.steps.personnel.form.confirmPassword')}</label>
                      <div className="relative">
                        <input
                          type={showPasswordConfirm ? "text" : "password"}
                          value={newPerson.passwordConfirm}
                          onChange={(e) => {
                            setNewPerson({...newPerson, passwordConfirm: e.target.value});
                            setPasswordError('');
                          }}
                          className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent pr-12 ${
                            passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500'
                          }`}
                          placeholder={t('restaurants.onboarding.steps.personnel.form.confirmPasswordPlaceholder')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
                        >
                          {showPasswordConfirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-3">{t('restaurants.onboarding.steps.personnel.form.roleLabel')}</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setNewPerson({...newPerson, role: 'manager'})}
                          className={`p-3 rounded-lg border transition-all ${
                            newPerson.role === 'manager'
                              ? 'bg-white border-[#2BE89A] shadow-sm'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <ShieldCheckIcon className={`h-5 w-5 mx-auto mb-2 ${
                            newPerson.role === 'manager' ? 'text-[#2BE89A]' : 'text-gray-400'
                          }`} />
                          <p className={`text-sm font-medium ${
                            newPerson.role === 'manager' ? 'text-gray-900' : 'text-gray-600'
                          }`}>{t('restaurants.onboarding.steps.personnel.form.manager')}</p>
                          <p className="text-xs mt-0.5 text-gray-500">{t('restaurants.onboarding.steps.personnel.form.fullAccess')}</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewPerson({...newPerson, role: 'staff'})}
                          className={`p-3 rounded-lg border transition-all ${
                            newPerson.role === 'staff'
                              ? 'bg-white border-[#2BE89A] shadow-sm'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <UserGroupIcon className={`h-5 w-5 mx-auto mb-2 ${
                            newPerson.role === 'staff' ? 'text-[#2BE89A]' : 'text-gray-400'
                          }`} />
                          <p className={`text-sm font-medium ${
                            newPerson.role === 'staff' ? 'text-gray-900' : 'text-gray-600'
                          }`}>{t('restaurants.onboarding.steps.personnel.form.staff')}</p>
                          <p className="text-xs mt-0.5 text-gray-500">{t('restaurants.onboarding.steps.personnel.form.basicAccess')}</p>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddPerson}
                      disabled={!newPerson.firstName || !newPerson.lastName || !newPerson.email || !newPerson.password || !newPerson.passwordConfirm}
                      className="w-full px-4 py-2.5 bg-[#2BE89A] text-black font-medium rounded-lg hover:bg-[#2BE89A]/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {t('restaurants.onboarding.steps.personnel.form.addUser')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowPersonForm(true)}
                  className="w-full px-5 py-4 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#2BE89A] hover:bg-gray-50 transition-all group"
                >
                  <UserGroupIcon className="h-6 w-6 mx-auto mb-2 text-gray-400 group-hover:text-[#2BE89A] transition" />
                  <p className="text-sm font-medium group-hover:text-gray-900 transition">{t('restaurants.onboarding.steps.personnel.addNewUser')}</p>
                </button>
              )}

              {/* Info Box */}
              <div className="mt-6 bg-[#2BE89A]/5 rounded-lg p-3.5 border border-[#2BE89A]/20">
                <p className="text-xs text-gray-600">
                  <span className="text-[#2BE89A] font-medium">{t('restaurants.onboarding.steps.personnel.tip')}</span> {t('restaurants.onboarding.steps.personnel.tipMessage')}
                </p>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            {/* Main Content Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{t('restaurants.onboarding.steps.stripe.title')}</h3>
                  <p className="text-sm text-gray-500">
                    {t('restaurants.onboarding.steps.stripe.subtitle')} {stripeData.connected && `• ✓ ${t('restaurants.onboarding.steps.stripe.connected')}`}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <CreditCardIcon className="h-6 w-6 text-gray-400" />
                </div>
              </div>

              <div className="space-y-6">
                {!stripeData.connected ? (
                  <>
                    {/* Stripe Connect Info */}
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <h4 className="text-base font-medium text-gray-900 mb-3">{t('restaurants.onboarding.steps.stripe.integration.title')}</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {t('restaurants.onboarding.steps.stripe.integration.description')}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <ShieldCheckIcon className="h-5 w-5 text-[#2BE89A] mx-auto mb-2" />
                          <p className="text-xs text-gray-600 text-center">{t('restaurants.onboarding.steps.stripe.integration.features.pciCompliant')}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <ClockIcon className="h-5 w-5 text-[#2BE89A] mx-auto mb-2" />
                          <p className="text-xs text-gray-600 text-center">{t('restaurants.onboarding.steps.stripe.integration.features.dailyPayout')}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <SparklesIcon className="h-5 w-5 text-[#2BE89A] mx-auto mb-2" />
                          <p className="text-xs text-gray-600 text-center">{t('restaurants.onboarding.steps.stripe.integration.features.realTimeInsight')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Connect Button - Disabled until API integration */}
                    <button
                      onClick={() => {
                        // TODO: Implement Stripe Connect OAuth flow
                        alert('Stripe Connect integratie komt binnenkort beschikbaar. Neem contact op met het Splitty team voor handmatige setup.');
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-[#635BFF] via-[#4F46E5] to-[#0073E6] text-white font-medium rounded-lg hover:opacity-90 flex items-center justify-center text-sm shadow-md hover:shadow-lg transition-all"
                    >
                      <span>Start Stripe onboarding</span>
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </button>
                    
                    {/* Info message */}
                    <div className="bg-[#2BE89A]/5 rounded-lg p-3.5 border border-[#2BE89A]/20">
                      <p className="text-xs text-gray-600">
                        <span className="text-[#2BE89A] font-medium">Let op:</span> Stripe Connect integratie komt binnenkort beschikbaar. Neem contact op met het Splitty team voor handmatige setup.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    {/* Success State */}
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-[#2BE89A]/10 rounded-lg mr-3">
                          <CheckCircleIcon className="h-5 w-5 text-[#2BE89A]" />
                        </div>
                        <h4 className="text-base font-medium text-gray-900">{t('restaurants.onboarding.steps.stripe.success.title')}</h4>
                      </div>
                      <div className="space-y-2.5 pl-11">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t('restaurants.onboarding.steps.stripe.success.accountId')}</span>
                          <span className="text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded border border-gray-200">{stripeData.accountId || 'acct_demo_123456'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t('restaurants.onboarding.steps.stripe.success.status')}</span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#2BE89A]/10 text-[#2BE89A] border border-[#2BE89A]/20">
                            {t('restaurants.onboarding.steps.stripe.success.active')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Uitbetaling frequentie</span>
                          <span className="text-sm text-gray-700">Dagelijks</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#2BE89A]/5 rounded-lg p-3.5 border border-[#2BE89A]/20">
                      <p className="text-xs text-gray-600">
                        <CheckCircleIcon className="h-3.5 w-3.5 text-[#2BE89A] inline mr-1" />
                        Het restaurant kan nu split betalingen ontvangen. Uitbetalingen gebeuren automatisch naar de gekoppelde bankrekening.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            {/* Main Content Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{t('restaurants.onboarding.steps.pos.title')}</h3>
                  <p className="text-sm text-gray-500">
                    {t('restaurants.onboarding.steps.pos.subtitle', { restaurantName: restaurant?.name })}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <WifiIcon className="h-6 w-6 text-gray-400" />
                </div>
              </div>

              <div className="space-y-4">
                {/* Form Container */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-5">
                  {/* POS Type */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                      {t('restaurants.onboarding.steps.pos.posSystem')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={posData.posType}
                      onChange={(e) => setPosData({...posData, posType: e.target.value})}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 text-sm focus:outline-none focus:border-[#2BE89A] focus:ring-1 focus:ring-[#2BE89A] transition-colors"
                      required
                    >
                      <option value="">{t('restaurants.onboarding.steps.pos.selectPos')}</option>
                      <option value="untill">Untill</option>
                      <option value="lightspeed">Lightspeed</option>
                      <option value="epos">EPOS Now</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Username and Password Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                        {t('restaurants.onboarding.steps.pos.posUsername')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={posData.username}
                        onChange={(e) => setPosData({...posData, username: e.target.value})}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#2BE89A] focus:ring-1 focus:ring-[#2BE89A] transition-colors"
                        placeholder={t('restaurants.onboarding.steps.pos.posUsernamePlaceholder')}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                        {t('restaurants.onboarding.steps.pos.posPassword')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={posData.password}
                        onChange={(e) => setPosData({...posData, password: e.target.value})}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#2BE89A] focus:ring-1 focus:ring-[#2BE89A] transition-colors"
                        placeholder={t('restaurants.onboarding.steps.pos.posPasswordPlaceholder')}
                        required
                      />
                    </div>
                  </div>

                  {/* Base URL */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                      {t('restaurants.onboarding.steps.pos.apiUrl')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={t('restaurants.onboarding.steps.pos.apiUrlPlaceholder')}
                      value={posData.baseUrl}
                      onChange={(e) => setPosData({...posData, baseUrl: e.target.value})}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#2BE89A] focus:ring-1 focus:ring-[#2BE89A] transition-colors"
                      required
                    />
                  </div>

                  {/* Environment */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                      {t('restaurants.onboarding.steps.pos.environment')}
                    </label>
                    <select
                      value={posData.environment}
                      onChange={(e) => setPosData({...posData, environment: e.target.value})}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 text-sm focus:outline-none focus:border-[#2BE89A] focus:ring-1 focus:ring-[#2BE89A] transition-colors"
                    >
                      <option value="production">{t('restaurants.onboarding.steps.pos.production')}</option>
                      <option value="staging">{t('restaurants.onboarding.steps.pos.staging')}</option>
                      <option value="development">{t('restaurants.onboarding.steps.pos.development')}</option>
                      <option value="test">{t('restaurants.onboarding.steps.pos.test')}</option>
                    </select>
                  </div>

                  {/* Active Toggle */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label htmlFor="is-active" className="text-sm font-medium text-gray-900 cursor-pointer">
                          {t('restaurants.onboarding.steps.pos.activate')}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">{t('restaurants.onboarding.steps.pos.activateDescription', { restaurantName: restaurant?.name })}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={posData.isActive}
                        onClick={() => setPosData({...posData, isActive: !posData.isActive})}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:ring-offset-2
                          ${posData.isActive ? 'bg-[#2BE89A]' : 'bg-gray-200'}
                        `}
                      >
                        <span className="sr-only">Activeer POS integratie</span>
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 
                            transition duration-200 ease-in-out
                            ${posData.isActive ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Test Connection Button */}
                <button 
                  onClick={() => {
                    // For demo purposes, mark POS as configured after "testing"
                    if (posData.posType && posData.username && posData.password && posData.baseUrl) {
                      // Mark step 3 as completed
                      let newCompletedSteps = [...completedSteps];
                      if (!newCompletedSteps.includes(3)) {
                        newCompletedSteps.push(3);
                      }
                      setCompletedSteps(newCompletedSteps);
                      
                      // Save progress
                      saveProgress({
                        personnelData,
                        stripeData,
                        posData,
                        googleReviewData,
                        completedSteps: newCompletedSteps,
                        currentStep
                      });
                      
                      // Show success feedback
                      alert('Verbinding succesvol! POS is geconfigureerd.');
                    } else {
                      alert('Vul alle verplichte velden in voordat je de verbinding test.');
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-[#2BE89A] text-black font-medium rounded-lg hover:bg-[#2BE89A]/90 transition text-sm"
                >
                  {t('restaurants.onboarding.steps.pos.testConnection')}
                </button>
                
                {/* Info Box */}
                <div className="bg-[#2BE89A]/5 rounded-lg p-3.5 border border-[#2BE89A]/20">
                  <p className="text-xs text-gray-600">
                    <span className="text-[#2BE89A] font-medium">Tip:</span> Zorg dat je de juiste API credentials hebt van het POS systeem voordat je de verbinding test.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            {/* Main Content Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{t('restaurants.onboarding.steps.qrHolders.title')}</h3>
                  <p className="text-sm text-gray-500">
                    {t('restaurants.onboarding.steps.qrHolders.subtitle', { restaurantName: restaurant?.name })}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <QrCodeIcon className="h-6 w-6 text-gray-400" />
                </div>
              </div>

              <div className="space-y-6">
                {/* QR Stand Design Showcase */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <label className="block text-xs font-medium text-gray-700 mb-4 uppercase tracking-wider">
                    {t('restaurants.onboarding.steps.qrHolders.availableDesigns')}
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { id: 'houder1', name: `${t('restaurants.onboarding.steps.qrHolders.design')} 1`, color: 'from-[#2BE89A] to-[#4FFFB0]' },
                      { id: 'houder2', name: `${t('restaurants.onboarding.steps.qrHolders.design')} 2`, color: 'from-[#635BFF] to-[#7C3AED]' },
                      { id: 'houder3', name: `${t('restaurants.onboarding.steps.qrHolders.design')} 3`, color: 'from-gray-300 to-gray-100' },
                      { id: 'houder4', name: `${t('restaurants.onboarding.steps.qrHolders.design')} 4`, color: 'from-orange-400 to-pink-400' }
                    ].map((design, index) => (
                      <div
                        key={design.id}
                        className="p-4 rounded-lg border border-gray-200 bg-white"
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br ${design.color} flex items-center justify-center shadow-sm`}>
                          <QrCodeIcon className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-xs font-medium text-gray-700 text-center">{design.name}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    {t('restaurants.onboarding.steps.qrHolders.selectPerSection')}
                  </p>
                </div>

                {/* Table Count by Section with Design Selection */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <label className="block text-xs font-medium text-gray-700 mb-4 uppercase tracking-wider">
                    {t('restaurants.onboarding.steps.qrHolders.tablesPerSection')}
                  </label>
                  <div className="space-y-6">
                    {/* Bar */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1.5">{t('restaurants.onboarding.steps.qrHolders.sections.bar')}</label>
                        <input
                          type="number"
                          value={qrStandData.tableSections?.bar || ''}
                          onChange={(e) => {
                            const newSections = {...qrStandData.tableSections, bar: e.target.value};
                            const total = Object.values(newSections).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
                            setQrStandData({...qrStandData, tableSections: newSections, tableCount: total.toString(), isConfigured: true});
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#2BE89A] focus:ring-1 focus:ring-[#2BE89A] transition-colors"
                          placeholder="0"
                          min="0"
                          max="50"
                        />
                      </div>
                      {qrStandData.tableSections?.bar > 0 && (
                        <div className="flex gap-2">
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => {
                                const newDesigns = {...(qrStandData.sectionDesigns || {}), bar: num};
                                setQrStandData({...qrStandData, sectionDesigns: newDesigns});
                              }}
                              className={`flex-1 px-3 py-2 rounded-md border transition-all text-xs font-medium ${
                                qrStandData.sectionDesigns?.bar === num
                                  ? 'border-[#2BE89A] bg-[#2BE89A]/10 text-[#2BE89A]'
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {t('restaurants.onboarding.steps.qrHolders.design')} {num}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Binnen */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1.5">{t('restaurants.onboarding.steps.qrHolders.sections.inside')}</label>
                        <input
                          type="number"
                          value={qrStandData.tableSections?.binnen || ''}
                          onChange={(e) => {
                            const newSections = {...qrStandData.tableSections, binnen: e.target.value};
                            const total = Object.values(newSections).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
                            setQrStandData({...qrStandData, tableSections: newSections, tableCount: total.toString(), isConfigured: true});
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#2BE89A] focus:ring-1 focus:ring-[#2BE89A] transition-colors"
                          placeholder="0"
                          min="0"
                          max="50"
                        />
                      </div>
                      {qrStandData.tableSections?.binnen > 0 && (
                        <div className="flex gap-2">
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => {
                                const newDesigns = {...(qrStandData.sectionDesigns || {}), binnen: num};
                                setQrStandData({...qrStandData, sectionDesigns: newDesigns});
                              }}
                              className={`flex-1 px-3 py-2 rounded-md border transition-all text-xs font-medium ${
                                qrStandData.sectionDesigns?.binnen === num
                                  ? 'border-[#2BE89A] bg-[#2BE89A]/10 text-[#2BE89A]'
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {t('restaurants.onboarding.steps.qrHolders.design')} {num}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Terras */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1.5">{t('restaurants.onboarding.steps.qrHolders.sections.terrace')}</label>
                        <input
                          type="number"
                          value={qrStandData.tableSections?.terras || ''}
                          onChange={(e) => {
                            const newSections = {...qrStandData.tableSections, terras: e.target.value};
                            const total = Object.values(newSections).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
                            setQrStandData({...qrStandData, tableSections: newSections, tableCount: total.toString(), isConfigured: true});
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#2BE89A] focus:ring-1 focus:ring-[#2BE89A] transition-colors"
                          placeholder="0"
                          min="0"
                          max="50"
                        />
                      </div>
                      {qrStandData.tableSections?.terras > 0 && (
                        <div className="flex gap-2">
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => {
                                const newDesigns = {...(qrStandData.sectionDesigns || {}), terras: num};
                                setQrStandData({...qrStandData, sectionDesigns: newDesigns});
                              }}
                              className={`flex-1 px-3 py-2 rounded-md border transition-all text-xs font-medium ${
                                qrStandData.sectionDesigns?.terras === num
                                  ? 'border-[#2BE89A] bg-[#2BE89A]/10 text-[#2BE89A]'
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {t('restaurants.onboarding.steps.qrHolders.design')} {num}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Lounge */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1.5">{t('restaurants.onboarding.steps.qrHolders.sections.lounge')}</label>
                        <input
                          type="number"
                          value={qrStandData.tableSections?.lounge || ''}
                          onChange={(e) => {
                            const newSections = {...qrStandData.tableSections, lounge: e.target.value};
                            const total = Object.values(newSections).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
                            setQrStandData({...qrStandData, tableSections: newSections, tableCount: total.toString(), isConfigured: true});
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#2BE89A] focus:ring-1 focus:ring-[#2BE89A] transition-colors"
                          placeholder="0"
                          min="0"
                          max="50"
                        />
                      </div>
                      {qrStandData.tableSections?.lounge > 0 && (
                        <div className="flex gap-2">
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => {
                                const newDesigns = {...(qrStandData.sectionDesigns || {}), lounge: num};
                                setQrStandData({...qrStandData, sectionDesigns: newDesigns});
                              }}
                              className={`flex-1 px-3 py-2 rounded-md border transition-all text-xs font-medium ${
                                qrStandData.sectionDesigns?.lounge === num
                                  ? 'border-[#2BE89A] bg-[#2BE89A]/10 text-[#2BE89A]'
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {t('restaurants.onboarding.steps.qrHolders.design')} {num}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Total Calculator */}
                  <div className="bg-white rounded-md p-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{t('restaurants.onboarding.steps.qrHolders.totalTables')}</span>
                      <span className="text-lg font-bold text-[#2BE89A]">
                        {qrStandData.tableCount || '0'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('restaurants.onboarding.steps.qrHolders.totalTablesDesc')}
                    </p>
                  </div>
                </div>

                {/* Floor Plan Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-4">
                    {t('restaurants.onboarding.steps.qrHolders.floorPlan.title')}
                  </label>
                  
                  {/* Display uploaded files */}
                  {qrStandData.floorPlans && qrStandData.floorPlans.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      {qrStandData.floorPlans.map((file, index) => {
                        const isImage = file.type && file.type.startsWith('image/');
                        const imageUrl = isImage ? URL.createObjectURL(file) : null;
                        
                        return (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            {isImage && imageUrl ? (
                              <div className="relative h-32 bg-gray-100">
                                <img 
                                  src={imageUrl} 
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newFiles = qrStandData.floorPlans.filter((_, i) => i !== index);
                                    setQrStandData({...qrStandData, floorPlans: newFiles});
                                  }}
                                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-100 transition"
                                >
                                  <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <div className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-green-100 rounded">
                                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs text-gray-900 font-medium truncate">{file.name}</p>
                                      <p className="text-xs text-gray-600">
                                        {file.size < 1024 * 1024 
                                          ? `${(file.size / 1024).toFixed(1)} KB`
                                          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                                        }
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newFiles = qrStandData.floorPlans.filter((_, i) => i !== index);
                                      setQrStandData({...qrStandData, floorPlans: newFiles});
                                    }}
                                    className="p-1 hover:bg-red-100 rounded transition"
                                  >
                                    <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            )}
                            {isImage && (
                              <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                                <p className="text-xs text-gray-600 truncate">{file.name}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-green-300 hover:bg-gray-50/50 transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium mb-2">{t('restaurants.onboarding.steps.qrHolders.floorPlan.uploadText')}</p>
                        <p className="text-sm text-gray-600">
                          {t('restaurants.onboarding.steps.qrHolders.floorPlan.fileTypes')}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf,.webp,.svg"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          if (files.length > 0) {
                            // Check file sizes (max 5MB per file)
                            const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
                            if (validFiles.length < files.length) {
                              alert(t('restaurants.onboarding.steps.qrHolders.floorPlan.filesSkipped', { count: files.length - validFiles.length }));
                            }
                            const currentFiles = qrStandData.floorPlans || [];
                            setQrStandData({...qrStandData, floorPlans: [...currentFiles, ...validFiles], isConfigured: true});
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {t('restaurants.onboarding.steps.qrHolders.floorPlan.description')}
                  </p>
                </div>
                
                {/* Notes Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {t('restaurants.onboarding.steps.qrHolders.notes.label')}
                  </label>
                  <textarea
                    value={qrStandData.notes || ''}
                    onChange={(e) => setQrStandData({...qrStandData, notes: e.target.value})}
                    placeholder={t('restaurants.onboarding.steps.qrHolders.notes.placeholder')}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#2BE89A] focus:ring-1 focus:ring-[#2BE89A] transition-colors resize-none"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('restaurants.onboarding.steps.qrHolders.notes.helpText')}
                  </p>
                </div>

                {/* Configuration Summary */}
                {qrStandData.isConfigured && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{t('restaurants.onboarding.steps.qrHolders.configurationOverview')}</h4>
                        <p className="text-xs text-gray-500">{t('restaurants.onboarding.steps.qrHolders.qrPerSection')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#2BE89A]">{qrStandData.tableCount || '0'}</p>
                        <p className="text-xs text-gray-500">{t('restaurants.onboarding.steps.qrHolders.total')}</p>
                      </div>
                    </div>
                    
                    {qrStandData.tableSections && (qrStandData.tableSections.bar || qrStandData.tableSections.binnen || qrStandData.tableSections.terras || qrStandData.tableSections.lounge) && (
                      <div className="grid grid-cols-2 gap-3">
                        {qrStandData.tableSections.bar > 0 && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700">{t('restaurants.onboarding.steps.qrHolders.sections.bar')}</span>
                              {qrStandData.sectionDesigns?.bar && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-900 text-white">
                                  D{qrStandData.sectionDesigns.bar}
                                </span>
                              )}
                            </div>
                            <p className="text-lg font-semibold text-gray-900">{qrStandData.tableSections.bar}</p>
                          </div>
                        )}
                        {qrStandData.tableSections.binnen > 0 && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700">{t('restaurants.onboarding.steps.qrHolders.sections.inside')}</span>
                              {qrStandData.sectionDesigns?.binnen && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-900 text-white">
                                  D{qrStandData.sectionDesigns.binnen}
                                </span>
                              )}
                            </div>
                            <p className="text-lg font-semibold text-gray-900">{qrStandData.tableSections.binnen}</p>
                          </div>
                        )}
                        {qrStandData.tableSections.terras > 0 && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700">{t('restaurants.onboarding.steps.qrHolders.sections.terrace')}</span>
                              {qrStandData.sectionDesigns?.terras && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-900 text-white">
                                  D{qrStandData.sectionDesigns.terras}
                                </span>
                              )}
                            </div>
                            <p className="text-lg font-semibold text-gray-900">{qrStandData.tableSections.terras}</p>
                          </div>
                        )}
                        {qrStandData.tableSections.lounge > 0 && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700">{t('restaurants.onboarding.steps.qrHolders.sections.lounge')}</span>
                              {qrStandData.sectionDesigns?.lounge && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-900 text-white">
                                  D{qrStandData.sectionDesigns.lounge}
                                </span>
                              )}
                            </div>
                            <p className="text-lg font-semibold text-gray-900">{qrStandData.tableSections.lounge}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {qrStandData.floorPlans && qrStandData.floorPlans.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t('restaurants.onboarding.steps.qrHolders.files')}</span>
                          <span className="text-sm text-gray-900 font-medium">{qrStandData.floorPlans.length} {qrStandData.floorPlans.length > 1 ? t('restaurants.onboarding.steps.qrHolders.files').toLowerCase() : t('restaurants.onboarding.steps.qrHolders.file')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            {/* Main Content Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{t('restaurants.onboarding.steps.googleReviews.title')}</h3>
                  <p className="text-sm text-gray-500">
                    {t('restaurants.onboarding.steps.googleReviews.subtitle', { restaurantName: restaurant?.name })}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <StarIcon className="h-6 w-6 text-gray-400" />
                </div>
              </div>

              <div className="space-y-6">
                {/* Restaurant Info - Disabled */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {t('restaurants.onboarding.steps.googleReviews.restaurant')}
                  </label>
                  <div className="relative">
                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg pr-12">
                      <span className="text-gray-900 font-medium">{restaurant?.name}</span>
                      <span className="text-gray-600 ml-3">
                        {restaurant?.address 
                          ? `${restaurant.address.street || ''} ${restaurant.address.postalCode || ''} ${restaurant.address.city || ''}`
                          : restaurant?.location}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const textToCopy = `${restaurant?.name} ${restaurant?.address 
                          ? `${restaurant.address.street || ''} ${restaurant.address.postalCode || ''} ${restaurant.address.city || ''}`
                          : restaurant?.location || ''}`;
                        navigator.clipboard.writeText(textToCopy);
                        setShowCopiedMessage(true);
                        setTimeout(() => setShowCopiedMessage(false), 2000);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900 transition"
                      title={t('restaurants.onboarding.steps.googleReviews.copyInfo')}
                    >
                      {showCopiedMessage ? (
                        <span className="text-xs text-green-500 font-medium mr-2">{t('common.copied') || 'Copied!'}</span>
                      ) : null}
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Instructions with Steps */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">{t('restaurants.onboarding.steps.googleReviews.setupTitle', { restaurantName: restaurant?.name })}</h4>
                  
                  {/* Step 1 */}
                  <div className="mb-5">
                    <div className="flex items-start mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2BE89A] text-black text-xs font-semibold mr-3 flex-shrink-0">1</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium mb-2">{t('restaurants.onboarding.steps.googleReviews.step1', { restaurantName: restaurant?.name })}</p>
                        <a 
                          href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black text-xs font-medium rounded-md hover:opacity-90 transition"
                        >
                          {t('restaurants.onboarding.steps.googleReviews.openFinder')}
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="mb-5">
                    <div className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2BE89A] text-black text-xs font-semibold mr-3 flex-shrink-0">2</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium mb-1">{t('restaurants.onboarding.steps.googleReviews.step2')}</p>
                        <p className="text-xs text-gray-600">{t('restaurants.onboarding.steps.googleReviews.step2Desc', { restaurantName: restaurant?.name })}</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="mb-5">
                    <div className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2BE89A] text-black text-xs font-semibold mr-3 flex-shrink-0">3</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium mb-1">{t('restaurants.onboarding.steps.googleReviews.step3')}</p>
                        <p className="text-xs text-gray-600">{t('restaurants.onboarding.steps.googleReviews.step3Desc')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div>
                    <div className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2BE89A] text-black text-xs font-semibold mr-3 flex-shrink-0">4</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium mb-1">{t('restaurants.onboarding.steps.googleReviews.step4')}</p>
                        <p className="text-xs text-gray-600">{t('restaurants.onboarding.steps.googleReviews.step4Desc', { restaurantName: restaurant?.name })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Review Link Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {t('restaurants.onboarding.steps.googleReviews.reviewLink')}
                  </label>
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#2BE89A] focus-within:border-transparent">
                    <span className="text-gray-600 font-mono text-sm pl-4 pr-0 whitespace-nowrap">
                      https://search.google.com/local/writereview?placeid=
                    </span>
                    <input
                      type="text"
                      value={googleReviewData.placeId || ''}
                      onChange={(e) => {
                        const placeId = e.target.value;
                        const fullLink = placeId ? `https://search.google.com/local/writereview?placeid=${placeId}` : '';
                        setGoogleReviewData({
                          placeId: placeId,
                          reviewLink: fullLink,
                          isConfigured: placeId.length > 0
                        });
                      }}
                      placeholder={t('restaurants.onboarding.steps.googleReviews.placeIdPlaceholder')}
                      className="flex-1 bg-transparent py-3 pr-4 pl-0 text-gray-900 font-mono text-sm placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {t('restaurants.onboarding.steps.googleReviews.canChangeLabel')}
                  </p>
                </div>

                {/* Success Message */}
                {googleReviewData.isConfigured && (
                  <div className="bg-[#2BE89A]/5 rounded-lg p-4 border border-[#2BE89A]/20">
                    <p className="text-sm text-gray-700 flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-[#2BE89A] mr-2" />
                      {t('restaurants.onboarding.steps.googleReviews.successMessage', { restaurantName: restaurant?.name })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            {/* Main Content Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{t('restaurants.onboarding.steps.telegram.title')}</h3>
                  <p className="text-sm text-gray-500">
                    {t('restaurants.onboarding.steps.telegram.subtitle', { restaurantName: restaurant?.name })}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.56c-.21 2.2-1.11 7.53-1.57 10-.2 1.04-.59 1.39-.96 1.42-.82.06-1.44-.54-2.24-.98-1.24-.68-1.94-1.1-3.14-1.77-1.39-.77-.49-1.19.3-1.88.21-.18 3.85-3.53 3.92-3.83.01-.04.01-.18-.07-.26-.09-.07-.22-.05-.31-.03-.13.03-2.2 1.4-6.2 4.11-.59.4-1.12.6-1.6.59-.53-.01-1.54-.3-2.29-.54-.92-.3-1.65-.46-1.59-.97.03-.27.4-.54 1.12-.83 4.38-1.91 7.3-3.17 8.77-3.78C15.84 9.57 16.34 9.4 16.73 9.4c.09 0 .29.02.42.12.11.08.14.2.16.28-.01.05.01.12 0 .24z"/>
                  </svg>
                </div>
              </div>

              <div className="space-y-6">
                {/* Step 1: Restaurant Name Check */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-start mb-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2BE89A] text-black text-xs font-semibold mr-3 flex-shrink-0">1</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">{t('restaurants.onboarding.steps.telegram.step1.title')}</p>
                      <p className="text-xs text-gray-600">{t('restaurants.onboarding.steps.telegram.step1.description')}</p>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={telegramData.restaurantName}
                    onChange={(e) => setTelegramData({...telegramData, restaurantName: e.target.value})}
                    placeholder={restaurant?.name}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#2BE89A] focus:ring-1 focus:ring-[#2BE89A] transition-colors"
                  />
                  {telegramData.restaurantName && telegramData.restaurantName.toLowerCase() === restaurant?.name?.toLowerCase() && (
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      {t('restaurants.onboarding.steps.telegram.step1.nameMatches')}
                    </div>
                  )}
                </div>

                {/* Step 2: Create Telegram Group */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-start mb-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2BE89A] text-black text-xs font-semibold mr-3 flex-shrink-0">2</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">{t('restaurants.onboarding.steps.telegram.step2.title')}</p>
                      <p className="text-xs text-gray-600">{t('restaurants.onboarding.steps.telegram.step2.description')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (telegramData.restaurantName && !telegramData.groupCreated && !telegramData.isCreating) {
                        setTelegramData({...telegramData, isCreating: true});
                        
                        // Simulate group creation
                        setTimeout(() => {
                          const groupLink = `https://t.me/+${Math.random().toString(36).substring(2, 15)}`;
                          setTelegramData({
                            ...telegramData,
                            isCreating: false,
                            groupCreated: true,
                            groupLink: groupLink,
                            isConfigured: true
                          });
                          
                          // Save progress
                          saveProgress({
                            telegramData: {
                              ...telegramData,
                              isCreating: false,
                              groupCreated: true,
                              groupLink: groupLink,
                              isConfigured: true
                            }
                          });
                        }, 2000);
                      }
                    }}
                    disabled={!telegramData.restaurantName || telegramData.groupCreated || telegramData.isCreating}
                    className={`w-full px-4 py-2.5 font-medium rounded-lg transition-all flex items-center justify-center ${
                      telegramData.groupCreated 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : telegramData.isCreating
                        ? 'bg-[#2BE89A]/20 text-gray-600 cursor-wait'
                        : !telegramData.restaurantName
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black hover:opacity-90'
                    }`}
                  >
                    {telegramData.isCreating ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('restaurants.onboarding.steps.telegram.step2.creating')}
                      </>
                    ) : telegramData.groupCreated ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        {t('restaurants.onboarding.steps.telegram.step2.created')}
                      </>
                    ) : (
                      t('restaurants.onboarding.steps.telegram.step2.createButton')
                    )}
                  </button>
                </div>

                {/* Step 3: Join Group and Share Link */}
                {telegramData.groupCreated && (
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <div className="flex items-start mb-4">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2BE89A] text-black text-xs font-semibold mr-3 flex-shrink-0">3</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">{t('restaurants.onboarding.steps.telegram.step3.title')}</p>
                        <p className="text-xs text-gray-600">{t('restaurants.onboarding.steps.telegram.step3.description')}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3">
                        <input
                          type="text"
                          value={telegramData.groupLink}
                          readOnly
                          className="flex-1 bg-transparent text-sm text-gray-900 font-mono outline-none"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(telegramData.groupLink);
                            setShowCopiedMessage(true);
                            setTimeout(() => setShowCopiedMessage(false), 2000);
                          }}
                          className="ml-3 p-2 hover:bg-gray-50 rounded-md transition"
                        >
                          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => window.open(telegramData.groupLink, '_blank')}
                        className="w-full px-4 py-2.5 bg-[#0088cc] text-white font-medium rounded-lg hover:bg-[#0077b5] transition flex items-center justify-center"
                      >
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.56c-.21 2.2-1.11 7.53-1.57 10-.2 1.04-.59 1.39-.96 1.42-.82.06-1.44-.54-2.24-.98-1.24-.68-1.94-1.1-3.14-1.77-1.39-.77-.49-1.19.3-1.88.21-.18 3.85-3.53 3.92-3.83.01-.04.01-.18-.07-.26-.09-.07-.22-.05-.31-.03-.13.03-2.2 1.4-6.2 4.11-.59.4-1.12.6-1.6.59-.53-.01-1.54-.3-2.29-.54-.92-.3-1.65-.46-1.59-.97.03-.27.4-.54 1.12-.83 4.38-1.91 7.3-3.17 8.77-3.78C15.84 9.57 16.34 9.4 16.73 9.4c.09 0 .29.02.42.12.11.08.14.2.16.28-.01.05.01.12 0 .24z"/>
                        </svg>
                        {t('restaurants.onboarding.steps.telegram.step3.joinButton')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {telegramData.isConfigured && (
                  <div className="bg-[#2BE89A]/5 rounded-lg p-4 border border-[#2BE89A]/20">
                    <p className="text-sm text-gray-700 flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-[#2BE89A] mr-2" />
                      {t('restaurants.onboarding.steps.telegram.successMessage', { restaurantName: restaurant?.name })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Layout>
      <OnboardingSidebar
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepChange={handleStepChange}
        restaurant={restaurant}
      >
        <div>
          {/* Locked State Banner for Archived Restaurants */}
          {isLocked && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                    <LockClosedIcon className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Restaurant is gearchiveerd</h3>
                    <p className="text-sm text-gray-600">
                      Dit restaurant is gearchiveerd. Je kunt de onboarding voortgang bekijken maar geen wijzigingen maken.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    restoreRestaurant(id)
                    router.reload()
                  }}
                  className="flex items-center px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-600 transition-colors"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Herstel om door te gaan
                </button>
              </div>
            </div>
          )}

          {showWelcome && !isLocked ? (
            // Welcome Screen - Cleaner Design
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-700">
              {/* Header Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2BE89A]/10 via-transparent to-[#4FFFB0]/10" />
                <div className="relative px-8 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-2xl mb-6">
                    <RocketLaunchIcon className="h-8 w-8 text-black" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {t('restaurants.onboarding.welcome.title')}
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {t('restaurants.onboarding.welcome.subtitle', { restaurantName: restaurant?.name })}
                  </p>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="px-8 pb-8">
                {/* Feature Cards - Cleaner Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-[#2BE89A] hover:shadow-md transition-all">
                    <UserGroupIcon className="h-8 w-8 text-[#2BE89A] mb-3" />
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('restaurants.onboarding.welcome.features.personnel.title')}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {t('restaurants.onboarding.welcome.features.personnel.description')}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-[#2BE89A] hover:shadow-md transition-all">
                    <CreditCardIcon className="h-8 w-8 text-[#2BE89A] mb-3" />
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('restaurants.onboarding.welcome.features.payments.title')}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {t('restaurants.onboarding.welcome.features.payments.description')}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-[#2BE89A] hover:shadow-md transition-all">
                    <WifiIcon className="h-8 w-8 text-[#2BE89A] mb-3" />
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('restaurants.onboarding.welcome.features.posSystem.title')}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {t('restaurants.onboarding.welcome.features.posSystem.description')}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-[#2BE89A] hover:shadow-md transition-all">
                    <StarIcon className="h-8 w-8 text-[#2BE89A] mb-3" />
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('restaurants.onboarding.welcome.features.reviews.title')}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {t('restaurants.onboarding.welcome.features.reviews.description')}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-[#2BE89A] hover:shadow-md transition-all">
                    <QrCodeIcon className="h-8 w-8 text-[#2BE89A] mb-3" />
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('restaurants.onboarding.welcome.features.qrStands.title')}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {t('restaurants.onboarding.welcome.features.qrStands.description')}
                    </p>
                  </div>
                </div>
                
                {/* Info Cards - Simplified */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-[#2BE89A]/10 rounded-lg mb-2">
                      <ClockIcon className="h-5 w-5 text-[#2BE89A]" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{t('restaurants.onboarding.welcome.info.estimatedTime')}</p>
                    <p className="text-xs text-gray-600 mt-1">{t('restaurants.onboarding.welcome.info.estimatedTimeDesc')}</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-[#2BE89A]/10 rounded-lg mb-2">
                      <ShieldCheckIcon className="h-5 w-5 text-[#2BE89A]" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{t('restaurants.onboarding.welcome.info.autoSaved')}</p>
                    <p className="text-xs text-gray-600 mt-1">{t('restaurants.onboarding.welcome.info.autoSavedDesc')}</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-[#2BE89A]/10 rounded-lg mb-2">
                      <SparklesIcon className="h-5 w-5 text-[#2BE89A]" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{t('restaurants.onboarding.welcome.info.instantActive')}</p>
                    <p className="text-xs text-gray-600 mt-1">{t('restaurants.onboarding.welcome.info.instantActiveDesc')}</p>
                  </div>
                </div>
                
                {/* CTA Button */}
                <button
                  onClick={() => {
                    setShowWelcome(false)
                    setCurrentStep(1)
                  }}
                  disabled={isLocked}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-semibold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center text-base">
                    {t('restaurants.onboarding.welcome.startButton')}
                    <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          ) : !isLocked ? (
            // Regular Onboarding Flow
            <div className="space-y-6">
              {/* Step Content */}
              {renderStepContent()}

              {/* Navigation */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex justify-between items-center">
                  {currentStep > 1 ? (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      <ChevronLeftIcon className="h-5 w-5 mr-2 inline" />
                      Vorige
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={handleCompleteStep}
                    disabled={isLocked || (currentStep === 1 && personnelData.filter(p => p.role === 'manager').length === 0)}
                    className={`px-8 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group`}
                  >
                    {currentStep === 6 ? (
                      <>
                        {t('restaurants.onboarding.steps.navigation.complete')}
                        <CheckCircleIcon className="h-5 w-5 ml-2 inline group-hover:scale-110 transition-transform" />
                      </>
                    ) : (
                      <>
                        {t('restaurants.onboarding.steps.navigation.next')}
                        <ChevronRightIcon className="h-5 w-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Show read-only view when locked OR regular view
            <div className="space-y-6">
              {isLocked ? (
                // Read-only content when locked
                <div className="opacity-75 pointer-events-none">
                  {renderStepContent()}
                </div>
              ) : (
                // Regular editable content
                renderStepContent()
              )}
            </div>
          )}
        </div>
      </OnboardingSidebar>
    </Layout>
  )
}
export default RestaurantOnboarding
