
exports.up = function (knex) {
    return knex.schema.createTable('address', table => {
        table.increments('id').primary()
        table.string('neighborhood').notNull()
        table.integer('cityId')/* .references('id')
        .inTable('cities') */.notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('address')
};