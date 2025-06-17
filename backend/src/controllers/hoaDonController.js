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
// Lấy hóa đơn theo mã đặt tiệc
const getHoaDonByMaDatTiec = async (req, res) => {
  try {
    const { maDatTiec } = req.params;
    console.log('getHoaDonByMaDatTiecController - MaDatTiec:', maDatTiec);

    // Chuyển maDatTiec thành số nguyên
    const parsedMaDatTiec = parseInt(maDatTiec, 10);
    if (isNaN(parsedMaDatTiec)) {
      return res
        .status(400)
        .json({ error: 'Mã đặt tiệc không hợp lệ, phải là số' });
    }

    // Gọi hàm từ model
    const hoaDons = await HoaDon.findByMaDatTiec(parsedMaDatTiec);
    return res.status(200).json({ data: hoaDons });
  } catch (error) {
    console.error('getHoaDonByMaDatTiecController - Error:', {
      message: error.message,
      stack: error.stack,
    });
    if (error.message.includes('Mã đặt tiệc không tồn tại')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Lỗi server: ' + error.message });
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

const deleteHoaDon = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('deleteHoaDonController - ID:', id);

    // Chuyển id thành số nguyên
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res
        .status(400)
        .json({ error: 'ID hóa đơn không hợp lệ, phải là số' });
    }

    // Gọi hàm delete từ model
    const deleted = await HoaDon.delete(parsedId);
    if (deleted) {
      return res.status(200).json({ message: 'Xóa hóa đơn thành công' });
    } else {
      return res.status(404).json({ error: 'Hóa đơn không tồn tại' });
    }
  } catch (error) {
    console.error('deleteHoaDonController - Error:', {
      message: error.message,
      stack: error.stack,
    });
    // Xử lý các lỗi cụ thể
    if (error.message.includes('Hóa đơn không tồn tại')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('đặt tiệc liên quan')) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Lỗi server: ' + error.message });
  }
};

export default {
  createHoaDon,
  getAllHoaDon,
  getHoaDon,
  updateHoaDon,
  deleteHoaDon,
  getHoaDonByMaDatTiec,
};