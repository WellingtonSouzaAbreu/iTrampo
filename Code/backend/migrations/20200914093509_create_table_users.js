
exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('email').notNull()
        table.string('description').notNull()
        table.string('password').notNull()
        table.string('userType').notNull()
        table.string('currentPackage').notNull()
        table.string('genre').notNull()
        table.date('dateOfBirth').notNull()
        table.string('profileImage')
        table.integer('servicesProvidedRequested').defaultTo(0)
        table.integer('remainingPackageDays').notNull()

        table.integer('addressId')
        table.string('curriculum')
        // table.integer('curriculumId') // Old
        
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('users')
};