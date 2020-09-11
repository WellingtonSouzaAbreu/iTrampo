module.exports = app => {
    const save = async (req, res) => {
        const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

        const service = { ...req.body }
        console.log(req.params)

        if (req.params.id) service.id = req.params.id // Usado para editar

        try {
            existsOrError(service.titulo_servico, 'Título do serviço não informado')
            existsOrError(service.descricao, 'Descrição não informada')
            existsOrError(service.objetivo, 'Objetivo não informado')
            existsOrError(service.valor, 'Valor não informado')
            existsOrError(service.prazo_dias, 'Prazo não informado')
            // existsOrError(service.status, 'Status não informado') // Default definido pelo knex-migrations
            existsOrError(service.qtd_vagas, 'Quantidade de não informada')
            // existsOrError(service.data_postagem, 'Data de postagem não informada') //  Default definido pelo knex-migrations

            existsOrError(service.usuario_id, 'Usuario(empregador) não informado')
            existsOrError(service.endereco_id, 'Endereço do não informado')

        } catch (err) {
            res.status(400).send(err)
        }

        console.log(service)
        service.data_postagem = new Date()

        console.log(service.id)
        if (service.id) {
            app.db('services')
                .update(service)
                .where({ id: service.id })
                .then(_ => res.status(204).send(service))
                .catch(err => res.status(500).send())
        } else {
            app.db('services')
                .insert(service)
                .then(_ => res.status(204).send(service))
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('services')
            .then(services => res.json(services))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        console.log(req.params.id)
        app.db('services')
            .where({ id: req.params.id })
            .first()
            .then(service => {
                service.descricao = service.descricao.toString()
                res.json(service)
            })
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => { // Ao deletar deve-se deletar tudo que está associado
        try {
            const rowsDeleted = await app.db('services')
                .where({ id: req.params.id }).del()

            try {
                existsOrError(rowsDeleted, 'Serviço não encontrado.')
            } catch (err) {
                //
            }

            res.status(204).send()
        } catch (err) {
            res.status(400).send(err)
        }
    }

    return { save, get, getById, remove }
}



/* {
    "titulo_servico": "Aplicativo para Puteiro",
    "descricao": "S",
    "objetivo": "Fazer um aplicativo para padaria",
    "valor": 400,
    "prazo_dias": 30,
    "status": true,
    "qtd_vagas": 3
} */