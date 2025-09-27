// 'use client'

// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import { useAuth } from '@/contexts/AuthContext'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// interface Pooja {
//   id: string
//   temple_id: string
//   title: string
//   description: string
//   duration_minutes: number
//   price: number
//   capacity_per_slot: number
//   benefits: string[]
//   requirements: string[]
//   best_time: string
//   temple_name?: string
//   temple_city?: string
//   temple_state?: string
// }

// export default function ServicesPage() {
//   const { user } = useAuth()
//   const router = useRouter()
//   const [poojas, setPoojas] = useState<Pooja[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedPriceRange, setSelectedPriceRange] = useState('')
//   const [selectedDuration, setSelectedDuration] = useState('')

//   useEffect(() => {
//     fetchPoojas()
//   }, [])

//   const fetchPoojas = async () => {
//     try {
//       setLoading(true)
      
//       // Fetch poojas with temple information
//       const { data: poojaData, error } = await supabase
//         .from('poojas')
//         .select('*')
//         .order('price', { ascending: true })

//       if (error) throw error

//       // Get temple names for each pooja
//       const poojaWithTemples = await Promise.all(
//         (poojaData || []).map(async (pooja) => {
//           const { data: templeData } = await supabase
//             .from('temples')
//             .select('name, city, state')
//             .eq('id', pooja.temple_id)
//             .single()

//           return {
//             ...pooja,
//             temple_name: templeData?.name || 'Unknown Temple',
//             temple_city: templeData?.city || '',
//             temple_state: templeData?.state || ''
//           }
//         })
//       )

//       setPoojas(poojaWithTemples)
//     } catch (error) {
//       console.error('Error fetching poojas:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleBookPooja = (poojaId: string) => {
//     if (!user) {
//       router.push('/auth/login')
//       return
//     }
//     router.push(`/book/${poojaId}`)
//   }

//   // Filter poojas based on search and filters
//   const filteredPoojas = poojas.filter(pooja => {
//     const matchesSearch = pooja.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          pooja.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          pooja.temple_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
//     let matchesPrice = true
//     if (selectedPriceRange) {
//       const [min, max] = selectedPriceRange.split('-').map(Number)
//       matchesPrice = pooja.price >= min && (max ? pooja.price <= max : true)
//     }

//     let matchesDuration = true
//     if (selectedDuration) {
//       const [min, max] = selectedDuration.split('-').map(Number)
//       matchesDuration = pooja.duration_minutes >= min && (max ? pooja.duration_minutes <= max : true)
//     }
    
//     return matchesSearch && matchesPrice && matchesDuration
//   })

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading services...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm sticky top-0 z-40">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between h-16">
//             <Link href="/" className="flex items-center space-x-2">
//               <span className="text-2xl">🕉️</span>
//               <span className="text-2xl font-bold text-orange-600">Samarpayami</span>
//             </Link>
            
//             <nav className="hidden md:flex items-center space-x-8">
//               <Link href="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Home</Link>
//               <Link href="/temples" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Temples</Link>
//               <Link href="/services" className="text-orange-600 font-medium">Services</Link>
//               {user && (
//                 <Link href="/account">
//                   <button className="text-gray-700 hover:text-orange-600 font-medium transition-colors">My Account</button>
//                 </Link>
//               )}
//             </nav>

//             <div className="flex items-center space-x-4">
//               {user ? (
//                 <span className="text-gray-700">Welcome, {user.user_metadata?.name}!</span>
//               ) : (
//                 <div className="space-x-2">
//                   <Link href="/auth/login">
//                     <button className="text-orange-600 hover:text-orange-700 font-medium">Login</button>
//                   </Link>
//                   <Link href="/auth/register">
//                     <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">Register</button>
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <div className="max-w-6xl mx-auto">
//           {/* Page Header */}
//           <div className="text-center mb-12">
//             <h1 className="text-5xl font-bold text-gray-800 mb-4">Pooja Services</h1>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Explore authentic pooja services across temples and book your spiritual experience online
//             </p>
//           </div>

//           {/* Search and Filters */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {/* Search */}
//               <div className="md:col-span-2">
//                 <input
//                   type="text"
//                   placeholder="Search poojas by name or temple..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                 />
//               </div>

//               {/* Price Filter */}
//               <div>
//                 <select
//                   value={selectedPriceRange}
//                   onChange={(e) => setSelectedPriceRange(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                 >
//                   <option value="">All Prices</option>
//                   <option value="0-500">₹0 - ₹500</option>
//                   <option value="501-1000">₹501 - ₹1000</option>
//                   <option value="1001-2000">₹1001 - ₹2000</option>
//                   <option value="2001">Above ₹2000</option>
//                 </select>
//               </div>

//               {/* Duration Filter */}
//               <div>
//                 <select
//                   value={selectedDuration}
//                   onChange={(e) => setSelectedDuration(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                 >
//                   <option value="">All Durations</option>
//                   <option value="0-30">0-30 minutes</option>
//                   <option value="31-60">31-60 minutes</option>
//                   <option value="61-120">1-2 hours</option>
//                   <option value="121">Above 2 hours</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Results Counter */}
//           <div className="mb-6">
//             <p className="text-gray-600">
//               Showing <span className="font-semibold text-gray-800">{filteredPoojas.length}</span> services
//               {searchTerm && <span> for "{searchTerm}"</span>}
//             </p>
//           </div>

//           {/* Services Grid */}
//           {filteredPoojas.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {filteredPoojas.map((pooja) => (
//                 <div key={pooja.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
//                   {/* Header */}
//                   <div className="flex justify-between items-start mb-4">
//                     <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{pooja.title}</h3>
//                     <span className="text-2xl font-bold text-green-600 ml-4">₹{pooja.price}</span>
//                   </div>

//                   {/* Temple Info */}
//                   <div className="flex items-center text-sm text-gray-600 mb-3">
//                     <span className="mr-2">🏛️</span>
//                     <span className="truncate">{pooja.temple_name}</span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-600 mb-4">
//                     <span className="mr-2">📍</span>
//                     <span>{pooja.temple_city}, {pooja.temple_state}</span>
//                   </div>

//                   {/* Description */}
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-3">{pooja.description}</p>

//                   {/* Details */}
//                   <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
//                     <div>
//                       <span className="text-gray-500">Duration:</span>
//                       <p className="font-medium">{pooja.duration_minutes} mins</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Capacity:</span>
//                       <p className="font-medium">{pooja.capacity_per_slot} people</p>
//                     </div>
//                     <div className="col-span-2">
//                       <span className="text-gray-500">Best Time:</span>
//                       <p className="font-medium">{pooja.best_time}</p>
//                     </div>
//                   </div>

//                   {/* Benefits */}
//                   {pooja.benefits && pooja.benefits.length > 0 && (
//                     <div className="mb-4">
//                       <p className="text-sm font-medium text-gray-700 mb-2">Benefits:</p>
//                       <div className="flex flex-wrap gap-1">
//                         {pooja.benefits.slice(0, 3).map((benefit, index) => (
//                           <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
//                             {benefit}
//                           </span>
//                         ))}
//                         {pooja.benefits.length > 3 && (
//                           <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
//                             +{pooja.benefits.length - 3} more
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Book Button */}
//                   <button 
//                     onClick={() => handleBookPooja(pooja.id)}
//                     className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium"
//                   >
//                     Book This Pooja
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-16">
//               <div className="text-6xl mb-4">🔍</div>
//               <h3 className="text-2xl font-semibold text-gray-800 mb-2">No services found</h3>
//               <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
//               <button
//                 onClick={() => {
//                   setSearchTerm('')
//                   setSelectedPriceRange('')
//                   setSelectedDuration('')
//                 }}
//                 className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Pooja {
  id: string
  temple_id: string
  title: string
  description: string
  duration_minutes: number
  price: number
  capacity_per_slot: number
  benefits: string[]
  requirements: string[]
  best_time: string
  temple_name?: string
  temple_city?: string
  temple_state?: string
}

export default function ServicesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [poojas, setPoojas] = useState<Pooja[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('')

  useEffect(() => {
    fetchPoojas()
  }, [])

  const fetchPoojas = async () => {
    try {
      setLoading(true)
      
      // Only fetch on client side
      if (typeof window === 'undefined') return

      // Dynamic import to avoid build-time issues
      const { supabase } = await import('@/lib/supabase')
      
      // Check if environment variables are available
      const hasConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                       process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://temp.supabase.co'

      if (!hasConfig) {
        // Mock data for development
        const mockPoojas = [
          {
            id: '1',
            temple_id: '1',
            title: 'Abhishek Pooja',
            description: 'Traditional abhishek ceremony with holy water, milk, and flowers. A sacred ritual to honor the deity.',
            duration_minutes: 30,
            price: 500,
            capacity_per_slot: 5,
            benefits: ['Spiritual cleansing', 'Inner peace', 'Divine blessings'],
            requirements: ['Clean clothes', 'Fruit offering'],
            best_time: 'Morning (6 AM - 10 AM)',
            temple_name: 'Sri Venkateswara Temple',
            temple_city: 'Tirupati',
            temple_state: 'Andhra Pradesh'
          },
          {
            id: '2',
            temple_id: '2',
            title: 'Archana',
            description: 'Personal prayer ceremony with chanting of sacred names and flower offerings.',
            duration_minutes: 15,
            price: 200,
            capacity_per_slot: 10,
            benefits: ['Personal blessings', 'Good fortune', 'Health'],
            requirements: ['Coconut', 'Flowers'],
            best_time: 'Any time',
            temple_name: 'Meenakshi Temple',
            temple_city: 'Madurai',
            temple_state: 'Tamil Nadu'
          },
          {
            id: '3',
            temple_id: '3',
            title: 'Special Darshan',
            description: 'VIP darshan with special access and priority viewing of the main deity.',
            duration_minutes: 20,
            price: 1000,
            capacity_per_slot: 2,
            benefits: ['Close darshan', 'Quick access', 'Blessed prasadam'],
            requirements: ['Advance booking', 'ID proof'],
            best_time: 'Evening (6 PM - 8 PM)',
            temple_name: 'Golden Temple',
            temple_city: 'Amritsar',
            temple_state: 'Punjab'
          },
          {
            id: '4',
            temple_id: '1',
            title: 'Rudrabhishek',
            description: 'Special abhishek dedicated to Lord Shiva with sacred water and bilva leaves.',
            duration_minutes: 45,
            price: 800,
            capacity_per_slot: 8,
            benefits: ['Lord Shiva blessings', 'Peace of mind', 'Removal of obstacles'],
            requirements: ['Bilva leaves', 'Sacred thread'],
            best_time: 'Early morning (5 AM - 7 AM)',
            temple_name: 'Sri Venkateswara Temple',
            temple_city: 'Tirupati',
            temple_state: 'Andhra Pradesh'
          },
          {
            id: '5',
            temple_id: '2',
            title: 'Sahasranama Archana',
            description: 'Chanting of 1000 names of the deity with flower offerings.',
            duration_minutes: 60,
            price: 1200,
            capacity_per_slot: 6,
            benefits: ['Complete divine protection', 'Prosperity', 'Spiritual growth'],
            requirements: ['Fresh flowers', 'Devotional attire'],
            best_time: 'Morning (8 AM - 10 AM)',
            temple_name: 'Meenakshi Temple',
            temple_city: 'Madurai',
            temple_state: 'Tamil Nadu'
          },
          {
            id: '6',
            temple_id: '3',
            title: 'Langar Seva',
            description: 'Participate in the community kitchen service and distribute food.',
            duration_minutes: 120,
            price: 300,
            capacity_per_slot: 20,
            benefits: ['Community service', 'Spiritual merit', 'Unity'],
            requirements: ['Clean hands', 'Head covering'],
            best_time: 'All day',
            temple_name: 'Golden Temple',
            temple_city: 'Amritsar',
            temple_state: 'Punjab'
          }
        ]
        
        setPoojas(mockPoojas)
        setLoading(false)
        return
      }

      // Fetch poojas with temple information
      const { data: poojaData, error } = await supabase
        .from('poojas')
        .select('*')
        .order('price', { ascending: true })

      if (error) throw error

      // Get temple names for each pooja
      const poojaWithTemples = await Promise.all(
        (poojaData || []).map(async (pooja) => {
          const { data: templeData } = await supabase
            .from('temples')
            .select('name, city, state')
            .eq('id', pooja.temple_id)
            .single()

          return {
            ...pooja,
            temple_name: templeData?.name || 'Unknown Temple',
            temple_city: templeData?.city || '',
            temple_state: templeData?.state || ''
          }
        })
      )

      setPoojas(poojaWithTemples)
    } catch (error) {
      console.error('Error fetching poojas:', error)
      // Fallback to mock data on error
      setPoojas([
        {
          id: '1',
          temple_id: '1',
          title: 'Abhishek Pooja',
          description: 'Traditional abhishek ceremony with holy water and sacred offerings.',
          duration_minutes: 30,
          price: 500,
          capacity_per_slot: 5,
          benefits: ['Spiritual cleansing', 'Inner peace'],
          requirements: ['Clean clothes'],
          best_time: 'Morning',
          temple_name: 'Sri Venkateswara Temple',
          temple_city: 'Tirupati',
          temple_state: 'Andhra Pradesh'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleBookPooja = (poojaId: string) => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    router.push(`/book/${poojaId}`)
  }

  // Filter poojas based on search and filters
  const filteredPoojas = poojas.filter(pooja => {
    const matchesSearch = pooja.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pooja.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pooja.temple_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesPrice = true
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number)
      matchesPrice = pooja.price >= min && (max ? pooja.price <= max : true)
    }

    let matchesDuration = true
    if (selectedDuration) {
      const [min, max] = selectedDuration.split('-').map(Number)
      matchesDuration = pooja.duration_minutes >= min && (max ? pooja.duration_minutes <= max : true)
    }
    
    return matchesSearch && matchesPrice && matchesDuration
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
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
              <Link href="/temples" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Temples</Link>
              <Link href="/services" className="text-orange-600 font-medium">Services</Link>
              {user && (
                <Link href="/account">
                  <button className="text-gray-700 hover:text-orange-600 font-medium transition-colors">My Account</button>
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <span className="text-gray-700">Welcome, {user.user_metadata?.name || user.email}!</span>
              ) : (
                <div className="space-x-2">
                  <Link href="/auth/login">
                    <button className="text-orange-600 hover:text-orange-700 font-medium">Login</button>
                  </Link>
                  <Link href="/auth/signup">
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
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Pooja Services</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore authentic pooja services across temples and book your spiritual experience online
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search poojas by name or temple..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Price Filter */}
              <div>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">All Prices</option>
                  <option value="0-500">₹0 - ₹500</option>
                  <option value="501-1000">₹501 - ₹1000</option>
                  <option value="1001-2000">₹1001 - ₹2000</option>
                  <option value="2001">Above ₹2000</option>
                </select>
              </div>

              {/* Duration Filter */}
              <div>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">All Durations</option>
                  <option value="0-30">0-30 minutes</option>
                  <option value="31-60">31-60 minutes</option>
                  <option value="61-120">1-2 hours</option>
                  <option value="121">Above 2 hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Counter */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-800">{filteredPoojas.length}</span> services
              {searchTerm && <span> for "{searchTerm}"</span>}
            </p>
          </div>

          {/* Services Grid */}
          {filteredPoojas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPoojas.map((pooja) => (
                <div key={pooja.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{pooja.title}</h3>
                    <span className="text-2xl font-bold text-green-600 ml-4">₹{pooja.price}</span>
                  </div>

                  {/* Temple Info */}
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span className="mr-2">🏛️</span>
                    <span className="truncate">{pooja.temple_name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <span className="mr-2">📍</span>
                    <span>{pooja.temple_city}, {pooja.temple_state}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{pooja.description}</p>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <p className="font-medium">{pooja.duration_minutes} mins</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Capacity:</span>
                      <p className="font-medium">{pooja.capacity_per_slot} people</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Best Time:</span>
                      <p className="font-medium">{pooja.best_time}</p>
                    </div>
                  </div>

                  {/* Benefits */}
                  {pooja.benefits && pooja.benefits.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {pooja.benefits.slice(0, 3).map((benefit, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {benefit}
                          </span>
                        ))}
                        {pooja.benefits.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{pooja.benefits.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  <button 
                    onClick={() => handleBookPooja(pooja.id)}
                    className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Book This Pooja
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No services found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedPriceRange('')
                  setSelectedDuration('')
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
