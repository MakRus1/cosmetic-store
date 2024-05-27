import express from 'express'
const router = express.Router()

import { 
    createMark,
    updateMark,
    removeMark,
    listMarks,
    readMark, 
} from '../controllers/markController.js'

import { authentificate, authorizeAdmin } from '../middlewares/authMiddleware.js'

router.route('/').post(authentificate, authorizeAdmin, createMark)
router
    .route('/:markId')
    .put(authentificate, authorizeAdmin, updateMark)
    .delete(authentificate, authorizeAdmin, removeMark)
router.route('/marks').get(listMarks)
router.route('/:id').get(readMark)

export default router
