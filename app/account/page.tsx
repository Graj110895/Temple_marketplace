// 'use client'

// import { useEffect, useState } from 'react'
// import { useAuth } from '@/contexts/AuthContext'
// import { supabase } from '@/lib/supabase'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// interface Booking {
//   id: string
//   pooja_id: string
//   temple_id: string
//   booking_status: string
//   payment_status: string
//   amount: number
//   booking_type: string
//   devotee_details: any
//   created_at: string
//   temple_name?: string
//   pooja_title?: string
// }

// interface UserProfile {
//   name: string
//   email: string
//   phone: string
//   rashi: string
//   nakshatra: string
//   gothra: string
// }

// export default function AccountPage() {
//   const { user, signOut } = useAuth()
//   const router = useRouter()
//   const [activeTab, setActiveTab] = useState('profile')
//   const [bookings, setBookings] = useState<Booking[]>([])
//   const [loading, setLoading] = useState(true)
//   const [profileData, setProfileData] = useState<UserProfile>({
//     name: '',
//     email: '',
//     phone: '',
//     rashi: '',
//     nakshatra: '',
//     gothra: ''
//   })
//   const [isEditing, setIsEditing] = useState(false)

//   useEffect(() => {
//     if (!user) {
//       router.push('/auth/login')
//       return
//     }

//     // Initialize profile data from user
//     setProfileData({
//       name: user.user_metadata?.name || '',
//       email: user.email || '',
//       phone: user.user_metadata?.phone || '',
//       rashi: user.user_metadata?.rashi || '',
//       nakshatra: user.user_metadata?.nakshatra || '',
//       gothra: user.user_metadata?.gothra || ''
//     })

//     fetchUserBookings()
//   }, [user])

//   const fetchUserBookings = async () => {
//     if (!user) return

//     try {
//       setLoading(true)
      
//       // Simple fetch without joins first
//       const { data: bookingsData, error } = await supabase
//         .from('bookings')
//         .select('*')
//         .eq('user_id', user.id)
//         .order('created_at', { ascending: false })

//       if (error) {
//         console.error('Bookings fetch error:', error)
//         setBookings([])
//         return
//       }

//       console.log('Fetched bookings:', bookingsData) // Debug log

//       // Get temple and pooja names separately
//       const bookingsWithDetails = await Promise.all(
//         (bookingsData || []).map(async (booking) => {
//           // Get temple name
//           const { data: templeData } = await supabase
//             .from('temples')
//             .select('name')
//             .eq('id', booking.temple_id)
//             .single()

//           // Get pooja name
//           const { data: poojaData } = await supabase
//             .from('poojas')
//             .select('title')
//             .eq('id', booking.pooja_id)
//             .single()

//           return {
//             ...booking,
//             temple_name: templeData?.name || 'Unknown Temple',
//             pooja_title: poojaData?.title || 'Unknown Pooja'
//           }
//         })
//       )

//       setBookings(bookingsWithDetails)
//     } catch (error) {
//       console.error('Error fetching bookings:', error)
//       setBookings([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleProfileUpdate = async () => {
//     try {
//       const { error } = await supabase.auth.updateUser({
//         data: {
//           name: profileData.name,
//           phone: profileData.phone,
//           rashi: profileData.rashi,
//           nakshatra: profileData.nakshatra,
//           gothra: profileData.gothra
//         }
//       })

//       if (error) throw error

//       alert('Profile updated successfully!')
//       setIsEditing(false)
//     } catch (error: any) {
//       alert(`Error updating profile: ${error.message}`)
//     }
//   }

//   const handleInputChange = (field: keyof UserProfile, value: string) => {
//     setProfileData(prev => ({
//       ...prev,
//       [field]: value
//     }))
//   }

//   const getBookingStatusColor = (status: string) => {
//     switch (status) {
//       case 'CONFIRMED': return 'bg-green-100 text-green-600'
//       case 'PENDING': return 'bg-yellow-100 text-yellow-600'
//       case 'CANCELLED': return 'bg-red-100 text-red-600'
//       case 'COMPLETED': return 'bg-blue-100 text-blue-600'
//       default: return 'bg-gray-100 text-gray-600'
//     }
//   }

//   const getPaymentStatusColor = (status: string) => {
//     switch (status) {
//       case 'PAID': return 'bg-green-100 text-green-600'
//       case 'PENDING': return 'bg-orange-100 text-orange-600'
//       case 'NOT_REQUIRED': return 'bg-blue-100 text-blue-600'
//       case 'REFUNDED': return 'bg-purple-100 text-purple-600'
//       default: return 'bg-gray-100 text-gray-600'
//     }
//   }

//   // Filter bookings for different tabs
//   const upcomingBookings = bookings.filter(booking => {
//     const bookingDate = new Date(booking.devotee_details?.booking_date)
//     return bookingDate >= new Date() && booking.booking_status !== 'CANCELLED'
//   })

//   const pastBookings = bookings.filter(booking => {
//     const bookingDate = new Date(booking.devotee_details?.booking_date)
//     return bookingDate < new Date() || booking.booking_status === 'COMPLETED'
//   })

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600">Please login to access your account</p>
//           <Link href="/auth/login">
//             <button className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
//               Login
//             </button>
//           </Link>
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
//             <div className="flex items-center space-x-4">
//               <Link href="/" className="flex items-center space-x-2">
//                 <span className="text-2xl">🕉️</span>
//                 <span className="text-2xl font-bold text-orange-600">Samarpayami</span>
//               </Link>
//               <span className="text-gray-400">→</span>
//               <span className="text-gray-600">My Account</span>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <span className="text-gray-700">Welcome, {user.user_metadata?.name}!</span>
//               <button 
//                 onClick={() => signOut()}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         {/* WIDER CONTAINER - Changed from max-w-6xl to max-w-7xl */}
//         <div className="max-w-7xl mx-auto">
//           {/* Page Header */}
//           <div className="mb-8">
//             <h1 className="text-4xl font-bold text-gray-800 mb-2">My Account</h1>
//             <p className="text-gray-600">Manage your profile, bookings, and preferences</p>
//           </div>

//           {/* ADJUSTED GRID - Changed from lg:grid-cols-4 to lg:grid-cols-5 */}
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//             {/* Sidebar Navigation - Smaller */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-2xl shadow-lg p-6">
//                 <div className="text-center mb-6">
//                   <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <span className="text-2xl">👤</span>
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-800">{profileData.name}</h3>
//                   <p className="text-xs text-gray-500">{profileData.email}</p>
//                 </div>

//                 <nav className="space-y-2">
//                   <button
//                     onClick={() => setActiveTab('profile')}
//                     className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
//                       activeTab === 'profile' 
//                         ? 'bg-orange-500 text-white' 
//                         : 'text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     👤 Profile
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('bookings')}
//                     className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
//                       activeTab === 'bookings' 
//                         ? 'bg-orange-500 text-white' 
//                         : 'text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     📅 My Bookings ({bookings.length})
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('upcoming')}
//                     className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
//                       activeTab === 'upcoming' 
//                         ? 'bg-orange-500 text-white' 
//                         : 'text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     🔮 Upcoming ({upcomingBookings.length})
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('history')}
//                     className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
//                       activeTab === 'history' 
//                         ? 'bg-orange-500 text-white' 
//                         : 'text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     📜 History ({pastBookings.length})
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('favorites')}
//                     className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
//                       activeTab === 'favorites' 
//                         ? 'bg-orange-500 text-white' 
//                         : 'text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     ❤️ Favorites
//                   </button>
//                 </nav>
//               </div>
//             </div>

//             {/* Main Content - MUCH WIDER */}
//             <div className="lg:col-span-4">
//               <div className="bg-white rounded-2xl shadow-lg p-8">
                
//                 {/* Profile Tab */}
//                 {activeTab === 'profile' && (
//                   <div>
//                     <div className="flex items-center justify-between mb-6">
//                       <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
//                       {!isEditing ? (
//                         <button
//                           onClick={() => setIsEditing(true)}
//                           className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
//                         >
//                           Edit Profile
//                         </button>
//                       ) : (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={handleProfileUpdate}
//                             className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//                           >
//                             Save Changes
//                           </button>
//                           <button
//                             onClick={() => setIsEditing(false)}
//                             className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//                         <input
//                           type="text"
//                           value={profileData.name}
//                           onChange={(e) => handleInputChange('name', e.target.value)}
//                           disabled={!isEditing}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                         <input
//                           type="email"
//                           value={profileData.email}
//                           disabled
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//                         <input
//                           type="tel"
//                           value={profileData.phone}
//                           onChange={(e) => handleInputChange('phone', e.target.value)}
//                           disabled={!isEditing}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Rashi</label>
//                         <input
//                           type="text"
//                           value={profileData.rashi}
//                           onChange={(e) => handleInputChange('rashi', e.target.value)}
//                           disabled={!isEditing}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Nakshatra</label>
//                         <input
//                           type="text"
//                           value={profileData.nakshatra}
//                           onChange={(e) => handleInputChange('nakshatra', e.target.value)}
//                           disabled={!isEditing}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Gothra</label>
//                         <input
//                           type="text"
//                           value={profileData.gothra}
//                           onChange={(e) => handleInputChange('gothra', e.target.value)}
//                           disabled={!isEditing}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* All Bookings Tab - WIDER CARDS */}
//                 {activeTab === 'bookings' && (
//                   <div>
//                     {loading ? (
//                       <div className="text-center py-8">
//                         <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto"></div>
//                         <p className="text-gray-600 mt-4">Loading bookings...</p>
//                       </div>
//                     ) : bookings && bookings.length > 0 ? (
//                       <div>
//                         {/* Orange Header */}
//                         <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 mb-8 text-center">
//                           <h2 className="text-3xl font-bold text-black">My Bookings</h2>
//                         </div>
                        
//                         {/* WIDER Cards Grid - Better spacing */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//                           {bookings.map((booking) => (
//                             <div key={booking.id} className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-sm min-w-0">
                              
//                               {/* Temple Name */}
//                               <h3 className="text-xl font-semibold text-black mb-2 truncate">{booking.temple_name}</h3>
                              
//                               {/* Pooja Name */}
//                               <p className="text-orange-500 font-medium text-base mb-4 truncate">{booking.pooja_title}</p>
                              
//                               {/* Status Badges */}
//                               <div className="flex justify-end gap-2 mb-6">
//                                 <span className={`px-3 py-1 rounded text-sm font-semibold ${getBookingStatusColor(booking.booking_status)}`}>
//                                   {booking.booking_status}
//                                 </span>
//                                 <span className={`px-3 py-1 rounded text-sm font-semibold ${getPaymentStatusColor(booking.payment_status)}`}>
//                                   {booking.payment_status}
//                                 </span>
//                               </div>
                              
//                               {/* Details Grid */}
//                               <div className="space-y-3 text-base mb-6">
//                                 <div className="flex justify-between items-center">
//                                   <span className="text-gray-600 font-medium">Booking ID:</span>
//                                   <span className="font-semibold">{booking.id.substring(0, 8).toUpperCase()}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                   <span className="text-gray-600 font-medium">Date:</span>
//                                   <span className="font-medium">{booking.devotee_details?.booking_date || 'N/A'}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                   <span className="text-gray-600 font-medium">Time:</span>
//                                   <span className="font-medium">{booking.devotee_details?.booking_time || 'N/A'}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                   <span className="text-gray-600 font-medium">Amount:</span>
//                                   <span className="font-bold text-green-600 text-lg">₹{booking.amount}</span>
//                                 </div>
//                               </div>

//                               {/* Horizontal Line */}
//                               <hr className="border-gray-300 mb-4" />

//                               {/* Footer */}
//                               <div className="flex justify-between items-center">
//                                 <span className="text-sm text-gray-500">
//                                   Booked on<br/>{new Date(booking.created_at).toLocaleDateString()}
//                                 </span>
//                                 <div className="flex gap-3">
//                                   <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
//                                     View<br/>Details
//                                   </button>
//                                   {booking.booking_status === 'CONFIRMED' && (
//                                     <button className="text-red-500 hover:text-red-600 text-sm font-medium">
//                                       Cancel
//                                     </button>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center py-12">
//                         <div className="text-6xl mb-4">📅</div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookings yet</h3>
//                         <p className="text-gray-600 mb-6">Start your spiritual journey by booking a pooja</p>
//                         <Link href="/">
//                           <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
//                             Explore Temples
//                           </button>
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Upcoming Bookings Tab - Same Style but Wider */}
//                 {activeTab === 'upcoming' && (
//                   <div>
//                     {upcomingBookings.length > 0 ? (
//                       <div>
//                         {/* Orange Header */}
//                         <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 mb-8 text-center">
//                           <h2 className="text-3xl font-bold text-black">Upcoming Bookings</h2>
//                         </div>
                        
//                         {/* WIDER Cards Grid */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//                           {upcomingBookings.map((booking) => (
//                             <div key={booking.id} className="bg-white border-2 border-orange-300 rounded-xl p-6 shadow-lg border-l-4 border-l-orange-500 min-w-0">
                              
//                               {/* Temple Name */}
//                               <h3 className="text-xl font-semibold text-black mb-2 truncate">{booking.temple_name}</h3>
                              
//                               {/* Pooja Name */}
//                               <p className="text-orange-500 font-medium text-base mb-4 truncate">{booking.pooja_title}</p>
                              
//                               {/* Status Badge */}
//                               <div className="flex justify-end mb-6">
//                                 <span className={`px-3 py-1 rounded text-sm font-semibold ${getBookingStatusColor(booking.booking_status)}`}>
//                                   {booking.booking_status}
//                                 </span>
//                               </div>
                              
//                               {/* Details Grid */}
//                               <div className="space-y-3 text-base mb-6">
//                                 <div className="flex justify-between items-center">
//                                   <span className="text-gray-600 font-medium">Booking ID:</span>
//                                   <span className="font-semibold">{booking.id.substring(0, 8).toUpperCase()}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                   <span className="text-gray-600 font-medium">Date:</span>
//                                   <span className="font-medium">{booking.devotee_details?.booking_date}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                   <span className="text-gray-600 font-medium">Time:</span>
//                                   <span className="font-medium">{booking.devotee_details?.booking_time}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                   <span className="text-gray-600 font-medium">Amount:</span>
//                                   <span className="font-bold text-green-600 text-lg">₹{booking.amount}</span>
//                                 </div>
//                               </div>

//                               {/* Horizontal Line */}
//                               <hr className="border-gray-300 mb-4" />

//                               {/* Footer */}
//                               <div className="flex justify-between items-center">
//                                 <span className="text-sm text-gray-500">
//                                   Booked on<br/>{new Date(booking.created_at).toLocaleDateString()}
//                                 </span>
//                                 <div className="flex gap-3">
//                                   <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
//                                     View<br/>Details
//                                   </button>
//                                   <button className="text-red-500 hover:text-red-600 text-sm font-medium">
//                                     Cancel
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center py-12">
//                         <div className="text-6xl mb-4">🔮</div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-2">No upcoming bookings</h3>
//                         <p className="text-gray-600 mb-6">Book a pooja for your spiritual journey</p>
//                         <Link href="/">
//                           <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
//                             Book a Pooja
//                           </button>
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* History Tab */}
//                 {activeTab === 'history' && (
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking History</h2>
//                     {pastBookings.length > 0 ? (
//                       <div className="space-y-4">
//                         {pastBookings.map((booking) => (
//                           <div key={booking.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
//                             <div className="flex justify-between items-start mb-4">
//                               <div>
//                                 <h3 className="text-lg font-semibold text-gray-800">{booking.temple_name}</h3>
//                                 <p className="text-gray-600 font-medium">{booking.pooja_title}</p>
//                               </div>
//                               <div className="text-right">
//                                 <p className="text-lg font-bold text-gray-700">₹{booking.amount}</p>
//                                 <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-600">
//                                   COMPLETED
//                                 </span>
//                               </div>
//                             </div>
                            
//                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
//                               <div>
//                                 <span className="text-gray-500">Booking ID:</span>
//                                 <p className="font-mono font-semibold text-gray-700">{booking.id.substring(0, 8).toUpperCase()}</p>
//                               </div>
//                               <div>
//                                 <span className="text-gray-500">Date:</span>
//                                 <p className="font-medium text-gray-700">📅 {booking.devotee_details?.booking_date}</p>
//                               </div>
//                               <div>
//                                 <span className="text-gray-500">Booked On:</span>
//                                 <p className="font-medium text-gray-700">{new Date(booking.created_at).toLocaleDateString()}</p>
//                               </div>
//                             </div>

//                             <div className="flex justify-end pt-4 border-t border-gray-300">
//                               <button className="text-orange-600 hover:text-orange-700 text-sm font-medium hover:underline">
//                                 Book Again
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-12">
//                         <div className="text-6xl mb-4">📜</div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-2">No booking history</h3>
//                         <p className="text-gray-600">Your completed bookings will appear here</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Favorites Tab */}
//                 {activeTab === 'favorites' && (
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-800 mb-6">Favorite Temples</h2>
//                     <div className="text-center py-12">
//                       <div className="text-6xl mb-4">❤️</div>
//                       <h3 className="text-xl font-semibold text-gray-800 mb-2">No favorites yet</h3>
//                       <p className="text-gray-600 mb-6">Save your favorite temples for quick access</p>
//                       <Link href="/">
//                         <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
//                           Browse Temples
//                         </button>
//                       </Link>
//                     </div>
//                   </div>
//                 )}

//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Booking {
  id: string
  temple_name: string
  service: string
  date: string
  time: string
  status: string
  amount: number
}

export default function AccountPage() {
  const { user, loading, signOut, isReady } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const loadBookings = async () => {
      if (!isReady || !user) {
        setBookingsLoading(false)
        return
      }

      try {
        // Import Supabase only when needed
        const { supabase } = await import('@/lib/supabase')
        
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setBookings(data || [])
      } catch (error) {
        console.error('Error loading bookings:', error)
      } finally {
        setBookingsLoading(false)
      }
    }

    loadBookings()
  }, [user, isReady])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading || !isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">My Bookings</h2>
          
          {bookingsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏛️</div>
              <p className="text-gray-600 mb-4">No bookings yet</p>
              <button
                onClick={() => router.push('/temples')}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse Temples
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.temple_name}</h3>
                      <p className="text-gray-600">{booking.service}</p>
                      <p className="text-sm text-gray-500">
                        {booking.date} at {booking.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </div>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        ₹{booking.amount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
