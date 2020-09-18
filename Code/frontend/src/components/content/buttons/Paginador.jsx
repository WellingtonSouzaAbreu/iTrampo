import React from 'react'

import './Paginator.css'

import BtnGrayWithRadius from './BtnGrayWithRadius.jsx'

function Paginator(props) {
    return (
        <div className="paginador">
            <BtnGrayWithRadius label='<<' />
            <ul className="pagination mb-0">
                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
            </ul>
            <BtnGrayWithRadius label='>>' />
        </div>
    )
}

export default Paginator