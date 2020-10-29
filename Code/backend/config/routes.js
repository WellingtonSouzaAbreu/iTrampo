module.exports = app => {

    app.post('/signin', app.api.auth.signin)
    app.post('/users', app.api.user.save)
    app.post('/validate-token', app.api.auth.validateToken)

    app.route('/services/services-interested-by-user')
        .all(app.config.passport.authenticate())
        .get(app.api.service.getServicesByInterested)

    app.route('/services/check-evaluation/:idService')
        .all(app.config.passport.authenticate())
        .post(app.api.service.concludeService)

    app.route('/services/employer/:idUser')
        .get(app.api.service.getServicesByEmployer)

    app.route('/services')
        .all(app.config.passport.authenticate())
        .get(app.api.service.getSummarized) // Resumido
        .post(app.api.service.save)

    app.route('/services/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.service.getById)
        .put(app.api.service.save)
        .delete(app.api.service.remove)

    app.route('/specialities')
        .get(app.api.speciality.get)

    app.route('/interested-service/already-interested')
        .all(app.config.passport.authenticate())
        .post(app.api.interested.getAlreadyInterested)

    app.route('/interested-service')
        .all(app.config.passport.authenticate())
        .post(app.api.interested.save)

    app.route('/interested-service/:idService')
        .all(app.config.passport.authenticate())
        .get(app.api.interested.get)

    app.route('/interested-service/:idService/:idUser')
        .all(app.config.passport.authenticate())
        .delete(app.api.interested.removeInterested)

    app.route('/interested-service/del-interest/:idService/:idUser')
        .all(app.config.passport.authenticate())
        .delete(app.api.interested.removeInterestInService) // Id do usuário vai pelo header ou pelo redux

    app.route('/users/preview/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.user.getUserViewById)

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.user.getById)
        .put(app.api.user.save)

    app.route('/profile-image/:idUser')
        .all(app.config.passport.authenticate())
        .post(app.api.profileImage.save)

    app.route('/evaluation/:idUser/:idService')
        .post(app.api.interested.saveEvaluation)

    app.route('/address/countries')
        .get(app.api.address.getCountries)

    app.route('/address/states/:countryId')
        .get(app.api.address.getStates)

    app.route('/address/cities/:stateId')
        .get(app.api.address.getCities)

    app.route('/curriculum/:idUser')
        .all(app.config.passport.authenticate())
        .post(app.api.curriculum.save)

    app.route('/extract-from-token')
        .all(app.config.passport.authenticate())
        .get(app.api.token.extractFromToken)
} 