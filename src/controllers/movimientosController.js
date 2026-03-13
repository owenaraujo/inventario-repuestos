import { getSupabaseWithToken } from '../supabase.js'

export const getMovimientos = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { data, error } = await supabase
      .from('movimientos')
      .select(`
        *,
        repuestos (*)
      `)
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getMovimientoById = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const { data, error } = await supabase
      .from('movimientos')
      .select(`
        *,
        repuestos (*)
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Movimiento no encontrado' })
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createMovimiento = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { repuesto_id, tipo, cantidad, motivo } = req.body
    const usuario_id = req.user?.id

    if (!repuesto_id || !tipo || !cantidad) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' })
    }
    if (!['entrada', 'salida'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo debe ser "entrada" o "salida"' })
    }
    if (cantidad <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a cero' })
    }

    // Verificar stock si es salida
    if (tipo === 'salida') {
      const { data: repuesto, error: repError } = await supabase
        .from('repuestos')
        .select('stock')
        .eq('id', repuesto_id)
        .single()
      if (repError || !repuesto) {
        return res.status(404).json({ error: 'Repuesto no encontrado' })
      }
      if (repuesto.stock < cantidad) {
        return res.status(400).json({ error: 'Stock insuficiente para esta salida' })
      }
    }

    const { data, error } = await supabase
      .from('movimientos')
      .insert([{
        repuesto_id,
        tipo,
        cantidad,
        motivo,
        usuario_id
      }])
      .select()
      .single()
    if (error) throw error

    // Si no hay trigger en BD, actualizar stock manualmente:
    // (Aquí podrías hacer una segunda llamada a Supabase para actualizar el stock)
    // Pero se asume que el trigger ya existe (de implementaciones anteriores)

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Opcional: eliminar movimiento (rara vez necesario, pero se puede mantener)
export const deleteMovimiento = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const { error } = await supabase
      .from('movimientos')
      .delete()
      .eq('id', id)
    if (error) throw error
    res.json({ message: 'Movimiento eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}