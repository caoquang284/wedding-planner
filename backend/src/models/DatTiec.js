import { knex } from '../config/database.js';

const isCaExists = async (maCa) => {
  const ca = await knex('CA').where({ MaCa: maCa }).first();
  return !!ca;
};

const isSanhExists = async (maSanh) => {
  const sanh = await knex('SANH').where({ MaSanh: maSanh }).first();
  return !!sanh;
};

const isThucDonExists = async (maThucDon) => {
  const thucDon = await knex('THUCDON').where({ MaThucDon: maThucDon }).first();
  return !!thucDon;
};

const isDichVuExists = async (maDichVu) => {
  const dichVu = await knex('DICHVU').where({ MaDichVu: maDichVu }).first();
  return !!dichVu;
};

const DatTiec = {
  create: async (data) => {
    const [datTiec] = await knex('DATTIEC').insert(data).returning('*');
    return datTiec;
  },
  findById: async (id) => {
    return await knex('DATTIEC').where({ MaDatTiec: id }).first();
  },
  findAllWithFilters: async (filters) => {
    let query = knex('DATTIEC');
    if (filters.ngayDaiTiec)
      query = query.where('NgayDaiTiec', filters.ngayDaiTiec);
    if (filters.maCa) query = query.where('MaCa', filters.maCa);
    if (filters.maSanh) query = query.where('MaSanh', filters.maSanh);
    if (filters.tenChuRe)
      query = query.where('TenChuRe', 'like', `%${filters.tenChuRe}%`);
    if (filters.tenCoDau)
      query = query.where('TenCoDau', 'like', `%${filters.tenCoDau}%`);
    if (filters.dienThoai)
      query = query.where('DienThoai', 'like', `%${filters.dienThoai}%`);
    return await query;
  },
  update: async (id, data) => {
    const [datTiec] = await knex('DATTIEC')
      .where({ MaDatTiec: id })
      .update(data)
      .returning('*');
    return datTiec;
  },
  delete: async (id) => {
    return await knex('DATTIEC')
      .where({ MaDatTiec: id })
      .update({ DaHuy: true });
  },

  getSoLuongBanToiDa: async (maSanh) => {
    const soLuongBanToiDa = await knex('SANH')
      .where({ MaSanh: maSanh })
      .select('SoLuongBanToiDa');
    return soLuongBanToiDa;
  },
};

export default DatTiec;
