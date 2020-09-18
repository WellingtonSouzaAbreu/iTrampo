import React from 'react'

import './BtnGrayWithRadius.css'

function BtnGrayWithRadius(props){ 
    return(
        <button className="btn-gray-with-radius" onClick={e => props.click(e)}>{props.label}</button>
    )
}

export default BtnGrayWithRadius