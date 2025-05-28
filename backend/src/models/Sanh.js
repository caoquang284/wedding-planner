import { knex } from '../config/database.js';

const Sanh = {
  create: async (data) => {
    const [sanh] = await knex('SANH').insert(data).returning('*');
    return sanh;
  },
  findById: async (id) => {
    return await knex('SANH')
      .select('SANH.*', 'LOAISANH.TenLoaiSanh', 'LOAISANH.DonGiaBanToiThieu')
      .leftJoin('LOAISANH', 'SANH.MaLoaiSanh', 'LOAISANH.MaLoaiSanh')
      .where({ MaSanh: id })
      .first();
  },
  findAll: async () => {
    return await knex('SANH')
      .select('SANH.*', 'LOAISANH.TenLoaiSanh', 'LOAISANH.DonGiaBanToiThieu')
      .leftJoin('LOAISANH', 'SANH.MaLoaiSanh', 'LOAISANH.MaLoaiSanh')
      .orderBy([
        { column: 'LOAISANH.TenLoaiSanh', order: 'asc' },
        { column: 'SANH.TenSanh', order: 'asc' },
      ]);
  },
  findByTenSanh: async (tenSanh) => {
    return await knex('SANH').where({ TenSanh: tenSanh }).first();
  },
  update: async (id, data) => {
    const [sanh] = await knex('SANH')
      .where({ MaSanh: id })
      .update(data)
      .returning('*');
    return sanh;
  },
  delete: async (id) => {
    return await knex('SANH').where({ MaSanh: id }).delete();
  },
};

export default Sanh;
