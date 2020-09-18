import React,{Component} from 'react'

const initialState = {
    
}

class SolicitacaoServico extends Component{ 
    constructor(props){
        super(props)
        this.state = {...initialState}
    }
    render(){
        return(
            <div className=''>
                Solicitacao Servico
            </div>
        )
    }
}

export default SolicitacaoServico