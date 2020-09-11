module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const save = (req, res) => {
        const interested = { ...req.body }

        if (req.params.id) interested.id = req.params.id

        try {
            // existsOrError(interested.situacao, 'Situação não informada')
            existsOrError(interested.servico_id, 'Serviço não informado')
            existsOrError(interested.usuario_id, 'Usuário não identificado')
        } catch (err) {
            res.status(400).send(err)
        }

        console.log(interested)
        if (interested.id) { // Put
            app.db('interested_service')
                .update(interested)
                .where({ id: interested.id })
                .then(_ => res.send(interested))
                .catch(err => res.status(500).send(err))
        } else {
            app.db('interested_service')
                .insert(interested)
                .then(_ => res.send(interested))
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('interested_service')
            .then(interested => res.json(interested))
            .catch(err => res.status(500).send(err))
    }

    const getById = async (req, res) => {
        app.db('interested_service')
            .where({ id: req.params.id })
            .then(interested => res.json(interested))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('interested_service')
                .where({ id: req.params.id }).del()

            try {
                existsOrError(rowsDeleted, 'Interessado no serviço não foi encontrado')
            } catch (err) {
                //
            }

            res.status(204).send()
        } catch (err) {
            res.status(500).send(msg)
        }



    }

    return { save, get, getById, remove }
}