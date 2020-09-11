import React from 'react'

import './Paginator.css'

import BtnGrayWithRadius from './BtnGrayWithRadius.jsx'

function Paginator(props) {
    return (
        <div className="paginador">
            <BtnGrayWithRadius label='<<' />
            {/* <ul class="pagination">
                <li class="page-item"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
            </ul> */}
            <BtnGrayWithRadius label='>>' />
        </div>
    )
}

export default Paginator