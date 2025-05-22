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
};

export default LoaiMonAn;
