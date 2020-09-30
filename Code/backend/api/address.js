module.exports = app => {

    const getCountries = (req, res) => {
        app.db('countries')
            .then(countries => res.status(200).send(countries))
    }

    const getStates = (req, res) => {
        const { countryId } = req.params
        app.db('states')
            .where({ countryId: countryId })
            .then(states => res.status(200).send(states))
    }

    const getCities = (req, res) => {
        const {stateId} = req.params
        app.db('cities')
            .where({ stateId: stateId })
            .then(cities => res.status(200).send(cities))
    }

    return { getCountries, getStates, getCities }
}