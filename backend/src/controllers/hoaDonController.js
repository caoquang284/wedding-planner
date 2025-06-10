import HoaDon from '../models/HoaDon.js';

// Thêm hóa đơn mới
const createHoaDon = async (req, res) => {
  try {
    const {
      MaDatTiec,
      NgayThanhToan,
      TongTienBan,
      TongTienDichVu,
      TongTienHoaDon,
      ApDungQuyDinhPhat,
      PhanTramPhatMotNgay,
      TongTienPhat,
      TongTienConLai,
      TrangThai,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (
      !MaDatTiec ||
      !NgayThanhToan ||
      TongTienBan === undefined ||
      TongTienDichVu === undefined ||
      TongTienHoaDon === undefined ||
      ApDungQuyDinhPhat === undefined ||
      PhanTramPhatMotNgay === undefined ||
      TongTienPhat === undefined ||
      TongTienConLai === undefined ||
      TrangThai === undefined
    ) {
      return res.status(400).json({ error: 'Thiếu các trường bắt buộc' });
    }

    const hoaDonData = {
      MaDatTiec,
      NgayThanhToan,
      TongTienBan,
      TongTienDichVu,
      TongTienHoaDon,
      ApDungQuyDinhPhat,
      PhanTramPhatMotNgay,
      TongTienPhat,
      TongTienConLai,
      TrangThai,
    };

    const newHoaDon = await HoaDon.create(hoaDonData);
    return res
      .status(201)
      .json({ message: 'Tạo hóa đơn thành công', data: newHoaDon });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Lấy danh sách tất cả hóa đơn
const getAllHoaDon = async (req, res) => {
  try {
    const hoaDons = await HoaDon.findAll();
    return res.status(200).json({ data: hoaDons });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Lấy hóa đơn theo ID
const getHoaDon = async (req, res) => {
  try {
    const { id } = req.params;
    const hoaDon = await HoaDon.findById(id);
    return res.status(200).json({ data: hoaDon });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// Sửa hóa đơn
const updateHoaDon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      MaDatTiec,
      NgayThanhToan,
      TongTienBan,
      TongTienDichVu,
      TongTienHoaDon,
      ApDungQuyDinhPhat,
      PhanTramPhatMotNgay,
      TongTienPhat,
      TongTienConLai,
      TrangThai,
    } = req.body;

    const updateData = {};
    if (MaDatTiec !== undefined) updateData.MaDatTiec = MaDatTiec;
    if (NgayThanhToan !== undefined) updateData.NgayThanhToan = NgayThanhToan;
    if (TongTienBan !== undefined) updateData.TongTienBan = TongTienBan;
    if (TongTienDichVu !== undefined)
      updateData.TongTienDichVu = TongTienDichVu;
    if (TongTienHoaDon !== undefined)
      updateData.TongTienHoaDon = TongTienHoaDon;
    if (ApDungQuyDinhPhat !== undefined)
      updateData.ApDungQuyDinhPhat = ApDungQuyDinhPhat;
    if (PhanTramPhatMotNgay !== undefined)
      updateData.PhanTramPhatMotNgay = PhanTramPhatMotNgay;
    if (TongTienPhat !== undefined) updateData.TongTienPhat = TongTienPhat;
    if (TongTienConLai !== undefined)
      updateData.TongTienConLai = TongTienConLai;
    if (TrangThai !== undefined) updateData.TrangThai = TrangThai;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Không có dữ liệu để cập nhật' });
    }

    const updatedHoaDon = await HoaDon.update(id, updateData);
    return res
      .status(200)
      .json({ message: 'Cập nhật hóa đơn thành công', data: updatedHoaDon });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Xóa hóa đơn
const deleteHoaDon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HoaDon.delete(id);
    if (deleted) {
      return res.status(200).json({ message: 'Xóa hóa đơn thành công' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export default {
  createHoaDon,
  getAllHoaDon,
  getHoaDon,
  updateHoaDon,
  deleteHoaDon,
};
