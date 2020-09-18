
exports.up = function (knex) {
    return knex.schema.createTable('specialities', table => {
        table.increments('id').primary()
        table.string('speciality').notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('specialities')
};