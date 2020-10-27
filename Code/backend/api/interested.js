module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const save = (req, res) => {
        console.log(req.body)

        const interested = { ...req.body }
        if (req.params.id) interested.id = req.params.id

        try {
            existsOrError(interested.serviceId, 'Serviço não informado')
            existsOrError(interested.userId, 'Usuário não identificado')
        } catch (err) {
            res.status(400).send(err)
        }

        app.db('interested_service') // Verifica se já foi manifestado interesse
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

    const saveEvaluation = async (req, res) => {
        const { idUser } = req.params
        const { userId } = req.body // Userid é o usuário que está avaliando
        const { idService } = req.params
        const { evaluation } = req.body

        const alreadyEvaluated = await app.db('evaluation')
            .where({ userId: idUser })
            .where({ serviceId: idService })
            .count()
            .first()
            .then(count => count.count > 0 ? true : false)

        if (alreadyEvaluated) return res.status(400).send('Este usuário já foi avaliado neste serviço!')

        await app.db('evaluation')
            .insert({ quality: evaluation.qualityStars, professionalism: evaluation.professionalismStars, deadline: evaluation.deadlineStars, comunication: evaluation.comunicationStars, userId: idUser, serviceId: idService })
            .then(_ => {
                incrementServicesProvidedRequested(userId) // Empregador
                incrementServicesProvidedRequested(idUser) // Trampeiro
                res.status(204).send()
            })
            .catch(err => res.status(500).send('Erro ao avaliar usuário!'))
    }

    const incrementServicesProvidedRequested = async (idUser) => {
                    await app.db('users')
            .select('servicesProvidedRequested')
            .where({ id: idUser })
            .first()
            .then(async servicesProvidedRequested => {
                await app.db('users')
                    .update({ servicesProvidedRequested: servicesProvidedRequested.servicesProvidedRequested + 1})
                    .where({ id: idUser })
                    .then(_ => console.log('Services Requested incrementados ocm sucesso'))
                    .catch(err => console.log(err))
            })

        /*    await app.db('users')
               .update({ servicesProvidedRequested: servicesProvidedRequested })
               .where({ id: idUser })
               .then(_ => console.log('Services Requested incrementados ocm sucesso'))
               .catch(err => console.log(err)) */
    }

    const removeInterested = async (req, res) => {
        const { idUser } = req.params
        const { idService } = req.params

        await app.db('interested_service')
            .where({ userId: idUser })
            .where({ serviceId: idService })
            .del()
            .then(rowsDeleted => {
                console.log('rowsDeleted: ' + rowsDeleted)
                console.log('Interessado deletado com sucesso!')
                res.status(200).send()
            })
            .catch(err => res.status(500).send('Erro ao deletar interessado!'))
        res.send('Entrei')
    }

    removeInterestInService = async (req, res) => {
        await app.db('interested_service')
            .where({
                serviceId: req.params.idService,
                userId: req.params.idUser
            })
            .del()
            .then(_ => {
                console.log('Interesse removido com sucesso!')
                res.status(200).send()
            })
            .catch(err => res.status.send(err))
    }

    return { save, getAlreadyInterested, get, saveEvaluation, removeInterested, removeInterestInService }
}