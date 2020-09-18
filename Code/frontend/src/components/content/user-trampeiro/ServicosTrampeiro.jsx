import React,{Component} from 'react'

const initialState = {
    
}

class ServicosTrampeiro extends Component{ 
    constructor(props){
        super(props)
        this.state = {...initialState}
    }
    render(){
        return(
            <div className=''>
                Servicos Trampeiro
            </div>
        )
    }
}

export default ServicosTrampeiro