module.exports = app => {
    function existsOrError(value, msg){
        if(!value) throw msg // throw = lançar erro = throw new Error(e)
        if(Array.isArray(value) && value.length === 0) throw msg
        if(typeof value === 'string' && !value.trim()) throw msg
    }
    
    function notExistsOrError(value, msg){
        try{
            existsOrError(value, msg) // Se não lanções nenhum erro
        }catch(msg){
            return
        }
        throw msg
    }
    
    function equalsOrError(valueA, valueB, msg){
        if(valueA !== valueB) throw msg 
    }

    return {existsOrError, notExistsOrError, equalsOrError}
}