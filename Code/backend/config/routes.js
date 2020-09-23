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
    
    app.route('/users')
        .post(app.api.user.save)









} 