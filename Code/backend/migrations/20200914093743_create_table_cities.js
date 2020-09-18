
exports.up = function (knex, promisse) {
    return knex.schema.createTable('cities', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.integer('stateId')/* .references('id')
        .inTable('states') */.notNull()
    })
};

exports.down = function (knex, promisse) {
    return knex.schema.dropTable('cities')
};