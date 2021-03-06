const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

        const user = { ...req.body }
        delete user.id

        const userContacts = user.contacts
        delete user.contacts

        const userAddress = user.address
        delete user.address

        const userSpecialitiesId = user.specialities
        delete user.specialities

        if (req.params.id) user.id = req.params.id // Usado para editar

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'Email não informado')
            existsOrError(user.description, 'Descrição não informada')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha não informada')
            existsOrError(user.userType, 'Tipo de usuário não informado')
            existsOrError(user.currentPackage, 'Pacote corrente não definido')
            existsOrError(user.genre, 'Gênero não definido')
            existsOrError(user.dateOfBirth, '')
            existsOrError(user.remainingPackageDays, 'Dias restantes não definidos')
            existsOrError(userAddress.neighborhood, 'Bairro não definido')
            existsOrError(userAddress.cityId, 'Cidade não definida')
            existsOrError(userContacts.numbers[0], 'Contato não definido')
            existsOrError(userSpecialitiesId, 'Especialidades não definidas')

            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()

            if (!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch (err) {
            return res.status(400).send(err)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if (user.id) {
            try {
                await app.db('users')
                    .update(user)
                    .where({ id: user.id })
                    .then(_ => console.log('Usuario atualizado com sucesso'))

                await app.db('address')
                    .update({ neighborhood: userAddress.neighborhood, cityId: userAddress.cityId })
                    .where({ id: userAddress.id })
                    .then(_ => console.log('Endereço atualizado com sucesso'))

                userContacts.numbers.map(async number => {
                    await app.db('contacts').where({ userId: user.id }).del()
                    await app.db('contacts')
                        .insert({ number: number, userId: user.id })
                        .then(_ => console.log('Contatos atualizado com sucesso'))
                })

                userSpecialitiesId.map(async specialityId => {
                    await app.db('user_specialities').where({ userId: user.id }).del()
                    await app.db('user_specialities')
                        .insert({ userId: user.id, specialityId: specialityId })
                        .then(rowCount => {
                            console.log('Especialidades Atualizadas com sucesso')
                            res.status(200).json(user.id)
                        })
                        .catch(err => res.status(500).send('Erro ao cadastrar especialidades'))
                })
            } catch (err) {
                console.log('Erro ao editar usuario')
                res.status(500).send('Erroo ao editar')
            }

        } else {
            try {
                await app.db('address')
                    .returning('id')
                    .insert(userAddress)
                    .then(idAddress => [user.addressId] = idAddress)
                    .then(_ => console.log('Endereço cadastrado com sucesso'))

                await app.db('users')
                    .returning('id')
                    .insert(user)
                    .then(idUser => {
                        [user.id] = idUser
                    })
                    .then(_ => console.log('Usuário cadastrado com sucesso!'))

                userContacts.numbers.map(async number => {
                    await app.db('contacts')
                        .insert({ number: number, userId: user.id })
                        .then(_ => console.log('Contatos cadastrados com sucesso'))
                })

                userSpecialitiesId.map(async specialityId => {
                    await app.db('user_specialities')
                        .insert({ userId: user.id, specialityId: specialityId }) // TODO specialityId
                        .then(rowCount => {
                            console.log('Especialidades cadastradas com sucesso')
                            res.status(200).json(user.id)
                        })
                        .catch(err => res.status(500).send('Erro ao cadastrar especialidades'))
                })

            } catch (err) {
                await app.db('address').where({ id: user.addressId }).del()
                await app.db('users').where({ id: user.id }).del()
                await app.db('contacts').where({ userId: user.id }).del()
                await app.db('user_specialities').where({ userId: user.id }).del()
                console.log('Rollback devido à um erro!')
                res.status(500).send('Erro ao cadastrar usuário! Algum dado não persistiu')
            }
        }

    }

    const getById = async (req, res) => {
        const idUser = req.params.id

        await app.db('users')
            .select('id', 'name', 'password', 'email', 'description', 'userType', 'currentPackage', 'genre', 'dateOfBirth', 'profileImage', 'servicesProvidedRequested', 'remainingPackageDays', 'addressId', 'curriculum')
            .where({ id: idUser })
            .then(async user => {
                [user] = user
                delete user.password
                let userWithAddress = await getAddress(user)
                let userWithContacts = await getContacts(userWithAddress)
                let userWithSpecialities = await getSpecialities(userWithContacts)
                
                res.status(200).send(userWithSpecialities)
            })
            .catch(err => res.status(500).send('Erro ao consultar usuário pelo Id!'))
    }

    const getAddress = async (user) => {
        await app.db('address')
            .select('address.neighborhood', 'address.cityId', 'states.id as idState', 'countries.id as idCountry')
            .where({ 'address.id': user.addressId })
            .innerJoin('cities', 'address.cityId', 'cities.id')
            .innerJoin('states', 'cities.stateId', 'states.id')
            .innerJoin('countries', 'states.countryId', 'countries.id')
            .then(address => {
                [user.address] = address
                user.address.id = user.addressId
            })
        return user
    }

    const getContacts = async (user) => {
        await app.db('contacts')
            .select('number')
            .where({ userId: user.id })
            .then(contacts => {
                user.contacts = {}
                user.contacts.numbers = contacts.map(contact => contact.number)
            })
        return user
    }

    const getSpecialities = async (user) => {
        await app.db('specialities')
            .select('specialities.id', 'specialities.speciality')
            .innerJoin('user_specialities', 'user_specialities.specialityId', 'specialities.id')
            .where({ 'user_specialities.userId': user.id })
            .then(specialities => {
                user.specialities = specialities.map(speciality => speciality.id)
                user.selectedSpecialitiesLabels = specialities.map(speciality => speciality.speciality)
            })
        return user
    }

    const getUserViewById = async (req, res) => {
        idUser = req.params.id || 0

        await app.db('users')
            .select('id', 'name', 'dateOfBirth', 'genre', 'email', 'curriculum', 'profileImage', 'description', 'addressId', 'userType', 'servicesProvidedRequested')
            .where({ 'users.id': idUser })
            .then(async user => {
                let userWithAddressPreview = await getAddressPreview(user)
                let userWithContacts = await getContacts(userWithAddressPreview)
                let userWithSpecialities = await getSpecialitiesPreview(userWithContacts)
                res.send(userWithSpecialities)
            })
    }

    const getAddressPreview = async ([user]) => {
        await app.db('address')
            .select('address.neighborhood', 'cities.name as city', 'states.name as state', 'countries.name as country')
            .where({ 'address.id': user.addressId })
            .innerJoin('cities', 'address.cityId', 'cities.id')
            .innerJoin('states', 'cities.stateId', 'states.id')
            .innerJoin('countries', 'states.countryId', 'countries.id')
            .then(address => {
                [user.address] = address
            })
        return user
    }

    const getSpecialitiesPreview = async (user) => {
        await app.db('specialities')
            .select('specialities.speciality')
            .innerJoin('user_specialities', 'user_specialities.specialityId', 'specialities.id')
            .where({ 'user_specialities.userId': user.id })
            .then(specialities => {
                user.specialities = specialities.map(speciality => speciality.speciality)
            })
        return user
    }

    return { save, getById, getUserViewById }
}