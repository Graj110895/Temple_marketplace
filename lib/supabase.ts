// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

import { createClient } from '@supabase/supabase-js'

// Safe initialization that won't break during build
let supabaseInstance: any = null

// Initialize only when actually used
export const getSupabase = () => {
  if (typeof window === 'undefined') {
    // On server side (build time), return a mock
    return null
  }

  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      supabaseInstance = createClient(supabaseUrl, supabaseKey)
    }
  }

  return supabaseInstance
}

// Export a proxy that checks if we're on client side
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const client = getSupabase()
    if (!client) {
      console.warn('Supabase not available on server side')
      return () => Promise.resolve({ data: null, error: null })
    }
    return client[prop]
  }
})

// Helper function
export const isSupabaseReady = () => {
  return typeof window !== 'undefined' && getSupabase() !== null
}
