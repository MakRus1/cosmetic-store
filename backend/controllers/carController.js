import { db } from "../config/db/dbconnector.js"
import asyncHandler from "../middlewares/asyncHandler.js"
import jwt from 'jsonwebtoken'

const createCar = asyncHandler(async (req, res) => {
    try {
        const { name, price, description, manufacturer, image, inStock } = req.fields

        switch (true) {
            case !name:
                return res.json({error: "Название является обязательным полем"})
            case !image:
                return res.json({error: "Картинка является обязательным полем"})
            case !manufacturer:
                return res.json({error: "Производитель является обязательным полем"})
            case !price:
                return res.json({error: "Цена является обязательным полем"})
            case !description:
                return res.json({error: "Описание является обязательным полем"})
            case !inStock:
                return res.json({error: "Количество на складе является обязательным полем"})
        }

        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const car = await db.query(`
            insert into product (
                sp_manufacturer_id,
                name,
                product_image, 
                price, 
                description,
                quantity,
                meta$cr_user_id, 
                meta$upd_user_id
            ) values (
                ${manufacturer}, 
                '${name}',
                '${image}',
                ${price}, 
                '${description}', 
                ${inStock},
                ${decoded.userId}, 
                ${decoded.userId}
            ) returning *`)

        if (!car[0]) {
            return res.json({error: "Невозможно создать продукт"})    
        }

        res.status(201).json(car)

    } catch(error) {
        res.status(400)
        throw new Error("Неверные данные продукта")
    }
})

const updateCar = asyncHandler(async (req, res) => {
    try {
        const { name, price, description, manufacturer, image, inStock } = req.fields

        switch (true) {
            case !name:
                return res.json({error: "Название является обязательным полем"})
            case !image:
                return res.json({error: "Картинка является обязательным полем"})
            case !manufacturer:
                return res.json({error: "Производитель является обязательным полем"})
            case !price:
                return res.json({error: "Цена является обязательным полем"})
            case !description:
                return res.json({error: "Описание является обязательным полем"})
            case !inStock:
                return res.json({error: "Количество на складе является обязательным полем"})
        }

        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const car = await db.query(`
            update product set
                name = '${name}',
                sp_manufacturer_id = ${manufacturer},
                product_image = '${image}', 
                price = ${price}, 
                description = '${description}', 
                quantity = ${inStock}, 
                meta$upd_user_id = ${decoded.userId}
            where id = ${req.params.id}
            returning *`)

        if (!car[0]) {
            return res.json({error: "Невозможно изменить продукт"})    
        }

        res.json(car)

    } catch(error) {
        res.status(400)
        throw new Error("Неверные данные продукта")
    }
})

const removeCar = asyncHandler(async (req, res) => {
    try {
        const car = await db.query(`delete from product where id = ${req.params.id} returning *`)
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

        const count = await db.query(`select count(*) from product`)
        const cars = await db.query(`select first ${pageSize} 
                                        p.* 
                                    from product p 
                                    where p.quantity > 0`)
        
        res.json({cars: cars, page: 1, pages: Math.ceil(parseInt(count[0].COUNT) / pageSize), hasMore: false})
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const fetchCarById = asyncHandler(async (req, res) => {
    try {
        const car = await db.query(`select first 1 
                                        p.* 
                                    from product p 
                                    where p.id = ${req.params.id}`)

        if (!car[0]) {
            res.status(404)
            throw new Error("Продукт не найден")
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
                                        * 
                                    from product
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
                                        * 
                                    from product
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
                                        p.* 
                                    from product p 
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