module.exports = app => {
    const save = async (req, res) => {
        const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

        const service = { ...req.body }
        console.log(req.params)

        if (req.params.id) service.id = req.params.id // Usado para editar

        try {
            existsOrError(service.serviceTitle, 'Título do serviço não informado')
            existsOrError(service.description, 'Descrição não informada')
            existsOrError(service.objective, 'Objetivo não informado')
            existsOrError(service.value, 'Valor não informado')
            existsOrError(service.termInDays, 'Prazo não informado')
            // existsOrError(service.status, 'Status não informado') // Default definido pelo knex-migrations
            existsOrError(service.numberOfVacancies, 'Quantidade de não informada')
            // existsOrError(service.data_postagem, 'Data de postagem não informada') //  Default definido pelo knex-migrations

            existsOrError(service.userId, 'Usuario(empregador) não informado')
            existsOrError(service.addressId, 'Endereço do não informado')

        } catch (err) {
            res.status(400).send(err)
        }

        service.post_date = new Date()

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

    const limit = 2 // Usado para paginação
    const getSummarized = async (req, res) => {
        const currentPage = req.query.page || 1
        const value = req.query.value ? req.query.value.split(',') : [0, 99999]
        const speciality = req.query.speciality || ''
        const city = req.query.city || ''
        /* console.log('value: ' + value)
        console.log('speciality: ' + speciality)
        console.log('city: ' + city) */

        /* let { count } = await app.db('services')
            .count('id')
            .first() //Consulta para saber quantas páginas deverão ser geradas */

        let count = await app.db('services')
            .innerJoin('skills', 'skills.serviceId', 'services.id')
            .innerJoin('specialities', 'skills.specialityId', 'specialities.id')
            .innerJoin('address', 'services.addressId', 'address.idAddress')
            .innerJoin('cities', 'address.cityId', 'cities.id')
            .whereBetween('services.value', value)
            .where('specialities.speciality', 'like', `%${speciality}%`)
            .where('cities.name', 'like', `%${city}%`)
            .groupBy('services.id')
            .count('services.id')
            .then(numberOfServices => {
                // console.log('numberOfServices: ' + numberOfServices.length)
                return (numberOfServices.length)
            })

        console.log(count)
        count = parseInt(count)
        count = count ? count : 1

        await app.db('services')
            .select('services.id', 'services.postDate', 'services.serviceTitle', 'services.value', 'services.addressId')
            .limit(limit).offset(currentPage * limit - limit)
            .innerJoin('skills', 'skills.serviceId', 'services.id')
            .innerJoin('specialities', 'skills.specialityId', 'specialities.id')
            .innerJoin('address', 'services.addressId', 'address.idAddress')
            .innerJoin('cities', 'address.cityId', 'cities.id')
            .whereBetween('services.value', value)
            .where('specialities.speciality', 'like', `%${speciality}%`)
            .where('cities.name', 'like', `%${city}%`)
            .groupBy('services.id')
            .then(async services => {
                // console.log(services)
                let servicesWithSpecialities = await getSpecialities(services)
                let servicesWithAddress = await getAddress(servicesWithSpecialities)
                res.send({ data: servicesWithAddress, count, limit })
            })
    }

    const getSpecialities = async (services) => {
        for (let service of services) {
            await app.db('skills')
                .select('specialities.speciality')
                .innerJoin('specialities', 'skills.specialityId', 'specialities.id')
                .where({ 'skills.serviceId': service.id })
                .then(specialities => {
                    service.specialities = specialities.map(speciality => speciality.speciality)
                })
        }
        return services
    }

    const getAddress = async (services) => {
        for (let service of services) {
            await app.db('address')
                .select('cities.name as city', 'states.name as state', 'country.name as country')
                .innerJoin('cities', 'cities.id', 'address.cityId')
                .innerJoin('states', 'states.id', 'cities.stateId')
                .innerJoin('country', 'country.id', 'states.countryId')
                .where({ idAddress: service.addressId })
                .then(adresses => {
                    service.address = adresses[0]
                    delete service.addressId
                })
        }
        return services
    }


    const getById = (req, res) => {
        console.log('id: ' + req.params.id)
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

    const getServicesByUser = async (req, res) => {
        console.log('userId: ' + req.query.userId)
        console.log('page: ' + req.query.page)

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
            .innerJoin('address', 'services.addressId', 'address.idAddress')
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

    const getServicesByService = (req, res) => {

    }

    /* const remove = async (req, res) => { // Ao deletar deve-se deletar tudo que está associado
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
    } */

    return { save, getSummarized, getById, getServicesByUser }
}
