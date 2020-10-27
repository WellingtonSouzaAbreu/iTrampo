import React from 'react'

import './ControlButtons.css'

function ControlButtons(props) {
    return (
        <div className="btn-controls">
            <button className="btn btn-success" onClick={e => props.confirm(props.idService, e)}><i className="fa fa-check"></i></button>
            <button className="btn btn-primary ml-1" onClick={e => props.edit(props.idService, e)}><i className="fa fa-pencil"></i></button>
            <button className="btn btn-danger  ml-1" onClick={e => props.delete(props.idService, e)}><i className="fa fa-trash"></i></button>
        </div>
    )
}

export default ControlButtons