import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import { db } from '../config/db/dbconnector.js'

const authentificate = asyncHandler(async (req, res, next) => {
    let token

    token = req.cookies.jwt

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const userInfo = await db.query(`select first 1 id, username, email, is_admin from sp_users where id = ${decoded.userId}`)
            req.user = userInfo[0]
            next()
        } catch (error) {
            res.status(401)
            throw new Error("Не авторизован. Неверный токен")
        }
    } else {
        res.status(401)
        throw new Error("Не авторизован. Токен отсутствует")   
    }
})

const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.IS_ADMIN) {
        next()
    } else {
        res.status(401).send('Не авторизован. Не является администратором')
    }
}

export { authentificate, authorizeAdmin }