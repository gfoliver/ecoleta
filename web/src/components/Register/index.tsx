import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import Header from '../Header'
import './style.scss'
import Item from './item'
import api from '../../services/api'
import Map from './map'
import ILocation from '../../utils/ILocation'
import { getStates, getCities } from '../../services/ibge'
import { useHistory } from 'react-router-dom'
import SuccessModal from '../Modals/SuccessModal'
import ErrorModal from '../Modals/ErrorModal'
import InputMask from 'react-input-mask'
import ImageUpload from './image'

interface IItem {
    id: number,
    title: string,
    image: string,
    active: boolean
}

export default function Register() {
    const history = useHistory()

    const [items, setItems] = useState<IItem[]>([])
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const [location, setLocation] = useState<ILocation | null>(null)
    const [states, setStates] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])
    
    const [selectedState, setSelectedState] = useState('')
    const [selectedCity, setSelectedCity] = useState('')

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    
    const [file, setFile] = useState<File | null>(null)
    
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        api.get('/items')
            .then(response => {
                setItems(response.data.items.map((item: IItem) => ({...item, active: false})))
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    useEffect(() => {
        getStates().then(response => {
            if (response.status && response.data)
                setStates(response.data)
        })
    }, [])

    function handleStateChange(e: ChangeEvent<HTMLSelectElement>) {
        setCities([])
        setSelectedState(e.target.value)

        if (e.target.value)
            getCities(e.target.value).then(response => {
                if (response.status && response.data)
                    setCities(response.data)
            })
    }

    function handleLocationChange(loc: ILocation) {
        setLocation(loc)
    }

    function handleItemActiveChange(id: number) {
        const selected = selectedItems.findIndex(item => item === id)
        if (selected > -1) {
            const tmp = selectedItems.filter(item => item !== id)
            setSelectedItems(tmp)
        }
        else {
            setSelectedItems([...selectedItems, id])
        }
    }

    function handleFileUpload(file: File) {
        setFile(file)
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        let data = new FormData()

        data.append('name', name)
        data.append('email', email)
        data.append('whatsapp', whatsapp)
        data.append('items', selectedItems.join(','))
        if (location) {
            data.append('latitude', location.latitude.toString())
            data.append('longitude', location.longitude.toString())
        }
        data.append('state', selectedState)
        data.append('city', selectedCity)
        
        if (file)
            data.append('image', file)

        api.post('/points', data).then(response => {
            if (response.data.status) {
                setShowSuccess(true)
                setTimeout(() => history.push('/'), 2000)
            }
        }).catch(error => {
            setShowError(true)
            setTimeout(() => setShowError(false), 2000)
        })
    }

    return (
        <div className="register">
            <Header showBackButton={true} />
            <div className="container">
                <div className="card">
                    <h1>
                        Cadastro do<br />
                        ponto de coleta
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <ImageUpload onFileUploaded={handleFileUpload} />
                        <fieldset>
                            <legend>
                                <h2>Dados</h2>
                            </legend>
                            <div className="input-wrapper">
                                <label htmlFor="point_name">Nome da entidade</label>
                                <input 
                                    id="point_name" 
                                    type="text" 
                                    required 
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                />
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="point_email">E-mail</label>
                                <input 
                                    id="point_email" 
                                    type="email" 
                                    required 
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="point_whatsapp">Whatsapp</label>
                                <InputMask 
                                    mask="(99) 99999-9999"
                                    maskChar={null}
                                    id="point_whatsapp" 
                                    type="tel" 
                                    required 
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setWhatsapp(e.target.value)}
                                />
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend>
                                <h2>Endereço</h2>
                                <span>Selecione o endereço no mapa</span>
                            </legend>
                            
                            <Map onChangeLocation={handleLocationChange} />

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <label htmlFor="point_state">Estado</label>
                                    <select 
                                        id="point_state" 
                                        onChange={handleStateChange} 
                                        required
                                    >
                                        <option value={''}>Selecione um estado</option>
                                        {states.map((state: string, index) => (
                                            <option key={index} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="point_city">Cidade</label>
                                    <select 
                                        id="point_city" 
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCity(e.target.value)}
                                        required
                                    >
                                        <option value={''}>Selecione uma cidade</option>
                                        {cities.map((city: string, index) => (
                                            <option key={index} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend>
                                <h2>Ítens de coleta</h2>
                                <span>Selecione um ou mais ítens abaixo</span>
                            </legend>
                            {items.length && (
                                <ul className="items">
                                {items.map(item => (
                                    <Item 
                                        id={item.id}
                                        image={item.image} 
                                        title={item.title} 
                                        key={item.id}
                                        active={item.active}
                                        onChangeActive={handleItemActiveChange}
                                    />
                                ))}
                            </ul>
                            )}
                        </fieldset>
                        <div className="submit-wrapper">
                            <button type="submit" className="submit">
                                Cadastrar ponto de coleta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {showSuccess && <SuccessModal />}
            {showError && <ErrorModal />}
        </div>
    )
}