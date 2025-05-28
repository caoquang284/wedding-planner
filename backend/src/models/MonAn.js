import { knex } from '../config/database.js';

const MonAn = {
  create: async (data) => {
    const [monAn] = await knex('MONAN').insert(data).returning('*');
    return monAn;
  },
  findById: async (id) => {
    return await knex('MONAN')
      .select('MONAN.*', 'LOAIMONAN.TenLoaiMonAn')
      .leftJoin('LOAIMONAN', 'MONAN.MaLoaiMonAn', 'LOAIMONAN.MaLoaiMonAn')
      .where({ MaMonAn: id })
      .first();
  },
  findAll: async () => {
    return await knex('MONAN')
      .select('MONAN.*', 'LOAIMONAN.TenLoaiMonAn')
      .leftJoin('LOAIMONAN', 'MONAN.MaLoaiMonAn', 'LOAIMONAN.MaLoaiMonAn');
  },
  update: async (id, data) => {
    const [monAn] = await knex('MONAN')
      .where({ MaMonAn: id })
      .update(data)
      .returning('*');
    return monAn;
  },
  delete: async (id) => {
    return await knex('MONAN').where({ MaMonAn: id }).delete();
  },
  isLoaiMonAnExists: async (maLoaiMonAn) => {
    const loaiMonAn = await knex('LOAIMONAN')
      .where({ MaLoaiMonAn: maLoaiMonAn })
      .first();
    return !!loaiMonAn; // Trả về true nếu loại món ăn tồn tại
  },
  isUsedByThucDon: async (id) => {
    // Kiểm tra món ăn có đang được sử dụng trong thực đơn nào không
    const thucDon = await knex('THUCDON_MONAN').where({ MaMonAn: id }).first();
    return !!thucDon; // Trả về true nếu món ăn đang được sử dụng trong thực đơn
  },
};

export default MonAn;
