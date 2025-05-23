export function up (knex) {
  return knex.schema.createTable('REFRESH_TOKEN', function (table) {
    table.increments('MaRefreshToken').primary();
    table.integer('MaNguoiDung').notNullable().references('MaNguoiDung').inTable('NGUOIDUNG');
    table.string('RefreshToken').notNullable();
    table.dateTime('HanSuDung').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export function down (knex) {
  return knex.schema.dropTable('REFRESH_TOKEN');
}