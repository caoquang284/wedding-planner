// baoCaoDoanhSoController.js
import BaoCaoDoanhSo from '../models/BaoCaoDoanhSo.js';

const createBaoCaoDoanhSo = async (req, res) => {
  try {
    const { thang, nam } = req.body;

    // Kiểm tra báo cáo đã tồn tại
    const existingReport = await BaoCaoDoanhSo.findByMonthYear(thang, nam);
    if (existingReport) {
      return res.status(400).json({ error: 'Báo cáo cho tháng/năm này đã tồn tại' });
    }

    // Tạo dữ liệu báo cáo
    const { tongDoanhThu, chiTiet } = await BaoCaoDoanhSo.generateReportData(thang, nam);

    // Tạo báo cáo doanh thu
    const baoCaoData = {
      Thang: thang,
      Nam: nam,
      TongDoanhThu: tongDoanhThu,
    };
    const newBaoCao = await BaoCaoDoanhSo.create(baoCaoData);

    // Thêm chi tiết báo cáo
    for (const chiTietItem of chiTiet) {
      await BaoCaoDoanhSo.createChiTiet({
        MaBaoCaoDoanhSo: newBaoCao.MaBaoCaoDoanhSo,
        Ngay: chiTietItem.Ngay,
        SoLuongTiec: chiTietItem.SoLuongTiec,
        DoanhThu: chiTietItem.DoanhThu,
        TiLe: chiTietItem.TiLe,
      });
    }

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

export default {
  createBaoCaoDoanhSo,
  getAllBaoCaoDoanhSo,
  getBaoCaoDoanhSo,
  themChiTiet,
  updateBaoCaoDoanhSo, 
};