import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('user', function (table) {
      table.increments('id');
      table.string('username').unique().notNullable();
      table.text('password').notNullable();
    })
    .createTable('note', function (table) {
      table.increments('id');
      table.integer('user_id').unsigned().notNullable();
      table
        .foreign('user_id')
        .references('id')
        .inTable('user')
        .onDelete('cascade');
      table.text('content').notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('note').dropTable('user');
}
