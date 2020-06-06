import { Response, Request } from 'express'
import connection from '../database/connection'

class PointController {
    async create(req: Request, res: Response) {
        const { name, email, whatsapp, latitude, longitude, city, state, items } = req.body

        if (! name || ! email || ! whatsapp || ! latitude || ! longitude || ! city || ! state || ! items) {
            return res.status(422).json({
                status: false,
                message: 'Missing fields'
            })
        }

        try {
            const trx = await connection.transaction()

            const [ point_id ] = await trx('points').insert({
                name, 
                email, 
                whatsapp, 
                image: req.file.filename, 
                latitude: Number(latitude), 
                longitude: Number(longitude), 
                city, 
                state
            })
    
            const pointItems = items
                .split(',')
                .map((item: string) => Number(item.trim()))
                .map((item_id: number) => ({ item_id, point_id }))
    
            await trx('point_items').insert(pointItems)
    
            await trx.commit()

            return res.json({
                status: true,
                message: 'Point created successfully',
                point_id
            })
        }
        catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Error creating point',
                error
            })
        }
    }

    async index(req: Request, res: Response) {
        const { city, state, items } = req.query

        const itemsArray = String(items).split(',').map(item => Number(item.trim()))

        try {
            const points = await connection('points')
                .join('point_items', 'points.id', '=', 'point_items.point_id')
                .whereIn('point_items.item_id', itemsArray)
                .where('city', String(city))
                .where('state', String(state))
                .distinct()
                .select('points.*')

            const serializedPoints = points.filter(point => point.image = 'http://192.168.1.3:5000/uploads/' + point.image)

            return res.json({
                status: true,
                points: serializedPoints
            })
        } 
        catch (error) {
            return res.status(500).json({
                status: false,
                error
            })
        }
    }

    async show(req: Request, res: Response) {
        const { id } = req.params

        try {
            const point = await connection('points').where({ id }).first()

            const items = await connection('items')
                .join('point_items', 'items.id', '=', 'point_items.item_id')
                .where('point_items.point_id', id)

            return res.json({
                status: true,
                point: {
                    ...point,
                    items,
                    image: 'http://192.168.1.3:5000/uploads/' + point.image
                }
            })
        }
        catch(error) {
            return res.status(500).json({
                status: false,
                error
            })
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params
        
        try {
            const trx = await connection.transaction()
            
            await trx('points').where({ id }).delete()
            await trx('point_items').where('point_id', id).delete()

            await trx.commit()

            return res.json({
                status: true,
                message: 'Point deleted successfully'
            })
        }
        catch(error) {
            return res.status(500).json({
                status: false,
                message: 'Error deleting point',
                error
            })
        }
    }
}

export default PointController