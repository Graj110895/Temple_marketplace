// 'use client'

// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import Link from 'next/link'
// import { useAuth } from '@/contexts/AuthContext'
// import { useRouter } from 'next/navigation'

// interface Temple {
//   id: string
//   name: string
//   description: string
//   address: string
//   city: string
//   state: string
//   contact_phone: string
//   timings: any
//   slug: string
// }

// interface Pooja {
//   id: string
//   temple_id: string
//   title: string
//   description: string
//   duration_minutes: number
//   price: number
//   capacity_per_slot: number
// }

// export default function Home() {
//   const { user, signOut } = useAuth()
//   const router = useRouter()
//   const [temples, setTemples] = useState<Temple[]>([])
//   const [poojas, setPoojas] = useState<Pooja[]>([])
//   const [loading, setLoading] = useState(true)
//   const [currentBanner, setCurrentBanner] = useState(0)
//   const [currentSlider, setCurrentSlider] = useState(0)

//   // Enhanced banner data with image support and flexible positioning
//   const banners = [
//     {
//       id: 1,
//       title: "Book Divine Poojas Online",
//       subtitle: "Connect with authenticated temples across India",
//       image: "🏛️", // You can replace this with actual image URLs
//       bgColor: "from-orange-500 to-red-500",
//       textPosition: "center", // center, left, right
//       overlayColor: "bg-black bg-opacity-30"
//     },
//     {
//       id: 2, 
//       title: "Trusted Temple Network",
//       subtitle: "Experience authentic rituals with verified pundits",
//       image: "🙏",
//       bgColor: "from-amber-500 to-orange-500",
//       textPosition: "left",
//       overlayColor: "bg-black bg-opacity-40"
//     },
//     {
//       id: 3,
//       title: "Sacred Ceremonies Made Easy",
//       subtitle: "Book your spiritual journey from home",
//       image: "🕉️",
//       bgColor: "from-red-500 to-pink-500", 
//       textPosition: "right",
//       overlayColor: "bg-black bg-opacity-35"
//     }
//   ]

//   // Add more sample temples for testing
//   const sampleTemples = [
//     {
//       id: 'temp1',
//       name: 'Sri Venkateswara Temple',
//       description: 'Famous hilltop temple dedicated to Lord Venkateswara, known for fulfilling devotees wishes',
//       city: 'Tirupati',
//       state: 'Andhra Pradesh',
//       contact_phone: '+91-9876543213',
//       slug: 'sri-venkateswara-temple',
//       address: 'Tirumala Hills, Tirupati',
//       timings: { morning: '4:00 AM - 12:00 PM', evening: '4:00 PM - 10:00 PM' }
//     },
//     {
//       id: 'temp2', 
//       name: 'Jagannath Temple',
//       description: 'Sacred temple of Lord Jagannath, famous for the annual Rath Yatra festival',
//       city: 'Puri',
//       state: 'Odisha',
//       contact_phone: '+91-9876543214',
//       slug: 'jagannath-temple',
//       address: 'Grand Road, Puri',
//       timings: { morning: '5:00 AM - 1:00 PM', evening: '5:00 PM - 9:00 PM' }
//     }
//   ]

//   useEffect(() => {
//     fetchData()
    
//     // Auto-slide banner
//     const bannerInterval = setInterval(() => {
//       setCurrentBanner((prev) => (prev + 1) % banners.length)
//     }, 5000) // Slower transition for better UX

//     // Auto-slide explore section
//     const sliderInterval = setInterval(() => {
//       const totalTemples = [...temples, ...sampleTemples].length
//       setCurrentSlider((prev) => (prev + 1) % Math.max(1, totalTemples - 3))
//     }, 4000)

//     return () => {
//       clearInterval(bannerInterval)
//       clearInterval(sliderInterval)
//     }
//   }, [temples.length])

//   async function fetchData() {
//     try {
//       const { data: templesData, error: templesError } = await supabase
//         .from('temples')
//         .select('*')
//         .eq('approved', true)

//       if (templesError) throw templesError

//       const { data: poojasData, error: poojasError } = await supabase
//         .from('poojas')
//         .select('*')
//         .eq('is_active', true)

//       if (poojasError) throw poojasError

//       setTemples(templesData || [])
//       setPoojas(poojasData || [])
//     } catch (err) {
//       console.error('Error:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const allTemples = [...temples, ...sampleTemples]

//   const handleTempleClick = (temple: Temple | any) => {
//     // Navigate to temple detail page
//     router.push(`/temple/${temple.slug}`)
//   }

//   const handleBookNow = (pooja: Pooja) => {
//     const temple = allTemples.find(t => t.id === pooja.temple_id)
//     alert(`🙏 Booking ${pooja.title} at ${temple?.name}\n\n💰 Price: ₹${pooja.price}\n⏰ Duration: ${pooja.duration_minutes} mins\n👥 Available slots: ${pooja.capacity_per_slot}\n\n✨ This will open the complete booking flow with:\n• Date & time selection\n• Devotee details form\n• Payment gateway integration\n• Booking confirmation`)
//   }

//   const getTextAlignment = (position: string) => {
//     switch(position) {
//       case 'center': return 'text-center mx-auto'
//       case 'right': return 'text-right ml-auto'
//       case 'left':
//       default: return 'text-left mr-auto'
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading Samarpayami...</p>
//           <p className="text-gray-400 text-sm mt-2">Connecting to divine services...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header/Navigation Bar */}
//       <header className="bg-white shadow-sm sticky top-0 z-50">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-2">
//               <span className="text-2xl">🕉️</span>
//               <span className="text-2xl font-bold text-orange-600">Samarpayami</span>
//             </div>

//               <nav className="hidden md:flex items-center space-x-8">
//   <Link href="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Home</Link>
//   <Link href="/temples" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Temples</Link>
//   <Link href="/services" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Services</Link>
//   {user && (
//     <Link href="/account">
//       <button className="text-gray-700 hover:text-orange-600 font-medium transition-colors">My Account</button>
//     </Link>
// )}
//             </nav>

//             <div className="flex items-center space-x-4">
//               <button className="hidden md:block bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
//                 🔍 Search
//               </button>
              
//               {user ? (
//                 <div className="flex items-center space-x-3">
//                   <span className="text-gray-700 hidden md:block">Welcome, {user.user_metadata?.name || 'Devotee'}!</span>
//                   <button 
//                     onClick={() => signOut()}
//                     className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               ) : (
//                 <Link href="/auth/login">
//                   <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
//                     Login
//                   </button>
//                 </Link>
//               )}
//             </div>

//             <button className="md:hidden p-2">
//               <div className="space-y-1">
//                 <div className="w-6 h-0.5 bg-gray-600"></div>
//                 <div className="w-6 h-0.5 bg-gray-600"></div>
//                 <div className="w-6 h-0.5 bg-gray-600"></div>
//               </div>
//             </button>
//           </div>
//         </div>
//       </header>

//       <main>
//         {/* Enhanced Hero Banners Section with Image Support */}
//         <section className="relative h-80 md:h-96 overflow-hidden">
//           {banners.map((banner, index) => (
//             <div
//               key={banner.id}
//               className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} transform transition-all duration-700 ease-in-out ${
//                 index === currentBanner ? 'translate-x-0 opacity-100' : 
//                 index < currentBanner ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'
//               }`}
//             >
//               {/* Background Image Placeholder - Replace with actual images */}
//               <div className="absolute inset-0 bg-cover bg-center opacity-20">
//                 {/* Replace with: <img src={banner.imageUrl} className="w-full h-full object-cover" /> */}
//                 <div className="w-full h-full flex items-center justify-center text-9xl opacity-30">
//                   {banner.image}
//                 </div>
//               </div>
              
//               {/* Overlay */}
//               <div className={`absolute inset-0 ${banner.overlayColor}`}></div>
              
//               <div className="container mx-auto px-4 h-full flex items-center relative z-10">
//                 <div className={`text-white max-w-4xl ${getTextAlignment(banner.textPosition)}`}>
//                   <div className="text-7xl md:text-8xl mb-6">{banner.image}</div>
//                   <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{banner.title}</h1>
//                   <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">{banner.subtitle}</p>
//                   <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
//                     <button 
//                       onClick={() => alert('Opening temple exploration...')}
//                       className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg"
//                     >
//                       Explore Temples 🏛️
//                     </button>
//                     <button 
//                       onClick={() => alert('Opening booking flow...')}
//                       className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-all transform hover:scale-105 backdrop-blur-sm"
//                     >
//                       Book Now 🙏
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {/* Enhanced Banner Indicators */}
//           <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
//             {banners.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentBanner(index)}
//                 className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
//                   index === currentBanner ? 'bg-white shadow-lg' : 'bg-white bg-opacity-60 hover:bg-opacity-80'
//                 }`}
//               />
//             ))}
//           </div>
//         </section>

//         <div className="container mx-auto px-4 py-16">
//           {/* Stats Section */}
//           <section className="mb-20">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//               <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
//                 <div className="text-4xl mb-3">🏛️</div>
//                 <div className="text-3xl font-bold text-orange-600 mb-1">{allTemples.length}</div>
//                 <div className="text-gray-600">Verified Temples</div>
//               </div>
//               <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
//                 <div className="text-4xl mb-3">🙏</div>
//                 <div className="text-3xl font-bold text-orange-600 mb-1">{poojas.length}</div>
//                 <div className="text-gray-600">Sacred Poojas</div>
//               </div>
//               <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
//                 <div className="text-4xl mb-3">⭐</div>
//                 <div className="text-3xl font-bold text-orange-600 mb-1">4.8</div>
//                 <div className="text-gray-600">Average Rating</div>
//               </div>
//               <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
//                 <div className="text-4xl mb-3">✅</div>
//                 <div className="text-3xl font-bold text-orange-600 mb-1">100%</div>
//                 <div className="text-gray-600">Satisfaction</div>
//               </div>
//             </div>
//           </section>

//           {/* Enhanced Temples Near You Section */}
//           <section className="py-16 bg-white">
//             <div className="container mx-auto px-4">
//               <h2 className="text-4xl font-bold text-gray-800 mb-3">Temples Near You</h2>
//               <p className="text-gray-600 text-lg mb-12">Discover sacred places in your vicinity</p>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
//                 {allTemples.slice(0, 6).map((temple, index) => (
//                   <div 
//                     key={temple.id} 
//                     className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-orange-200 group transform hover:-translate-y-2"
//                     onClick={() => handleTempleClick(temple)}
//                   >
//                     {/* Improved Temple Image */}
//                     <div className="h-36 bg-gradient-to-br from-orange-400 to-red-500 rounded-t-2xl flex items-center justify-center relative overflow-hidden">
//                       <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">🏛️</span>
//                       <div className="absolute top-2 right-2">
//                         <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-1">
//                           <span className="text-white text-xs font-medium">⭐ 4.{index + 3}</span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="p-4">
//                       <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
//                         {temple.name}
//                       </h3>
//                       <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">{temple.description}</p>
                      
//                       <div className="flex items-center text-sm text-gray-500 mb-4">
//                         <span className="mr-2 text-orange-500">📍</span>
//                         <span className="line-clamp-1">{temple.city}, {temple.state}</span>
//                       </div>
                      
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-bold">
//                             ✓ Verified
//                           </span>
//                         </div>
//                         <button className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors transform hover:scale-105 shadow-md">
//                           View
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>

//           {/* Enhanced Explore All Temples - Auto Sliding Section */}
//           <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
//             <div className="container mx-auto px-4">
//               <div className="flex items-center justify-between mb-12">
//                 <div>
//                   <h2 className="text-4xl font-bold text-gray-800 mb-3">Explore All Temples</h2>
//                   <p className="text-gray-600 text-lg">Discover more sacred destinations across India</p>
//                 </div>
                
//                 <div className="flex space-x-3">
//                   <button 
//                     onClick={() => setCurrentSlider(Math.max(0, currentSlider - 1))}
//                     className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl border border-orange-100 hover:bg-orange-50 transition-all"
//                     disabled={currentSlider === 0}
//                   >
//                     <span className="text-orange-500 font-bold">←</span>
//                   </button>
//                   <button 
//                     onClick={() => setCurrentSlider(Math.min(allTemples.length - 4, currentSlider + 1))}
//                     className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl border border-orange-100 hover:bg-orange-50 transition-all"
//                     disabled={currentSlider >= allTemples.length - 4}
//                   >
//                     <span className="text-orange-500 font-bold">→</span>
//                   </button>
//                 </div>
//               </div>

//               <div className="overflow-hidden rounded-2xl">
//                 <div 
//                   className="flex transition-transform duration-500 ease-in-out"
//                   style={{ transform: `translateX(-${currentSlider * (100 / 4)}%)` }}
//                 >
//                   {allTemples.map((temple, index) => (
//                     <div key={temple.id} className="w-1/4 flex-shrink-0 px-3">
//                       <div 
//                         className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-orange-200 group transform hover:-translate-y-1"
//                         onClick={() => handleTempleClick(temple)}
//                       >
//                         <div className="h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-t-2xl flex items-center justify-center relative">
//                           <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">🏛️</span>
//                           <div className="absolute top-2 right-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-1">
//                             <span className="text-white text-xs font-medium">⭐ 4.{index + 4}</span>
//                           </div>
//                         </div>
                        
//                         <div className="p-4">
//                           <h3 className="font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
//                             {temple.name}
//                           </h3>
//                           <p className="text-sm text-gray-500 mb-2 line-clamp-1">{temple.city}, {temple.state}</p>
                          
//                           <div className="flex items-center justify-between">
//                             <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold">
//                               ✓ Verified
//                             </span>
//                             <span className="text-orange-500 hover:text-orange-600 font-bold text-sm group-hover:underline">
//                               View →
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Enhanced Popular Poojas Section */}
//           <section className="py-16 bg-white">
//             <div className="container mx-auto px-4">
//               <h2 className="text-4xl font-bold text-gray-800 mb-3">Popular Poojas</h2>
//               <p className="text-gray-600 text-lg mb-12">Most booked spiritual services this month</p>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//                 {poojas.map((pooja, index) => {
//                   const temple = allTemples.find(t => t.id === pooja.temple_id)
//                   return (
//                     <div 
//                       key={pooja.id} 
//                       className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:border-orange-200 transform hover:-translate-y-2 cursor-pointer"
//                       onClick={() => handleBookNow(pooja)}
//                     >
//                       {/* Enhanced Pooja Image */}
//                       <div className="h-36 bg-gradient-to-br from-amber-300 via-orange-400 to-red-400 rounded-t-2xl flex items-center justify-center relative overflow-hidden">
//                         <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🙏</span>
//                         <div className="absolute top-3 left-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-1">
//                           <span className="text-white text-xs font-bold">⏱️ {pooja.duration_minutes}min</span>
//                         </div>
//                         <div className="absolute top-3 right-3 bg-green-500 bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1">
//                           <span className="text-white text-xs font-bold">🔥 Popular</span>
//                         </div>
//                       </div>
                      
//                       <div className="p-5">
//                         <h3 className="font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors text-lg">
//                           {pooja.title}
//                         </h3>
//                         <p className="text-sm text-gray-500 mb-2 font-medium">📍 {temple?.name}</p>
//                         <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">{pooja.description}</p>
                        
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="text-center">
//                             <div className="text-2xl font-bold text-green-600">₹{pooja.price}</div>
//                             <div className="text-xs text-gray-500">per person</div>
//                           </div>
//                           <div className="text-center">
//                             <div className="text-lg font-bold text-orange-600">{pooja.capacity_per_slot}</div>
//                             <div className="text-xs text-gray-500">slots left</div>
//                           </div>
//                         </div>
                        
//                         <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl text-sm font-bold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg">
//                           Book Now 🚀
//                         </button>
                        
//                         <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-gray-500">
//                           <span className="flex items-center">⭐ 4.{index + 7}</span>
//                           <span className="flex items-center">👥 {Math.floor(Math.random() * 50) + 20} booked</span>
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
              
//               <div className="text-center mt-12">
//                 <button 
//                   onClick={() => alert('Opening all poojas page...')}
//                   className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg"
//                 >
//                   View All Poojas 🙏
//                 </button>
//               </div>
//             </div>
//           </section>

//           {/* About Section */}
//           <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
//             <div className="container mx-auto px-4 text-center">
//               <div className="max-w-5xl mx-auto">
//                 <div className="text-6xl mb-8">🕉️</div>
//                 <h2 className="text-5xl font-bold text-gray-800 mb-8">About Samarpayami</h2>
//                 <p className="text-xl text-gray-600 mb-12 leading-relaxed">
//                   Samarpayami bridges the gap between devotion and modern convenience. We connect you with 
//                   verified temples across India, making it easy to book authentic poojas and spiritual services 
//                   from the comfort of your home. Experience divine blessings through technology.
//                 </p>
                
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
//                   <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
//                     <div className="text-5xl mb-6">🏛️</div>
//                     <h3 className="text-2xl font-bold text-gray-800 mb-4">Verified Temples</h3>
//                     <p className="text-gray-600 leading-relaxed">All our partner temples are thoroughly verified for authenticity and quality spiritual services</p>
//                   </div>
                  
//                   <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
//                     <div className="text-5xl mb-6">📱</div>
//                     <h3 className="text-2xl font-bold text-gray-800 mb-4">Easy Booking</h3>
//                     <p className="text-gray-600 leading-relaxed">Book your preferred pooja in just a few clicks, anytime, anywhere with instant confirmation</p>
//                   </div>
                  
//                   <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
//                     <div className="text-5xl mb-6">✨</div>
//                     <h3 className="text-2xl font-bold text-gray-800 mb-4">Authentic Experience</h3>
//                     <p className="text-gray-600 leading-relaxed">Experience traditional rituals performed by learned and dedicated pundits with complete devotion</p>
//                   </div>
//                 </div>
                
//                 <div className="mt-16">
//                   <button 
//                     onClick={() => alert('Opening registration page...')}
//                     className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-xl"
//                   >
//                     Join Samarpayami Today 🚀
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-16">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <div className="flex items-center space-x-2 mb-6">
//                 <span className="text-3xl">🕉️</span>
//                 <span className="text-2xl font-bold">Samarpayami</span>
//               </div>
//               <p className="text-gray-400 leading-relaxed">Bridging devotion with modern technology for authentic spiritual experiences</p>
//             </div>
            
//             <div>
//               <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
//               <div className="space-y-3 text-gray-400">
//                 <div className="hover:text-white cursor-pointer">Home</div>
//                 <div className="hover:text-white cursor-pointer">Temples</div>
//                 <div className="hover:text-white cursor-pointer">Services</div>
//                 <div className="hover:text-white cursor-pointer">About Us</div>
//               </div>
//             </div>
            
//             <div>
//               <h4 className="font-bold mb-6 text-lg">Support</h4>
//               <div className="space-y-3 text-gray-400">
//                 <div className="hover:text-white cursor-pointer">Help Center</div>
//                 <div className="hover:text-white cursor-pointer">Contact Us</div>
//                 <div className="hover:text-white cursor-pointer">Privacy Policy</div>
//                 <div className="hover:text-white cursor-pointer">Terms of Service</div>
//               </div>
//             </div>
            
//             <div>
//               <h4 className="font-bold mb-6 text-lg">Connect</h4>
//               <div className="space-y-3 text-gray-400">
//                 <div>📧 support@samarpayami.com</div>
//                 <div>📞 +91-XXXX-XXXXX</div>
//                 <div>🕐 24/7 Support</div>
//                 <div>💬 Live Chat Available</div>
//               </div>
//             </div>
//           </div>
          
//           <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
//             © 2025 Samarpayami. All rights reserved. Built with ❤️ for devotees worldwide.
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface Temple {
  id: string
  name: string
  location: string
  description: string
  image_url: string
  rating: number
}

export default function Home() {
  const { user } = useAuth()
  const [temples, setTemples] = useState<Temple[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTemples = async () => {
      try {
        // Only load data on client side
        if (typeof window === 'undefined') return

        // Use simplified import
        const { supabase } = await import('@/lib/supabase')
        
        // Check if environment variables are available
        const hasConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://temp.supabase.co'

        if (!hasConfig) {
          // Mock data for development
          setTemples([
            {
              id: '1',
              name: 'Sri Venkateswara Temple',
              location: 'Tirupati, Andhra Pradesh',
              description: 'Famous temple dedicated to Lord Venkateswara',
              image_url: '/temple-placeholder.jpg',
              rating: 4.8
            },
            {
              id: '2', 
              name: 'Meenakshi Temple',
              location: 'Madurai, Tamil Nadu',
              description: 'Historic temple dedicated to Goddess Meenakshi',
              image_url: '/temple-placeholder.jpg',
              rating: 4.7
            },
            {
              id: '3',
              name: 'Golden Temple',
              location: 'Amritsar, Punjab',
              description: 'Sacred Sikh temple with golden architecture',
              image_url: '/temple-placeholder.jpg',
              rating: 4.9
            }
          ])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('temples')
          .select('*')
          .limit(6)

        if (error) throw error
        setTemples(data || [])
      } catch (error) {
        console.error('Error loading temples:', error)
        // Use mock data as fallback
        setTemples([
          {
            id: '1',
            name: 'Sri Venkateswara Temple', 
            location: 'Tirupati, Andhra Pradesh',
            description: 'Famous temple dedicated to Lord Venkateswara',
            image_url: '/temple-placeholder.jpg',
            rating: 4.8
          },
          {
            id: '2',
            name: 'Meenakshi Temple',
            location: 'Madurai, Tamil Nadu', 
            description: 'Historic temple dedicated to Goddess Meenakshi',
            image_url: '/temple-placeholder.jpg',
            rating: 4.7
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadTemples()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Temple Marketplace</h1>
          <p className="text-xl mb-8">Book your spiritual services online</p>
          <div className="space-x-4">
            <Link
              href="/temples"
              className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Explore Temples
            </Link>
            {!user && (
              <Link
                href="/auth/signup"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors inline-block"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Featured Temples */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Featured Temples
        </h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {temples.map((temple) => (
              <div key={temple.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl">🏛️</span>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {temple.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{temple.location}</p>
                  <p className="text-gray-600 text-sm mb-4">{temple.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 ml-1">{temple.rating}</span>
                    </div>
                    <Link
                      href={`/temple/${temple.id}`}
                      className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
