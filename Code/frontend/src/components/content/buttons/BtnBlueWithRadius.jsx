import React from 'react'
import './BtnBlueWithRadius.css'

export default function btnBlueWithRadius(props) {


    return (
        <button className={`btn-blue-with-radius ${props.style}`} onClick={e => props.click(e)}>{props.label}</button>
    )
}
