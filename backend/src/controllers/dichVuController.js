/* eslint-disable no-unused-vars */
import DichVu from '../models/DichVu.js';
import DatTiecDichVu from '../models/DatTiecDichVu.js';
const createDichVu = async (req, res) => {
  try {
    const { tenDichVu, maLoaiDichVu, donGia, ghiChu, anhURL } = req.body;
    const loaiDichVuExists = await DichVu.isLoaiDichVuExists(maLoaiDichVu);
    if (!loaiDichVuExists) {
      return res.status(400).json({ error: 'Loại dịch vụ không tồn tại' });
    }
    const dichVu = await DichVu.create({
      TenDichVu: tenDichVu,
      MaLoaiDichVu: maLoaiDichVu,
      DonGia: donGia,
      GhiChu: ghiChu || null,
      AnhURL: anhURL || null,
    });
    const dichVuWithDetails = await DichVu.findById(dichVu.MaDichVu);
    return res.status(201).json(dichVuWithDetails);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi tạo dịch vụ: ' + error.message });
  }
};

const getAllDichVu = async (req, res) => {
  try {
    const dichVuList = await DichVu.findAll();
    return res.status(200).json(dichVuList);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy danh sách dịch vụ: ' + error.message });
  }
};

const getDichVu = async (req, res) => {
  try {
    const { id } = req.params;
    const dichVu = await DichVu.findById(id);
    if (!dichVu) {
      return res.status(404).json({ error: 'Dịch vụ không tồn tại' });
    }
    return res.status(200).json(dichVu);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy thông tin dịch vụ: ' + error.message });
  }
};

const updateDichVu = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenDichVu, maLoaiDichVu, donGia, ghiChu, anhURL } = req.body;
    const dichVu = await DichVu.findById(id);
    if (!dichVu) {
      return res.status(404).json({ error: 'Dịch vụ không tồn tại' });
    }
    const loaiDichVuExists = await DichVu.isLoaiDichVuExists(maLoaiDichVu);
    if (!loaiDichVuExists) {
      return res.status(400).json({ error: 'Loại dịch vụ không tồn tại' });
    }
    const updatedDichVu = await DichVu.update(id, {
      TenDichVu: tenDichVu,
      MaLoaiDichVu: maLoaiDichVu,
      DonGia: donGia,
      GhiChu: ghiChu || null,
      AnhURL: anhURL || null,
    });
    const dichVuWithDetails = await DichVu.findById(id);
    return res.status(200).json(dichVuWithDetails);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi cập nhật dịch vụ: ' + error.message });
  }
};

const deleteDichVu = async (req, res) => {
  try {
    const { id } = req.params;
    const dichVu = await DichVu.findById(id);
    if (!dichVu) {
      return res.status(404).json({ error: 'Dịch vụ không tồn tại' });
    }
    const isUsed = await DichVu.isUsedByDatTiec(id);
    if (isUsed) {
      return res.status(400).json({
        error: 'Không thể xóa dịch vụ đang được sử dụng trong một đặt tiệc',
      });
    }
    await DichVu.temDelete(id);
    return res.status(200).json({ message: 'Xóa dịch vụ thành công' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi xóa dịch vụ: ' + error.message });
  }
};
const getDichVuByMaDatTiec = async (req, res) => {
  try {
    const { maDatTiec } = req.params;
    const dichVu = await DatTiecDichVu.getByMaDatTiec(maDatTiec);
    return res.status(200).json(dichVu);
  } catch (error) {
    return res.status(500).json({
      error: 'Lỗi khi lấy dịch vụ theo mã đặt tiệc: ' + error.message,
    });
  }
};

export default {
  createDichVu,
  getAllDichVu,
  getDichVu,
  updateDichVu,
  deleteDichVu,
  getDichVuByMaDatTiec,
};
