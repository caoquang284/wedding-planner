import { knex } from '../config/database.js';

const LoaiDichVu = {
  create: async (data) => {
    const [loaiDichVu] = await knex('LOAIDICHVU').insert(data).returning('*');
    return loaiDichVu;
  },
  findById: async (id) => {
    return await knex('LOAIDICHVU').where({ MaLoaiDichVu: id }).first();
  },
  findAll: async () => {
    return await knex('LOAIDICHVU');
  },
  update: async (id, data) => {
    const [loaiDichVu] = await knex('LOAIDICHVU')
      .where({ MaLoaiDichVu: id })
      .update(data)
      .returning('*');
    return loaiDichVu;
  },
  delete: async (id) => {
    return await knex('LOAIDICHVU').where({ MaLoaiDichVu: id }).delete();
  },
};

export default LoaiDichVu;
