
exports.up = function (knex) {
    return knex.schema.createTable('contacts', table => {
        table.increments('id').primary()
        table.string('number').notNull()
        table.integer('userId').notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('contacts')
};