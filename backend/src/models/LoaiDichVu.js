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
  isUsedByDichVu: async (id) => {
    const dichVu = await knex('DICHVU').where({ MaLoaiDichVu: id }).first();
    return !!dichVu; // Trả về true nếu có dịch vụ sử dụng loại này
  },
};

export default LoaiDichVu;
