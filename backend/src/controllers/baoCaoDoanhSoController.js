import BaoCaoDoanhSo from '../models/BaoCaoDoanhSo.js';
import { knex } from '../config/database.js';

const createBaoCaoDoanhSo = async (req, res) => {
  try {
    const { thang, nam } = req.body;

    const existingReport = await BaoCaoDoanhSo.findByMonthYear(thang, nam);
    if (existingReport) {
      return res.status(400).json({ error: 'Báo cáo cho tháng/năm này đã tồn tại' });
    }

    const { tongDoanhThu, chiTiet } = await BaoCaoDoanhSo.generateReportData(thang, nam);
    if (tongDoanhThu === undefined || tongDoanhThu === 0) {
      console.warn('TongDoanhThu không hợp lệ:', tongDoanhThu);
    }

    const baoCaoData = {
      Thang: thang,
      Nam: nam,
      TongDoanhThu: tongDoanhThu || 0,
    };
    const newBaoCao = await BaoCaoDoanhSo.create(baoCaoData);

    for (const chiTietItem of chiTiet) {
      await BaoCaoDoanhSo.createChiTiet({
        MaBaoCaoDoanhSo: newBaoCao.MaBaoCaoDoanhSo,
        Ngay: chiTietItem.Ngay,
        SoLuongTiec: chiTietItem.SoLuongTiec,
        DoanhThu: chiTietItem.DoanhThu,
        TiLe: chiTietItem.TiLe,
      });
    }

    // Cập nhật lại TongDoanhThu từ chi tiết
    const totalRevenueFromChiTiet = chiTiet.reduce((sum, item) => sum + item.DoanhThu, 0);
    await BaoCaoDoanhSo.update(newBaoCao.MaBaoCaoDoanhSo, { TongDoanhThu: totalRevenueFromChiTiet });

    return res.status(201).json({ message: 'Tạo báo cáo thành công', data: newBaoCao });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllBaoCaoDoanhSo = async (req, res) => {
  try {
    const filters = {
      thang: req.query.thang ? Number(req.query.thang) : undefined,
      nam: req.query.nam ? Number(req.query.nam) : undefined,
    };
    const baoCaos = await BaoCaoDoanhSo.findAllWithFilters(filters);
    return res.status(200).json({ data: baoCaos });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getBaoCaoDoanhSo = async (req, res) => {
  try {
    const { id } = req.params;
    const baoCao = await BaoCaoDoanhSo.findById(id);
    const chiTiet = await BaoCaoDoanhSo.findChiTietByBaoCaoId(id);
    console.log('BaoCao:', baoCao, 'ChiTiet:', chiTiet);
    return res.status(200).json({ data: { ...baoCao, chiTiet } });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const themChiTiet = async (req, res) => {
  try {
    const { id } = req.params;
    const { Ngay, SoLuongTiec, DoanhThu, TiLe } = req.body;

    const chiTietData = {
      MaBaoCaoDoanhSo: id,
      Ngay,
      SoLuongTiec,
      DoanhThu,
      TiLe,
    };

    const existingChiTiet = await knex('CHITIET_BAOCAODOANHSO')
      .where({ MaBaoCaoDoanhSo: id, Ngay })
      .first();

    let chiTiet;
    if (existingChiTiet) {
      chiTiet = await BaoCaoDoanhSo.updateChiTiet(id, Ngay, chiTietData);
    } else {
      chiTiet = await BaoCaoDoanhSo.createChiTiet(chiTietData);
    }

    return res.status(201).json({ message: 'Thêm/cập nhật chi tiết báo cáo thành công', data: chiTiet });
  } catch (error) {
    return res.status(400).json({ error: error.message });
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
  console.log('Query params:', req.query); // Debug
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Vui lòng cung cấp ngày bắt đầu và ngày kết thúc' });
    }

    const stats = await knex('HOADON')
      .join('DATTIEC', 'HOADON.MaDatTiec', '=', 'DATTIEC.MaDatTiec')
      .where('HOADON.NgayThanhToan', '>=', startDate)
      .where('HOADON.NgayThanhToan', '<=', endDate)
      .where('HOADON.TrangThai', 1)
      .select(
        knex.raw('EXTRACT(YEAR FROM "HOADON"."NgayThanhToan") as Nam'),
        knex.raw('EXTRACT(MONTH FROM "HOADON"."NgayThanhToan") as Thang'),
        knex.raw('COUNT(*) as SoLuongTiec'),
        knex.raw('SUM("HOADON"."TongTienHoaDon") as DoanhThu')
      )
      .groupBy(
        'HOADON.NgayThanhToan', 
        knex.raw('EXTRACT(YEAR FROM "HOADON"."NgayThanhToan")'),
        knex.raw('EXTRACT(MONTH FROM "HOADON"."NgayThanhToan")')
      )
      .orderBy(
        knex.raw('EXTRACT(YEAR FROM "HOADON"."NgayThanhToan")'),
        'asc'
      )
      .orderBy(
        knex.raw('EXTRACT(MONTH FROM "HOADON"."NgayThanhToan")'),
        'asc'
      );

    console.log('Stats result:', stats);
    return res.status(200).json({ data: stats });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error.message, error.stack);
    return res.status(500).json({ error: error.message });
  }
};

export default {
  createBaoCaoDoanhSo,
  getAllBaoCaoDoanhSo,
  getBaoCaoDoanhSo,
  themChiTiet,
  updateBaoCaoDoanhSo,
  getRevenueStatsByDateRange,
};