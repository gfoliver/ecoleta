import express from 'express'
import path from 'path'
import PointController from './controllers/PointController'
import ItemController from './controllers/ItemController'
import multer from 'multer'
import multerConfig from './config/multer'
import validation from './validation'
import { errors } from 'celebrate'

const app = express.Router()
const point = new PointController()
const item = new ItemController()

const upload = multer(multerConfig)

// Points
app.post(
    '/points', 
    upload.single('image'), 
    validation.createPoint,
    point.create
)

app.get('/points', validation.fetchPoints, point.index)

app.get('/points/:id', point.show)

app.delete('/points/:id', point.delete)

// Items
app.get('/items', item.index)

// Uploads
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

// Celebrate error handling
app.use(errors())

export default app