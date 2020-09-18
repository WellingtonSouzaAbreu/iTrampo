
exports.up = function (knex) {
    return knex.schema.createTable('curriculum', table => {
        table.increments('id').primary()
        table.timestamp('attachmentDate')
        table.string('attachment').notNull() // Diretório do currículo
        table.integer('userId')/* .references('id')
        .inTable('users') */.notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('curriculum')
};