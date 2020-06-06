import express from 'express'
import path from 'path'
import PointController from './controllers/PointController'
import ItemController from './controllers/ItemController'
import multer from 'multer'
import multerConfig from './config/multer'

const app = express.Router()
const point = new PointController()
const item = new ItemController()

const upload = multer(multerConfig)

// Points
app.post('/points', upload.single('image'), point.create)

app.get('/points', point.index)

app.get('/points/:id', point.show)

app.delete('/points/:id', point.delete)

// Items
app.get('/items', item.index)

// Uploads
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

export default app