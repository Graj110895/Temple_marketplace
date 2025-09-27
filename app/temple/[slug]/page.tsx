'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface Temple {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  contact_phone: string
  timings: any
  slug: string
}

interface Pooja {
  id: string
  temple_id: string
  title: string
  description: string
  duration_minutes: number
  price: number
  capacity_per_slot: number
  images: string[]
}

export default function TempleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [temple, setTemple] = useState<Temple | null>(null)
  const [poojas, setPoojas] = useState<Pooja[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPooja, setSelectedPooja] = useState<Pooja | null>(null)

  useEffect(() => {
    if (params.slug) {
      fetchTempleData(params.slug as string)
    }
  }, [params.slug])

  const fetchTempleData = async (slug: string) => {
    try {
      // Fetch temple details
      const { data: templeData, error: templeError } = await supabase
        .from('temples')
        .select('*')
        .eq('slug', slug)
        .eq('approved', true)
        .single()

      if (templeError) throw templeError

      // Fetch temple poojas
      const { data: poojasData, error: poojasError } = await supabase
        .from('poojas')
        .select('*')
        .eq('temple_id', templeData.id)
        .eq('is_active', true)

      if (poojasError) throw poojasError

      setTemple(templeData)
      setPoojas(poojasData || [])
    } catch (error) {
      console.error('Error fetching temple data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookPooja = (pooja: Pooja) => {
    if (!user) {
      alert('Please login to book a pooja')
      router.push('/auth/login')
      return
    }
    setSelectedPooja(pooja)
    // Navigate to booking page
    router.push(`/book/${pooja.id}?temple=${temple?.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading temple details...</p>
        </div>
      </div>
    )
  }

  if (!temple) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Temple Not Found</h1>
          <p className="text-gray-600 mb-6">The temple you're looking for doesn't exist or is not available.</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl">🕉️</span>
                <span className="text-2xl font-bold text-orange-600">Samarpayami</span>
              </Link>
              <span className="text-gray-400">→</span>
              <span className="text-gray-600">{temple.name}</span>
            </div>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700">Welcome, {user.user_metadata?.name}!</span>
                <Link href="/account">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    My Account
                  </button>
                </Link>
              </div>
            ) : (
              <Link href="/auth/login">
                <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Temple Header Section */}
        <section className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="md:flex">
            {/* Temple Image */}
            <div className="md:w-1/2 h-64 md:h-80 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <span className="text-8xl opacity-80">🏛️</span>
            </div>
            
            {/* Temple Info */}
            <div className="md:w-1/2 p-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-gray-800">{temple.name}</h1>
                <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-bold">
                  ✓ Verified Temple
                </div>
              </div>
              
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">{temple.description}</p>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <span className="mr-3 text-orange-500 text-xl">📍</span>
                  <span className="font-medium">{temple.address}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <span className="mr-3 text-orange-500 text-xl">🏙️</span>
                  <span className="font-medium">{temple.city}, {temple.state}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <span className="mr-3 text-orange-500 text-xl">📞</span>
                  <span className="font-medium">{temple.contact_phone}</span>
                </div>
                
                {temple.timings && (
                  <div className="bg-orange-50 rounded-xl p-4 mt-6">
                    <h3 className="font-bold text-orange-800 mb-3 flex items-center">
                      <span className="mr-2 text-xl">🕐</span> Temple Timings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(temple.timings).map(([session, time]) => (
                        <div key={session} className="flex justify-between">
                          <span className="capitalize font-medium text-orange-700">{session}:</span>
                          <span className="text-orange-600">{time as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Available Poojas Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Available Poojas & Services</h2>
            <div className="text-sm text-gray-500">
              {poojas.length} services available
            </div>
          </div>

          {poojas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {poojas.map((pooja) => (
                <div key={pooja.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                  {/* Pooja Image */}
                  <div className="h-48 bg-gradient-to-br from-amber-300 via-orange-400 to-red-400 flex items-center justify-center relative">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">🙏</span>
                    <div className="absolute top-4 left-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-sm font-bold">⏱️ {pooja.duration_minutes} min</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                      {pooja.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {pooja.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">₹{pooja.price}</div>
                        <div className="text-sm text-gray-500">per person</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{pooja.capacity_per_slot}</div>
                        <div className="text-sm text-gray-500">slots available</div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleBookPooja(pooja)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Book This Pooja 🚀
                    </button>
                    
                    <div className="flex items-center justify-center mt-3 space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">⭐ 4.8</span>
                      <span className="flex items-center">👥 {Math.floor(Math.random() * 20) + 10} booked today</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">🙏</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Poojas Available</h3>
              <p className="text-gray-600 mb-6">This temple hasn't added any poojas yet. Please check back later.</p>
              <Link href="/">
                <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
                  Explore Other Temples
                </button>
              </Link>
            </div>
          )}
        </section>

        {/* Contact & Reviews Section */}
        <section className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Temple</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="mr-3 text-orange-500 text-xl">📞</span>
                <div>
                  <div className="font-medium text-gray-800">Phone</div>
                  <div className="text-gray-600">{temple.contact_phone}</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-orange-500 text-xl">📍</span>
                <div>
                  <div className="font-medium text-gray-800">Address</div>
                  <div className="text-gray-600">{temple.address}</div>
                </div>
              </div>
              <div className="pt-4">
                <button className="w-full bg-orange-100 text-orange-600 py-3 rounded-xl font-medium hover:bg-orange-200 transition-colors">
                  Get Directions 🗺️
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Temple Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">4.8⭐</div>
                <div className="text-sm text-green-700">Average Rating</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{poojas.length}</div>
                <div className="text-sm text-blue-700">Services Available</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-purple-700">Happy Devotees</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">✓</div>
                <div className="text-sm text-orange-700">Verified Temple</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
