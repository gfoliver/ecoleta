import React from 'react'
import Header from '../Header'
import { Link } from 'react-router-dom'
import { FiLogIn } from 'react-icons/fi'
import './style.scss'

export default function Home() {
    return (
        <div className="Home">
            <Header />
            <div className="hero">
                <div className="container">
                    <div className="content">
                        <h1>
                            Seu marketplace <br />
                            de coleta de resíduos.
                        </h1>
                        <div className="subtitle">
                            Ajudamos pessoas a encontrarem pontos <br />
                            de coleta de forma eficiente.
                        </div>
                        <Link to="/cadastro" className="link">
                            <div className="icon">
                                <FiLogIn size="24" color="#FFF" />
                            </div>
                            <div className="text">
                                Cadastre um ponto de coleta
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}