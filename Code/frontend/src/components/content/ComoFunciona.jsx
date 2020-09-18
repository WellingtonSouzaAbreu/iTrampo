import React,{Component} from 'react'

const initialState = {
    
}

class ComoFunciona extends Component{ 
    constructor(props){
        super(props)
        this.state = {...initialState}
    }
    render(){
        return(
            <div className=''>
                Como Funciona
            </div>
        )
    }
}

export default ComoFunciona