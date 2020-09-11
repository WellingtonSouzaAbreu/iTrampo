module.exports = app => {

    const save = async (req, res) => {
        const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

        const service = { ...req.body }

        if (req.params.id) service.id = req.params.id // Usado para editar

        try {
            existsOrError(service.tituloServico, 'Título do serviço não informado')
            existsOrError(service.descricao, 'Descrição não informada')
            existsOrError(service.objetivo, 'Objetivo não informado')
            existsOrError(service.valor, 'Valor não informado')
            existsOrError(service.prazoDias, 'Prazo não informado')
            // existsOrError(service.status, 'Status não informado') // Default definido pelo knex-migrations
            existsOrError(service.qtdVagas, 'Quantidade de não informada')
            // existsOrError(service.dataPostagem, 'Data de postagem não informada') //  Default definido pelo knex-migrations

            // existsOrError(service.usuarioId, 'Usuario(empregador) não informado') TODO
            // existsOrError(service.enderecoId, 'Endereço do não informado')

        } catch (err) {
            res.status(400).send(err)
        }

        console.log(service)
        service.dataPostagem = new Date()

        app.db('services')
            .insert(service)
            .then(_ => res.status(204).send(service))
            .catch(err => res.status(500).send(err))
    }

    const getServices = (req, res) => {
        app.db('services')
            .then(services => res.json(services))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req,res) => {
        console.log(req.params.id)
        app.db('services')
            .where({id: req.params.id})
            .then(service => res.json(service))
            .catch(err => res.status(500).send(err))
    }

    const remove = (req, res) => {  
        app.db('services')
            // .delete() / Ao deletar deve-se deletar tudo que está associado
    }

    return { save , getServices, getById, remove}
}



/* {   
    "tituloServico": "Aplicativo para Puteiro",
    "descricao": "S",
    "objetivo": "Fazer um aplicativo para padaria",
    "valor": 400,
    "prazoDias": 30,
    "status": true,
    "qtdVagas": 3
} */