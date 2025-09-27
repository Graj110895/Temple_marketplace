'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface Pooja {
  id: string
  temple_id: string
  title: string
  description: string
  duration_minutes: number
  price: number
  capacity_per_slot: number
}

interface Temple {
  id: string
  name: string
  address: string
  city: string
  state: string
  contact_phone: string
}

interface BookingFormData {
  date: string
  time: string
  guests: number
  specialRequests: string
  devoteeDetails: {
    name: string
    phone: string
    email: string
    rashi: string
    nakshatra: string
    gothra: string
  }
}

interface BookingData {
  id: string
  temple_name: string
  pooja_title: string
  booking_date: string
  booking_time: string
  guests: number
  total_amount: number
}

export default function BookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  
  const [pooja, setPooja] = useState<Pooja | null>(null)
  const [temple, setTemple] = useState<Temple | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<BookingData | null>(null)
  const [step, setStep] = useState(1) // 1: Select Date/Time, 2: Devotee Details, 3: Confirmation
  
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    date: '',
    time: '',
    guests: 1,
    specialRequests: '',
    devoteeDetails: {
      name: user?.user_metadata?.name || '',
      phone: user?.user_metadata?.phone || '',
      email: user?.email || '',
      rashi: user?.user_metadata?.rashi || '',
      nakshatra: user?.user_metadata?.nakshatra || '',
      gothra: user?.user_metadata?.gothra || ''
    }
  })

  // Available time slots (you can make this dynamic from database)
  const timeSlots = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ]

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    if (params.id) {
      fetchPoojaData(params.id as string)
    }
  }, [params.id, user])

  const fetchPoojaData = async (poojaId: string) => {
    try {
      // Fetch pooja details
      const { data: poojaData, error: poojaError } = await supabase
        .from('poojas')
        .select('*')
        .eq('id', poojaId)
        .single()

      if (poojaError) throw poojaError

      // Fetch temple details
      const { data: templeData, error: templeError } = await supabase
        .from('temples')
        .select('*')
        .eq('id', poojaData.temple_id)
        .single()

      if (templeError) throw templeError

      setPooja(poojaData)
      setTemple(templeData)
      
      // Update form with user data
      setBookingForm(prev => ({
        ...prev,
        devoteeDetails: {
          name: user?.user_metadata?.name || '',
          phone: user?.user_metadata?.phone || '',
          email: user?.email || '',
          rashi: user?.user_metadata?.rashi || '',
          nakshatra: user?.user_metadata?.nakshatra || '',
          gothra: user?.user_metadata?.gothra || ''
        }
      }))
      
    } catch (error) {
      console.error('Error fetching pooja data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('devoteeDetails.')) {
      const detailField = field.replace('devoteeDetails.', '')
      setBookingForm(prev => ({
        ...prev,
        devoteeDetails: {
          ...prev.devoteeDetails,
          [detailField]: value
        }
      }))
    } else {
      setBookingForm(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!bookingForm.date || !bookingForm.time) {
        alert('Please select date and time')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!bookingForm.devoteeDetails.name || !bookingForm.devoteeDetails.phone) {
        alert('Please fill required fields')
        return
      }
      setStep(3)
    }
  }

  // UPDATED handleBookingConfirm function with loading and modal
  const handleBookingConfirm = async () => {
    // Start loading animation
    setBookingLoading(true)

    try {
      // Validate required data
      if (!user?.id) {
        alert('User not authenticated. Please login again.')
        router.push('/auth/login')
        return
      }

      if (!pooja?.id || !temple?.id) {
        alert('Missing pooja or temple information. Please try again.')
        return
      }

      if (!bookingForm.devoteeDetails.name || !bookingForm.devoteeDetails.phone) {
        alert('Please provide name and phone number.')
        return
      }

      console.log('Creating booking with data:', {
        user_id: user.id,
        pooja_id: pooja.id,
        temple_id: temple.id,
        devotee_details: bookingForm.devoteeDetails
      })

      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Prepare booking data
      const bookingData = {
        user_id: user.id,
        pooja_id: pooja.id,
        temple_id: temple.id,
        booking_status: 'CONFIRMED',
        payment_status: (pooja?.price || 0) > 0 ? 'PENDING' : 'NOT_REQUIRED',
        amount: (pooja?.price || 0) * bookingForm.guests,
        booking_type: 'ONLINE',
        devotee_details: {
          name: bookingForm.devoteeDetails.name,
          phone: bookingForm.devoteeDetails.phone,
          email: bookingForm.devoteeDetails.email || '',
          rashi: bookingForm.devoteeDetails.rashi || '',
          nakshatra: bookingForm.devoteeDetails.nakshatra || '',
          gothra: bookingForm.devoteeDetails.gothra || '',
          booking_date: bookingForm.date,
          booking_time: bookingForm.time,
          guests: bookingForm.guests,
          special_requests: bookingForm.specialRequests || ''
        },
        notes: bookingForm.specialRequests || null
      }

      console.log('Submitting booking data:', bookingData)

      // Insert booking into database
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single()

      if (error) {
        console.error('Supabase error details:', error)
        alert(`Booking failed: ${error.message}\n\nDetails: ${error.details || 'No additional details'}\n\nCode: ${error.code || 'No code'}`)
        return
      }

      console.log('Booking created successfully:', data)

      // Set booking details for modal
      setBookingDetails({
        id: data.id,
        temple_name: temple.name,
        pooja_title: pooja.title,
        booking_date: bookingForm.date,
        booking_time: bookingForm.time,
        guests: bookingForm.guests,
        total_amount: (pooja?.price || 0) * bookingForm.guests
      })

      // Stop loading and show success modal
      setBookingLoading(false)
      setShowSuccessModal(true)
      
    } catch (error: any) {
      setBookingLoading(false)
      console.error('Unexpected booking error:', error)
      alert(`Unexpected error occurred: ${error.message}\n\nPlease try again or contact support.`)
    }
  }

  const closeModal = () => {
    setShowSuccessModal(false)
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!pooja || !temple) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Available</h1>
          <p className="text-gray-600 mb-6">The pooja you're trying to book is not available.</p>
          <Link href="/">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Loading Overlay */}
      {bookingLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
            <div className="relative mb-6">
              {/* Animated Loading Ring */}
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🙏</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Processing Your Booking</h3>
            <p className="text-gray-600 mb-4">Please wait while we confirm your pooja booking...</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal - Positioned over booking area */}
{/* Success Modal - Positioned directly over booking content */}
{showSuccessModal && bookingDetails && (
  <>
    {/* Non-functional backdrop */}
    <div 
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
      onClick={(e) => e.preventDefault()}
    ></div>
    
    {/* Modal positioned over the main booking content area */}
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 mx-4 animate-in fade-in slide-in-from-bottom-4 duration-300 relative pointer-events-auto">
        
        {/* Close Button - Top Right Corner */}
        <button
          onClick={closeModal}
          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg z-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success Header - Equal spacing */}
        <div className="text-center px-6 pt-6 pb-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">🎉 Booking Confirmed!</h2>
          <p className="text-gray-600 text-sm">Your spiritual journey awaits</p>
        </div>

        {/* Booking Details - Equal inner spacing */}
        <div className="px-6">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 mb-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-bold text-orange-600">{bookingDetails.id.substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Temple:</span>
                <span className="font-medium text-gray-800 text-right text-sm max-w-[160px] truncate">{bookingDetails.temple_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pooja:</span>
                <span className="font-medium text-gray-800 text-right text-sm max-w-[160px] truncate">{bookingDetails.pooja_title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-800">{bookingDetails.booking_date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium text-gray-800">{bookingDetails.booking_time}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                <span className="text-green-700 font-semibold">Total Amount:</span>
                <span className="font-bold text-green-700 text-lg">₹{bookingDetails.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Note */}
          <div className="bg-blue-50 rounded-lg p-3 mb-5">
            <p className="text-blue-800 text-xs text-center leading-relaxed">
              📧 Confirmation sent to email<br/>
              📱 WhatsApp notification coming soon
            </p>
          </div>

          {/* Action Buttons - Better spacing from edges */}
          <div className="pb-6">
            <div className="flex space-x-3">
              <button
                onClick={closeModal}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-semibold text-sm hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-[1.02] shadow-md"
              >
                Continue Browsing
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors shadow-sm"
              >
                View Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
)}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl">🕉️</span>
                <span className="text-2xl font-bold text-orange-600">Samarpayami</span>
              </Link>
              <span className="text-gray-400">→</span>
              <span className="text-gray-600">Book Pooja</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-gray-700">Welcome, {user?.user_metadata?.name}!</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${step >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>1</div>
              <span className="ml-2 font-medium">Date & Time</span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>2</div>
              <span className="ml-2 font-medium">Details</span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>3</div>
              <span className="ml-2 font-medium">Confirm</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Step 1: Date & Time Selection */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Date & Time</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                      <input
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                      <div className="grid grid-cols-3 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleInputChange('time', time)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                              bookingForm.time === time
                                ? 'bg-orange-500 text-white border-orange-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of People</label>
                      <select
                        value={bookingForm.guests}
                        onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full mt-8 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Continue to Details →
                  </button>
                </div>
              )}

              {/* Step 2: Devotee Details */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Devotee Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={bookingForm.devoteeDetails.name}
                        onChange={(e) => handleInputChange('devoteeDetails.name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={bookingForm.devoteeDetails.phone}
                        onChange={(e) => handleInputChange('devoteeDetails.phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="+91-9876543210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={bookingForm.devoteeDetails.email}
                        onChange={(e) => handleInputChange('devoteeDetails.email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rashi</label>
                      <input
                        type="text"
                        value={bookingForm.devoteeDetails.rashi}
                        onChange={(e) => handleInputChange('devoteeDetails.rashi', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., Mesha, Vrishabha"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nakshatra</label>
                      <input
                        type="text"
                        value={bookingForm.devoteeDetails.nakshatra}
                        onChange={(e) => handleInputChange('devoteeDetails.nakshatra', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., Ashwini, Bharani"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gothra</label>
                      <input
                        type="text"
                        value={bookingForm.devoteeDetails.gothra}
                        onChange={(e) => handleInputChange('devoteeDetails.gothra', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., Bharadwaja, Kashyapa"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                    <textarea
                      value={bookingForm.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Any special requirements or requests for the pooja..."
                    />
                  </div>

                  <div className="flex space-x-4 mt-8">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Review Booking →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Your Booking</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Booking Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{bookingForm.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{bookingForm.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">People:</span>
                          <span className="font-medium">{bookingForm.guests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-bold text-green-600">₹{(pooja?.price || 0) * bookingForm.guests}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-6">
                      <h3 className="font-semibold text-orange-800 mb-4">Devotee Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-orange-600">Name:</span>
                          <span className="font-medium">{bookingForm.devoteeDetails.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-orange-600">Phone:</span>
                          <span className="font-medium">{bookingForm.devoteeDetails.phone}</span>
                        </div>
                        {bookingForm.devoteeDetails.rashi && (
                          <div className="flex justify-between">
                            <span className="text-orange-600">Rashi:</span>
                            <span className="font-medium">{bookingForm.devoteeDetails.rashi}</span>
                          </div>
                        )}
                        {bookingForm.devoteeDetails.nakshatra && (
                          <div className="flex justify-between">
                            <span className="text-orange-600">Nakshatra:</span>
                            <span className="font-medium">{bookingForm.devoteeDetails.nakshatra}</span>
                          </div>
                        )}
                        {bookingForm.devoteeDetails.gothra && (
                          <div className="flex justify-between">
                            <span className="text-orange-600">Gothra:</span>
                            <span className="font-medium">{bookingForm.devoteeDetails.gothra}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 mt-8">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      ← Edit Details
                    </button>
                    <button
                      onClick={handleBookingConfirm}
                      disabled={bookingLoading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bookingLoading ? 'Processing...' : 'Confirm Booking ✅'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🏛️</div>
                  <div>
                    <div className="font-semibold text-gray-800">{temple?.name}</div>
                    <div className="text-sm text-gray-500">{temple?.city}, {temple?.state}</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-2xl">🙏</div>
                    <div>
                      <div className="font-semibold text-gray-800">{pooja?.title}</div>
                      <div className="text-sm text-gray-500">{pooja?.duration_minutes} minutes</div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{pooja?.description}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Price per person:</span>
                    <span className="font-medium">₹{pooja?.price}</span>
                  </div>
                  {bookingForm.guests > 1 && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">× {bookingForm.guests} people:</span>
                      <span className="font-medium">₹{(pooja?.price || 0) * bookingForm.guests}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-bold text-green-600 border-t pt-2">
                    <span>Total Amount:</span>
                    <span>₹{(pooja?.price || 0) * bookingForm.guests}</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                  <div className="font-medium mb-1">📞 Need Help?</div>
                  <div>Call: {temple?.contact_phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
