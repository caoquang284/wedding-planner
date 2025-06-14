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
  getDonGiaBanToiThieuTuMaSanh: async (maSanh) => {
    // B1: Lấy MaLoaiSanh từ bảng SANH
    const s = await knex('SANH').where({ MaSanh: maSanh }).first();
    if (!s) throw new Error('Không tìm thấy sảnh có mã: ' + maSanh);

    // B2: Dùng MaLoaiSanh để truy ra đơn giá từ bảng LOAISANH
    const loai = await knex('LOAISANH')
      .where({ MaLoaiSanh: s.MaLoaiSanh })
      .first('DonGiaBanToiThieu');

    if (!loai) throw new Error('Không tìm thấy loại sảnh phù hợp');

    return loai.DonGiaBanToiThieu;
  },
};

export default Sanh;
