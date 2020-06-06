import { celebrate, Joi } from 'celebrate'

export default {
    createPoint: celebrate({
        body: Joi.object({
            name: Joi.string().required(), 
            email: Joi.string().required().email(), 
            whatsapp: Joi.string().required(), 
            latitude: Joi.number().required(), 
            longitude: Joi.number().required(),  
            city: Joi.string().required(), 
            state: Joi.string().max(2).required(), 
            items: Joi.string().required(),
        })
    }, {
        abortEarly: false
    }),

    fetchPoints: celebrate({
        query: Joi.object({
            city: Joi.string().required(), 
            state: Joi.string().max(2).required(), 
            items: Joi.string().required()
        })
    }, {
        abortEarly: false
    })
}