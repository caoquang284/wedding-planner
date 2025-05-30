/* eslint-disable no-unused-vars */
import ThucDon from '../models/ThucDon.js';

const createThucDon = async (req, res) => {
  try {
    const { tenThucDon, donGiaThoiDiemDat, donGiaHienTai, ghiChu } = req.body;

    const thucDon = await ThucDon.create({
      TenThucDon: tenThucDon,
      DonGiaThoiDiemDat: donGiaThoiDiemDat,
      DonGiaHienTai: donGiaHienTai,
      GhiChu: ghiChu || null,
    });

    return res.status(201).json(thucDon);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi tạo thực đơn: ' + error.message });
  }
};

const getAllThucDon = async (req, res) => {
  try {
    const thucDonList = await ThucDon.findAllWithMonAnNames();
    return res.status(200).json(thucDonList);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy danh sách thực đơn: ' + error.message });
  }
};

const getThucDon = async (req, res) => {
  try {
    const { id } = req.params;
    const thucDon = await ThucDon.findByIdWithMonAn(id);

    if (!thucDon) {
      return res.status(404).json({ error: 'Thực đơn không tồn tại' });
    }

    // Tính tổng tiền của thực đơn
    const tongTien = await ThucDon.calculateTotalPrice(id);
    thucDon.TongTien = tongTien;

    return res.status(200).json(thucDon);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy thông tin thực đơn: ' + error.message });
  }
};

const updateThucDon = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenThucDon, donGiaThoiDiemDat, donGiaHienTai, ghiChu, coverImg } =
      req.body;

    const thucDon = await ThucDon.findById(id);
    if (!thucDon) {
      return res.status(404).json({ error: 'Thực đơn không tồn tại' });
    }

    const updatedThucDon = await ThucDon.update(id, {
      TenThucDon: tenThucDon,
      DonGiaThoiDiemDat: donGiaThoiDiemDat,
      DonGiaHienTai: donGiaHienTai,
      GhiChu: ghiChu || null,
      Cover_Img: coverImg || null,
    });

    return res.status(200).json(updatedThucDon);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi cập nhật thực đơn: ' + error.message });
  }
};

const deleteThucDon = async (req, res) => {
  try {
    const { id } = req.params;
    const thucDon = await ThucDon.findById(id);

    if (!thucDon) {
      return res.status(404).json({ error: 'Thực đơn không tồn tại' });
    }

    const isUsed = await ThucDon.isUsedByDatTiec(id);
    if (isUsed) {
      return res.status(400).json({
        error: 'Không thể xóa thực đơn đang được sử dụng trong một đặt tiệc',
      });
    }

    await ThucDon.delete(id);
    return res.status(200).json({ message: 'Xóa thực đơn thành công' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi xóa thực đơn: ' + error.message });
  }
};

// Thêm món ăn vào thực đơn
const addMonAnToThucDon = async (req, res) => {
  try {
    const { id } = req.params;
    const { maMonAn, donGiaThoiDiemDat } = req.body;

    // Kiểm tra thực đơn tồn tại
    const thucDon = await ThucDon.findById(id);
    if (!thucDon) {
      return res.status(404).json({ error: 'Thực đơn không tồn tại' });
    }

    // Kiểm tra món ăn tồn tại
    const monAnExists = await ThucDon.isMonAnExists(maMonAn);
    if (!monAnExists) {
      return res.status(400).json({ error: 'Món ăn không tồn tại' });
    }

    // Kiểm tra món ăn đã có trong thực đơn chưa
    const isAlreadyInThucDon = await ThucDon.isMonAnInThucDon(id, maMonAn);
    if (isAlreadyInThucDon) {
      return res.status(400).json({ error: 'Món ăn đã có trong thực đơn' });
    }

    const thucDonMonAn = await ThucDon.addMonAn(id, maMonAn, donGiaThoiDiemDat);
    return res.status(201).json({
      message: 'Thêm món ăn vào thực đơn thành công',
      data: thucDonMonAn,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi thêm món ăn vào thực đơn: ' + error.message });
  }
};

// Xóa món ăn khỏi thực đơn
const removeMonAnFromThucDon = async (req, res) => {
  try {
    const { id, maMonAn } = req.params;

    // Kiểm tra thực đơn tồn tại
    const thucDon = await ThucDon.findById(id);
    if (!thucDon) {
      return res.status(404).json({ error: 'Thực đơn không tồn tại' });
    }

    // Kiểm tra món ăn có trong thực đơn không
    const isInThucDon = await ThucDon.isMonAnInThucDon(id, maMonAn);
    if (!isInThucDon) {
      return res.status(404).json({ error: 'Món ăn không có trong thực đơn' });
    }

    await ThucDon.removeMonAn(id, maMonAn);
    return res
      .status(200)
      .json({ message: 'Xóa món ăn khỏi thực đơn thành công' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi xóa món ăn khỏi thực đơn: ' + error.message });
  }
};

// Cập nhật giá món ăn trong thực đơn
const updateMonAnInThucDon = async (req, res) => {
  try {
    const { id, maMonAn } = req.params;
    const { donGiaThoiDiemDat } = req.body;

    // Kiểm tra thực đơn tồn tại
    const thucDon = await ThucDon.findById(id);
    if (!thucDon) {
      return res.status(404).json({ error: 'Thực đơn không tồn tại' });
    }

    // Kiểm tra món ăn có trong thực đơn không
    const isInThucDon = await ThucDon.isMonAnInThucDon(id, maMonAn);
    if (!isInThucDon) {
      return res.status(404).json({ error: 'Món ăn không có trong thực đơn' });
    }

    const updatedThucDonMonAn = await ThucDon.updateMonAn(
      id,
      maMonAn,
      donGiaThoiDiemDat
    );
    return res.status(200).json({
      message: 'Cập nhật giá món ăn trong thực đơn thành công',
      data: updatedThucDonMonAn,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Lỗi khi cập nhật món ăn trong thực đơn: ' + error.message,
    });
  }
};

export default {
  createThucDon,
  getAllThucDon,
  getThucDon,
  updateThucDon,
  deleteThucDon,
  addMonAnToThucDon,
  removeMonAnFromThucDon,
  updateMonAnInThucDon,
};
