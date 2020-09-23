
exports.up = function (knex) {
    return knex.schema.createTable('user_specialities', table => {
        table.increments('id').primary()
        table.integer('userId')/* .references('id')
        .inTable('users') */.notNull()
        table.integer('specialityId')/* .references('id')
        .inTable('specialities') */.notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('user_specialities')
};