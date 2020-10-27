const { authSecret } = require('./../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { authenticate } = require('passport')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    const params = { // utilizado na criação da estratégia
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Função vai no cabeçalho da requisição e pega o authorization Bearer
    }

    const strategy = new Strategy(params, (payload, done) => { // Done ajuda a voltar quando tudo já foi feito
        
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => {
                done(null, user ? { ...payload } : false)
            })
            .catch(err => done(err, false))
    })

    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}