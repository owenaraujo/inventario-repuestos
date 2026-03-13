import { getSupabaseWithToken } from '../supabase.js'

// Obtener todos los proveedores activos
export const getProveedores = async (req, res) => {
  try {
    
    const supabase = getSupabaseWithToken(req.token)
    const { data, error } = await supabase
      .from('proveedores')
      .select('*')
      .eq('activo', true)
      .order('nombre')
    if (error) throw error
    
    res.json(data)
  } catch (error) {
    
    res.status(500).json({ error: error.message })
  }
}

// Obtener un proveedor por ID (sin filtrar activo, para mostrar detalles aunque esté inactivo)
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

// Crear un nuevo proveedor (activo por defecto)
export const createProveedor = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { nombre, telefono, email, direccion } = req.body
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' })

    const { data, error } = await supabase
      .from('proveedores')
      .insert([{ nombre, telefono, email, direccion, activo: true }])
      .select()
      .single()
    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Actualizar un proveedor (no permite modificar 'activo')
export const updateProveedor = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const updates = { ...req.body }
    delete updates.activo  // evitar que se modifique el estado directamente
    delete updates.id

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

// Soft delete: marcar como inactivo
export const deleteProveedor = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const { error } = await supabase
      .from('proveedores')
      .update({ activo: false })
      .eq('id', id)
    if (error) throw error
    res.json({ message: 'Proveedor desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Reactivar proveedor (opcional)
export const reactivarProveedor = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const { error } = await supabase
      .from('proveedores')
      .update({ activo: true })
      .eq('id', id)
    if (error) throw error
    res.json({ message: 'Proveedor reactivado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}