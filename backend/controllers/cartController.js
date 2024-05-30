import { db } from "../config/db/dbconnector.js"
import asyncHandler from "../middlewares/asyncHandler.js"
import jwt from 'jsonwebtoken'

const createCartItem = asyncHandler(async (req, res) => {
    try {
        const {count} = req.body

        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const cartItem = await db.query(`
            update or insert into cart (
                user_id,
                product_id,
                quantity
            ) values (
                ${decoded.userId}, 
                ${req.params.carId},
                ${count}
            ) matching (
                user_id,
                product_id
            ) returning *`)

        if (!cartItem[0]) {
            return res.json({error: "Невозможно добавить в корзину"})    
        }

        res.status(201).json(cartItem)

    } catch(error) {
        res.status(400)
        throw new Error("Не существует такого продукта")
    }
})

const removeCartItem = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const cartItem = await db.query(`delete from cart where product_id = ${req.params.carId} and user_id = ${decoded.userId} returning *`)
        res.json(cartItem)
    } catch(error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const fetchCart = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const count = await db.query(`select count(*) from cart where user_id = ${decoded.userId}`)

        const cart = await db.query(`
            select 
                p.*,
                fc.quantity 
            from cart fc 
            left join product p on p.id = fc.product_id 
            where fc.user_id = ${decoded.userId}`)  

        res.json({count: parseInt(count[0].COUNT), cart: cart})    
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const fetchIsInCart = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const cartItem = await db.query(`select first 1 product_id from cart where product_id = ${req.params.carId} and user_id = ${decoded.userId}`)

        res.json(cartItem[0])    
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const clearCart = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        await db.query(`delete from cart where user_id = ${decoded.userId}`)
        res.json({message: "success"})
    } catch(error) {
        res.status(400)
        throw new Error(error.message)
    }
})

export { 
    createCartItem, 
    removeCartItem,
    fetchCart,
    fetchIsInCart,
    clearCart,
}