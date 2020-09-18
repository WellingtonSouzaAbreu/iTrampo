
exports.up = function (knex) {
    return knex.schema.createTable('phones', table => {
        table.increments('id').primary()
        table.string('number').notNull()
        table.integer('contactId')/* .references('id')
        .inTable('contacts') */.notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('phones')
};