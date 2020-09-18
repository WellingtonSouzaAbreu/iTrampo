
exports.up = function (knex) {
    return knex.schema.createTable('contacts', table => {
        table.increments('id').primary()
        table.string('email').notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('contacts')
};