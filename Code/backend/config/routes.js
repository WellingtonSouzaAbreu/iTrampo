module.exports = app => {
    // app.post('/service', app.api.service.save)

    app.route('/services/services-interested-by-user')
        .get(app.api.service.getServicesByUser)

    app.route('/services')
        .get(app.api.service.getSummarized) // Resumido

    app.route('/services/:id')
        .get(app.api.service.getById)

    app.route('/specialities')
        .get(app.api.speciality.get)

    app.route('/interested-service/already-interested')
        .post(app.api.interested.getAlreadyInterested)

    app.route('/interested-service')
        .post(app.api.interested.save)

    app.route('/interested-service/:idService')
        .get(app.api.interested.get)

    app.route('/users/preview/:id')
        .get(app.api.user.getUserViewById)

    app.route('/users')
        .post(app.api.user.save)

    app.route('/users/:id')
        .get(app.api.user.getById)
        .put(app.api.user.save)

    app.route('/profile-image/:idUser')
        .post(app.api.profileImage.save)
    // .get(app.api.profileImage.getById)

    app.route('/address/countries')
        .get(app.api.address.getCountries)

    app.route('/address/states/:countryId')
        .get(app.api.address.getStates)

    app.route('/address/cities/:stateId')
        .get(app.api.address.getCities)

    app.route('/curriculum/:idUser')
        .post(app.api.curriculum.save)


} 