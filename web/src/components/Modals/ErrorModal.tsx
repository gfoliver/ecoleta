import React from 'react'
import { FiXCircle } from 'react-icons/fi'
import './style.scss'

export default function ErrorModal() {
    return (
        <div className="overlay error">
            <FiXCircle className="icon" color="#FC2003" size={64} />
            <h1>Erro ao realizar o cadastro.</h1>
        </div>
    )
}