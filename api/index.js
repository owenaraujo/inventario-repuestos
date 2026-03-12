import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import repuestosRoutes from '../src/routes/repuestos.js'
import categoriasRoutes from '../src/routes/categorias.js'
import proveedoresRoutes from '../src/routes/proveedores.js'
import movimientosRoutes from '../src/routes/movimientos.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/repuestos', repuestosRoutes)
app.use('/api/categorias', categoriasRoutes)
app.use('/api/proveedores', proveedoresRoutes)
app.use('/api/movimientos', movimientosRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' })
})

// Ruta comodín para 404
app.use('/', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
  })
}

export default app