// 'use client'

// import { createContext, useContext, useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import type { User } from '@supabase/supabase-js'

// interface AuthContextType {
//   user: User | null
//   signUp: (email: string, password: string, userData: any) => Promise<any>
//   signIn: (email: string, password: string) => Promise<any>
//   signOut: () => Promise<void>
//   loading: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     // Get initial session
//     const getInitialSession = async () => {
//       const { data: { session } } = await supabase.auth.getSession()
//       setUser(session?.user ?? null)
//       setLoading(false)
//     }

//     getInitialSession()

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         setUser(session?.user ?? null)
//         setLoading(false)
//       }
//     )

//     return () => subscription.unsubscribe()
//   }, [])

//   const signUp = async (email: string, password: string, userData: any) => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: userData
//       }
//     })
//     return { data, error }
//   }

//   const signIn = async (email: string, password: string) => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password
//     })
//     return { data, error }
//   }

//   const signOut = async () => {
//     const { error } = await supabase.auth.signOut()
//     if (error) throw error
//   }

//   return (
//     <AuthContext.Provider value={{
//       user,
//       signUp,
//       signIn,
//       signOut,
//       loading
//     }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, metadata?: any) => Promise<any>  // Add optional metadata parameter
  signOut: () => Promise<any>
  isReady: boolean
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)

  // Initialize Supabase only on client side
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (supabaseUrl && supabaseKey) {
          const client = createClient(supabaseUrl, supabaseKey)
          setSupabase(client)
          setIsReady(true)

          // Get initial session
          const { data: { session } } = await client.auth.getSession()
          setUser(session?.user || null)

          // Listen for auth changes
          const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null)
            setLoading(false)
          })

          return () => subscription?.unsubscribe()
        } else {
          console.warn('Supabase environment variables not found')
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to initialize Supabase:', error)
        setLoading(false)
      }
    }

    initSupabase()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase not initialized')
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
  if (!supabase) throw new Error('Supabase not initialized')
  
  const options: any = { email, password }
  
  if (metadata) {
    options.options = {
      data: metadata
    }
  }
  
  return await supabase.auth.signUp(options)
}


  const signOut = async () => {
    if (!supabase) throw new Error('Supabase not initialized')
    return await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      isReady
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

