
exports.up = function (knex) {
    return knex.schema.createTable('evaluation', table => {
        table.increments('id').primary()
        table.integer('quality').notNull()
        table.integer('professionalism').notNull()
        table.integer('deadline').notNull()
        table.integer('comunication').notNull()
        table.integer('userId').notNull()
        table.integer('serviceId').notNull() // Adicionado no dia 07/10, ainda não migrado
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('evaluation')
};