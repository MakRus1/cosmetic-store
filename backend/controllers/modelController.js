import { db } from "../config/db/dbconnector.js"
import asyncHandler from "../middlewares/asyncHandler.js"
import jwt from 'jsonwebtoken'

const createModel = asyncHandler(async (req, res) => {
    try {
        const {name, markId} = req.body

        if (!name) {
            return res.json({error: "Заполните наименование"})
        }

        const existingModel = await db.query(`select first 1 * from sp_model where upper(name) = upper('${name}')`)

        if (existingModel[0]) {
            return res.json({error: "Модель уже существует"})    
        }
        
        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const newModel = await db.query(`insert into sp_model (sp_mark_id, name, meta$cr_user_id) values (${markId}, '${name}', ${decoded.userId}) returning *`)

        res.status(201).json({ 
            id: newModel[0].ID, 
            markId: newModel[0].SP_MARK_ID,
            name: newModel[0].NAME, 
        })
    } catch(error) {
        res.status(400)
        throw new Error("Неверные данные модели")
    }
})

const updateModel = asyncHandler(async (req, res) => {
    try {
        const {name, markId} = req.body
        const {modelId} = req.params
        
        const model = await db.query(`select first 1 * from sp_model where id = ${modelId}`)

        if (!model[0]) {
            return res.status(404).json({error: "Модель не существует"})    
        }

        const updatedModel = await db.query(`update sp_model set name = '${name}', sp_mark_id = ${markId} where id = ${modelId} returning *`)

        if (!updatedModel[0]) {
            return res.json({error: "Невозможно изменить данные"})    
        }

        res.status(201).json({ 
            id: updatedModel[0].ID, 
            markId: updatedModel[0].SP_MARK_ID,
            name: updatedModel[0].NAME, 
        })
    } catch(error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const removeModel = asyncHandler(async (req, res) => {
    try {
        const {modelId} = req.params

        const model = await db.query(`select first 1 * from sp_model where id = ${modelId}`)

        if (!model[0]) {
            return res.status(404).json({error: "Модель не существует"})    
        }

        const deletedModel = await db.query(`delete from sp_model where id = ${modelId} returning *`)

        res.json(deletedModel[0])
    } catch(error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const listModels = asyncHandler(async (req, res) => {
    const models = await db.query(`select model.*, mark.name as mark_name from sp_model model left join sp_mark mark on mark.id = model.sp_mark_id order by sp_mark_id`)
    res.json(models)
})

const readModel = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params

        const model = await db.query(`select model.*, mark.name as mark_name from sp_model model left join sp_mark mark on mark.id = model.sp_mark_id where model.id = ${id} order by sp_mark_id`)

        if (!model[0]) {
            return res.status(404).json({error: "Модель не существует"})    
        }

        res.json(model[0])
    } catch(error) {
        res.status(400)
        throw new Error(error.message)
    }
})

export { 
    createModel, 
    updateModel,
    removeModel,
    listModels,
    readModel,
}