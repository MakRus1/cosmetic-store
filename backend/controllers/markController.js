import { db } from "../config/db/dbconnector.js"
import asyncHandler from "../middlewares/asyncHandler.js"
import jwt from 'jsonwebtoken'

const createMark = asyncHandler(async (req, res) => {
    try {
        const {name} = req.body

        if (!name) {
            return res.json({error: "Заполните наименование"})
        }

        const existingMark = await db.query(`select first 1 * from sp_manufacturer where upper(name) = upper('${name}')`)

        if (existingMark[0]) {
            return res.json({error: "Производитель уже существует"})    
        }
        
        let token = req.cookies.jwt

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const newMark = await db.query(`insert into sp_manufacturer (name, meta$cr_user_id) values ('${name}', ${decoded.userId}) returning *`)

        res.status(201).json({ 
            id: newMark[0].ID, 
            name: newMark[0].NAME, 
        })
    } catch(error) {
        res.status(400)
        throw new Error("Неверные данные производителя")
    }
})

const updateMark = asyncHandler(async (req, res) => {
    try {
        const {name} = req.body
        const {markId} = req.params
        
        const model = await db.query(`select first 1 * from sp_manufacturer where id = ${markId}`)

        if (!model[0]) {
            return res.status(404).json({error: "Производитель не существует"})    
        }

        const updatedMark = await db.query(`update sp_manufacturer set name = '${name}' where id = ${markId} returning *`)

        if (!updatedMark[0]) {
            return res.json({error: "Невозможно изменить данные"})    
        }

        res.status(201).json({ 
            id: updatedMark[0].ID, 
            name: updatedMark[0].NAME, 
        })
    } catch(error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const removeMark = asyncHandler(async (req, res) => {
    try {
        const {markId} = req.params

        const mark = await db.query(`select first 1 * from sp_manufacturer where id = ${markId}`)

        if (!mark[0]) {
            return res.status(404).json({error: "Производитель не существует"})    
        }

        const deletedMark = await db.query(`delete from sp_manufacturer where id = ${markId} returning *`)

        res.json(deletedMark[0])
    } catch(error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const listMarks = asyncHandler(async (req, res) => {
    const marks = await db.query(`select * from sp_manufacturer`)
    res.json(marks)
})

const readMark = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params

        const mark = await db.query(`select first 1 * from sp_manufacturer where id = ${id}`)

        if (!mark[0]) {
            return res.status(404).json({error: "Производитель не существует"})    
        }

        res.json(mark[0])
    } catch(error) {
        res.status(400)
        throw new Error(error.message)
    }
})

export { 
    createMark, 
    updateMark,
    removeMark,
    listMarks,
    readMark,
}