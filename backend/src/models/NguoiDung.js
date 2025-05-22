import { knex } from '../config/database.js';

const NguoiDung = {
  create: async (data) => {
    const [nguoiDung] = await knex('NGUOIDUNG').insert(data).returning('*');
    return nguoiDung;
  },
  findById: async (id) => {
    return await knex('NGUOIDUNG').where({ MaNguoiDung: id }).first();
  },
  findAll: async () => {
    return await knex('NGUOIDUNG');
  },
  findByTenDangNhap: async (tenDangNhap) => {
    return await knex('NGUOIDUNG').where({ TenDangNhap: tenDangNhap }).first();
  },
  update: async (id, data) => {
    const [nguoiDung] = await knex('NGUOIDUNG')
      .where({ MaNguoiDung: id })
      .update(data)
      .returning('*');
    return nguoiDung;
  },
  delete: async (id) => {
    return await knex('NGUOIDUNG').where({ MaNguoiDung: id }).delete();
  },
};

export default NguoiDung;
