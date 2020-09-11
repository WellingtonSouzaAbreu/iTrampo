import React from 'react'

import './ControlButtons.css'

function ControlButtons(props) {
    return (
        <div className="btn-controls">
            <button className="btn btn-success"><i className="fa fa-check"></i></button>
            <button className="btn btn-warning ml-1"><i className="fa fa-pencil"></i></button>
            <button className="btn btn-danger  ml-1"><i className="fa fa-trash"></i></button>
        </div>
    )
}

export default ControlButtons