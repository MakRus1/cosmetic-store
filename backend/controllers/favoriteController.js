import { db } from "../config/db/dbconnector.js"
import asyncHandler from "../middlewares/asyncHandler.js"
import jwt from 'jsonwebtoken'

const createFavorite = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const favorite = await db.query(`
            insert into favorites_products (
                user_id,
                product_id
            ) values (
                ${decoded.userId}, 
                ${req.params.carId}
            ) returning *`)

        if (!favorite[0]) {
            return res.json({error: "Невозможно сохранить в избранное"})    
        }

        res.status(201).json(favorite)

    } catch(error) {
        res.status(400)
        throw new Error("Не существует такого продукта")
    }
})

const removeFavorite = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const favorite = await db.query(`delete from favorites_products where product_id = ${req.params.carId} and user_id = ${decoded.userId} returning *`)
        res.json(favorite)
    } catch(error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const fetchFavorites = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const count = await db.query(`select count(*) from favorites_products where user_id = ${decoded.userId}`)

        const favorites = await db.query(`
            select 
                p.* 
            from favorites_products fc 
            left join product p on p.id = fc.product_id 
            where fc.user_id = ${decoded.userId}`)  

        res.json({count: parseInt(count[0].COUNT), favorites: favorites})    
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const fetchIsFavorite = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const favorites = await db.query(`select first 1 product_id from favorites_products where product_id = ${req.params.carId} and user_id = ${decoded.userId}`)

        res.json(favorites[0])    
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

export { 
    createFavorite, 
    removeFavorite,
    fetchFavorites,
    fetchIsFavorite,
}