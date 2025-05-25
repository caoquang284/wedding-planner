import { knex } from '../config/database.js';

const DichVu = {
  create: async (data) => {
    const [dichVu] = await knex('DICHVU').insert(data).returning('*');
    return dichVu;
  },
  findById: async (id) => {
    return await knex('DICHVU')
      .select('DICHVU.*', 'LOAIDICHVU.TenLoaiDichVu')
      .leftJoin('LOAIDICHVU', 'DICHVU.MaLoaiDichVu', 'LOAIDICHVU.MaLoaiDichVu')
      .where({ MaDichVu: id })
      .first();
  },
  findAll: async () => {
    return await knex('DICHVU')
      .select('DICHVU.*', 'LOAIDICHVU.TenLoaiDichVu')
      .leftJoin('LOAIDICHVU', 'DICHVU.MaLoaiDichVu', 'LOAIDICHVU.MaLoaiDichVu');
  },
  update: async (id, data) => {
    const [dichVu] = await knex('DICHVU')
      .where({ MaDichVu: id })
      .update(data)
      .returning('*');
    return dichVu;
  },
  delete: async (id) => {
    return await knex('DICHVU').where({ MaDichVu: id }).delete();
  },
  isLoaiDichVuExists: async (maLoaiDichVu) => {
    const loaiDichVu = await knex('LOAIDICHVU')
      .where({ MaLoaiDichVu: maLoaiDichVu })
      .first();
    return !!loaiDichVu; // Trả về true nếu loại dịch vụ tồn tại
  },
  isUsedByDatTiec: async (id) => {
    const datTiec = await knex('DATTIEC_DICHVU')
      .where({ MaDichVu: id })
      .first();
    return !!datTiec; // Trả về true nếu dịch vụ đang được sử dụng trong đặt tiệc
  },
};

export default DichVu;
