/* eslint-disable */
import DatTiec from '../models/DatTiec.js';
import DichVu from '../models/DichVu.js';
import DatTiecDichVu from '../models/DatTiecDichVu.js';
import { knex } from '../config/database.js';

// Tạo đặt tiệc
const createDatTiec = async (req, res) => {
  try {
    const {
      tenChuRe,
      tenCoDau,
      dienThoai,
      ngayDaiTiec,
      maCa,
      maSanh,
      maThucDon,
      soLuongBan,
      soBanDuTru,
      tienDatCoc,
      dichVus, // Mảng: [{maDichVu, soLuong, donGiaThoiDiemDat}]
    } = req.body;

    // Kiểm tra đầy đủ thông tin
    if (
      !tenChuRe ||
      !tenCoDau ||
      !dienThoai ||
      !ngayDaiTiec ||
      !maCa ||
      !maSanh ||
      !maThucDon ||
      soLuongBan === undefined ||
      soBanDuTru === undefined ||
      tienDatCoc === undefined
    ) {
      return res
        .status(400)
        .json({ error: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    // Kiểm tra định dạng số điện thoại (10 chữ số)
    if (!/^\d{10}$/.test(dienThoai)) {
      return res.status(400).json({ error: 'Số điện thoại phải có 10 chữ số' });
    }

    // Kiểm tra ngày đại tiệc
    if (isNaN(new Date(ngayDaiTiec).getTime())) {
      return res.status(400).json({ error: 'Ngày đại tiệc không hợp lệ' });
    }

    // Kiểm tra số lượng bàn
    if (
      !Number.isInteger(soLuongBan) ||
      !Number.isInteger(soBanDuTru) ||
      soLuongBan < 0 ||
      soBanDuTru < 0
    ) {
      return res.status(400).json({
        error: 'Số lượng bàn và bàn dự trữ phải là số nguyên không âm',
      });
    }

    const soLuongBanToiDa = await DatTiec.getSoLuongBanToiDa(maSanh);
    // Kiểm tra tổng số bàn
    if (soLuongBan + soBanDuTru > soLuongBanToiDa) {
      return res.status(400).json({
        error: 'Tổng số bàn không được vượt qua số lượng bàn tối đa của sảnh',
      });
    }

    // Kiểm tra tiền đặt cọc
    if (tienDatCoc < 0) {
      return res.status(400).json({ error: 'Tiền đặt cọc không được âm' });
    }

    // Kiểm tra trùng lịch
    const existing = await knex('DATTIEC')
      .where({ MaSanh: maSanh, MaCa: maCa, NgayDaiTiec: ngayDaiTiec })
      .first();
    if (existing) {
      return res
        .status(400)
        .json({ error: 'Sảnh và ca đã được đặt vào ngày này' });
    }

    // Kiểm tra dịch vụ
    if (dichVus && !Array.isArray(dichVus)) {
      return res.status(400).json({ error: 'Danh sách dịch vụ phải là mảng' });
    }
    if (dichVus && dichVus.length > 0) {
      for (const dichVu of dichVus) {
        if (
          !dichVu.maDichVu ||
          !Number.isInteger(dichVu.soLuong) ||
          dichVu.soLuong < 0 ||
          isNaN(dichVu.donGiaThoiDiemDat) ||
          dichVu.donGiaThoiDiemDat < 0
        ) {
          return res
            .status(400)
            .json({ error: 'Thông tin dịch vụ không hợp lệ' });
        }
      }
    }

    // Tạo bản ghi đặt tiệc
    const datTiecData = {
      TenChuRe: tenChuRe,
      TenCoDau: tenCoDau,
      DienThoai: dienThoai,
      NgayDaiTiec: new Date(ngayDaiTiec),
      MaCa: maCa,
      MaSanh: maSanh,
      MaThucDon: maThucDon,
      SoLuongBan: Number(soLuongBan),
      SoBanDuTru: Number(soBanDuTru),
      TienDatCoc: Number(tienDatCoc),
    };

    const datTiec = await DatTiec.create(datTiecData);

    // Lưu dịch vụ
    if (dichVus && dichVus.length > 0) {
      const datTiecDichVuData = dichVus.map((dichVu) => ({
        MaDatTiec: datTiec.MaDatTiec,
        MaDichVu: dichVu.maDichVu,
        SoLuong: Number(dichVu.soLuong),
        DonGiaThoiDiemDat: Number(dichVu.donGiaThoiDiemDat),
        ThanhTien: Number(dichVu.soLuong) * Number(dichVu.donGiaThoiDiemDat),
      }));
      await Promise.all(
        datTiecDichVuData.map((data) => DatTiecDichVu.create(data))
      );
    }

    // Trả về thông tin chi tiết
    const datTiecWithDetails = await findDatTiecById(datTiec.MaDatTiec);
    return res.status(201).json(datTiecWithDetails);
  } catch (error) {
    console.error('Error creating dat tiec:', error.stack);
    return res
      .status(500)
      .json({ error: 'Lỗi khi tạo đặt tiệc: ' + error.message });
  }
};

// Lấy chi tiết đặt tiệc
const findDatTiecById = async (id) => {
  const datTiec = await DatTiec.findById(id);
  if (!datTiec) return null;

  const dichVus = await knex('DATTIEC_DICHVU')
    .where({ MaDatTiec: id })
    .select('MaDichVu', 'SoLuong', 'DonGiaThoiDiemDat', 'ThanhTien');

  const monAns = await knex('THUCDON_MONAN')
    .where({ MaThucDon: datTiec.MaThucDon })
    .select('MaMonAn', 'DonGiaThoiDiemDat');

  return {
    ...datTiec,
    DichVus: dichVus,
    MonAns: monAns,
  };
};

const getDatTiecById = async (req, res) => {
  try {
    const { id } = req.params;
    const datTiec = await findDatTiecById(id);
    if (!datTiec) {
      return res.status(404).json({ error: 'Đặt tiệc không tồn tại' });
    }
    return res.status(200).json(datTiec);
  } catch (error) {
    console.error('Error getting dat tiec:', error.stack);
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy chi tiết đặt tiệc: ' + error.message });
  }
};

// Lấy danh sách đặt tiệc
const getAllDatTiec = async (req, res) => {
  try {
    const { ngayDaiTiec, maCa, maSanh, tenChuRe, tenCoDau, dienThoai } =
      req.query;
    const filters = {
      ngayDaiTiec,
      maCa: maCa ? Number(maCa) : undefined,
      maSanh: maSanh ? Number(maSanh) : undefined,
      tenChuRe,
      tenCoDau,
      dienThoai,
    };
    const datTiecList = await DatTiec.findAllWithFilters(filters);
    const datTiecWithDetails = await Promise.all(
      datTiecList.map(
        async (datTiec) => await findDatTiecById(datTiec.MaDatTiec)
      )
    );
    return res.status(200).json(datTiecWithDetails);
  } catch (error) {
    console.error('Error getting all dat tiec:', error.stack);
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy danh sách đặt tiệc: ' + error.message });
  }
};

// Cập nhật đặt tiệc
const updateDatTiec = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tenChuRe,
      tenCoDau,
      dienThoai,
      ngayDaiTiec,
      maCa,
      maSanh,
      maThucDon,
      soLuongBan,
      soBanDuTru,
      tienDatCoc,
      dichVus,
    } = req.body;

    // Kiểm tra đặt tiệc tồn tại
    const datTiec = await DatTiec.findById(id);
    if (!datTiec) {
      return res.status(404).json({ error: 'Đặt tiệc không tồn tại' });
    }

    // Kiểm tra đầy đủ thông tin
    if (
      !tenChuRe ||
      !tenCoDau ||
      !dienThoai ||
      !ngayDaiTiec ||
      !maCa ||
      !maSanh ||
      !maThucDon ||
      soLuongBan === undefined ||
      soBanDuTru === undefined ||
      tienDatCoc === undefined
    ) {
      return res
        .status(400)
        .json({ error: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    // Kiểm tra định dạng số điện thoại
    if (!/^\d{10}$/.test(dienThoai)) {
      return res.status(400).json({ error: 'Số điện thoại phải có 10 chữ số' });
    }

    // Kiểm tra ngày đại tiệc
    if (isNaN(new Date(ngayDaiTiec).getTime())) {
      return res.status(400).json({ error: 'Ngày đại tiệc không hợp lệ' });
    }

    // Kiểm tra số lượng bàn
    if (
      !Number.isInteger(soLuongBan) ||
      !Number.isInteger(soBanDuTru) ||
      soLuongBan < 0 ||
      soBanDuTru < 0
    ) {
      return res.status(400).json({
        error: 'Số lượng bàn và bàn dự trữ phải là số nguyên không âm',
      });
    }

    const soLuongBanToiDa = await DatTiec.getSoLuongBanToiDa(maSanh);
    // Kiểm tra tổng số bàn
    if (soLuongBan + soBanDuTru > soLuongBanToiDa) {
      return res.status(400).json({
        error: 'Tổng số bàn không được vượt quá số lượng bàn tối đa của sảnh',
      });
    }

    // Kiểm tra tiền đặt cọc
    if (tienDatCoc < 0) {
      return res.status(400).json({ error: 'Tiền đặt cọc không được âm' });
    }

    // Kiểm tra trùng lịch
    const existing = await knex('DATTIEC')
      .where({ MaSanh: maSanh, MaCa: maCa, NgayDaiTiec: ngayDaiTiec })
      .whereNot({ MaDatTiec: id })
      .first();
    if (existing) {
      return res
        .status(400)
        .json({ error: 'Sảnh và ca đã được đặt vào ngày này' });
    }

    // Kiểm tra dịch vụ
    if (dichVus && !Array.isArray(dichVus)) {
      return res.status(400).json({ error: 'Danh sách dịch vụ phải là mảng' });
    }
    if (dichVus && dichVus.length > 0) {
      for (const dichVu of dichVus) {
        if (
          !dichVu.maDichVu ||
          !Number.isInteger(dichVu.soLuong) ||
          dichVu.soLuong < 0 ||
          isNaN(dichVu.donGiaThoiDiemDat) ||
          dichVu.donGiaThoiDiemDat < 0
        ) {
          return res
            .status(400)
            .json({ error: 'Thông tin dịch vụ không hợp lệ' });
        }
      }
    }

    // Cập nhật đặt tiệc
    const datTiecData = {
      TenChuRe: tenChuRe,
      TenCoDau: tenCoDau,
      DienThoai: dienThoai,
      NgayDaiTiec: new Date(ngayDaiTiec),
      MaCa: maCa,
      MaSanh: maSanh,
      MaThucDon: maThucDon,
      SoLuongBan: Number(soLuongBan),
      SoBanDuTru: Number(soBanDuTru),
      TienDatCoc: Number(tienDatCoc),
    };

    const updatedDatTiec = await DatTiec.update(id, datTiecData);

    // Xóa và thêm lại dịch vụ
    if (dichVus && dichVus.length > 0) {
      await knex('DATTIEC_DICHVU').where({ MaDatTiec: id }).delete();
      const datTiecDichVuData = dichVus.map((dichVu) => ({
        MaDatTiec: id,
        MaDichVu: dichVu.maDichVu,
        SoLuong: Number(dichVu.soLuong),
        DonGiaThoiDiemDat: Number(dichVu.donGiaThoiDiemDat),
        ThanhTien: Number(dichVu.soLuong) * Number(dichVu.donGiaThoiDiemDat),
      }));
      await Promise.all(
        datTiecDichVuData.map((data) => DatTiecDichVu.create(data))
      );
    }

    // Trả về thông tin chi tiết
    const datTiecWithDetails = await findDatTiecById(id);
    return res.status(200).json(datTiecWithDetails);
  } catch (error) {
    console.error('Error updating dat tiec:', error.stack);
    return res
      .status(500)
      .json({ error: 'Lỗi khi cập nhật đặt tiệc: ' + error.message });
  }
};

// Xóa đặt tiệc
const deleteDatTiec = async (req, res) => {
  try {
    const { id } = req.params;
    const datTiec = await DatTiec.findById(id);
    if (!datTiec) {
      return res.status(404).json({ error: 'Đặt tiệc không tồn tại' });
    }

    // Xóa dịch vụ liên quan
    await knex('DATTIEC_DICHVU').where({ MaDatTiec: id }).delete();

    // Xóa đặt tiệc
    await DatTiec.delete(id);
    return res.status(200).json({ message: 'Xóa đặt tiệc thành công' });
  } catch (error) {
    console.error('Error deleting dat tiec:', error.stack);
    return res
      .status(500)
      .json({ error: 'Lỗi khi xóa đặt tiệc: ' + error.message });
  }
};

const cancelDatTiec = async (req, res) => {
  try {
    const { id } = req.params;
    const datTiec = await DatTiec.findById(id);
    if (!datTiec) {
      return res.status(404).json({ error: 'Đặt tiệc không tồn tại' });
    }

    // Kiểm tra nếu đã hủy
    if (datTiec.DaHuy) {
      return res.status(400).json({ error: 'Đặt tiệc đã được hủy trước đó' });
    }

    // Cập nhật trạng thái hủy
    await DatTiec.delete(id); // Tên hàm giữ nguyên, nhưng thực chất là update DaHuy
    return res.status(200).json({ message: 'Hủy đặt tiệc thành công' });
  } catch (error) {
    console.error('Error canceling dat tiec:', {
      message: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ error: 'Lỗi khi hủy đặt tiệc: ' + error.message });
  }
};

// Thêm món ăn vào thực đơn
const themMonAn = async (req, res) => {
  try {
    const { id } = req.params;
    const { maMonAn } = req.body;

    // Kiểm tra đặt tiệc tồn tại
    const datTiec = await DatTiec.findById(id);
    if (!datTiec) {
      return res.status(404).json({ error: 'Đặt tiệc không tồn tại' });
    }

    // Kiểm tra món ăn đã có trong thực đơn
    const existing = await knex('MONAN_THUCDON')
      .where({ MaThucDon: datTiec.MaThucDon, MaMonAn: maMonAn })
      .first();
    if (existing) {
      return res.status(400).json({ error: 'Món ăn đã có trong thực đơn' });
    }

    // Thêm món ăn
    await knex('MONAN_THUCDON').insert({
      MaThucDon: datTiec.MaThucDon,
      MaMonAn: maMonAn,
    });

    // Trả về thông tin chi tiết
    const datTiecWithDetails = await findDatTiecById(id);
    return res.status(200).json(datTiecWithDetails);
  } catch (error) {
    console.error('Error adding mon an:', error.stack);
    return res
      .status(500)
      .json({ error: 'Lỗi khi thêm món ăn: ' + error.message });
  }
};

// Xóa món ăn khỏi thực đơn
const xoaMonAn = async (req, res) => {
  try {
    const { id, maMonAn } = req.params;

    // Kiểm tra đặt tiệc tồn tại
    const datTiec = await DatTiec.findById(id);
    if (!datTiec) {
      return res.status(404).json({ error: 'Đặt tiệc không tồn tại' });
    }

    // Kiểm tra món ăn trong thực đơn
    const existing = await knex('MONAN_THUCDON')
      .where({ MaThucDon: datTiec.MaThucDon, MaMonAn: maMonAn })
      .first();
    if (!existing) {
      return res.status(400).json({ error: 'Món ăn không có trong thực đơn' });
    }

    // Xóa món ăn
    await knex('MONAN_THUCDON')
      .where({ MaThucDon: datTiec.MaThucDon, MaMonAn: maMonAn })
      .delete();

    // Trả về thông tin chi tiết
    const datTiecWithDetails = await findDatTiecById(id);
    return res.status(200).json(datTiecWithDetails);
  } catch (error) {
    console.error('Error deleting mon an:', error.stack);
    return res
      .status(500)
      .json({ error: 'Lỗi khi xóa món ăn: ' + error.message });
  }
};

// Thêm dịch vụ vào đặt tiệc
const themDichVu = async (req, res) => {
  try {
    const { id } = req.params;
    const { maDichVu, soLuong, donGiaThoiDiemDat } = req.body;

    // Kiểm tra đặt tiệc tồn tại
    const datTiec = await DatTiec.findById(id);
    if (!datTiec) {
      return res.status(404).json({ error: 'Đặt tiệc không tồn tại' });
    }

    // Kiểm tra số lượng và đơn giá
    if (
      !Number.isInteger(soLuong) ||
      soLuong < 0 ||
      isNaN(donGiaThoiDiemDat) ||
      donGiaThoiDiemDat < 0
    ) {
      return res
        .status(400)
        .json({ error: 'Số lượng hoặc đơn giá không hợp lệ' });
    }

    // Kiểm tra dịch vụ đã có
    const existing = await knex('DATTIEC_DICHVU')
      .where({ MaDatTiec: id, MaDichVu: maDichVu })
      .first();
    if (existing) {
      return res.status(400).json({ error: 'Dịch vụ đã có trong đặt tiệc' });
    }

    // Thêm dịch vụ
    const datTiecDichVuData = {
      MaDatTiec: id,
      MaDichVu: maDichVu,
      SoLuong: Number(soLuong),
      DonGiaThoiDiemDat: Number(donGiaThoiDiemDat),
      ThanhTien: Number(soLuong) * Number(donGiaThoiDiemDat),
    };
    await DatTiecDichVu.create(datTiecDichVuData);

    // Trả về thông tin chi tiết
    const datTiecWithDetails = await findDatTiecById(id);
    return res.status(200).json(datTiecWithDetails);
  } catch (error) {
    console.error('Error adding dich vu:', error.stack);
    return res
      .status(500)
      .json({ error: 'Lỗi khi thêm dịch vụ: ' + error.message });
  }
};

// Xóa dịch vụ khỏi đặt tiệc
const xoaDichVu = async (req, res) => {
  try {
    const { id, maDichVu } = req.params;

    // Kiểm tra đặt tiệc tồn tại
    const datTiec = await DatTiec.findById(id);
    if (!datTiec) {
      return res.status(404).json({ error: 'Đặt tiệc không tồn tại' });
    }

    // Kiểm tra dịch vụ trong đặt tiệc
    const existing = await knex('DATTIEC_DICHVU')
      .where({ MaDatTiec: id, MaDichVu: maDichVu })
      .first();
    if (!existing) {
      return res.status(400).json({ error: 'Dịch vụ không có trong đặt tiệc' });
    }

    // Xóa dịch vụ
    await DatTiecDichVu.delete(id, maDichVu);

    // Trả về thông tin chi tiết
    const datTiecWithDetails = await findDatTiecById(id);
    return res.status(200).json(datTiecWithDetails);
  } catch (error) {
    console.error('Error deleting dich vu:', error.stack);
    return res
      .status(500)
      .json({ error: 'Lỗi khi xóa dịch vụ: ' + error.message });
  }
};

export default {
  createDatTiec,
  getDatTiecById,
  getAllDatTiec,
  updateDatTiec,
  deleteDatTiec,
  themMonAn,
  xoaMonAn,
  themDichVu,
  xoaDichVu,
  cancelDatTiec,
};
