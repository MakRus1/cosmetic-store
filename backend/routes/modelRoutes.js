import express from 'express'
const router = express.Router()

import { 
    createModel,
    updateModel,
    removeModel,
    listModels,
    readModel, 
} from '../controllers/modelController.js'

import { authentificate, authorizeAdmin } from '../middlewares/authMiddleware.js'

router.route('/').post(authentificate, authorizeAdmin, createModel)
router
    .route('/:modelId')
    .put(authentificate, authorizeAdmin, updateModel)
    .delete(authentificate, authorizeAdmin, removeModel)
router.route('/models').get(listModels)
router.route('/:id').get(readModel)

export default router
