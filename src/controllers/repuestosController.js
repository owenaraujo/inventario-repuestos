import { getSupabaseWithToken } from '../supabase.js'


// Obtener repuestos con paginación y búsqueda
export const getRepuestos = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('repuestos')
      .select(`
        *,
        categorias (*),
        proveedores (*)
      `, { count: 'exact' })
      .eq('activo', true);

    if (search) {
      // Búsqueda en nombre y descripción (puedes agregar más campos si quieres)
      query = query.or(`nombre.ilike.%${search}%,descripcion.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order('nombre')
      .range(from, to);

    if (error) throw error;

    res.setHeader('X-Total-Count', count);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Las demás funciones (getById, create, update, delete, getRepuestosBajoStock) permanecen igual
// ...
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
        stock_minimo:  stock_minimo||0,

        precio_compra,
        precio_venta,
        ubicacion,
        imagen_url,
        activo: true
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
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const updates = { ...req.body }
    delete updates.activo
    delete updates.id
    delete updates.categorias
    delete updates.proveedores

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
    res.status(500).json({ error: error.message })
  }
}

export const deleteRepuesto = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const { error } = await supabase
      .from('repuestos')
      .update({ activo: false })
      .eq('id', id)
    if (error) throw error
    res.json({ message: 'Repuesto desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const reactivarRepuesto = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token)
    const { id } = req.params
    const { error } = await supabase
      .from('repuestos')
      .update({ activo: true })
      .eq('id', id)
    if (error) throw error
    res.json({ message: 'Repuesto reactivado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Función RPC para stock bajo (solo repuestos activos)
export const getRepuestosBajoStock = async (req, res) => {
  try {
    const supabase = getSupabaseWithToken(req.token);
    const { data, error } = await supabase.rpc('get_repuestos_bajo_stock');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error en getRepuestosBajoStock:', error);
    res.status(500).json({ error: error.message });
  }
};


export const countRepuestos = async (req, res) => {
  
  
  try {
    
    
    const supabase = getSupabaseWithToken(req.token);
    const { count, error } = await supabase
      .from('repuestos')
      .select('*', { count: 'exact', head: true })
      .eq('activo', true);
    if (error) throw error;
    
    
    res.json({ count });
  } catch (error) {
  
    
    res.status(500).json({ error: error.message });
  }
};