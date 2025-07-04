import BaoCaoDoanhSo from '../models/BaoCaoDoanhSo.js';
import { knex } from '../config/database.js';

const getAllBaoCaoDoanhSo = async (req, res) => {
  try {
    const filters = {
      thang: req.query.thang ? Number(req.query.thang) : undefined,
      nam: req.query.nam ? Number(req.query.nam) : undefined,
    };

    let query = knex('HOADON')
      .join('DATTIEC', 'HOADON.MaDatTiec', '=', 'DATTIEC.MaDatTiec')
      .where('HOADON.TrangThai', 1)
      .select({
        MaBaoCaoDoanhSo: knex.raw('CONCAT(EXTRACT(YEAR FROM "HOADON"."NgayThanhToan"), EXTRACT(MONTH FROM "HOADON"."NgayThanhToan"))'), // Tạo ID giả lập
        Thang: knex.raw('EXTRACT(MONTH FROM "HOADON"."NgayThanhToan")'),
        Nam: knex.raw('EXTRACT(YEAR FROM "HOADON"."NgayThanhToan")'),
        TongDoanhThu: knex.raw('SUM("HOADON"."TongTienHoaDon")'),
      })
      .groupBy('Thang', 'Nam');

    if (filters.thang) {
      query = query.whereRaw('EXTRACT(MONTH FROM "HOADON"."NgayThanhToan") = ?', [filters.thang]);
    }
    if (filters.nam) {
      query = query.whereRaw('EXTRACT(YEAR FROM "HOADON"."NgayThanhToan") = ?', [filters.nam]);
    }

    const baoCaos = await query;
    const formattedBaoCaos = baoCaos.map((baoCao) => ({
      MaBaoCaoDoanhSo: baoCao.MaBaoCaoDoanhSo,
      Thang: Number(baoCao.Thang),
      Nam: Number(baoCao.Nam),
      TongDoanhThu: Number(baoCao.TongDoanhThu) || 0,
    }));

    return res.status(200).json({ data: formattedBaoCaos });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getBaoCaoDoanhSo = async (req, res) => {
  try {
    const { id } = req.params; // id là CONCAT(Nam, Thang), ví dụ: "202501"
    const nam = Number(id.substring(0, 4)); // Lấy năm
    const thang = Number(id.substring(4)); // Lấy tháng

    // Tính tổng doanh thu cho tháng/năm
    const baoCao = await knex('HOADON')
      .join('DATTIEC', 'HOADON.MaDatTiec', '=', 'DATTIEC.MaDatTiec')
      .where('HOADON.TrangThai', 1)
      .whereRaw('EXTRACT(MONTH FROM "HOADON"."NgayThanhToan") = ?', [thang])
      .whereRaw('EXTRACT(YEAR FROM "HOADON"."NgayThanhToan") = ?', [nam])
      .select({
        MaBaoCaoDoanhSo: knex.raw('?::text', [id]),
        Thang: knex.raw('?::integer', [thang]),
        Nam: knex.raw('?::integer', [nam]),
        TongDoanhThu: knex.raw('SUM("HOADON"."TongTienHoaDon")'),
      })
      .first();

    if (!baoCao) {
      throw new Error('Không có dữ liệu báo cáo cho tháng/năm này');
    }

    // Tính chi tiết báo cáo theo ngày
    const chiTiet = await knex('HOADON')
      .join('DATTIEC', 'HOADON.MaDatTiec', '=', 'DATTIEC.MaDatTiec')
      .where('HOADON.TrangThai', 1)
      .whereRaw('EXTRACT(MONTH FROM "HOADON"."NgayThanhToan") = ?', [thang])
      .whereRaw('EXTRACT(YEAR FROM "HOADON"."NgayThanhToan") = ?', [nam])
      .select({
        Ngay: knex.raw('DATE("HOADON"."NgayThanhToan")'),
        SoLuongTiec: knex.raw('COUNT(*)'),
        DoanhThu: knex.raw('SUM("HOADON"."TongTienHoaDon")'),
      })
      .groupBy('Ngay')
      .orderBy('Ngay', 'asc');

    // Tính tỷ lệ (TiLe) cho chi tiết
    const tongDoanhThu = Number(baoCao.TongDoanhThu) || 0;
    const formattedChiTiet = chiTiet.map((item) => ({
      Ngay: item.Ngay,
      SoLuongTiec: Number(item.SoLuongTiec) || 0,
      DoanhThu: Number(item.DoanhThu) || 0,
      TiLe: tongDoanhThu > 0 ? (Number(item.DoanhThu) / tongDoanhThu) * 100 : 0,
    }));

    return res.status(200).json({
      data: {
        MaBaoCaoDoanhSo: baoCao.MaBaoCaoDoanhSo,
        Thang: Number(baoCao.Thang),
        Nam: Number(baoCao.Nam),
        TongDoanhThu: Number(baoCao.TongDoanhThu) || 0,
        chiTiet: formattedChiTiet,
      },
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const updateBaoCaoDoanhSo = async (req, res) => {
  try {
    const { id } = req.params;
    const { TongDoanhThu } = req.body;

    const updatedBaoCao = await BaoCaoDoanhSo.update(id, { TongDoanhThu });
    return res.status(200).json({ message: 'Cập nhật báo cáo thành công', data: updatedBaoCao });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getRevenueStatsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Vui lòng cung cấp ngày bắt đầu và ngày kết thúc' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Xác định khoảng thời gian
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    const startMonth = start.getMonth() + 1;
    const endMonth = end.getMonth() + 1;

    let groupByClause, selectClause, labelFormat;
    let isYearly = false, isMonthly = false, isDaily = false;

    if (startYear !== endYear) {
      // Trường hợp khác năm: nhóm theo năm
      isYearly = true;
      groupByClause = knex.raw('EXTRACT(YEAR FROM "HOADON"."NgayThanhToan")');
      selectClause = {
        Nam: knex.raw('EXTRACT(YEAR FROM "HOADON"."NgayThanhToan")'),
        SoLuongTiec: knex.raw('COUNT(*)'),
        DoanhThu: knex.raw('SUM("HOADON"."TongTienHoaDon")'),
      };
      labelFormat = (row) => `${row.Nam}`;
    } else if (startMonth !== endMonth) {
      // Trường hợp cùng năm, khác tháng: nhóm theo tháng/năm
      isMonthly = true;
      groupByClause = [
        knex.raw('EXTRACT(YEAR FROM "HOADON"."NgayThanhToan")'),
        knex.raw('EXTRACT(MONTH FROM "HOADON"."NgayThanhToan")'),
      ];
      selectClause = {
        Nam: knex.raw('EXTRACT(YEAR FROM "HOADON"."NgayThanhToan")'),
        Thang: knex.raw('EXTRACT(MONTH FROM "HOADON"."NgayThanhToan")'),
        SoLuongTiec: knex.raw('COUNT(*)'),
        DoanhThu: knex.raw('SUM("HOADON"."TongTienHoaDon")'),
      };
      labelFormat = (row) => `${row.Thang}/${row.Nam}`;
    } else {
      // Trường hợp cùng năm, cùng tháng, khác ngày: nhóm theo ngày
      isDaily = true;
      groupByClause = 'HOADON.NgayThanhToan';
      selectClause = {
        Ngay: 'HOADON.NgayThanhToan',
        SoLuongTiec: knex.raw('COUNT(*)'),
        DoanhThu: knex.raw('SUM("HOADON"."TongTienHoaDon")'),
      };
      labelFormat = (row) => new Date(row.Ngay).toLocaleDateString('vi-VN');
    }

    const stats = await knex('HOADON')
      .join('DATTIEC', 'HOADON.MaDatTiec', '=', 'DATTIEC.MaDatTiec')
      .where('HOADON.NgayThanhToan', '>=', startDate)
      .where('HOADON.NgayThanhToan', '<=', endDate)
      .where('HOADON.TrangThai', 1)
      .select(selectClause)
      .groupBy(groupByClause)
      .orderBy(isYearly ? 'Nam' : isMonthly ? ['Nam', 'Thang'] : 'NgayThanhToan', 'asc');

    // Định dạng dữ liệu trả về
    const formattedStats = stats.map((row) => ({
      label: labelFormat(row),
      SoLuongTiec: Number(row.SoLuongTiec) || 0,
      DoanhThu: Number(row.DoanhThu) || 0,
    }));

    return res.status(200).json({ data: formattedStats });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error.message, error.stack);
    return res.status(500).json({ error: error.message });
  }
};

export default {
  getAllBaoCaoDoanhSo,
  getBaoCaoDoanhSo,
  updateBaoCaoDoanhSo,
  getRevenueStatsByDateRange,
};