// knex migrate:make create_table_services

exports.up = function (knex) {
    return knex.schema.createTable('services', table => {
        table.increments('id').primary()
        table.string('serviceTitle').notNull()
        table.binary('description').notNull()
        table.float('value').notNull()
        table.integer('termInDays').notNull()
        table.boolean('status').defaultTo(true)
        table.integer('numberOfVacancies').notNull()
        table.date('postDate')
        table.integer('userId')/* .references('id')
            .inTable('users') */.notNull()
        table.integer('addressId')/* .references('id')
            .inTable('address') */.notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('services')
};
