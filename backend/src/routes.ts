import { Router } from 'express'

const app = Router()

app.get('/', (req, res) => {
    return res.json({
        status: true,
        message: "API"
    })
})

export default app