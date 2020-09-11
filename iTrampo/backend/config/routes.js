module.exports = app => {
    // app.post('/service', app.api.service.save)

    app.route('/services')
        .post(app.api.service.save)
        .get(app.api.service.get)

    app.route('/services/:id')
        .put(app.api.service.save)
        .get(app.api.service.getById)
        .delete(app.api.service.remove)

    app.route('/interested-service')
        .post(app.api.interested.save)
        .get(app.api.interested.get)

    app.route('/interested/:id')
        .put(app.api.interested.save)
        .get(app.api.interested.getById)
        .delete(app.api.interested.remove)
} 