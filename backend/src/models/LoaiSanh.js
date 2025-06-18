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
    return await knex('LOAISANH').select('*').orderBy('TenLoaiSanh', 'asc');
  },
  findByTenLoaiSanh: async (tenLoaiSanh) => {
    return await knex('LOAISANH').where({ TenLoaiSanh: tenLoaiSanh }).first();
  },
  checkDaDuocDatTiec: async (maLoaiSanh) => {
    const sanh = await knex('SANH').where({ MaLoaiSanh: maLoaiSanh }).first();
    if (sanh) {
      return true;
    }
    return false;
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
  temDelete: async (id) => {
    return await knex('LOAISANH')
      .where({ MaLoaiSanh: id })
      .update({ DaXoa: true });
  },
};

export default LoaiSanh;
