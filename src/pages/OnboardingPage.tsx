import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Dumbbell, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  User,
  Scale,
  Heart,
  Apple,
  Sun,
  Moon,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Building2,
  Globe2,
  Check,
  Ruler,
  Activity,
  Users,
  Shield,
  CreditCard,
  Share2,
  FileText,
  Loader2
} from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { UserProfile } from '../types/onboarding';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '../components/auth/AuthModal';
import { subscriptionPlans } from '../data/subscriptions';

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Step 1: Payment Model Selection
    payment_model: '', // 'subscription' or 'pay-as-you-go'
    
    // Step 1b: Package Selection (if subscription)
    selected_package: '',
    
    // Step 2: Personal Information
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    state: '',
    date_of_birth: '',
    gender: '',
    
    // Step 3: Physical Stats
    height_feet: '',
    height_inches: '',
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    
    // Step 4: Health & Medical (moved goals to step 5)
    medical_conditions: [] as string[],
    injuries: '',
    medications: '',
    doctor_clearance: '',
    
    // Step 5: Fitness Goals & Level (enhanced)
    specific_goal: '',
    target_date: '',
    current_activity_level: '',
    
    // Step 6: Emergency Contact
    emergency_name: '',
    emergency_phone: '',
    emergency_relationship: '',
    
    // Step 7: Scheduling (enhanced)
    preferred_days: [] as string[],
    sessions_per_week: '',
    
    // Step 8: Legal & Waivers
    liability_waiver: false,
    terms_accepted: false,
    photo_consent: false,
    
    // Step 9: Payment (placeholder)
    payment_method: '',
    
    // Step 10: Referral
    referral_source: ''
  });

  const stateAbbreviations: { [key: string]: string } = {
    'alabama': 'AL',
    'alaska': 'AK',
    'arizona': 'AZ',
    'arkansas': 'AR',
    'california': 'CA',
    'colorado': 'CO',
    'connecticut': 'CT',
    'delaware': 'DE',
    'florida': 'FL',
    'georgia': 'GA',
    'hawaii': 'HI',
    'idaho': 'ID',
    'illinois': 'IL',
    'indiana': 'IN',
    'iowa': 'IA',
    'kansas': 'KS',
    'kentucky': 'KY',
    'louisiana': 'LA',
    'maine': 'ME',
    'maryland': 'MD',
    'massachusetts': 'MA',
    'michigan': 'MI',
    'minnesota': 'MN',
    'mississippi': 'MS',
    'missouri': 'MO',
    'montana': 'MT',
    'nebraska': 'NE',
    'nevada': 'NV',
    'new hampshire': 'NH',
    'new jersey': 'NJ',
    'new mexico': 'NM',
    'new york': 'NY',
    'north carolina': 'NC',
    'north dakota': 'ND',
    'ohio': 'OH',
    'oklahoma': 'OK',
    'oregon': 'OR',
    'pennsylvania': 'PA',
    'rhode island': 'RI',
    'south carolina': 'SC',
    'south dakota': 'SD',
    'tennessee': 'TN',
    'texas': 'TX',
    'utah': 'UT',
    'vermont': 'VT',
    'virginia': 'VA',
    'washington': 'WA',
    'west virginia': 'WV',
    'wisconsin': 'WI',
    'wyoming': 'WY'
  };

  useEffect(() => {
    // If user is already logged in and has a profile, redirect to dashboard
    if (user) {
      checkExistingProfile();
    }
  }, [user]);

  const checkExistingProfile = async () => {
    if (!user) return;
    
    try {
      const { data: profile, error: queryError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (queryError) {
        throw queryError;
      }

      // Only redirect if a profile exists
      if (profile) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setError('Failed to check existing profile. Please try again.');
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
    } else if (name === 'first_name' || name === 'last_name') {
      const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
      setFormData(prev => ({
        ...prev,
        [name]: capitalizedValue
      }));
    } else if (name === 'city') {
      const capitalizedCity = value.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      setFormData(prev => ({
        ...prev,
        [name]: capitalizedCity
      }));
    } else if (name === 'state') {
      const lowercaseValue = value.toLowerCase();
      const stateAbbr = stateAbbreviations[lowercaseValue] || value.toUpperCase();
      setFormData(prev => ({
        ...prev,
        [name]: stateAbbr
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const medicalConditions = [
    'Heart Disease',
    'High Blood Pressure',
    'Diabetes',
    'Asthma',
    'Joint Problems',
    'Back Pain',
    'Pregnancy',
    'Recent Surgery',
    'None'
  ];

  const daysOfWeek = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

  const referralSources = [
    'Google Search',
    'Social Media (Instagram, Facebook, etc.)',
    'Friend or Family Referral',
    'Gym or Fitness Center',
    'Online Ad',
    'Article or Blog',
    'Other'
  ];

  const fitnessGoals = [
    {
      id: 'weight-loss',
      title: 'Weight Loss',
      description: 'Burn fat and achieve a healthier weight',
      icon: <Scale className="w-6 h-6" />
    },
    {
      id: 'muscle-gain',
      title: 'Muscle Gain',
      description: 'Build strength and increase muscle mass',
      icon: <Dumbbell className="w-6 h-6" />
    },
    {
      id: 'endurance',
      title: 'Endurance',
      description: 'Improve stamina and cardiovascular health',
      icon: <Heart className="w-6 h-6" />
    },
    {
      id: 'flexibility',
      title: 'Flexibility',
      description: 'Enhance mobility and reduce injury risk',
      icon: <User className="w-6 h-6" />
    }
  ];

  const fitnessLevels = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'New to fitness or returning after a long break',
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Regular exercise with basic form knowledge',
      icon: <Dumbbell className="w-6 h-6" />
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Experienced with complex exercises',
      icon: <Target className="w-6 h-6" />
    }
  ];

  const dietaryPreferences = [
    {
      id: 'none',
      title: 'No Restrictions',
      description: 'I eat everything',
      icon: <Apple className="w-6 h-6" />
    },
    {
      id: 'vegetarian',
      title: 'Vegetarian',
      description: 'Plant-based diet with dairy and eggs',
      icon: <Apple className="w-6 h-6" />
    },
    {
      id: 'vegan',
      title: 'Vegan',
      description: 'Strictly plant-based diet',
      icon: <Apple className="w-6 h-6" />
    },
    {
      id: 'keto',
      title: 'Keto',
      description: 'Low-carb, high-fat diet',
      icon: <Apple className="w-6 h-6" />
    }
  ];

  const workoutTimes = [
    {
      id: 'morning',
      title: 'Morning',
      description: '6 AM - 10 AM',
      icon: <Sun className="w-6 h-6" />
    },
    {
      id: 'afternoon',
      title: 'Afternoon',
      description: '11 AM - 4 PM',
      icon: <Sun className="w-6 h-6" />
    },
    {
      id: 'evening',
      title: 'Evening',
      description: '5 PM - 9 PM',
      icon: <Moon className="w-6 h-6" />
    }
  ];

  const handleNext = () => {
    // Validate each step before proceeding
    if (step === 1 && !formData.payment_model) {
      setError('Please select a payment option to continue.');
      return;
    }
    if (step === 1 && formData.payment_model === 'subscription' && !formData.selected_package) {
      setError('Please select a subscription package to continue.');
      return;
    }
    if (step === 2 && !isPersonalInfoComplete()) {
      setError('Please complete all required personal information fields.');
      return;
    }
    if (step === 3 && !isPhysicalStatsComplete()) {
      setError('Please enter your height and weight.');
      return;
    }
    if (step === 6 && !isEmergencyContactComplete()) {
      setError('Please provide emergency contact information.');
      return;
    }
    if (step === 7 && !isSchedulingComplete()) {
      setError('Please select your preferred days and session frequency.');
      return;
    }
    if (step === 8 && !areLegalWaiversAccepted()) {
      setError('You must accept all legal agreements to continue.');
      return;
    }
    
    setError(null);
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPersonalInfoComplete = () => {
    const requiredFields = ['first_name', 'last_name', 'phone', 'city', 'state', 'date_of_birth', 'gender'];
    return requiredFields.every(field => formData[field as keyof typeof formData]);
  };

  const isPhysicalStatsComplete = () => {
    return formData.height_feet && formData.height_inches && formData.weight;
  };

  const isEmergencyContactComplete = () => {
    return formData.emergency_name && formData.emergency_phone && formData.emergency_relationship;
  };

  const isSchedulingComplete = () => {
    return formData.preferred_days.length > 0 && formData.sessions_per_week;
  };

  const areLegalWaiversAccepted = () => {
    return formData.liability_waiver && formData.terms_accepted;
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    if (!user) {
      setIsAuthModalOpen(true);
      setIsSubmitting(false);
      return;
    }

    try {
      // Calculate height in inches
      const heightInInches = (parseInt(formData.height_feet) || 0) * 12 + (parseInt(formData.height_inches) || 0);

      // Ensure arrays are properly formatted
      const medicalConditionsArray = Array.isArray(formData.medical_conditions) 
        ? formData.medical_conditions 
        : [];
      
      const preferredDaysArray = Array.isArray(formData.preferred_days)
        ? formData.preferred_days
        : [];
      
      const fitnessGoalsArray = Array.isArray(profile.fitnessGoals)
        ? profile.fitnessGoals
        : [];
      
      const workoutTimesArray = Array.isArray(profile.preferredWorkoutTimes)
        ? profile.preferredWorkoutTimes
        : [];
      
      const dietaryRestrictionsArray = Array.isArray(profile.dietaryRestrictions)
        ? profile.dietaryRestrictions
        : [];

      console.log('🔍 Submitting profile data:', {
        payment_model: formData.payment_model,
        selected_package: formData.selected_package,
        first_name: formData.first_name,
        last_name: formData.last_name,
        medical_conditions: medicalConditionsArray,
        preferred_days: preferredDaysArray,
        medical_conditions_type: typeof formData.medical_conditions,
        medical_conditions_isArray: Array.isArray(formData.medical_conditions)
      });

      const profileData = {
          id: user.id,
        // Step 1: Payment Model & Package
        payment_model: formData.payment_model || null,
        subscription_package: formData.selected_package || null,
        
        // Step 2: Personal Info
          first_name: formData.first_name,
          last_name: formData.last_name,
        phone: formData.phone,
          city: formData.city,
          state: formData.state,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
        
        // Step 3: Physical Stats
        height: heightInInches,
        weight: parseFloat(formData.weight) || null,
        chest: parseFloat(formData.chest) || null,
        waist: parseFloat(formData.waist) || null,
        hips: parseFloat(formData.hips) || null,
        
        // Step 4: Health & Medical
        medical_conditions: medicalConditionsArray,
        injuries: formData.injuries || null,
        medications: formData.medications || null,
        doctor_clearance: formData.doctor_clearance || null,
        
        // Step 5: Fitness Goals & Level
        fitness_goals: fitnessGoalsArray,
        specific_goal: formData.specific_goal || null,
        target_date: formData.target_date || null,
        current_activity_level: formData.current_activity_level || null,
        fitness_level: profile.fitnessLevel || null,
        
        // Step 6: Emergency Contact
        emergency_contact_name: formData.emergency_name,
        emergency_contact_phone: formData.emergency_phone,
        emergency_contact_relationship: formData.emergency_relationship,
        
        // Step 7: Scheduling
        preferred_days: preferredDaysArray,
        sessions_per_week: parseInt(formData.sessions_per_week) || null,
        preferred_workout_times: workoutTimesArray,
        
        // Step 8: Legal
        liability_waiver_accepted: formData.liability_waiver,
        terms_accepted: formData.terms_accepted,
        photo_consent: formData.photo_consent,
        
        // Step 9: Payment
        preferred_payment_method: formData.payment_method || null,
        payment_setup_required: true,
        payment_setup_status: 'pending',
        
        // Step 10: Referral
        referral_source: formData.referral_source || null,
        
        // Dietary
        dietary_restrictions: dietaryRestrictionsArray,
        
        // Mark onboarding as complete
        onboarding_completed_at: new Date().toISOString()
      };

      console.log('📤 Full profile data being sent:', profileData);
      console.log('📤 Array checks:', {
        medical_conditions_value: profileData.medical_conditions,
        medical_conditions_isArray: Array.isArray(profileData.medical_conditions),
        medical_conditions_length: profileData.medical_conditions?.length,
        preferred_days_value: profileData.preferred_days,
        preferred_days_isArray: Array.isArray(profileData.preferred_days),
        fitness_goals_value: profileData.fitness_goals,
        fitness_goals_isArray: Array.isArray(profileData.fitness_goals)
      });

      // Ensure arrays are properly formatted for PostgreSQL
      const cleanProfileData = {
        ...profileData,
        medical_conditions: profileData.medical_conditions?.length > 0 ? profileData.medical_conditions : null,
        preferred_days: profileData.preferred_days?.length > 0 ? profileData.preferred_days : null,
        fitness_goals: profileData.fitness_goals?.length > 0 ? profileData.fitness_goals : null,
        preferred_workout_times: profileData.preferred_workout_times?.length > 0 ? profileData.preferred_workout_times : null,
        dietary_restrictions: profileData.dietary_restrictions?.length > 0 ? profileData.dietary_restrictions : null
      };

      console.log('🧹 Cleaned profile data:', cleanProfileData);

      // Use RPC to insert with proper array handling
      const { error: supabaseError } = await supabase.rpc('upsert_profile_with_arrays', {
        p_id: user.id,
        p_payment_model: cleanProfileData.payment_model,
        p_subscription_package: cleanProfileData.subscription_package,
        p_first_name: cleanProfileData.first_name,
        p_last_name: cleanProfileData.last_name,
        p_phone: cleanProfileData.phone,
        p_city: cleanProfileData.city,
        p_state: cleanProfileData.state,
        p_date_of_birth: cleanProfileData.date_of_birth,
        p_gender: cleanProfileData.gender,
        p_height: cleanProfileData.height,
        p_weight: cleanProfileData.weight,
        p_chest: cleanProfileData.chest,
        p_waist: cleanProfileData.waist,
        p_hips: cleanProfileData.hips,
        p_medical_conditions: cleanProfileData.medical_conditions,
        p_injuries: cleanProfileData.injuries,
        p_medications: cleanProfileData.medications,
        p_doctor_clearance: cleanProfileData.doctor_clearance,
        p_fitness_goals: cleanProfileData.fitness_goals,
        p_specific_goal: cleanProfileData.specific_goal,
        p_target_date: cleanProfileData.target_date,
        p_current_activity_level: cleanProfileData.current_activity_level,
        p_fitness_level: cleanProfileData.fitness_level,
        p_emergency_contact_name: cleanProfileData.emergency_contact_name,
        p_emergency_contact_phone: cleanProfileData.emergency_contact_phone,
        p_emergency_contact_relationship: cleanProfileData.emergency_contact_relationship,
        p_preferred_days: cleanProfileData.preferred_days,
        p_sessions_per_week: cleanProfileData.sessions_per_week,
        p_preferred_workout_times: cleanProfileData.preferred_workout_times,
        p_liability_waiver_accepted: cleanProfileData.liability_waiver_accepted,
        p_terms_accepted: cleanProfileData.terms_accepted,
        p_photo_consent: cleanProfileData.photo_consent,
        p_preferred_payment_method: cleanProfileData.preferred_payment_method,
        p_payment_setup_required: cleanProfileData.payment_setup_required,
        p_payment_setup_status: cleanProfileData.payment_setup_status,
        p_referral_source: cleanProfileData.referral_source,
        p_dietary_restrictions: cleanProfileData.dietary_restrictions,
        p_onboarding_completed_at: cleanProfileData.onboarding_completed_at
      });

      if (supabaseError) {
        console.error('Supabase error details:', supabaseError);
        console.error('Error code:', supabaseError.code);
        console.error('Error message:', supabaseError.message);
        console.error('Error details:', supabaseError.details);
        throw supabaseError;
      }
      
      console.log('✅ Profile saved successfully!');
      
      // Create admin notification for payment setup follow-up
      try {
        await supabase.from('admin_tasks').insert({
          task_type: 'payment_setup_required',
          user_id: user.id,
          priority: 'high',
          title: `Payment Setup Required: ${formData.first_name} ${formData.last_name}`,
          description: `New client completed onboarding but needs payment setup. Payment model: ${formData.payment_model}, Preferred method: ${formData.payment_method || 'Not specified'}, Package: ${formData.selected_package || 'Pay as you go'}`,
          due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Due in 24 hours
          status: 'pending'
        });
      } catch (taskError) {
        console.error('Error creating admin task:', taskError);
        // Don't fail the whole process if task creation fails
      }

      // Log the completion for tracking
      console.log('Onboarding completed for user:', user.id, {
        payment_model: formData.payment_model,
        package: formData.selected_package,
        payment_method: formData.payment_method,
        timestamp: new Date().toISOString()
      });

      // Small delay to ensure data is saved
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to user dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error saving profile:', error);
      
      // Show more detailed error message
      let errorMessage = 'Failed to save your profile. Please try again.';
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
        console.error('Detailed error:', error);
      }
      
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <Section className="pt-24 pb-12 min-h-screen bg-gradient-radial">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-light/70">
              Step {step} of 10
            </div>
            <div className="text-sm text-primary font-medium">
              {Math.round((step / 10) * 100)}% Complete
            </div>
          </div>
          <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 10) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
          <AnimatePresence mode="wait">
            {/* Step 1: Payment Model & Package Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Payment Model Selection */}
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-display font-bold text-light mb-3">
                    How Would You Like to Pay?
                  </h2>
                  <p className="text-light/60 text-lg">
                    Choose between flexible pay-as-you-go sessions or commit to a monthly subscription.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                  {/* Subscription Option */}
                  <Card
                    className={`cursor-pointer transition-all duration-300 ${
                      formData.payment_model === 'subscription'
                        ? 'border-primary border-2 shadow-glow'
                        : 'border-light/10 hover:border-primary/50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, payment_model: 'subscription', selected_package: '' }))}
                  >
                    <CardBody className="p-8 text-center">
                      {formData.payment_model === 'subscription' && (
                        <div className="absolute top-4 right-4 bg-primary text-black rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-light mb-3">Monthly Subscription</h3>
                      <p className="text-light/70 mb-4 text-sm">
                        Best value with recurring sessions, online coaching, meal planning, and exclusive perks.
                      </p>
                      <div className="space-y-2 text-left text-sm">
                        <div className="flex items-center gap-2 text-light/80">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>Save up to 40% vs pay-as-you-go</span>
                        </div>
                        <div className="flex items-center gap-2 text-light/80">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>Guaranteed session slots</span>
                        </div>
                        <div className="flex items-center gap-2 text-light/80">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>Bonus services included</span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Pay As You Go Option */}
                  <Card
                    className={`cursor-pointer transition-all duration-300 ${
                      formData.payment_model === 'pay-as-you-go'
                        ? 'border-primary border-2 shadow-glow'
                        : 'border-light/10 hover:border-primary/50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, payment_model: 'pay-as-you-go', selected_package: '' }))}
                  >
                    <CardBody className="p-8 text-center">
                      {formData.payment_model === 'pay-as-you-go' && (
                        <div className="absolute top-4 right-4 bg-primary text-black rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-light mb-3">Pay As You Go</h3>
                      <p className="text-light/70 mb-4 text-sm">
                        Maximum flexibility - pay only for individual sessions as you need them.
                      </p>
                      <div className="space-y-2 text-left text-sm">
                        <div className="flex items-center gap-2 text-light/80">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>No commitment required</span>
                        </div>
                        <div className="flex items-center gap-2 text-light/80">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>Book sessions on demand</span>
                        </div>
                        <div className="flex items-center gap-2 text-light/80">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>Try before you commit</span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                {/* Subscription Package Selection - Only show if subscription selected */}
                {formData.payment_model === 'subscription' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8 pt-8 border-t border-primary/20">
                      <h3 className="text-3xl font-display font-bold text-light mb-3">
                        Choose Your Subscription Package
                      </h3>
                      <p className="text-light/60">
                        Select the package that best fits your fitness goals and budget.
                      </p>
                    </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {subscriptionPlans.map(pkg => {
                    const isSelected = formData.selected_package === pkg.id;
                    const mainFeatures = pkg.features.filter(f => f.included).slice(0, 5);
                    const remainingCount = pkg.features.filter(f => f.included).length - 5;
                    
                    return (
                      <div 
                        key={pkg.id} 
                        className={`relative ${pkg.popular ? 'lg:scale-105 lg:z-10' : ''}`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                            <div className="bg-primary text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                              Most Popular
                            </div>
                          </div>
                        )}
                        
                        <Card
                          className={`cursor-pointer transition-all duration-300 relative overflow-hidden ${
                            isSelected
                              ? 'border-primary border-2 shadow-glow'
                              : 'border-light/10 hover:border-primary/50'
                          } ${pkg.popular ? 'border-primary/30' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, selected_package: pkg.id }))}
                        >
                          {isSelected && (
                            <div className="absolute top-4 right-4 bg-primary text-black rounded-full p-1">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                          
                          <CardBody className="p-8">
                            {/* Header */}
                            <div className="text-center mb-6 pb-6 border-b border-light/10">
                              <h3 className="text-2xl font-bold text-light mb-3">{pkg.name}</h3>
                              <div className="flex items-baseline justify-center gap-2 mb-2">
                                <span className="text-5xl font-bold text-primary">${pkg.price}</span>
                                <span className="text-light/50">/month</span>
                              </div>
                              <p className="text-sm text-light/60 mt-2">{pkg.description}</p>
                            </div>
                            
                            {/* Key Features */}
                            <div className="space-y-3 mb-6">
                              {mainFeatures.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                  <span className="text-sm text-light/90 leading-relaxed">{feature.title}</span>
                                </div>
                              ))}
                              {remainingCount > 0 && (
                                <div className="flex items-start gap-3 text-primary/80">
                                  <span className="text-sm font-medium">+ {remainingCount} more features</span>
                                </div>
                              )}
                            </div>
                            
                            {/* CTA */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData(prev => ({ ...prev, selected_package: pkg.id }));
                              }}
                              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                                isSelected
                                  ? 'bg-primary text-black'
                                  : 'bg-dark-surface border border-primary/30 text-primary hover:bg-primary/10'
                              }`}
                            >
                              {isSelected ? 'Selected ✓' : 'Select Plan'}
                            </button>
                          </CardBody>
                        </Card>
                      </div>
                    );
                  })}
                </div>
                  </motion.div>
                )}

                {/* Pay As You Go Info - Only show if pay-as-you-go selected */}
                {formData.payment_model === 'pay-as-you-go' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-3xl mx-auto"
                  >
                    <Card className="border-primary/30">
                      <CardBody className="p-8">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-primary" />
                          </div>
                          <h3 className="text-2xl font-bold text-light mb-2">Pay As You Go Selected</h3>
                          <p className="text-light/70">
                            Perfect! You'll be able to book individual services as needed.
                          </p>
                        </div>
                        
                        <div className="bg-dark-surface/50 rounded-lg p-6 border border-primary/20">
                          <h4 className="font-semibold text-light mb-4">Pay As You Go Pricing:</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-light/80">Personal Training Session</span>
                              <span className="text-primary font-semibold">$80</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-light/80">Online Coaching (per month)</span>
                              <span className="text-primary font-semibold">$60</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-light/80">Meal Planning (per month)</span>
                              <span className="text-primary font-semibold">$50</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-light/80">Flex, Mobility & Recovery</span>
                              <span className="text-primary font-semibold">$120</span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-primary/10">
                            <p className="text-xs text-light/60">
                              You can book and pay for services individually through your dashboard after completing onboarding.
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Personal Information */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-display font-bold text-light mb-3">
                  Tell us about yourself
                </h2>
                <p className="text-light/70 mb-6">
                  Let's start with some basic information to personalize your experience.
                </p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-light/70 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-light/70 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light/50" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={14}
                        className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 pl-10 pr-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                        placeholder="(333) 333-3333"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-light/70 mb-2">
                        City *
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light/50" />
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 pl-10 pr-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                          placeholder="Enter your city"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-light/70 mb-2">
                        State *
                      </label>
                      <div className="relative">
                        <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light/50" />
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 pl-10 pr-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                          placeholder="Enter your state"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-light/70 mb-2">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light/50 pointer-events-none" />
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                          className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 pl-10 pr-4 text-light placeholder-light/30 focus:outline-none focus:border-primary [color-scheme:dark]"
                        required
                      />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-light/70 mb-2">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Physical Stats & Measurements */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-display font-bold text-light mb-3">
                  Physical Stats & Measurements
                </h2>
                <p className="text-light/70 mb-6">
                  These measurements help us track your progress and create personalized workout plans.
                </p>
                
                <div className="space-y-6">
                  {/* Height */}
                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">
                      Height *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light/50" />
                        <input
                          type="number"
                          name="height_feet"
                          value={formData.height_feet}
                          onChange={handleInputChange}
                          min="3"
                          max="8"
                          className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 pl-10 pr-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                          placeholder="Feet"
                          required
                        />
                      </div>
                      <input
                        type="number"
                        name="height_inches"
                        value={formData.height_inches}
                        onChange={handleInputChange}
                        min="0"
                        max="11"
                        className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                        placeholder="Inches"
                        required
                      />
                    </div>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">
                      Current Weight (lbs) *
                    </label>
                    <div className="relative">
                      <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light/50" />
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        min="50"
                        max="500"
                        className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 pl-10 pr-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                        placeholder="Enter your current weight"
                        required
                      />
                    </div>
                  </div>

                  {/* Body Measurements (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-3">
                      Body Measurements (Optional)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <input
                          type="number"
                          name="chest"
                          value={formData.chest}
                          onChange={handleInputChange}
                          className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                          placeholder="Chest (inches)"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="waist"
                          value={formData.waist}
                          onChange={handleInputChange}
                          className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                          placeholder="Waist (inches)"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="hips"
                          value={formData.hips}
                          onChange={handleInputChange}
                          className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                          placeholder="Hips (inches)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Health & Medical Screening */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-display font-bold text-light mb-3">
                  Health & Medical Screening
                </h2>
                <p className="text-light/70 mb-6">
                  Your safety is our priority. Please provide any relevant health information.
                </p>
                
                <div className="space-y-6">
                  {/* Medical Conditions */}
                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-3">
                      Do you have any of the following conditions? (Select all that apply)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {medicalConditions.map(condition => (
                        <label
                          key={condition}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.medical_conditions.includes(condition)
                              ? 'border-primary bg-primary/10'
                              : 'border-primary/20 hover:border-primary/40'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.medical_conditions.includes(condition)}
                            onChange={(e) => {
                              const newConditions = e.target.checked
                                ? [...formData.medical_conditions, condition]
                                : formData.medical_conditions.filter(c => c !== condition);
                              setFormData(prev => ({ ...prev, medical_conditions: newConditions }));
                            }}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span className="text-light/90 text-sm">{condition}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Injuries */}
                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">
                      Any current or past injuries?
                    </label>
                    <textarea
                      name="injuries"
                      value={formData.injuries}
                      onChange={(e) => setFormData(prev => ({ ...prev, injuries: e.target.value }))}
                      rows={3}
                      className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light placeholder-light/30 focus:outline-none focus:border-primary resize-none"
                      placeholder="Describe any injuries (e.g., knee surgery in 2020, lower back pain)"
                    />
                  </div>

                  {/* Medications */}
                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">
                      Are you currently taking any medications?
                    </label>
                    <textarea
                      name="medications"
                      value={formData.medications}
                      onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                      rows={2}
                      className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light placeholder-light/30 focus:outline-none focus:border-primary resize-none"
                      placeholder="List any medications (or leave blank if none)"
                    />
                  </div>

                  {/* Doctor Clearance */}
                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">
                      Has your doctor cleared you for exercise?
                    </label>
                    <select
                      name="doctor_clearance"
                      value={formData.doctor_clearance}
                      onChange={handleInputChange}
                      className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light focus:outline-none focus:border-primary"
                    >
                      <option value="">Select an option</option>
                      <option value="yes">Yes, I have medical clearance</option>
                      <option value="no">No, but I don't need it</option>
                      <option value="will-get">I will get clearance before starting</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Fitness Goals & Level */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-display font-bold text-light mb-3">
                  What are your fitness goals?
                </h2>
                <p className="text-light/70 mb-6">
                  Select all that apply to help us personalize your experience.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {fitnessGoals.map(goal => (
                    <Card
                      key={goal.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        profile.fitnessGoals?.includes(goal.id)
                          ? 'border-primary shadow-glow'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setProfile(prev => ({
                        ...prev,
                        fitnessGoals: prev.fitnessGoals?.includes(goal.id)
                          ? prev.fitnessGoals.filter(id => id !== goal.id)
                          : [...(prev.fitnessGoals || []), goal.id]
                      }))}
                    >
                      <CardBody className="flex items-center p-6">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mr-4">
                          {goal.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-light mb-1">{goal.title}</h3>
                          <p className="text-sm text-light/70">{goal.description}</p>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>

                {/* Specific Goal & Target Date */}
                <div className="space-y-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">
                      Describe your specific, measurable goal
                    </label>
                    <input
                      type="text"
                      name="specific_goal"
                      value={formData.specific_goal}
                      onChange={handleInputChange}
                      className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                      placeholder="e.g., Lose 20 lbs, Run a 5K, Bench press 225 lbs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">
                      Target Date (Optional)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light/50 pointer-events-none" />
                      <input
                        type="date"
                        name="target_date"
                        value={formData.target_date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 pl-10 pr-4 text-light focus:outline-none focus:border-primary [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">
                      Current Activity Level
                    </label>
                    <select
                      name="current_activity_level"
                      value={formData.current_activity_level}
                      onChange={handleInputChange}
                      className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light focus:outline-none focus:border-primary"
                    >
                      <option value="">Select your current level</option>
                      <option value="sedentary">Sedentary (little to no exercise)</option>
                      <option value="lightly-active">Lightly Active (1-2 days/week)</option>
                      <option value="moderately-active">Moderately Active (3-5 days/week)</option>
                      <option value="very-active">Very Active (6-7 days/week)</option>
                      <option value="athlete">Athlete (intense daily training)</option>
                    </select>
                  </div>
                </div>

                {/* Fitness Level Selection */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-light mb-4">
                  What's your fitness level?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fitnessLevels.map(level => (
                    <Card
                      key={level.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        profile.fitnessLevel === level.id
                          ? 'border-primary shadow-glow'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setProfile(prev => ({
                        ...prev,
                        fitnessLevel: level.id
                      }))}
                    >
                      <CardBody className="text-center p-6">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                          {level.icon}
                        </div>
                        <h3 className="font-semibold text-light mb-2">{level.title}</h3>
                        <p className="text-sm text-light/70">{level.description}</p>
                      </CardBody>
                    </Card>
                  ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Emergency Contact */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-display font-bold text-light mb-3">
                  Emergency Contact Information
                </h2>
                <p className="text-light/70 mb-6">
                  For your safety, please provide an emergency contact we can reach if needed.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">
                      Emergency Contact Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light/50" />
                      <input
                        type="text"
                        name="emergency_name"
                        value={formData.emergency_name}
                        onChange={handleInputChange}
                        className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 pl-10 pr-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                        placeholder="Full name"
                        required
                      />
                        </div>
                  </div>

                        <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">
                      Emergency Contact Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light/50" />
                      <input
                        type="tel"
                        name="emergency_phone"
                        value={formData.emergency_phone}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          setFormData(prev => ({ ...prev, emergency_phone: formatted }));
                        }}
                        maxLength={14}
                        className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 pl-10 pr-4 text-light placeholder-light/30 focus:outline-none focus:border-primary"
                        placeholder="(333) 333-3333"
                        required
                      />
                        </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">
                      Relationship *
                    </label>
                    <select
                      name="emergency_relationship"
                      value={formData.emergency_relationship}
                      onChange={handleInputChange}
                      className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light focus:outline-none focus:border-primary"
                      required
                    >
                      <option value="">Select relationship</option>
                      <option value="spouse">Spouse/Partner</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="friend">Friend</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 7: Scheduling Preferences */}
            {step === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-display font-bold text-light mb-3">
                  Scheduling Preferences
                </h2>
                <p className="text-light/70 mb-6">
                  Let us know when you're available so we can schedule your sessions.
                </p>
                
                <div className="space-y-6">
                  {/* Preferred Days */}
                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-3">
                      Which days work best for you? (Select all that apply) *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {daysOfWeek.map(day => (
                        <label
                          key={day.id}
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.preferred_days.includes(day.id)
                              ? 'border-primary bg-primary/10'
                              : 'border-primary/20 hover:border-primary/40'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.preferred_days.includes(day.id)}
                            onChange={(e) => {
                              const newDays = e.target.checked
                                ? [...formData.preferred_days, day.id]
                                : formData.preferred_days.filter(d => d !== day.id);
                              setFormData(prev => ({ ...prev, preferred_days: newDays }));
                            }}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span className="text-light/90 text-sm">{day.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sessions Per Week */}
                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">
                      How many sessions per week? *
                    </label>
                    <select
                      name="sessions_per_week"
                      value={formData.sessions_per_week}
                      onChange={handleInputChange}
                      className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light focus:outline-none focus:border-primary"
                      required
                    >
                      <option value="">Select frequency</option>
                      <option value="1">1 session per week</option>
                      <option value="2">2 sessions per week</option>
                      <option value="3">3 sessions per week</option>
                      <option value="4">4 sessions per week</option>
                      <option value="5">5+ sessions per week</option>
                    </select>
                  </div>

                  {/* Preferred Time of Day */}
                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-3">
                      Preferred time of day?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {workoutTimes.map(time => (
                    <Card
                      key={time.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        profile.preferredWorkoutTimes?.includes(time.id)
                          ? 'border-primary shadow-glow'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setProfile(prev => ({
                        ...prev,
                        preferredWorkoutTimes: prev.preferredWorkoutTimes?.includes(time.id)
                          ? prev.preferredWorkoutTimes.filter(id => id !== time.id)
                          : [...(prev.preferredWorkoutTimes || []), time.id]
                      }))}
                    >
                      <CardBody className="text-center p-6">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                          {time.icon}
                        </div>
                        <h3 className="font-semibold text-light mb-2">{time.title}</h3>
                        <p className="text-sm text-light/70">{time.description}</p>
                      </CardBody>
                    </Card>
                  ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 8: Legal Waivers & Consent */}
            {step === 8 && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-display font-bold text-light mb-3">
                  Legal Agreements & Consent
                </h2>
                <p className="text-light/70 mb-6">
                  Please review and accept the following agreements to continue.
                </p>
                
                <div className="space-y-6">
                  {/* Liability Waiver */}
                  <div className="p-6 bg-dark-surface/50 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3 mb-4">
                      <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-light mb-2">Liability Waiver</h3>
                        <p className="text-sm text-light/70 mb-3">
                          I understand that physical exercise involves inherent risks and I assume full responsibility 
                          for any injuries or damages that may occur during training. I waive all claims against 
                          RSF Fitness and its trainers for any injuries sustained.
                        </p>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.liability_waiver}
                            onChange={(e) => setFormData(prev => ({ ...prev, liability_waiver: e.target.checked }))}
                            className="w-5 h-5 text-primary focus:ring-primary"
                            required
                          />
                          <span className="text-light/90">I agree to the liability waiver *</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="p-6 bg-dark-surface/50 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3 mb-4">
                      <FileText className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-light mb-2">Terms & Conditions</h3>
                        <p className="text-sm text-light/70 mb-3">
                          I agree to RSF Fitness's terms of service, including payment terms, cancellation policy, 
                          and code of conduct. I understand that sessions must be cancelled 24 hours in advance 
                          to avoid charges.
                        </p>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.terms_accepted}
                            onChange={(e) => setFormData(prev => ({ ...prev, terms_accepted: e.target.checked }))}
                            className="w-5 h-5 text-primary focus:ring-primary"
                            required
                          />
                          <span className="text-light/90">I agree to the terms and conditions *</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Photo/Video Consent */}
                  <div className="p-6 bg-dark-surface/50 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3 mb-4">
                      <Share2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-light mb-2">Photo/Video Consent (Optional)</h3>
                        <p className="text-sm text-light/70 mb-3">
                          I give permission for RSF Fitness to use photos and videos of me for marketing purposes 
                          on social media, website, and promotional materials. Your face will not be shown without 
                          explicit permission.
                        </p>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.photo_consent}
                            onChange={(e) => setFormData(prev => ({ ...prev, photo_consent: e.target.checked }))}
                            className="w-5 h-5 text-primary focus:ring-primary"
                          />
                          <span className="text-light/90">I consent to photo/video use</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 9: Payment Setup */}
            {step === 9 && (
              <motion.div
                key="step9"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-display font-bold text-light mb-3">
                  Payment Setup
                </h2>
                <p className="text-light/70 mb-6">
                  Secure your spot with your selected package.
                </p>
                
                <div className="space-y-6">
                  {/* Selected Package Summary */}
                  <div className="p-6 bg-dark-surface/50 border border-primary/20 rounded-lg">
                    <h3 className="font-semibold text-light mb-4">Your Selected Package</h3>
                    {subscriptionPlans.find(pkg => pkg.id === formData.selected_package) && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-primary">
                            {subscriptionPlans.find(pkg => pkg.id === formData.selected_package)?.name}
                          </p>
                          <p className="text-sm text-light/70 mt-1">
                            Billed monthly
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-light">
                            ${subscriptionPlans.find(pkg => pkg.id === formData.selected_package)?.price}
                          </p>
                          <p className="text-sm text-light/70">/month</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Method Placeholder */}
                  <div className="p-8 bg-dark-surface/50 border-2 border-dashed border-primary/30 rounded-lg text-center">
                    <CreditCard className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-light mb-2">Payment Integration Coming Soon</h3>
                    <p className="text-sm text-light/70 mb-4">
                      Stripe payment integration will be set up here. For now, our team will contact you 
                      to process payment securely.
                    </p>
                    <div className="max-w-md mx-auto">
                      <label className="block text-sm font-medium text-light/70 mb-2 text-left">
                        Preferred Payment Method
                      </label>
                      <select
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleInputChange}
                        className="w-full bg-dark-surface border border-primary/20 rounded-lg py-2 px-4 text-light focus:outline-none focus:border-primary"
                      >
                        <option value="">Select method</option>
                        <option value="credit-card">Credit Card</option>
                        <option value="debit-card">Debit Card</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="paypal">PayPal</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 10: Referral & Final Confirmation */}
            {step === 10 && (
              <motion.div
                key="step10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-display font-bold text-light mb-3">
                  Almost Done! 🎉
                </h2>
                <p className="text-light/70 mb-6">
                  Just one more thing - help us improve by telling us how you found us.
                </p>
                
                <div className="space-y-6">
                  {/* Referral Source */}
                  <div>
                    <label className="block text-sm font-medium text-light/70 mb-3">
                      How did you hear about RSF Fitness?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {referralSources.map(source => (
                        <label
                          key={source}
                          className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                            formData.referral_source === source
                              ? 'border-primary bg-primary/10'
                              : 'border-primary/20 hover:border-primary/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name="referral_source"
                            value={source}
                            checked={formData.referral_source === source}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span className="text-light/90">{source}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl">
                    <h3 className="text-2xl font-bold text-light mb-4 flex items-center gap-2">
                      <Check className="w-6 h-6 text-primary" />
                      You're All Set!
                    </h3>
                    <p className="text-light/80 mb-6">
                      Click "Complete & Submit" below to finish your onboarding. Our team will review your 
                      information and contact you within 24 hours to schedule your first session.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-light/60 mb-1">Package</p>
                        <p className="font-semibold text-light">
                          {subscriptionPlans.find(pkg => pkg.id === formData.selected_package)?.name || 'Not selected'}
                        </p>
                      </div>
                      <div>
                        <p className="text-light/60 mb-1">Sessions/Week</p>
                        <p className="font-semibold text-light">{formData.sessions_per_week || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Remove old dietary preferences step (was step 4) */}
            {/* Remove old fitness level step (was step 3) - now integrated into step 5 */}
            {/* Remove old workout times step (was step 5) - now integrated into step 7 */}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mt-6 pt-6 border-t border-primary/20">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              leftIcon={<ChevronLeft className="w-5 h-5" />}
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}
            <Button
              variant="primary"
            onClick={step < 10 ? handleNext : handleSubmit}
            rightIcon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
            className="min-w-[140px]"
            disabled={isSubmitting}
            >
            {isSubmitting ? 'Submitting...' : (step < 10 ? 'Next' : 'Complete & Submit')}
            </Button>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode="sign-up"
      />
    </Section>
  );
};

export default OnboardingPage;