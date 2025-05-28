import { knex } from '../config/database.js';

const LoaiMonAn = {
  create: async (data) => {
    const [loaiMonAn] = await knex('LOAIMONAN').insert(data).returning('*');
    return loaiMonAn;
  },
  findById: async (id) => {
    return await knex('LOAIMONAN').where({ MaLoaiMonAn: id }).first();
  },
  findAll: async () => {
    return await knex('LOAIMONAN');
  },
  update: async (id, data) => {
    const [loaiMonAn] = await knex('LOAIMONAN')
      .where({ MaLoaiMonAn: id })
      .update(data)
      .returning('*');
    return loaiMonAn;
  },
  delete: async (id) => {
    return await knex('LOAIMONAN').where({ MaLoaiMonAn: id }).delete();
  },
  isUsedByMonAn: async (id) => {
    const monAn = await knex('MONAN').where({ MaLoaiMonAn: id }).first();
    return !!monAn; // Trả về true nếu có món ăn sử dụng loại này
  },
};

export default LoaiMonAn;
