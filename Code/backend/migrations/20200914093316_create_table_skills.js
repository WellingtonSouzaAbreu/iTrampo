
exports.up = function (knex) {
    return knex.schema.createTable('skills', table => {
        table.increments('id').primary()
        table.integer('serviceId')/* .references('id')
        .inTable('services') */.notNull()
        table.integer('specialityId')/* .references('id')  
        .inTable('specialities') */.notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('skills')
};
