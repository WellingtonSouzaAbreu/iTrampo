const { authSecret } = require('./../.env')
const jwt = require('jwt-simple')

module.exports = app => {

    const extractFromToken = (req, res) => {
        try {

            let dataType = req.query.dataType
            const token =  req.headers.authorization.split(' ')[1]

            let user = jwt.decode(token, authSecret)
            console.log(user)
            res.status(200).json(user[dataType])
        } catch (err) {
            console.log(err)
        }
    }




    return { extractFromToken }
}