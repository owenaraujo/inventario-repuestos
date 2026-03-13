import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

// Cliente público (sin token) – solo para operaciones sin autenticación
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente autenticado con token JWT del usuario
export const getSupabaseWithToken = (token) => {
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  })
}