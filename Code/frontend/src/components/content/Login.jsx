import React,{Component} from 'react'

const initialState = {
    
}

class Login extends Component{ 
    constructor(props){
        super(props)
        this.state = {...initialState}
    }
    render(){
        return(
            <div className=''>
                Login
            </div>
        )
    }
}

export default Login