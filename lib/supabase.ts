// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

import { createClient } from '@supabase/supabase-js'

// Provide defaults to prevent build errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gbdtypjccpmdagzpkdjy.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZHR5cGpjY3BtZGFnenBrZGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NjMzODAsImV4cCI6MjA3NDUzOTM4MH0.Q6VNiqWvo56wNe-NsuaMiF_Ge5wyNnJQ-kIvv0vpSlItemp-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
