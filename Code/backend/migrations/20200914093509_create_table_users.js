
exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('description').notNull()
        table.string('password').notNull()
        table.string('userType').notNull()
        table.string('currentPackage').notNull()
        table.string('genre').notNull()
        table.timestamp('dateOfBirth').notNull()
        table.string('profileImage').notNull()  // Diretório
        table.integer('servicesProvidedRequested').defaultTo(0)
        table.integer('remainingPackageDays').notNull()

        table.integer('specialtiesId')/* .references('id')
        .inTable('specialties') */.notNull()
        table.integer('addressId')/* .references('id')
        .inTable('address') */.notNull()
        table.integer('contactId')/* .references('id')
        .inTable('contact') */.notNull()
        table.integer('curriculumId')/* .references('id')
        .inTable('curriculum') */.notNull()
        table.integer('evaluationId')/* .references('id')
        .inTable('evaluation') */.notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('users')
};