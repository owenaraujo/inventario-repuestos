import { Router } from 'express'
import {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  reactivarProveedor
} from '../controllers/proveedoresController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

router.get('/', getProveedores)
router.get('/:id', getProveedorById)
router.post('/', createProveedor)
router.put('/:id', updateProveedor)
router.delete('/:id', deleteProveedor)
router.put('/:id/reactivar', reactivarProveedor)

export default router