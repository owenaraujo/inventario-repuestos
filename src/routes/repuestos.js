import { Router } from 'express'
import {
  getRepuestos,
  getRepuestoById,
  createRepuesto,
  updateRepuesto,
  deleteRepuesto,
  reactivarRepuesto,
  getRepuestosBajoStock,
  countRepuestos,
} from '../controllers/repuestosController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

router.get('/', getRepuestos)
router.get('/count', countRepuestos);
router.get('/consulta/bajo-stock', getRepuestosBajoStock)
router.get('/consulta/:id', getRepuestoById)
router.post('/', createRepuesto)
router.put('/:id', updateRepuesto)
router.delete('/:id', deleteRepuesto)
router.put('/:id/reactivar', reactivarRepuesto)


export default router