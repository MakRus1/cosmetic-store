import express from 'express'
const router = express.Router()

import { 
    createCartItem,
    removeCartItem,
    fetchCart,
    fetchIsInCart,
    clearCart,
} from '../controllers/cartController.js'

import { authentificate, authorizeAdmin } from '../middlewares/authMiddleware.js'

router
    .route('/')
    .get(authentificate, fetchCart)
    .delete(authentificate, clearCart)
router
    .route('/:carId')
    .get(authentificate, fetchIsInCart)
    .post(authentificate, createCartItem)
    .delete(authentificate, removeCartItem)
export default router
