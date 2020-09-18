import React,{Component} from 'react'

const initialState = {
    
}

class PerfilProprio extends Component{ 
    constructor(props){
        super(props)
        this.state = {...initialState}
    }
    render(){
        return(
            <div className=''>
                Perfil Proprio
            </div>
        )
    }
}

export default PerfilProprio