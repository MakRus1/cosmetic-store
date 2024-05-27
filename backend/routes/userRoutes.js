import express from 'express'

import { 
    createUser, 
    loginUser, 
    logoutUser, 
    getAllUsers, 
    getUserProfile,
    updateUser,
    deleteUserById,
    getUserById,
    updateUserById,
} from '../controllers/userController.js'

import { authentificate, authorizeAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router
    .route('/')
    .post(createUser)
    .get(authentificate, authorizeAdmin, getAllUsers)

router.post('/auth', loginUser)
router.post('/logout', logoutUser)

router
    .route('/profile')
    .get(authentificate, getUserProfile)
    .put(authentificate, updateUser)

// ADMIN ROUTES
router
    .route("/:id")
    .delete(authentificate, authorizeAdmin, deleteUserById)
    .get(authentificate, authorizeAdmin, getUserById)
    .put(authentificate, authorizeAdmin, updateUserById)

export default router;