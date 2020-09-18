
exports.up = function (knex) {
    return knex.schema.createTable('interested_service', table => {
        table.increments('id').primary()
        table.integer('serviceId')/* .references('id')
            .inTable('services') */.notNull()
        table.integer('userId')/* .references('id')
            .inTable('users') */.notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('interested_service')
};
