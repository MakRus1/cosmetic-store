import { db } from "../config/db/dbconnector.js"
import asyncHandler from "../middlewares/asyncHandler.js"
import bcrypt from 'bcryptjs'
import createToken from '../utils/createToken.js'

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    
    if (!username || !email || !password) {
        throw new Error("Пожалуйста, заполните все поля")
    }

    const userExist = await db.query(`select first 1 * from sp_users where email = '${email}'`)
    if (userExist[0] != null) return res.json({error: "Такой пользователь уже существует"})

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await db.query(`insert into sp_users (username, email, pass) values ('${username}', '${email}', '${hashedPassword}') returning *`)
        createToken(res, newUser[0].ID)

        res.status(201).json({ 
            id: newUser[0].ID, 
            username: newUser[0].USERNAME, 
            email: newUser[0].EMAIL, 
            isAdmin: newUser[0].IS_ADMIN 
        })
    } catch(error) {
        res.status(400)
        throw new Error("Неверные данные пользователя")
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        throw new Error("Пожалуйста, заполните все поля")
    }

    const userExist = await db.query(`select first 1 * from sp_users where email = '${email}'`)
    if (userExist[0] == null) return res.json({error: "Неверный логин или пароль"})

    const isPasswordValid = await bcrypt.compare(password, userExist[0].PASS)

    if (!isPasswordValid) return res.json({error: "Неверный логин или пароль"})
    
    createToken(res, userExist[0].ID)

    return res.status(200).json({ 
        id: userExist[0].ID, 
        username: userExist[0].USERNAME, 
        email: userExist[0].EMAIL, 
        isAdmin: userExist[0].IS_ADMIN 
    })
})

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) })

    res.status(200).json({ message: "Выход прошел успешно" })
})

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await db.query(`select * from sp_users`)
    res.json(users)
})

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await db.query(`select first 1 * from sp_users where id = ${req.user.ID}`)

    if (user[0]) {
        res.json({
            id: user[0].ID,
            username: user[0].USERNAME,
            email: user[0].EMAIL
        })
    } else {
        res.status(404)
        throw new Error("Пользователь не найден")
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const user = await db.query(`select first 1 * from sp_users where id = ${req.user.ID}`)

    if (user[0]) {
        let hashedPassword = null
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(req.body.password, salt)    
        }

        const updatedUser = await db.query(`update sp_users set username = '${req.body.username || user[0].USERNAME}', email = '${req.body.email || user[0].EMAIL}', pass = '${hashedPassword || user[0].PASS}' where id = ${req.user.ID} returning *`)  

        if (!updatedUser[0]) {
            return res.json({error: "Невозможно изменить данные"})    
        }

        res.json({
            id: updatedUser[0].ID,
            username: updatedUser[0].USERNAME,
            email: updatedUser[0].EMAIL,
            isAdmin: updatedUser[0].IS_ADMIN
        })
    } else {
        res.status(404)
        throw new Error("Пользователь не найден")
    }
})

const deleteUserById = asyncHandler(async (req, res) => {
    const user = await db.query(`select first 1 * from sp_users where id = ${req.params.id}`)

    if (user[0]) {
        if (user[0].IS_ADMIN) {
            res.status(400)
            throw new Error('Невозможно удалить профиль администратора')
        }

        await db.query(`delete from sp_users where id = ${req.params.id}`)  

        res.json({
            message: 'Пользователь успешно удален'
        })
    } else {
        res.status(404)
        throw new Error("Пользователь не найден")
    }
})

const getUserById = asyncHandler(async (req, res) => {
    const user = await db.query(`select first 1 id, username, email, is_admin from sp_users where id = ${req.params.id}`)

    if (user[0]) {
        res.json(user[0])
    } else {
        res.status(404)
        throw new Error("Пользователь не найден")
    }
})

const updateUserById = asyncHandler(async (req, res) => {
    const user = await db.query(`select first 1 * from sp_users where id = ${req.params.id}`)

    if (user[0]) {
        if (!req.body.isAdmin) {
            req.body.isAdmin = 0
        } else {
            req.body.isAdmin = req.body.isAdmin ? 1 : 0    
        }

        let hashedPassword = null
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(req.body.password, salt)    
        }

        const updatedUser = await db.query(`update sp_users set username = '${req.body.username || user[0].USERNAME}', email = '${req.body.email || user[0].EMAIL}', pass = '${hashedPassword || user[0].PASS}', is_admin = '${req.body.isAdmin}' where id = ${req.params.id} returning *`)  
        
        if (!updatedUser[0]) {
            return res.json({error: "Невозможно изменить данные"})     
        }

        res.json({
            id: updatedUser[0].ID,
            username: updatedUser[0].USERNAME,
            email: updatedUser[0].EMAIL,
            isAdmin: updatedUser[0].IS_ADMIN
        })
    } else {
        res.status(404)
        throw new Error("Пользователь не найден")
    }
})

export { 
    createUser, 
    loginUser, 
    logoutUser, 
    getAllUsers, 
    getUserProfile, 
    updateUser, 
    deleteUserById, 
    getUserById, 
    updateUserById,
}