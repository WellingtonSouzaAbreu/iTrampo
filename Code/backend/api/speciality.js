module.exports = app => {

    const get = (req, res) => {
        app.db('specialities')
            .select('id','speciality')
            .then(specialities => {
                res.send(specialities)
            })
            .catch(err => res.status(500).send(err))
    }

    return { get }
}