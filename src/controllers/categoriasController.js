import { getSupabaseWithToken } from '../supabase.js'

export const getCategorias = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('activo', true)
      .order('nombre')
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getCategoriaById = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Categoría no encontrada' })
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createCategoria = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { nombre, descripcion } = req.body
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' })

    const { data, error } = await supabase
      .from('categorias')
      .insert([{ nombre, descripcion, activo: true }])
      .select()
      .single()
    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateCategoria = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const updates = { ...req.body }
    delete updates.activo
    delete updates.id

    const { data, error } = await supabase
      .from('categorias')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Categoría no encontrada' })
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteCategoria = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const { error } = await supabase
      .from('categorias')
      .update({ activo: false })
      .eq('id', id)
    if (error) throw error
    res.json({ message: 'Categoría desactivada correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const reactivarCategoria = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const { error } = await supabase
      .from('categorias')
      .update({ activo: true })
      .eq('id', id)
    if (error) throw error
    res.json({ message: 'Categoría reactivada' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}