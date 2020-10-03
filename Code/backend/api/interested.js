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

    const getAlreadyInterested = async (req, res) => {
        await app.db('interested_service')
            .count('id')
            .where({ userId: req.body.userId })
            .where({ serviceId: req.body.serviceId })
            .then(interested => interested[0].count > 0 ? res.send(true) : res.send(false))
    }

    const get = async (req, res) => {
        const idService = req.params.idService || 0

        await app.db('interested_service')
            .select('users.id', 'users.name', 'users.servicesProvidedRequested')
            .innerJoin('users', 'users.id', 'interested_service.userId')
            .where({ 'interested_service.serviceId': idService })
            .then(async interestedInService => {
                let interestedWithEvaluation = await getEvaluation(interestedInService)
                res.status(200).send(interestedWithEvaluation)
            })
            .catch(err => res.status(500).send('Erro ao obter interessados no serviço!'))
    }

    const getEvaluation = async (interestedInService) => {
        // console.log(interested)
        for (interested of interestedInService) {
            await app.db('evaluation')
                .where({ userId: interested.id })
                .then(evaluations => {
                    let averageEvaluation = evaluations.map((evaluation) => {
                        return (evaluation.quality + evaluation.professionalism + evaluation.deadline + evaluation.comunication) / 4
                    })
                    interested.averageEvaluation = (averageEvaluation.reduce((total, evaluation) => total + evaluation, 0)) / averageEvaluation.length
                })
        }
        return interestedInService
    }

    return { save, getAlreadyInterested, get/* , remove */ }
}

/* const remove = async (req, res) => {
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
    } */