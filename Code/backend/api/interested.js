module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const save = (req, res) => {
        const interested = { ...req.body }
        if (req.params.id) interested.id = req.params.id

        try {
            existsOrError(interested.serviceId, 'Serviço não informado')
            existsOrError(interested.userId, 'Usuário não identificado')
        } catch (err) {
            res.status(400).send(err)
        }

        app.db('interested_service')
            .where({ serviceId: interested.serviceId })
            .where({ userId: interested.userId })
            .count('id')
            .then(interested => interested[0].count > 0 ? res.status(400).send('Interesse já manifestado') : '')

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

    const get = (req, res) => { // Pega todos interessados
        app.db('interested_service')
            .then(interested => res.json(interested))
            .catch(err => res.status(500).send(err))
    }

    const getAlreadyInterested = async (req, res) => {
        await app.db('interested_service')
            .count('id')
            .where({ userId: req.body.userId })
            .where({ serviceId: req.body.serviceId })
            .then(interested => interested[0].count > 0 ? res.send(true) : res.send(false))
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

    return { save, get, getAlreadyInterested, remove }
}