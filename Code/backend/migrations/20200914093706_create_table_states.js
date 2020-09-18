
exports.up = function (knex) {
    return knex.schema.createTable('states', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.integer('countryId')/* .references('id')
        .inTable('country') */.notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('states')
};