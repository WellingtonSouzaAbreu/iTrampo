module.exports = app => {
    const save = async (req, res) => {
        const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

        const user = { ...req.body }

        const userContacts = user.contacts
        delete user.contacts

        const userAddress = user.address
        delete user.address

        const userSpecialities = user.specialities
        delete user.specialities

        console.log(user)
        console.log(userAddress)
        console.log(userContacts)
        console.log(userSpecialities)

        if (req.params.id) user.id = req.params.id // Usado para editar

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'Email não informado')
            existsOrError(user.description, 'Descrição não informada')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha não informada')
            existsOrError(user.userType, 'Typo de usuário não informado')
            existsOrError(user.currentPackage, 'Pacote corrente não definido')
            existsOrError(user.genre, 'Gênero não definido')
            existsOrError(user.dateOfBirth, '')
            existsOrError(user.remainingPackageDays, 'Dias restantes não definidos')
            existsOrError(userContacts, 'Telefone não definido')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            /* const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
            if (!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            } */
        } catch (err) {
            res.status(400).send(err)
        }

        // user.password = encryptPassword(user.password) TODO
        delete user.confirmPassword

        try {
            await app.db('address')
                .returning('id')
                .insert(userAddress)
                .then(idAddress => [user.addressId] = idAddress)

            if (user.id) {
                // Editar
            } else {
                await app.db('users')
                    .returning('id')
                    .insert(user)
                    .then(idUser => {
                        [userContacts.userId] = idUser
                    })
            }

            userContacts.numbers.map(async number => {
                await app.db('contacts')
                    .insert({ number: number, userId: userContacts.userId })
                    .then(_ => console.log('Contatos cadastrados com sucesso'))
            })

            let specialitiesId
            await app.db('specialities')
                .select('id')
                .whereIn('speciality', userSpecialities)
                .then(async specialitiesId => {
                    specialitiesId.map(async specialityId => {
                        let {id} = specialityId
                        console.log(id)
                        console.log(userContacts.userId)
                        await app.db('user_specialities')
                            .insert({ userId: userContacts.userId, specialitiesId: id}) // TODO specialityId
                    })
                })



            res.status(204).send()
        } catch (err) {
            await app.db('address').where({ id: user.addressId }).del()
            await app.db('users').where({ id: userContacts.userId }).del()

            res.status(500).send(err)
        }

    }


    return { save }
}