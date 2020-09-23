
exports.up = function (knex) {
    return knex.schema.createTable('address', table => {
        table.increments('id').primary()
        table.string('neighborhood').notNull()
        table.integer('cityId').notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('address')
};