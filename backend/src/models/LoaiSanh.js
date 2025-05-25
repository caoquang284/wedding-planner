import { knex } from '../config/database.js';

const LoaiSanh = {
  create: async (data) => {
    const [loaiSanh] = await knex('LOAISANH').insert(data).returning('*');
    return loaiSanh;
  },
  findById: async (id) => {
    return await knex('LOAISANH').where({ MaLoaiSanh: id }).first();
  },
  findAll: async () => {
    return await knex('LOAISANH').select('*');
  },
  findByTenLoaiSanh: async (tenLoaiSanh) => {
    return await knex('LOAISANH').where({ TenLoaiSanh: tenLoaiSanh }).first();
  },
  update: async (id, data) => {
    const [loaiSanh] = await knex('LOAISANH')
      .where({ MaLoaiSanh: id })
      .update(data)
      .returning('*');
    return loaiSanh;
  },
  delete: async (id) => {
    return await knex('LOAISANH').where({ MaLoaiSanh: id }).delete();
  },
};

export default LoaiSanh;
