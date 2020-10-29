const user = require("./user")

module.exports = app => {
    const save = async (req, res) => {
        const { existsOrError } = app.api.validation

        const service = { ...req.body }
        console.log(req.headers)
        delete service.id
        delete service.user
        delete service.numberOfStakeholders

        const serviceAddress = service.address
        delete service.address

        const serviceSpecialitiesId = service.specialities
        delete service.specialities

        if (req.params.id) service.id = req.params.id // Usado para editar

        try {
            existsOrError(service.serviceTitle, 'Título do serviço não informado')
            existsOrError(service.description, 'Descrição não informada')
            existsOrError(service.value, 'Valor não informado')
            existsOrError(service.termInDays, 'Prazo não informado')
            existsOrError(service.numberOfVacancies, 'Quantidade de vagas não informada')
            existsOrError(serviceAddress.neighborhood, 'Bairro não definido')
            existsOrError(serviceAddress.cityId, 'Cidade não definida')
            existsOrError(serviceSpecialitiesId, 'Especialidades/Competências não definidas')
            existsOrError(service.userId, 'Usuario(empregador) não informado')

        } catch (err) {
            console.log(err)
            return res.status(400).send(err)
        }

        if (service.id) {
            try {
                await app.db('services')
                    .update(service)
                    .where({ id: service.id })
                    .then(_ => console.log('Serviço atualizado com sucesso'))
                    .catch(err => res.status(500).send(err))

                await app.db('address')
                    .update({ neighborhood: serviceAddress.neighborhood, cityId: serviceAddress.cityId })
                    .where({ id: service.addressId })
                    .then(_ => console.log('Endereço atualizado com sucesso'))

                console.log(serviceSpecialitiesId)

                await serviceSpecialitiesId.map(async specialityId => {
                    await app.db('skills').where({ serviceId: service.id }).del()

                    await app.db('skills')
                        .insert({ serviceId: service.id, specialityId: specialityId })
                        .where({ serviceId: service.id })
                        .then(_ => {
                            console.log('Competências Atualizadas com sucesso')
                            res.status(200).json()
                        })
                        .catch(err => res.status(500).send('Erro ao cadstrar especialidades'))
                })

                console.log('foi')
            } catch (err) {
                console.log(err)
                res.status(500).send('Erro ao atualizar')
            }
        } else {
            try {
                service.postDate = new Date()

                await app.db('address')
                    .returning('id')
                    .insert(serviceAddress)
                    .then(idAddress => [service.addressId] = idAddress)
                    .then(_ => console.log('Endereço cadastrado com sucesso'))

                await app.db('services')
                    .returning('id')
                    .insert(service)
                    .then(idService => {
                        [service.id] = idService
                        console.log('Serviço cadastrado com sucesso!')
                    })
                    .catch(err => res.status(500).send('Erro ao cadastrar serviço'))

                await serviceSpecialitiesId.map(async specialityId => {
                    await app.db('skills')
                        .insert({ serviceId: service.id, specialityId: specialityId })
                        .then(rowCount => {
                            console.log('Competências cadastradas com sucesso')
                            res.status(200).json()
                        })
                        .catch(err => res.status(500).send('Erro ao cadstrar especialidades'))
                })

            } catch (err) {
                await app.db('address').where({ id: service.addressId }).del()
                await app.db('services').where({ id: service.id }).del()
                await app.db('skills').where({ serviceId: service.id }).del()

                return res.status(500).send('Erro ao Salvar serviço')
            }
        }
    }

    const limit = 5 // Usado para paginação
    const getSummarized = async (req, res) => { // Feed
        const currentPage = req.query.page || 1
        const value = req.query.value ? req.query.value.split(',') : [0, 99999]
        const speciality = req.query.speciality || ''
        const city = req.query.city || ''

        let count = await app.db('services')
            .innerJoin('skills', 'skills.serviceId', 'services.id')
            .innerJoin('specialities', 'skills.specialityId', 'specialities.id')
            .innerJoin('address', 'services.addressId', 'address.id')
            .innerJoin('cities', 'address.cityId', 'cities.id')
            .whereBetween('services.value', value)
            .where('specialities.speciality', 'like', `%${speciality}%`)
            .where('cities.name', 'like', `%${city}%`)
            .where({'services.status': true}) // Pega somente serviços ativos
            .groupBy('services.id')
            .count('services.id')
            .then(numberOfServices => {
                return (numberOfServices.length)
            })

        console.log('count: ' + count)
        count = parseInt(count)
        count = count ? count : 1

        await app.db('services')
            .select('services.id', 'services.postDate', 'services.serviceTitle', 'services.value', 'services.addressId')
            .limit(limit).offset(currentPage * limit - limit)
            .innerJoin('skills', 'skills.serviceId', 'services.id')
            .innerJoin('specialities', 'skills.specialityId', 'specialities.id')
            .innerJoin('address', 'services.addressId', 'address.id')
            .innerJoin('cities', 'address.cityId', 'cities.id')
            .whereBetween('services.value', value)
            .where('specialities.speciality', 'like', `%${speciality}%`)
            .where('cities.name', 'like', `%${city}%`)
            .where({'services.status': true}) // Pega somente serviços ativos
            .groupBy('services.id')
            .then(async services => {
                let servicesWithSpecialities = await getSpecialities(services)
                let servicesWithAddress = await getAddress(servicesWithSpecialities)
                res.send({ data: servicesWithAddress, count, limit })
            })
    }

    const getSpecialities = async (services) => {
        for (let service of services) {
            await app.db('skills')
                .select('specialities.speciality', 'specialities.id')
                .innerJoin('specialities', 'skills.specialityId', 'specialities.id')
                .where({ 'skills.serviceId': service.id })
                .then(specialities => {
                    service.specialities = specialities.map(speciality => speciality.id)
                    service.selectedSpecialitiesLabels = specialities.map(speciality => speciality.speciality)
                })
        }
        return services
    }

    const getAddress = async (services) => {
        for (let service of services) {
            await app.db('address')
                .select('address.neighborhood', 'cities.name as city', 'states.name as state', 'countries.name as country', 'address.cityId', 'states.id as idState', 'countries.id as idCountry')
                .innerJoin('cities', 'cities.id', 'address.cityId')
                .innerJoin('states', 'states.id', 'cities.stateId')
                .innerJoin('countries', 'countries.id', 'states.countryId')
                .where({ 'address.id': service.addressId })
                .then(addresses => {
                    service.address = addresses[0]
                    service.addressId = service.addressId
                })
        }
        return services
    }


    const getById = (req, res) => {
        app.db('services')
            .where({ id: req.params.id })
            .first()
            .then(async service => {
                let serviceWithSpecialities = await getSpecialities([service]) // Precisa ir como array para ser lido pelo for of
                let serviceWithAddress = await getAddress(serviceWithSpecialities)
                let serviceWithInterested = await getInterested(serviceWithAddress)
                let serviceWithUser = await getUser(serviceWithInterested)

                let [serviceComplete] = serviceWithUser
                serviceComplete.description = serviceComplete.description.toString()

                res.json(serviceComplete)
            })
        // .catch(err => res.status(500).send(err))
    }

    const getInterested = async (service) => {
        await app.db('interested_service')
            .where({ serviceId: service[0].id })
            .count('id')
            .then(interested => service[0].numberOfStakeholders = interested[0].count)
        return service
    }

    const getUser = async (service) => {
        await app.db('users')
            .select('id', 'name')
            .where({ id: service[0].userId })
            .first()
            .then(user => service[0].user = user)
        return service
    }

    const getServicesByInterested = async (req, res) => {
        const currentPage = req.query.page || 1
        let userId = req.query.userId || 0

        let { count } = await app.db('services')
            .count('services.id')
            .innerJoin('interested_service', 'services.id', 'interested_service.serviceId')
            .where({ 'interested_service.userId': userId })
            .first()
        count = parseInt(count)

        await app.db('services')
            .select('services.id', 'services.postDate', 'services.serviceTitle', 'services.value', 'services.addressId')
            .limit(limit).offset(currentPage * limit - limit)
            .innerJoin('skills', 'skills.serviceId', 'services.id')
            .innerJoin('specialities', 'skills.specialityId', 'specialities.id')
            .innerJoin('address', 'services.addressId', 'address.id')
            .innerJoin('cities', 'address.cityId', 'cities.id')
            .innerJoin('interested_service', 'services.id', 'interested_service.serviceId')
            .where({ 'interested_service.userId': userId })
            .groupBy('services.id')
            .then(async services => {
                let servicesWithSpecialities = await getSpecialities(services)
                let servicesWithAddress = await getAddress(servicesWithSpecialities)
                res.send({ data: servicesWithAddress, count, limit })
            })
            .catch(err => res.send(err))
    }

    const getServicesByEmployer = async (req, res) => {
        const currentPage = req.query.page || 1
        const {idUser} = req.params
        console.log('>>>>>>>>>>>>>> '+idUser)

        let count = await app.db('services')
            .innerJoin('skills', 'skills.serviceId', 'services.id')
            .innerJoin('specialities', 'skills.specialityId', 'specialities.id')
            .innerJoin('address', 'services.addressId', 'address.id')
            .innerJoin('cities', 'address.cityId', 'cities.id')
            .where({'services.userId': idUser}) // Pega somente quem publicou o serviço
            .groupBy('services.id')
            .count('services.id')
            .then(numberOfServices => {
                return (numberOfServices.length)
            })

        console.log('count: ' + count)
        count = parseInt(count)
        count = count ? count : 1

        await app.db('services')
            .select('services.id','services.status', 'services.postDate', 'services.serviceTitle', 'services.value', 'services.addressId')
            .limit(limit).offset(currentPage * limit - limit)
            .innerJoin('skills', 'skills.serviceId', 'services.id')
            .innerJoin('specialities', 'skills.specialityId', 'specialities.id')
            .innerJoin('address', 'services.addressId', 'address.id')
            .innerJoin('cities', 'address.cityId', 'cities.id')
            .where({'services.userId': idUser}) // Pega somente quem publicou o serviço
            .groupBy('services.id')
            .then(async services => {
                let servicesWithSpecialities = await getSpecialities(services)
                let servicesWithAddress = await getAddress(servicesWithSpecialities)
                res.send({ data: servicesWithAddress, count, limit })
            })
    }

    const remove = async (req, res) => { // Ao deletar deve-se deletar tudo que está associado
        const { existsOrError } = app.api.validation
        const idService = parseInt(req.params.id || 0)
        try {
            let [addressId] = await app.db('services')
                .where({ id: idService })
                .returning('addressId')
                .del()

            await app.db('address')
                .where({ id: parseInt(addressId) })
                .del()

            await app.db('skills')
                .where({ serviceId: idService })
                .del()

            await app.db('interested_service')
                .where({ serviceId: idService })
                .del()

            try {
                // existsOrError(rowsDeleted, 'Serviço não encontrado.')
            } catch (err) {
                return res.status(400).send(err)
            }

            res.status(204).send()
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }

    const concludeService = async (req, res) => {
        const { idService } = req.params

        /* let readyToEndService = await checkNumberOfEvaluations(idService)
        console.log(readyToEndService) */

        /* if (!readyToEndService) return res.status(400).send('Por favor, avalie todos que trabalharam para você antes de encerrar o serviço') */

        await app.db('services')
            .update({ status: false })
            .where({ id: idService })
            .then(_ => {
                console.log('Serviço finalizado com sucesso!')
                res.status(204).send()
            })
            .catch(err => console.log('Erro ao finalizar serviço'))

    }

    /* const checkNumberOfEvaluations = async (idService) => {
        let [numberOfEvaluations] = await app.db('evaluation')
            .where({ serviceId: idService })
            .count()

        numberOfEvaluations = numberOfEvaluations.count || 0

        let [numberOfVacancies] = await app.db('services')
            .select('numberOfVacancies')
            .where({ id: idService })
        numberOfVacancies = numberOfVacancies.numberOfVacancies || 0

        console.log(numberOfEvaluations, numberOfVacancies)

        if (numberOfEvaluations >= numberOfVacancies) {
            return true
        } else {
            return false
        }
    } */

    return { save, getSummarized, getById, getServicesByInterested, getServicesByEmployer, remove, concludeService }
}
