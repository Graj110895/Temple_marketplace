'use client'

import { useEffect, useState } from 'react'
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
  deity: string
  temple_type: string
  slug: string
}

export default function TemplesListingPage() {
  const { user } = useAuth()
  const [temples, setTemples] = useState<Temple[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedType, setSelectedType] = useState('')

  useEffect(() => {
    fetchTemples()
  }, [])

  const fetchTemples = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('temples')
        .select('*')
        .eq('approved', true) // Only show approved temples
        .order('name', { ascending: true })

      if (error) throw error
      setTemples(data || [])
    } catch (error) {
      console.error('Error fetching temples:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter temples based on search and filters
  const filteredTemples = temples.filter(temple => {
    const matchesSearch = temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         temple.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (temple.deity && temple.deity.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesState = !selectedState || temple.state === selectedState
    const matchesType = !selectedType || temple.temple_type === selectedType
    
    return matchesSearch && matchesState && matchesType
  })

  // Get unique states and types for filters
  const states = [...new Set(temples.map(temple => temple.state))].filter(Boolean)
  const templeTypes = [...new Set(temples.map(temple => temple.temple_type))].filter(Boolean)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading temples...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🕉️</span>
              <span className="text-2xl font-bold text-orange-600">Samarpayami</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Home</Link>
              <Link href="/temples" className="text-orange-600 font-medium">Temples</Link>
              <Link href="/services" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Services</Link>
              {user && (
                <Link href="/account">
                  <button className="text-gray-700 hover:text-orange-600 font-medium transition-colors">My Account</button>
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
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
                <div className="space-x-2">
                  <Link href="/auth/login">
                    <button className="text-orange-600 hover:text-orange-700 font-medium">Login</button>
                  </Link>
                  <Link href="/auth/register">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">Register</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Sacred Temples</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover divine temples across India and begin your spiritual journey with authentic pooja services
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search temples by name, city, or deity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* State Filter */}
              <div>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">All Types</option>
                  {templeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Counter */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-800">{filteredTemples.length}</span> temples
              {searchTerm && <span> for "{searchTerm}"</span>}
            </p>
          </div>

          {/* Temples Grid */}
          {filteredTemples.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemples.map((temple) => (
                <Link key={temple.id} href={`/temple/${temple.slug}`}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                    {/* Temple Image */}
                    <div className="h-48 bg-gradient-to-r from-orange-400 to-red-500 relative flex items-center justify-center">
                      <span className="text-6xl opacity-80">🏛️</span>
                      <div className="absolute bottom-4 left-4 text-white">
                        <span className="px-2 py-1 bg-orange-600 rounded-full text-xs font-medium">
                          {temple.temple_type || 'Temple'}
                        </span>
                      </div>
                    </div>

                    {/* Temple Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{temple.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{temple.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        {temple.deity && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">🏛️</span>
                            <span>{temple.deity}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📍</span>
                          <span>{temple.city}, {temple.state}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📞</span>
                          <span>{temple.contact_phone}</span>
                        </div>
                      </div>

                      <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                        View Temple Details
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No temples found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedState('')
                  setSelectedType('')
                }}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
