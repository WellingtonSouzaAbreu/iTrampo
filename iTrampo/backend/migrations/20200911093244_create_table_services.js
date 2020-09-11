// knex migrate:make create_table_services

exports.up = function (knex) {
    return knex.schema.createTable('services', table => {
        table.increments('id').primary()
        table.string('titulo_servico').notNull()
        table.binary('descricao').notNull()
        table.string('objetivo').notNull()
        table.float('valor').notNull()
        table.integer('prazo_dias').notNull()
        table.boolean('status').defaultTo(true)
        table.integer('qtd_vagas').notNull()
        table.timestamp('data_postagem')
        table.integer('usuario_id').notNull()
        table.integer('endereco_id').notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('services')
};
