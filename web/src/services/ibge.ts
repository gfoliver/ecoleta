import axios from 'axios'

const api = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
})

interface IResponse {
    status: boolean,
    data?: any
}

interface IState {
    sigla: string
}

interface ICity {
    nome: string
}

export const getStates = async (): Promise<IResponse> => {
    try {
        const states = await api.get('/')

        return {
            status: true,
            data: states.data.map((state: IState) => state.sigla)
        }
    }
    catch(error) {
        return {
            status: false
        }
    }
}

export const getCities = async (state: string) : Promise<IResponse> => {
    try {
        const cities = await api.get(`/${state}/municipios`)

        return {
            status: true,
            data: cities.data.map((city: ICity) => city.nome)
        }
    }
    catch(error) {
        return {
            status: false
        }
    }
}