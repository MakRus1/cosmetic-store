import express from 'express'
const router = express.Router()

import { 
    createOrder,
    getAllOrders,
    getUserOrders,
    countTotalOrders,
    calculateTotalSales,
    calculateTotalSalesByDate,
    findOrderById,
    markOrderIsPaid,
    markOrderIsDelivered,
    setShippingAddress,
    calculateTotalSalesByMarkId,
    getCheque
} from '../controllers/orderController.js'

import { authentificate, authorizeAdmin } from '../middlewares/authMiddleware.js'

router
    .route('/')
    .post(authentificate, createOrder)
    .get(authentificate, authorizeAdmin, getAllOrders)

router
    .route('/mine')
    .get(authentificate, getUserOrders)

router
    .route('/total-orders')
    .get(countTotalOrders)

router
    .route('/total-sales')
    .get(calculateTotalSales)

router
    .route('/total-sales/:id')
    .get(calculateTotalSalesByMarkId)

router
    .route('/total-sales-by-date')
    .get(calculateTotalSalesByDate)

router
    .route('/:id')
    .get(authentificate, findOrderById)
    .put(authentificate, setShippingAddress)

router
    .route('/:id/pay')
    .put(authentificate, markOrderIsPaid)

router
    .route('/:id/deliver')
    .put(authentificate, authorizeAdmin, markOrderIsDelivered)

router
    .route('/:id/cheque')
    .get(authentificate, getCheque)

export default router
