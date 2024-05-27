import express from 'express'
import formidable from 'express-formidable'
const router = express.Router()

import { 
    createCar,
    updateCar,
    removeCar,
    fetchCars,
    fetchCarById,
    fetchAllCars,
    fetchLastCars,
    filteredCars,
} from '../controllers/carController.js'

import { authentificate, authorizeAdmin } from '../middlewares/authMiddleware.js'

router
    .route('/')
    .get(fetchCars)
    .post(authentificate, authorizeAdmin, formidable(), createCar)
router.route('/allcars').get(fetchAllCars)
router.route('/lastcars').get(fetchLastCars)
router
    .route('/:id')
    .get(fetchCarById)
    .put(authentificate, authorizeAdmin, formidable(), updateCar)
    .delete(authentificate, authorizeAdmin, removeCar)
router.route('/filtered-cars').post(filteredCars)

export default router
