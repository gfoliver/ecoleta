import React from 'react'
import Logo from '../../img/logo.svg'
import './style.scss'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

interface HeaderProps {
    showBackButton?: Boolean
}

const Header: React.FC<HeaderProps> = ({ showBackButton }) => {
    return (
        <div className="container">
            <header>
                <img src={Logo} alt="Ecoleta" className="logo"/>
                {showBackButton && (
                    <Link to="/" className="link">
                        <FiArrowLeft size="20" color="#34CB79" />
                        Voltar para home
                    </Link>
                )}
            </header>
        </div>
    )
}

export default Header