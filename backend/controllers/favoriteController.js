import { db } from "../config/db/dbconnector.js"
import asyncHandler from "../middlewares/asyncHandler.js"
import jwt from 'jsonwebtoken'

const createFavorite = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const favorite = await db.query(`
            insert into favorites_cars (
                user_id,
                car_id
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
        throw new Error("Не существует такого автомобиля")
    }
})

const removeFavorite = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const favorite = await db.query(`delete from favorites_cars where car_id = ${req.params.carId} and user_id = ${decoded.userId} returning *`)
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

        const count = await db.query(`select count(*) from favorites_cars where user_id = ${decoded.userId}`)

        const favorites = await db.query(`
            select 
                mark.name || ' ' || model.name as name,
                c.* 
            from favorites_cars fc 
            left join cars c on c.id = fc.car_id 
            left join sp_model model on model.id = c.sp_model_id
            left join sp_mark mark on mark.id = model.sp_mark_id 
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

        const favorites = await db.query(`select first 1 car_id from favorites_cars where car_id = ${req.params.carId} and user_id = ${decoded.userId}`)

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