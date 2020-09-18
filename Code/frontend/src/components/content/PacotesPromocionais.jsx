import React,{Component} from 'react'

const initialState = {
    
}

class PacotesPromocionais extends Component{ 
    constructor(props){
        super(props)
        this.state = {...initialState}
    }
    render(){
        return(
            <div className=''>
                Pacotes Promocionais
            </div>
        )
    }
}

export default PacotesPromocionais