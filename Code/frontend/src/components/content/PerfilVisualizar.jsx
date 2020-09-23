import React,{Component} from 'react'

const initialState = {
    
}

class PerfilVisualizar extends Component{ 
    constructor(props){
        super(props)
        this.state = {...initialState}
        this.teste()
    }

    teste(){
        window.alert(this.props.match.params.id)
    }

    render(){
        return(
            <div className=''>
                Perfil Visualizar 
            </div>
        )
    }
}

export default PerfilVisualizar