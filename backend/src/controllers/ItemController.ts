import { Request, Response } from 'express'
import connection from '../database/connection'

class ItemController {
    async index(req: Request, res: Response) {
        const items = await connection('items').select('*')

        const serializedItems = items.map(item => ({
            ...item,
            image: 'http://192.168.1.3:5000/uploads/' + item.image
        }))

        return res.json({
            status: true,
            items: serializedItems
        })
    }
}

export default ItemController