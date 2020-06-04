import React, { useState } from 'react'

interface ItemProps {
    id: number,
    image: string,
    title: string,
    active?: boolean,
    onChangeActive: Function
}

const Item: React.FC<ItemProps> = ({ id, image, title, active, onChangeActive }) => {
    const [act, setAct] = useState(active)
    
    function toggleActive() {
        onChangeActive(id)
        setAct(!act)
    }
    return (
        <li className={act ? 'item active' : 'item'} onClick={() => toggleActive()}>
            <img src={image} alt={title} className="icon"/>
            <div className="title">{title}</div>
        </li>
    )
}

export default Item