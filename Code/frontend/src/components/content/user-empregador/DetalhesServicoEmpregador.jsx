import React,{Component} from 'react'

const initialState = {
    
}

class DetalhesServicoEmpregador extends Component{ 
    constructor(props){
        super(props)
        this.state = {...initialState}
    }
    render(){
        return(
            <div className=''>
                Detalhes Servico Empregador
            </div>
        )
    }
}

export default DetalhesServicoEmpregador