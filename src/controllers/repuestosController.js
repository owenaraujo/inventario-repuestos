import { getSupabaseWithToken } from '../supabase.js'

export const getRepuestos = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { data, error } = await supabase
      .from('repuestos')
      .select(`
        *,
        categorias (*),
        proveedores (*)
      `)
      .order('nombre')
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRepuestoById = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const { data, error } = await supabase
      .from('repuestos')
      .select(`
        *,
        categorias (*),
        proveedores (*)
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Repuesto no encontrado' })
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createRepuesto = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { nombre, descripcion, categoria_id, proveedor_id, stock, stock_minimo, precio_compra, precio_venta, ubicacion, imagen_url } = req.body
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' })

    const { data, error } = await supabase
      .from('repuestos')
      .insert([{
        nombre,
        descripcion,
        categoria_id,
        proveedor_id,
        stock: stock || 0,
        stock_minimo: stock_minimo || 5,
        precio_compra,
        precio_venta,
        ubicacion,
        imagen_url
      }])
      .select()
      .single()
    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateRepuesto = async (req, res) => {
  try {
    console.log(req.body[1]);
    
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const updates = req.body
    const { data, error } = await supabase
      .from('repuestos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Repuesto no encontrado' })
    res.json(data)
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: error.message })
  }
}

export const deleteRepuesto = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const { error } = await supabase
      .from('repuestos')
      .delete()
      .eq('id', id)
    if (error) throw error
    res.json({ message: 'Repuesto eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRepuestosBajoStock = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { data, error } = await supabase
      .rpc('get_repuestos_bajo_stock')
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}