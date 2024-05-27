// packages
import path from "path";
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

// utils
import { db } from "./config/db/dbconnector.js";
import userRoutes from './routes/userRoutes.js'
import modelRoutes from './routes/modelRoutes.js'
import markRoutes from './routes/markRoutes.js'
import carRoutes from './routes/carRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import favoriteRoutes from './routes/favoriteRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

dotenv.config()
const port = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/users', userRoutes);
app.use('/api/model', modelRoutes);
app.use('/api/mark', markRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname + '/uploads')))

app.listen(port, () => console.log(`Сервер запущен на порту: ${port}`))