/* eslint-disable no-unused-vars */
import MonAn from '../models/MonAn.js';

const createMonAn = async (req, res) => {
  try {
    const { tenMonAn, maLoaiMonAn, donGia, ghiChu, anhURL } = req.body;
    const loaiMonAnExists = await MonAn.isLoaiMonAnExists(maLoaiMonAn);
    if (!loaiMonAnExists) {
      return res.status(400).json({ error: 'Loại món ăn không tồn tại' });
    }
    const monAn = await MonAn.create({
      TenMonAn: tenMonAn,
      MaLoaiMonAn: maLoaiMonAn,
      DonGia: donGia,
      GhiChu: ghiChu || null,
      AnhURL: anhURL || null,
    });
    const monAnWithDetails = await MonAn.findById(monAn.MaMonAn);
    return res.status(201).json(monAnWithDetails);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi tạo món ăn: ' + error.message });
  }
};

const getAllMonAn = async (req, res) => {
  try {
    const monAnList = await MonAn.findAll();
    return res.status(200).json(monAnList);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy danh sách món ăn: ' + error.message });
  }
};

const getMonAn = async (req, res) => {
  try {
    const { id } = req.params;
    const monAn = await MonAn.findById(id);
    if (!monAn) {
      return res.status(404).json({ error: 'Món ăn không tồn tại' });
    }
    return res.status(200).json(monAn);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy thông tin món ăn: ' + error.message });
  }
};

const updateMonAn = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenMonAn, maLoaiMonAn, donGia, ghiChu } = req.body;
    const monAn = await MonAn.findById(id);
    if (!monAn) {
      return res.status(404).json({ error: 'Món ăn không tồn tại' });
    }
    const loaiMonAnExists = await MonAn.isLoaiMonAnExists(maLoaiMonAn);
    if (!loaiMonAnExists) {
      return res.status(400).json({ error: 'Loại món ăn không tồn tại' });
    }
    const updatedMonAn = await MonAn.update(id, {
      TenMonAn: tenMonAn,
      MaLoaiMonAn: maLoaiMonAn,
      DonGia: donGia,
      GhiChu: ghiChu || null,
    });
    const monAnWithDetails = await MonAn.findById(id);
    return res.status(200).json(monAnWithDetails);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi cập nhật món ăn: ' + error.message });
  }
};

const deleteMonAn = async (req, res) => {
  try {
    const { id } = req.params;
    const monAn = await MonAn.findById(id);
    if (!monAn) {
      return res.status(404).json({ error: 'Món ăn không tồn tại' });
    }
    const isUsed = await MonAn.isUsedByThucDon(id);
    if (isUsed) {
      return res.status(400).json({
        error: 'Không thể xóa món ăn đang được sử dụng trong một thực đơn',
      });
    }
    await MonAn.temDelete(id);
    return res.status(200).json({ message: 'Xóa món ăn thành công' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi xóa món ăn: ' + error.message });
  }
};

export default {
  createMonAn,
  getAllMonAn,
  getMonAn,
  updateMonAn,
  deleteMonAn,
};
