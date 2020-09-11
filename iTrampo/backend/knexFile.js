const { db } = require('./.env')

module.exports = {
    client: 'postgresql',
    connection: db,
    pool: {
        min: 0,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations' // Tabela de migração
    }
}