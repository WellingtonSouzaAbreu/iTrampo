module.exports = app => {
    function existsOrError(value, err){
        if(!value) throw err // throw = lançar erro = throw new Error(e)
        if(Array.isArray(value) && value.length === 0) throw err
        if(typeof value === 'string' && !value.trim()) throw err
    }
    
    function notExistsOrError(value, err){
        try{
            existsOrError(value, err) // Se não lanções nenhum erro
        }catch(err){
            return
        }
        throw err
    }
    
    function equalsOrError(valueA, valueB, err){
        if(valueA !== valueB) throw err 
    }

    return {existsOrError, notExistsOrError, equalsOrError}
}