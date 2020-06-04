import React from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import './style.scss'

export default function SuccessModal() {
    return (
        <div className="overlay success">
            <FiCheckCircle className="icon" color="#34CB79" size={64} />
            <h1>Cadastro concluído</h1>
        </div>
    )
}