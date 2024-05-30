import { db } from "../config/db/dbconnector.js"
import asyncHandler from "../middlewares/asyncHandler.js"
import jwt from 'jsonwebtoken'
import excel from 'excel4node'

function calcPrices(orderItems) {
    let totalPrice = 0
    orderItems.forEach((item) => totalPrice += item.PRICE * item.QUANTITY)
    return totalPrice
}

const createOrder = asyncHandler(async (req, res) => {
    try {
        const { orderItems, shippingAddress } = req.body

        if (orderItems && orderItems.length === 0) {
            res.status(400)
            throw new Error('Нет элементов в заказе')
        }

        const itemsFromDB = await db.query(`
            select 
                p.* 
            from product p 
            where p.id in (${orderItems.map((x) => x.ID)}) 
            order by meta$cr_timestamp desc`
        )

        const dbOrderItems = orderItems.map((itemFromClient) => {
            const matchingItemFromDB = itemsFromDB.find((itemFromDB) => itemFromDB.ID.toString() === itemFromClient.ID.toString())

            if (!matchingItemFromDB) {
                res.status(404)
                throw new Error(`Продукт не найден: ${itemFromClient.ID}`)
            }

            return {
                ...itemFromClient,
                CAR: itemFromClient.ID,
                PRICE: matchingItemFromDB.PRICE,
                ID: undefined,
            }
        })

        const totalPrice = calcPrices(dbOrderItems)

        let token = req.cookies.jwt 

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const order = await db.query(`
            insert into orders (
                user_id, 
                shipping_address, 
                total_price
            ) values ( 
                ${decoded.userId},
                '${shippingAddress}', 
                ${totalPrice}
            ) returning *`)

        if (!order[0]) {
            return res.json({error: "Невозможно создать заказ"})    
        }

        console.log(order[0])

        orderItems.map(async (itemFromClient) => {
            const mx = await db.query(`
                insert into mx_order_product (
                    order_id,
                    product_id,
                    quantity
                ) values (
                    ${order[0].ID},
                    ${itemFromClient.ID},
                    ${itemFromClient.QUANTITY}
                ) returning *`)

            if (!mx[0]) {
                return res.json({error: "Невозможно создать связь"})    
            }
        })

        res.status(201).json(order[0])

    } catch(error) {
        res.status(500).json({error: error.message})
    }
})

const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await db.query(`
            select 
                o.*,
                u.username
            from orders o
            left join sp_users u on u.id = o.user_id 
            order by o.meta$cr_timestamp desc`
        )

        res.status(201).json(orders)

    } catch(error) {
        res.status(500).json({error: error.message})
    }
})

const getUserOrders = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt 

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const orders = await db.query(`
            select 
                o.*
            from orders o
            where o.user_id = ${decoded.userId}
            order by o.meta$cr_timestamp desc`
        )

        
        res.status(201).json(orders)

    } catch(error) {
        res.status(500).json({error: error.message})
    }
})

const countTotalOrders = asyncHandler(async (req, res) => {
    try {
        const count = await db.query(`
            select 
                count(*)
            from orders`
        )

        res.status(201).json({count: parseInt(count[0].COUNT)})

    } catch(error) {
        res.status(500).json({error: error.message})
    }
})

const calculateTotalSales = asyncHandler(async (req, res) => {
    try {
        const total = await db.query(`
            select 
                cast(sum(total_price) as numeric(15,2)) as total
            from orders`
        )

        res.status(201).json({total: total[0].TOTAL})

    } catch(error) {
        res.status(500).json({error: error.message})
    }
})

const calculateTotalSalesByDate = asyncHandler(async (req, res) => {
    try {
        const sales = await db.query(`
            select
                cast(time_paid as date) as time_paid,
                cast(sum(total_price) as numeric(15,2)) as total
            from orders 
            where is_paid = 1
            group by cast(time_paid as date)`
        )

        res.status(201).json(sales)

    } catch(error) {
        res.status(500).json({error: error.message})
    }
})

const findOrderById = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt 

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const order = await db.query(`
            select first 1 
                o.*,
                u.username,
                u.email
            from orders o
            left join sp_users u on u.id = o.user_id  
            where o.user_id = ${decoded.userId} and o.id = ${req.params.id} 
            order by o.meta$cr_timestamp desc`
        )

        if (order[0]) {
            const items = await db.query(`
                select
                    p.*,
                    op.quantity 
                from mx_order_product op
                left join product p on p.id = op.product_id 
                where op.order_id = ${req.params.id}`
            )
            res.status(201).json({order: order[0], items: items})
        } else {
            res.status(404) 
            throw new Error("Заказ не найден")   
        }

    } catch(error) {
        res.status(500).json({error: error.message})
    }
})

const markOrderIsPaid = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt 

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const order = await db.query(`
            update orders 
                set is_paid = 1  
            where user_id = ${decoded.userId} and id = ${req.params.id} 
            returning *`
        )

        if (order[0]) {
            res.status(201).json(order[0])
        } else {
            res.status(404) 
            throw new Error("Заказ не найден")   
        }

    } catch(error) {
        res.status(500).json({error: error.message})
    }
})

const markOrderIsDelivered = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt 

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const order = await db.query(`
            update orders 
                set is_delivered = 1  
            where user_id = ${decoded.userId} and id = ${req.params.id} 
            returning *`
        )

        if (order[0]) {
            res.status(201).json(order[0])
        } else {
            res.status(404) 
            throw new Error("Заказ не найден")   
        }

    } catch(error) {
        res.status(500).json({error: error.message})
    }
})

const setShippingAddress = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt 

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const order = await db.query(`
            update orders 
                set shipping_address = ${req.body.address}  
            where user_id = ${decoded.userId} and id = ${req.params.id} 
            returning *`
        )

        if (order[0]) {
            res.status(201).json(order[0])
        } else {
            res.status(404) 
            throw new Error("Заказ не найден")   
        }

    } catch(error) {
        res.status(500).json({error: error.message})
    }
})

const calculateTotalSalesByMarkId = asyncHandler(async (req, res) => {
    try {
        const sales = await db.query(`
            select
                *
            from manufacturer_sales
            where sp_maunfacturer_id is null or sp_maunfacturer_id = ${req.params.id}`
        )

        res.status(201).json(sales)

    } catch(error) {
        res.status(500).json({error: error.message})
    }
})

const getCheque = asyncHandler(async (req, res) => {
    try {
        let token = req.cookies.jwt 

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const order = await db.query(`
            select first 1 
                o.*,
                u.username,
                u.email
            from orders o
            left join sp_users u on u.id = o.user_id  
            where o.user_id = ${decoded.userId} and o.id = ${req.params.id} 
            order by o.meta$cr_timestamp desc`
        )

        if (order[0]) {
            var workbook = new excel.Workbook({
                dateFormat: 'dd.mm.yyy hh:mm:ss'
            })

            var worksheet = workbook.addWorksheet('Sheet 1')

            var style = workbook.createStyle({
                font: {
                    color: '#FF0800',
                    size: 12
                },
                numberFormat: '$#,##0.00; ($#,##0.00); -'
            });

            worksheet.column(1).setWidth(50)
            worksheet.cell(1, 1).string('Чек по заказу №' + order[0].ID)
            worksheet.column(2).setWidth(30)
            worksheet.cell(1, 2).string('Заказчик ' + order[0].USERNAME)

            const items = await db.query(`
                select
                    p.*,
                    op.quantity  
                from mx_order_product op
                left join product p on p.id = op.product_id 
                where op.order_id = ${req.params.id}`
            )

            worksheet.cell(3, 1).string('Наименование')
            worksheet.cell(3, 2).string('Количество')
            worksheet.cell(3, 3).string('Стоимость')
            worksheet.cell(3, 4).string('Итого')

            let headerIndex = 4
            let i = 0

            for (; i < items.length; i++) {
                worksheet.cell(headerIndex + i, 1).string(items[i].NAME)  
                worksheet.cell(headerIndex + i, 2).number(items[i].QUANTITY) 
                worksheet.cell(headerIndex + i, 3).number(items[i].PRICE)
                worksheet.cell(headerIndex + i, 4).number(items[i].QUANTITY * items[i].PRICE)     
            }

            worksheet.cell(headerIndex + i, 1).string('Итого') 
            worksheet.cell(headerIndex + i, 4).number(order[0].TOTAL_PRICE)

            worksheet.cell(headerIndex + i + 1, 1).string(order[0].IS_PAID ? 'Заказ оплачен' : 'Заказ не оплачен')
            worksheet.cell(headerIndex + i + 1, 2).date(order[0].IS_PAID ? order[0].TIME_PAID : '')

            workbook.write(`cheque${order[0].ID}.xlsx`, res)
        } else {
            res.status(404) 
            throw new Error("Заказ не найден")   
        }

    } catch(error) {
        res.status(500).json({error: error.message})
    }
})

export { 
    createOrder,
    getAllOrders,
    getUserOrders, 
    countTotalOrders,
    calculateTotalSales,
    calculateTotalSalesByDate,
    findOrderById,
    markOrderIsPaid,
    markOrderIsDelivered,
    setShippingAddress,
    calculateTotalSalesByMarkId,
    getCheque
}