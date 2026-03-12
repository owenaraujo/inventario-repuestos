import { supabase } from '../supabase.js'

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'No se proporcionó token de autenticación' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Formato de token inválido' })
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido o expirado' })
    }
    // Guardamos el usuario y el token en la request para usarlos después
    req.user = user
    req.token = token
    next()
  } catch (error) {
    return res.status(500).json({ error: 'Error al verificar autenticación' })
  }
}