
exports.up = function (knex) {
    return knex.schema.createTable('interested_service', table => {
        table.increments('id').primary()
        table.boolean('situacao').notNull()
        table.integer('servico_id').notNull()
        table.integer('usuario_id').notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('interested_service')
};
