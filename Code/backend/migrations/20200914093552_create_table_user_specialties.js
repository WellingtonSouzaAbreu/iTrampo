
exports.up = function (knex) {
    return knex.schema.createTable('user_specialities', table => {
        table.increments('id').primary()
        table.integer('userId').notNull()
        table.integer('specialityId').notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('user_specialities')
};