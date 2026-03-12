import { Router } from 'express'
import {
  getMovimientos,
  getMovimientoById,
  createMovimiento,
  deleteMovimiento
} from '../controllers/movimientosController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

router.get('/', getMovimientos)
router.get('/:id', getMovimientoById)
router.post('/', createMovimiento)
router.delete('/:id', deleteMovimiento)

export default router