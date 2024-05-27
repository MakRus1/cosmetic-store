import express from 'express'
const router = express.Router()

import { 
    createFavorite,
    removeFavorite,
    fetchFavorites,
    fetchIsFavorite
} from '../controllers/favoriteController.js'

import { authentificate, authorizeAdmin } from '../middlewares/authMiddleware.js'

router.route('/').get(authentificate, fetchFavorites)
router
    .route('/:carId')
    .get(authentificate, fetchIsFavorite)
    .post(authentificate, createFavorite)
    .delete(authentificate, removeFavorite)
export default router
