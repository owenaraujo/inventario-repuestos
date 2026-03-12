import { Router } from 'express'
import {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from '../controllers/categoriasController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

router.get('/', getCategorias)
router.get('/:id', getCategoriaById)
router.post('/', createCategoria)
router.put('/:id', updateCategoria)
router.delete('/:id', deleteCategoria)

export default router