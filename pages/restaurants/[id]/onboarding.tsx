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
  const [currentStep, setCurrentStep] = useState(1)
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
    role: 'staff'
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
            let nextStep = 1;
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
          // No saved data, start at step 1
          if (!hasInitialized) {
            setCurrentStep(1);
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
    // Allow navigation even when locked, but just for viewing
    setCurrentStep(step)
    
    // Only save progress if not locked
    if (!isLocked) {
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
        role: 'staff'
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
    
    if (currentStep < 5) {
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
        qrStandData
      });
    } else if (currentStep === 5) {
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
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('restaurants.onboarding.steps.personnel.title')}</h3>
                  <p className="text-gray-600">
                    {t('restaurants.onboarding.steps.personnel.subtitle')} • {t('restaurants.onboarding.steps.personnel.usersAdded', { count: personnelData.length })}
                  </p>
                </div>
                <UserGroupIcon className="h-12 w-12 text-gray-600 opacity-20" />
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
                <div className="bg-gray-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">{t('restaurants.onboarding.steps.personnel.addNewUserForm')}</h4>
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
                          role: 'staff'
                        });
                        setEmailError('');
                        setPhoneError('');
                        setPasswordError('');
                        setShowPassword(false);
                        setShowPasswordConfirm(false);
                      }}
                      className="text-gray-600 hover:text-gray-900 transition p-2"
                    >
                      <XMarkIcon className="h-5 w-5" />
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
                          onClick={() => setNewPerson({...newPerson, role: 'staff'})}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            newPerson.role === 'staff'
                              ? 'bg-blue-50 border-blue-400 text-gray-900'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-400/50'
                          }`}
                        >
                          <UserGroupIcon className="h-6 w-6 mx-auto mb-2" />
                          <p className="font-medium">{t('restaurants.onboarding.steps.personnel.form.staff')}</p>
                          <p className="text-xs mt-1 opacity-75">{t('restaurants.onboarding.steps.personnel.form.basicAccess')}</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewPerson({...newPerson, role: 'manager'})}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            newPerson.role === 'manager'
                              ? 'bg-green-50 border-green-400 text-gray-900'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300'
                          }`}
                        >
                          <ShieldCheckIcon className="h-6 w-6 mx-auto mb-2" />
                          <p className="font-medium">{t('restaurants.onboarding.steps.personnel.form.manager')}</p>
                          <p className="text-xs mt-1 opacity-75">{t('restaurants.onboarding.steps.personnel.form.fullAccess')}</p>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddPerson}
                      disabled={!newPerson.firstName || !newPerson.lastName || !newPerson.email || !newPerson.password || !newPerson.passwordConfirm}
                      className="w-full px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('restaurants.onboarding.steps.personnel.form.addUser')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowPersonForm(true)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-600 hover:border-green-300 hover:bg-gray-50 transition-all group"
                >
                  <UserGroupIcon className="h-8 w-8 mx-auto mb-2 group-hover:text-green-500 transition" />
                  <p className="font-medium group-hover:text-gray-900 transition">{t('restaurants.onboarding.steps.personnel.addNewUser')}</p>
                </button>
              )}

              {/* Info Box */}
              <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="text-green-500 font-medium">{t('restaurants.onboarding.steps.personnel.tip')}</span> {t('restaurants.onboarding.steps.personnel.tipMessage')}
                </p>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            {/* Main Content Card */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('restaurants.onboarding.steps.stripe.title')}</h3>
                  <p className="text-gray-600">
                    {t('restaurants.onboarding.steps.stripe.subtitle')} {stripeData.connected && `• ✓ ${t('restaurants.onboarding.steps.stripe.connected')}`}
                  </p>
                </div>
                <CreditCardIcon className="h-12 w-12 text-gray-600 opacity-20" />
              </div>

              <div className="space-y-6">
                {!stripeData.connected ? (
                  <>
                    {/* Restaurant Info - Disabled */}
                    <div className="opacity-50 cursor-not-allowed">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t('restaurants.onboarding.steps.stripe.restaurant')}
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                        {restaurant?.name}
                      </div>
                    </div>

                    {/* Stripe Connect Info */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <h4 className="text-base font-medium text-gray-900 mb-4">{t('restaurants.onboarding.steps.stripe.integration.title')}</h4>
                      <p className="text-sm text-gray-600 mb-6">
                        {t('restaurants.onboarding.steps.stripe.integration.description')}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <ShieldCheckIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-xs text-gray-600">{t('restaurants.onboarding.steps.stripe.integration.features.pciCompliant')}</p>
                        </div>
                        <div className="text-center">
                          <ClockIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-xs text-gray-600">{t('restaurants.onboarding.steps.stripe.integration.features.dailyPayout')}</p>
                        </div>
                        <div className="text-center">
                          <SparklesIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-xs text-gray-600">{t('restaurants.onboarding.steps.stripe.integration.features.realTimeInsight')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Connect Button - Disabled until API integration */}
                    <button
                      onClick={() => {
                        // TODO: Implement Stripe Connect OAuth flow
                        alert('Stripe Connect integratie komt binnenkort beschikbaar. Neem contact op met het Splitty team voor handmatige setup.');
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg opacity-75 cursor-not-allowed transition-all shadow-lg flex items-center justify-center"
                      disabled
                    >
                      <svg className="w-20 h-6 mr-3" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M59.64 14.28C59.64 8.46 56.37 5.43 51.54 5.43C46.68 5.43 43.08 8.49 43.08 14.34C43.08 21.27 47.61 23.7 52.74 23.7C55.26 23.7 57.18 23.13 58.59 22.26V18.42C57.18 19.2 55.5 19.65 53.28 19.65C51.24 19.65 49.44 18.96 49.05 16.26H59.55C59.55 15.99 59.64 14.91 59.64 14.28ZM49.02 12.72C49.02 10.11 50.61 9.21 51.51 9.21C52.38 9.21 53.88 10.11 53.88 12.72H49.02ZM40.68 14.28C40.68 8.52 37.77 5.43 33.15 5.43C28.53 5.43 25.32 8.52 25.32 14.28C25.32 20.04 28.53 23.13 33.15 23.13C37.77 23.13 40.68 20.04 40.68 14.28ZM34.65 14.28C34.65 10.5 33.72 9.48 33.15 9.48C32.58 9.48 31.65 10.5 31.65 14.28C31.65 18.06 32.58 19.08 33.15 19.08C33.72 19.08 34.65 18.06 34.65 14.28ZM23.4 11.61C23.4 9.75 22.56 5.7 16.56 5.7C14.07 5.7 12.15 6.45 10.83 7.41L12.24 10.86C13.38 10.05 14.88 9.48 16.23 9.48C17.58 9.48 17.7 10.38 17.7 10.89V11.16C12.84 11.16 9.36 12.87 9.36 17.07C9.36 20.4 11.73 23.13 15.12 23.13C17.01 23.13 18.24 22.32 19.02 21.21H19.14C19.14 21.21 19.83 24.42 24.84 22.77C23.82 21.3 23.4 18.78 23.4 16.59V11.61ZM17.91 16.56C17.91 16.89 17.88 17.25 17.79 17.58C17.58 18.39 16.89 19.26 15.75 19.26C14.88 19.26 14.31 18.66 14.31 17.46C14.31 15.51 16.17 14.94 17.91 14.94V16.56ZM7.68 2.31L0 22.77H6.18L9.15 14.16L10.74 9.21H10.86L11.73 14.16L13.2 22.77H19.71L18.42 2.31H7.68Z" fill="currentColor"/>
                      </svg>
                      <span className="text-base">{t('restaurants.onboarding.steps.stripe.integration.connectButton')}</span>
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    {/* Success State */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-green-200">
                      <div className="flex items-center mb-4">
                        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                        <h4 className="text-base font-medium text-gray-900">{t('restaurants.onboarding.steps.stripe.success.title')}</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t('restaurants.onboarding.steps.stripe.success.accountId')}</span>
                          <span className="text-sm text-gray-900 font-mono">{stripeData.accountId || 'acct_demo_123456'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t('restaurants.onboarding.steps.stripe.success.status')}</span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-500">
                            {t('restaurants.onboarding.steps.stripe.success.active')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Uitbetaling frequentie</span>
                          <span className="text-sm text-gray-900">Dagelijks</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <p className="text-sm text-gray-600">
                        ✓ Het restaurant kan nu split betalingen ontvangen. Uitbetalingen gebeuren automatisch naar de gekoppelde bankrekening.
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
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('restaurants.onboarding.steps.pos.title')}</h3>
                  <p className="text-gray-600">
                    {t('restaurants.onboarding.steps.pos.subtitle', { restaurantName: restaurant?.name })}
                  </p>
                </div>
                <WifiIcon className="h-12 w-12 text-gray-600 opacity-20" />
              </div>

              <div className="space-y-6">
                {/* Restaurant Selection - Disabled in onboarding as we already know the restaurant */}
                <div className="opacity-50 cursor-not-allowed">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {t('restaurants.onboarding.steps.pos.restaurant')} <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-gray-900 font-medium">{restaurant?.name}</span>
                    <span className="text-gray-600 ml-3">
                      • {restaurant?.address 
                          ? `${restaurant.address.street || ''} ${restaurant.address.postalCode || ''} ${restaurant.address.city || ''}`
                          : restaurant?.location}
                    </span>
                  </div>
                </div>

                {/* POS Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {t('restaurants.onboarding.steps.pos.posSystem')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={posData.posType}
                    onChange={(e) => setPosData({...posData, posType: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      {t('restaurants.onboarding.steps.pos.posUsername')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={posData.username}
                      onChange={(e) => setPosData({...posData, username: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('restaurants.onboarding.steps.pos.posUsernamePlaceholder')}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      {t('restaurants.onboarding.steps.pos.posPassword')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={posData.password}
                      onChange={(e) => setPosData({...posData, password: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('restaurants.onboarding.steps.pos.posPasswordPlaceholder')}
                      required
                    />
                  </div>
                </div>

                {/* Base URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {t('restaurants.onboarding.steps.pos.apiUrl')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t('restaurants.onboarding.steps.pos.apiUrlPlaceholder')}
                    value={posData.baseUrl}
                    onChange={(e) => setPosData({...posData, baseUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Environment */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {t('restaurants.onboarding.steps.pos.environment')}
                  </label>
                  <select
                    value={posData.environment}
                    onChange={(e) => setPosData({...posData, environment: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="production">{t('restaurants.onboarding.steps.pos.production')}</option>
                    <option value="staging">{t('restaurants.onboarding.steps.pos.staging')}</option>
                    <option value="development">{t('restaurants.onboarding.steps.pos.development')}</option>
                    <option value="test">{t('restaurants.onboarding.steps.pos.test')}</option>
                  </select>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="is-active"
                      type="checkbox"
                      checked={posData.isActive}
                      onChange={(e) => setPosData({...posData, isActive: e.target.checked})}
                      className="h-4 w-4 rounded border-gray-200 bg-gray-50 text-green-500 focus:ring-green-500 focus:ring-offset-0 focus:ring-offset-[#0F1117]"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="is-active" className="text-sm font-medium text-gray-900">
                      {t('restaurants.onboarding.steps.pos.activate')}
                    </label>
                    <p className="text-sm text-gray-600">{t('restaurants.onboarding.steps.pos.activateDescription', { restaurantName: restaurant?.name })}</p>
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
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg"
                >
                  {t('restaurants.onboarding.steps.pos.testConnection')}
                </button>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            {/* Main Content Card */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('restaurants.onboarding.steps.qrHolders.title')}</h3>
                  <p className="text-gray-600">
                    {t('restaurants.onboarding.steps.qrHolders.subtitle', { restaurantName: restaurant?.name })}
                  </p>
                </div>
                <QrCodeIcon className="h-12 w-12 text-gray-600 opacity-20" />
              </div>

              <div className="space-y-8">
                {/* QR Stand Design Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-4">
                    {t('restaurants.onboarding.steps.qrHolders.selectDesign')}
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { id: 'houder1', name: 'HOUDER#1', color: 'from-[#2BE89A] to-[#4FFFB0]' },
                      { id: 'houder2', name: 'HOUDER#2', color: 'from-[#635BFF] to-[#7C3AED]' },
                      { id: 'houder3', name: 'HOUDER#3', color: 'from-[#BBBECC] to-[#ffffff]' },
                      { id: 'houder4', name: 'HOUDER#4', color: 'from-[#FF6B6B] to-[#FF8E53]' }
                    ].map((design) => (
                      <button
                        key={design.id}
                        type="button"
                        onClick={() => setQrStandData({...qrStandData, selectedDesign: design.id, isConfigured: true})}
                        className={`p-6 rounded-xl border-2 transition-all group ${
                          qrStandData.selectedDesign === design.id
                            ? 'border-green-400 bg-green-50'
                            : 'border-gray-200 bg-gray-50 hover:border-green-300'
                        }`}
                      >
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${design.color} flex items-center justify-center`}>
                          <QrCodeIcon className="h-8 w-8 text-black" />
                        </div>
                        <p className="text-gray-900 font-medium text-sm">{design.name}</p>
                        <div className="mt-2 w-full h-1 bg-gray-200 rounded-full">
                          <div className={`h-1 rounded-full bg-gradient-to-r ${design.color} transition-all duration-300 ${
                            qrStandData.selectedDesign === design.id ? 'w-full' : 'w-0'
                          }`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Count by Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-4">
                    {t('restaurants.onboarding.steps.qrHolders.tablesPerSection')}
                  </label>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Bar */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">{t('restaurants.onboarding.steps.qrHolders.sections.bar')}</label>
                      <input
                        type="number"
                        value={qrStandData.tableSections?.bar || ''}
                        onChange={(e) => {
                          const newSections = {...qrStandData.tableSections, bar: e.target.value};
                          const total = Object.values(newSections).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
                          setQrStandData({...qrStandData, tableSections: newSections, tableCount: total.toString(), isConfigured: true});
                        }}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        max="50"
                      />
                    </div>
                    {/* Binnen */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">{t('restaurants.onboarding.steps.qrHolders.sections.inside')}</label>
                      <input
                        type="number"
                        value={qrStandData.tableSections?.binnen || ''}
                        onChange={(e) => {
                          const newSections = {...qrStandData.tableSections, binnen: e.target.value};
                          const total = Object.values(newSections).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
                          setQrStandData({...qrStandData, tableSections: newSections, tableCount: total.toString(), isConfigured: true});
                        }}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        max="50"
                      />
                    </div>
                    {/* Terras */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">{t('restaurants.onboarding.steps.qrHolders.sections.terrace')}</label>
                      <input
                        type="number"
                        value={qrStandData.tableSections?.terras || ''}
                        onChange={(e) => {
                          const newSections = {...qrStandData.tableSections, terras: e.target.value};
                          const total = Object.values(newSections).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
                          setQrStandData({...qrStandData, tableSections: newSections, tableCount: total.toString(), isConfigured: true});
                        }}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        max="50"
                      />
                    </div>
                    {/* Lounge */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">{t('restaurants.onboarding.steps.qrHolders.sections.lounge')}</label>
                      <input
                        type="number"
                        value={qrStandData.tableSections?.lounge || ''}
                        onChange={(e) => {
                          const newSections = {...qrStandData.tableSections, lounge: e.target.value};
                          const total = Object.values(newSections).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
                          setQrStandData({...qrStandData, tableSections: newSections, tableCount: total.toString(), isConfigured: true});
                        }}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        max="50"
                      />
                    </div>
                  </div>
                  
                  {/* Total Calculator */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">{t('restaurants.onboarding.steps.qrHolders.totalTables')}</span>
                      <span className="text-xl font-bold text-green-500">
                        {qrStandData.tableCount || '0'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
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
                      {qrStandData.floorPlans.map((file, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 bg-green-100 rounded">
                                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-900 font-medium truncate">{file.name}</p>
                                <p className="text-xs text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
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
                      ))}
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
                        accept=".png,.jpg,.jpeg,.pdf"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          if (files.length > 0) {
                            const currentFiles = qrStandData.floorPlans || [];
                            setQrStandData({...qrStandData, floorPlans: [...currentFiles, ...files], isConfigured: true});
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

                {/* Configuration Summary */}
                {qrStandData.isConfigured && (
                  <div className="bg-gray-50 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center mb-4">
                      <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                      <h4 className="text-base font-medium text-gray-900">QR Stand Configuratie</h4>
                    </div>
                    <div className="space-y-3">
                      {qrStandData.selectedDesign && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Design</span>
                          <span className="text-sm text-gray-900 font-medium uppercase">
                            {qrStandData.selectedDesign.replace('houder', 'HOUDER#')}
                          </span>
                        </div>
                      )}
                      {qrStandData.tableCount && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Totaal aantal tafels</span>
                            <span className="text-sm text-gray-900 font-medium">{qrStandData.tableCount}</span>
                          </div>
                          {qrStandData.tableSections && (qrStandData.tableSections.bar || qrStandData.tableSections.binnen || qrStandData.tableSections.terras || qrStandData.tableSections.lounge) && (
                            <div className="pl-4 space-y-1">
                              {qrStandData.tableSections.bar > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-600">• Bar</span>
                                  <span className="text-xs text-gray-900">{qrStandData.tableSections.bar}</span>
                                </div>
                              )}
                              {qrStandData.tableSections.binnen > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-600">• Binnen</span>
                                  <span className="text-xs text-gray-900">{qrStandData.tableSections.binnen}</span>
                                </div>
                              )}
                              {qrStandData.tableSections.terras > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-600">• Terras</span>
                                  <span className="text-xs text-gray-900">{qrStandData.tableSections.terras}</span>
                                </div>
                              )}
                              {qrStandData.tableSections.lounge > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-600">• Lounge</span>
                                  <span className="text-xs text-gray-900">{qrStandData.tableSections.lounge}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                      {qrStandData.floorPlans && qrStandData.floorPlans.length > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Bestanden</span>
                          <span className="text-sm text-gray-900 font-medium">{qrStandData.floorPlans.length} bestand{qrStandData.floorPlans.length > 1 ? 'en' : ''}</span>
                        </div>
                      )}
                    </div>
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
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('restaurants.onboarding.steps.googleReviews.title')}</h3>
                  <p className="text-gray-600">
                    {t('restaurants.onboarding.steps.googleReviews.subtitle', { restaurantName: restaurant?.name })}
                  </p>
                </div>
                <StarIcon className="h-12 w-12 text-gray-600 opacity-20" />
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
                        <span className="text-xs text-green-500 font-medium mr-2">Gekopieerd!</span>
                      ) : null}
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Instructions with Steps */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-4">{t('restaurants.onboarding.steps.googleReviews.setupTitle', { restaurantName: restaurant?.name })}</h4>
                  
                  {/* Step 1 */}
                  <div className="mb-6">
                    <div className="flex items-start mb-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-500 text-black text-sm font-bold mr-3 flex-shrink-0">1</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium mb-2">{t('restaurants.onboarding.steps.googleReviews.step1', { restaurantName: restaurant?.name })}</p>
                        <a 
                          href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black text-sm font-medium rounded-lg hover:opacity-90 transition"
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
                  <div className="mb-6">
                    <div className="flex items-start">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-500 text-black text-sm font-bold mr-3 flex-shrink-0">2</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium mb-1">{t('restaurants.onboarding.steps.googleReviews.step2')}</p>
                        <p className="text-xs text-gray-600">{t('restaurants.onboarding.steps.googleReviews.step2Desc', { restaurantName: restaurant?.name })}</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="mb-6">
                    <div className="flex items-start">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-500 text-black text-sm font-bold mr-3 flex-shrink-0">3</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium mb-1">{t('restaurants.onboarding.steps.googleReviews.step3')}</p>
                        <p className="text-xs text-gray-600">{t('restaurants.onboarding.steps.googleReviews.step3Desc')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div>
                    <div className="flex items-start">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-500 text-black text-sm font-bold mr-3 flex-shrink-0">4</span>
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
                  <div className="bg-gray-50 rounded-lg p-5 border border-green-200">
                    <p className="text-sm text-gray-600 flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      Review link toegevoegd! Klanten van {restaurant?.name} ontvangen na betaling een review verzoek.
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
            // Welcome Screen
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-transparent to-blue-100" />
                <div className="relative px-8 py-10 lg:py-12 xl:py-14 2xl:py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-full mb-4 lg:mb-5 xl:mb-6 animate-pulse">
                    <RocketLaunchIcon className="h-8 w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10 text-black" />
                  </div>
                  <h1 className="text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 lg:mb-3 xl:mb-4">
                    {t('restaurants.onboarding.welcome.title')}
                  </h1>
                  <p className="text-lg lg:text-lg xl:text-xl text-gray-600 mb-0 max-w-3xl mx-auto">
                    {t('restaurants.onboarding.welcome.subtitle', { restaurantName: restaurant?.name })}
                  </p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-all group">
                    <UserGroupIcon className="h-10 w-10 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('restaurants.onboarding.welcome.features.personnel.title')}</h3>
                    <p className="text-sm text-gray-600">
                      {t('restaurants.onboarding.welcome.features.personnel.description')}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-green-400 transition-all group">
                    <CreditCardIcon className="h-10 w-10 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('restaurants.onboarding.welcome.features.payments.title')}</h3>
                    <p className="text-sm text-gray-600">
                      {t('restaurants.onboarding.welcome.features.payments.description')}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gray-400 transition-all group">
                    <WifiIcon className="h-10 w-10 text-gray-600 mb-4 group-hover:text-gray-900 transition-all" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('restaurants.onboarding.welcome.features.posSystem.title')}</h3>
                    <p className="text-sm text-gray-600">
                      {t('restaurants.onboarding.welcome.features.posSystem.description')}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-yellow-400 transition-all group">
                    <StarIcon className="h-10 w-10 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('restaurants.onboarding.welcome.features.reviews.title')}</h3>
                    <p className="text-sm text-gray-600">
                      {t('restaurants.onboarding.welcome.features.reviews.description')}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-all group">
                    <QrCodeIcon className="h-10 w-10 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('restaurants.onboarding.welcome.features.qrStands.title')}</h3>
                    <p className="text-sm text-gray-600">
                      {t('restaurants.onboarding.welcome.features.qrStands.description')}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <ClockIcon className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-900 font-medium">{t('restaurants.onboarding.welcome.info.estimatedTime')}</p>
                    <p className="text-xs text-gray-600">{t('restaurants.onboarding.welcome.info.estimatedTimeDesc')}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <ShieldCheckIcon className="h-6 w-6 text-gray-900 mx-auto mb-2" />
                    <p className="text-sm text-gray-900 font-medium">{t('restaurants.onboarding.welcome.info.autoSaved')}</p>
                    <p className="text-xs text-gray-600">{t('restaurants.onboarding.welcome.info.autoSavedDesc')}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <SparklesIcon className="h-6 w-6 text-gray-900 mx-auto mb-2" />
                    <p className="text-sm text-gray-900 font-medium">{t('restaurants.onboarding.welcome.info.instantActive')}</p>
                    <p className="text-xs text-gray-600">{t('restaurants.onboarding.welcome.info.instantActiveDesc')}</p>
                  </div>
                </div>
              </div>
              
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => setShowWelcome(false)}
                  disabled={isLocked}
                  className="w-full px-8 py-5 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-bold rounded-xl hover:opacity-90 transition-all text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center">
                    {t('restaurants.onboarding.welcome.startButton')}
                    <ArrowRightIcon className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
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
                    {currentStep === 5 ? (
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
