import { db } from "../config/db/dbconnector.js"
import asyncHandler from "../middlewares/asyncHandler.js"
import jwt from 'jsonwebtoken'

const createCar = asyncHandler(async (req, res) => {
    try {
        const { price, topSpeed, engineVolume, model, image, inStock } = req.fields

        switch (true) {
            case !image:
                return res.json({error: "Картинка является обязательным полем"})
            case !model:
                return res.json({error: "Модель является обязательным полем"})
            case !price:
                return res.json({error: "Цена является обязательным полем"})
            case !topSpeed:
                return res.json({error: "Максимальная скорость является обязательным полем"})
            case !engineVolume:
                return res.json({error: "Объем двигателя является обязательным полем"})
            case !inStock:
                return res.json({error: "Количество на складе является обязательным полем"})
        }

        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const car = await db.query(`
            insert into cars (
                sp_model_id,
                car_image, 
                price, 
                top_speed,
                engine_volume,
                in_stock,
                meta$cr_user_id, 
                meta$upd_user_id
            ) values (
                ${model}, 
                '${image}',
                ${price}, 
                ${topSpeed}, 
                ${engineVolume},
                ${inStock},
                ${decoded.userId}, 
                ${decoded.userId}
            ) returning *`)

        if (!car[0]) {
            return res.json({error: "Невозможно создать автомобиль"})    
        }

        res.status(201).json(car)

    } catch(error) {
        res.status(400)
        throw new Error("Неверные данные автомобиля")
    }
})

const updateCar = asyncHandler(async (req, res) => {
    try {
        const { price, topSpeed, engineVolume, model, image, inStock } = req.fields

        switch (true) {
            case !image:
                return res.json({error: "Картинка является обязательным полем"})
            case !model:
                return res.json({error: "Модель является обязательным полем"})
            case !price:
                return res.json({error: "Цена является обязательным полем"})
            case !topSpeed:
                return res.json({error: "Максимальная скорость является обязательным полем"})
            case !engineVolume:
                return res.json({error: "Объем двигателя является обязательным полем"})
            case !inStock:
                return res.json({error: "Количество на складе является обязательным полем"})
        }

        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const car = await db.query(`
            update cars set
                sp_model_id = ${model},
                car_image = '${image}', 
                price = ${price}, 
                top_speed = ${topSpeed}, 
                engine_volume = ${engineVolume},
                in_stock = ${inStock}, 
                meta$upd_user_id = ${decoded.userId}
            where id = ${req.params.id}
            returning *`)

        if (!car[0]) {
            return res.json({error: "Невозможно изменить автомобиль"})    
        }

        res.json(car)

    } catch(error) {
        res.status(400)
        throw new Error("Неверные данные автомобиля")
    }
})

const removeCar = asyncHandler(async (req, res) => {
    try {
        const car = await db.query(`delete from cars where id = ${req.params.id} returning *`)
        res.json(car)
    } catch(error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const fetchCars = asyncHandler(async (req, res) => {
    try {
        const pageSize = 6
        const keyword = req.query.keyword ? {name: {$redex: req.query.keyword, $options: "i"}} : {}

        const count = await db.query(`select count(*) from cars`)
        const cars = await db.query(`select first ${pageSize} 
                                        c.*, 
                                        mark.name || ' ' || model.name as name 
                                    from cars c 
                                    left join sp_model model on model.id = c.sp_model_id 
                                    left join sp_mark mark on mark.id = model.sp_mark_id
                                    where c.in_stock > 0`)
        
        res.json({cars: cars, page: 1, pages: Math.ceil(parseInt(count[0].COUNT) / pageSize), hasMore: false})
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const fetchCarById = asyncHandler(async (req, res) => {
    try {
        const car = await db.query(`select first 1 
                                        c.*, 
                                        mark.name || ' ' || model.name as name 
                                    from cars c 
                                    left join sp_model model on model.id = c.sp_model_id 
                                    left join sp_mark mark on mark.id = model.sp_mark_id 
                                    where c.id = ${req.params.id}`)

        if (!car[0]) {
            res.status(404)
            throw new Error("Автомобиль не найден")
        }

        res.json(car[0])
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const fetchAllCars = asyncHandler(async (req, res) => {
    try {
        const cars = await db.query(`select first 12 
                                        c.*, 
                                        mark.name || ' ' || model.name as name 
                                    from cars c 
                                    left join sp_model model on model.id = c.sp_model_id 
                                    left join sp_mark mark on mark.id = model.sp_mark_id 
                                    order by meta$cr_timestamp desc`)
                                    
        res.json(cars)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const fetchLastCars = asyncHandler(async (req, res) => {
    try {
        const cars = await db.query(`select first 5 
                                        c.*, 
                                        mark.name || ' ' || model.name as name 
                                    from cars c 
                                    left join sp_model model on model.id = c.sp_model_id 
                                    left join sp_mark mark on mark.id = model.sp_mark_id 
                                    order by meta$cr_timestamp desc`)
                                    
        res.json(cars)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const filteredCars = asyncHandler(async (req, res) => {
    try {
        const {checked, radio} = req.body

        let args = {}
        if (checked.length > 0) args.marks = checked
        if (radio.length) args.price = {$gte: radio[0], $lte: radio[1]}

        const cars = await db.query(`select 
                                        c.*, 
                                        mark.name || ' ' || model.name as name 
                                    from cars c 
                                    left join sp_model model on model.id = c.sp_model_id 
                                    left join sp_mark mark on mark.id = model.sp_mark_id
                                    where sp_mark_id in (${args.marks}) 
                                    order by meta$cr_timestamp desc`)
                                    
        res.json(cars)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)    
    }
})

export { 
    createCar, 
    updateCar,
    removeCar,
    fetchCars,
    fetchCarById,
    fetchAllCars,
    fetchLastCars,
    filteredCars
}