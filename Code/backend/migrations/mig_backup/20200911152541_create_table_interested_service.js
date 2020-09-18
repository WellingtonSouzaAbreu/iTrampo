
exports.up = function (knex) {
    return knex.schema.createTable('interested_service', table => {
        table.increments('id').primary()
        table.boolean('situacao').notNull()
        table.integer('servico_id').references('id')
            .inTable('services').notNull()
        table.integer('usuario_id').references('id')
            .inTable('users').notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('interested_service')
};
