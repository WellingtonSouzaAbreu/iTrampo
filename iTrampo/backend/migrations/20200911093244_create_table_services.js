// knex migrate:make create_table_services

exports.up = function (knex) {
    return knex.schema.createTable('services', table => {
        table.increments('id').primary()
        table.string('tituloServico')/* .notNull() */
        table.binary('descricao')/* .notNull() */
        table.string('objetivo')/* .notNull() */
        table.float('valor')/* .notNull() */
        table.integer('prazoDias')/* .notNull() */ // Prazo em dias
        table.boolean('status')/* .notNull() */.defaultTo(true)
        table.integer('qtdVagas')/* .notNull() */
        table.timestamp('dataPostagem')/* .notNull() */

        /* table.integer('usuarioId').references('id')
            .inTable('users').notNull()
        table.integer('enderecoId').references('id')
            .inTable('enderecos').notNull() */
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('services')
};
