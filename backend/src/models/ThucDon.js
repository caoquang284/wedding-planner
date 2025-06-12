import { knex } from '../config/database.js';

const ThucDon = {
  create: async (data) => {
    const [thucDon] = await knex('THUCDON').insert(data).returning('*');
    return thucDon;
  },

  findById: async (id) => {
    return await knex('THUCDON').where({ MaThucDon: id }).first();
  },

  findByIdWithMonAn: async (id) => {
    const thucDon = await knex('THUCDON').where({ MaThucDon: id }).first();
    if (!thucDon) return null;

    const monAnList = await knex('THUCDON_MONAN')
      .select(
        'MONAN.*',
        'LOAIMONAN.TenLoaiMonAn',
        'THUCDON_MONAN.DonGiaThoiDiemDat'
      )
      .leftJoin('MONAN', 'THUCDON_MONAN.MaMonAn', 'MONAN.MaMonAn')
      .leftJoin('LOAIMONAN', 'MONAN.MaLoaiMonAn', 'LOAIMONAN.MaLoaiMonAn')
      .where({ 'THUCDON_MONAN.MaThucDon': id });

    return {
      ...thucDon,
      MonAnList: monAnList,
    };
  },

  findAll: async () => {
    return await knex('THUCDON');
  },

  findAllWithMonAnCount: async () => {
    return await knex('THUCDON as td')
      .leftJoin('THUCDON_MONAN as tdm', 'td.MaThucDon', 'tdm.MaThucDon')
      .select('td.*', knex.raw('COUNT(tdm."MaMonAn") as "SoLuongMonAn"'))
      .groupBy('td.MaThucDon');
  },

  findAllWithMonAnNames: async () => {
    const rows = await knex('THUCDON as td')
      .leftJoin('THUCDON_MONAN as tdm', 'td.MaThucDon', 'tdm.MaThucDon')
      .leftJoin('MONAN as ma', 'tdm.MaMonAn', 'ma.MaMonAn')
      .select(
        'td.MaThucDon',
        'td.TenThucDon',
        'td.DonGiaHienTai',
        'td.DonGiaThoiDiemDat',
        'td.GhiChu',
        'ma.TenMonAn'
      );

    // Gom nhóm tên món ăn theo MaThucDon
    const grouped = {};

    for (const row of rows) {
      if (!grouped[row.MaThucDon]) {
        grouped[row.MaThucDon] = {
          MaThucDon: row.MaThucDon,
          TenThucDon: row.TenThucDon,
          DonGiaHienTai: row.DonGiaHienTai,
          DonGiaThoiDiemDat: row.DonGiaThoiDiemDat,
          GhiChu: row.GhiChu,
          TenMonAnList: [],
        };
      }

      if (row.TenMonAn) {
        grouped[row.MaThucDon].TenMonAnList.push(row.TenMonAn);
      }
    }

    return Object.values(grouped);
  },

  update: async (id, data) => {
    const [thucDon] = await knex('THUCDON')
      .where({ MaThucDon: id })
      .update(data)
      .returning('*');
    return thucDon;
  },

  delete: async (id) => {
    return await knex('THUCDON').where({ MaThucDon: id }).delete();
  },

  isUsedByDatTiec: async (id) => {
    // Giả sử có bảng DATTIEC có trường MaThucDon
    const datTiec = await knex('DATTIEC').where({ MaThucDon: id }).first();
    return !!datTiec;
  },

  // Các phương thức cho THUCDON_MONAN
  addMonAn: async (maThucDon, maMonAn, donGiaThoiDiemDat) => {
    const [thucDonMonAn] = await knex('THUCDON_MONAN')
      .insert({
        MaThucDon: maThucDon,
        MaMonAn: maMonAn,
        DonGiaThoiDiemDat: donGiaThoiDiemDat,
      })
      .returning('*');
    return thucDonMonAn;
  },

  removeMonAn: async (maThucDon, maMonAn) => {
    return await knex('THUCDON_MONAN')
      .where({
        MaThucDon: maThucDon,
        MaMonAn: maMonAn,
      })
      .delete();
  },

  removeAllMonAn: async (maThucDon) => {
    return await knex('THUCDON_MONAN').where({ MaThucDon: maThucDon }).delete();
  },

  updateMonAn: async (maThucDon, maMonAn, donGiaThoiDiemDat) => {
    const [thucDonMonAn] = await knex('THUCDON_MONAN')
      .where({
        MaThucDon: maThucDon,
        MaMonAn: maMonAn,
      })
      .update({ DonGiaThoiDiemDat: donGiaThoiDiemDat })
      .returning('*');
    return thucDonMonAn;
  },

  isMonAnInThucDon: async (maThucDon, maMonAn) => {
    const thucDonMonAn = await knex('THUCDON_MONAN')
      .where({
        MaThucDon: maThucDon,
        MaMonAn: maMonAn,
      })
      .first();
    return !!thucDonMonAn;
  },

  isMonAnExists: async (maMonAn) => {
    const monAn = await knex('MONAN').where({ MaMonAn: maMonAn }).first();
    return !!monAn;
  },

  calculateTotalPrice: async (maThucDon) => {
    const result = await knex('THUCDON_MONAN')
      .where({ MaThucDon: maThucDon })
      .sum('DonGiaThoiDiemDat as TongTien')
      .first();
    return result.TongTien || 0;
  },
};

export default ThucDon;
