
exports.up = function (knex) {
    return knex.schema.createTable('countries', table => {
        table.increments('id').primary()
        table.string('name').notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('countries')
};