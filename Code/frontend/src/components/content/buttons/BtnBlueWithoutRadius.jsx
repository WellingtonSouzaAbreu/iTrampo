import React from 'react'
import './BtnBlueWithoutRadius.css'

export default function btnBlueWithRadius(props) {
    return (
        <button className="btn-blue-without-radius" onClick={e => props.click(e)}>{props.label}</button>
    )
}
