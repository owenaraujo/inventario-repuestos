import { getSupabaseWithToken } from '../supabase.js'

export const getProveedores = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { data, error } = await supabase
      .from('proveedores')
      .select('*')
      .order('nombre')
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getProveedorById = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const { data, error } = await supabase
      .from('proveedores')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Proveedor no encontrado' })
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createProveedor = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { nombre, telefono, email, direccion } = req.body
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' })

    const { data, error } = await supabase
      .from('proveedores')
      .insert([{ nombre, telefono, email, direccion }])
      .select()
      .single()
    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateProveedor = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const updates = req.body
    const { data, error } = await supabase
      .from('proveedores')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Proveedor no encontrado' })
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteProveedor = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const { error } = await supabase
      .from('proveedores')
      .delete()
      .eq('id', id)
    if (error) throw error
    res.json({ message: 'Proveedor eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}