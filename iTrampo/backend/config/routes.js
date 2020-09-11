module.exports = app => {
    // app.post('/service', app.api.service.save)

    app.route('/services')
        .post(app.api.service.save)
        .get(app.api.service.getServices)

    app.route('/services/:id')
        .get(app.api.service.getById)
        .delete(app.api.service.remove)
} 