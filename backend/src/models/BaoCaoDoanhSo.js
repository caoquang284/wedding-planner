// BaoCaoDoanhSo.js
import { knex } from '../config/database.js';

const BaoCaoDoanhSo = {
  // Tạo báo cáo doanh thu mới
  create: async (data) => {
    try {
      const [baoCao] = await knex('BAOCAODOANHSO').insert(data).returning('*');
      return baoCao;
    } catch (error) {
      throw new Error(`Lỗi khi tạo báo cáo doanh thu: ${error.message}`);
    }
  },

  // Tìm báo cáo theo ID
  findById: async (id) => {
    try {
      const baoCao = await knex('BAOCAODOANHSO')
        .where({ MaBaoCaoDoanhSo: id })
        .first();
      if (!baoCao) {
        throw new Error('Báo cáo doanh thu không tồn tại');
      }
      return baoCao;
    } catch (error) {
      throw new Error(`Lỗi khi tìm báo cáo: ${error.message}`);
    }
  },

  // Tìm báo cáo theo tháng và năm
  findByMonthYear: async (thang, nam) => {
    try {
      return await knex('BAOCAODOANHSO')
        .where({ Thang: thang, Nam: nam })
        .first();
    } catch (error) {
      throw new Error(`Lỗi khi tìm báo cáo theo tháng/năm: ${error.message}`);
    }
  },

  // Tìm tất cả báo cáo với bộ lọc
  findAllWithFilters: async (filters) => {
    try {
      let query = knex('BAOCAODOANHSO').select('*');
      if (filters.thang) query = query.where('Thang', filters.thang);
      if (filters.nam) query = query.where('Nam', filters.nam);
      return await query;
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách báo cáo: ${error.message}`);
    }
  },

  // Lấy chi tiết báo cáo theo MaBaoCaoDoanhSo
  findChiTietByBaoCaoId: async (maBaoCaoDoanhSo) => {
    try {
      const chiTiet = await knex('CHITIET_BAOCAODOANHSO')
        .where({ MaBaoCaoDoanhSo: maBaoCaoDoanhSo })
        .select('*');
      console.log('Chi tiết lấy được:', chiTiet); // Kiểm tra log
      return chiTiet;
    } catch (error) {
      throw new Error(`Lỗi khi lấy chi tiết báo cáo: ${error.message}`);
    }
  },

  // Thêm chi tiết báo cáo
  createChiTiet: async (data) => {
    try {
      const [chiTiet] = await knex('CHITIET_BAOCAODOANHSO')
        .insert(data)
        .returning('*');
      return chiTiet;
    } catch (error) {
      throw new Error(`Lỗi khi thêm chi tiết báo cáo: ${error.message}`);
    }
  },

  // Cập nhật báo cáo doanh thu
  update: async (id, data) => {
    try {
      const [updatedBaoCao] = await knex('BAOCAODOANHSO')
        .where({ MaBaoCaoDoanhSo: id })
        .update(data)
        .returning('*');
      return updatedBaoCao;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật báo cáo: ${error.message}`);
    }
  },

  // Cập nhật chi tiết báo cáo theo ngày
  updateChiTiet: async (maBaoCaoDoanhSo, ngay, data) => {
    try {
      const [updatedChiTiet] = await knex('CHITIET_BAOCAODOANHSO')
        .where({ MaBaoCaoDoanhSo: maBaoCaoDoanhSo, Ngay: ngay })
        .update(data)
        .returning('*');
      return updatedChiTiet;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật chi tiết báo cáo: ${error.message}`);
    }
  },

  // Tạo dữ liệu báo cáo doanh thu cho tháng/năm
  generateReportData: async (thang, nam) => {
  try {
    console.log(`Tạo báo cáo cho tháng ${thang}, năm ${nam}`);
    const hoaDons = await knex('HOADON')
      .join('DATTIEC', 'HOADON.MaDatTiec', '=', 'DATTIEC.MaDatTiec')
      .where('HOADON.NgayThanhToan', '>=', `${nam}-${thang}`)
      .where('HOADON.NgayThanhToan', '<', `${nam}-${thang + 1}`)
      .where('HOADON.TrangThai', 1)
      .select(
        'HOADON.TongTienHoaDon',
        'HOADON.NgayThanhToan'
      );

    console.log('Hóa đơn tìm thấy:', hoaDons);
    const chiTietMap = {};
    let tongDoanhThu = 0;

    for (const hoaDon of hoaDons) {
      const ngay = new Date(hoaDon.NgayThanhToan).toISOString().split('T')[0];
      const tongTien = parseFloat(hoaDon.TongTienHoaDon.toString().replace(/[^0-9.-]/g, ''));
      console.log('TongTienHoaDon thô:', hoaDon.TongTienHoaDon, 'sau xử lý:', tongTien);
      tongDoanhThu += tongTien;

      if (!chiTietMap[ngay]) {
        chiTietMap[ngay] = {
          Ngay: ngay,
          SoLuongTiec: 0,
          DoanhThu: 0,
        };
      }

      chiTietMap[ngay].SoLuongTiec += 1;
      chiTietMap[ngay].DoanhThu += tongTien; // Đảm bảo DoanhThu được cộng
    }

    const chiTiet = Object.values(chiTietMap).map((item) => ({
      ...item,
      TiLe: tongDoanhThu > 0 ? (item.DoanhThu / tongDoanhThu) * 100 : 0,
    }));

    console.log('Dữ liệu báo cáo:', { tongDoanhThu, chiTiet }); // Kiểm tra chiTiet

    return {
      tongDoanhThu,
      chiTiet,
    };
  } catch (error) {
    console.error('Lỗi trong generateReportData:', error);
    throw new Error(`Lỗi khi tạo dữ liệu báo cáo: ${error.message}`);
  }
},
};

export default BaoCaoDoanhSo;