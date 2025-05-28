import LoaiMonAn from '../models/LoaiMonAn.js';

const createLoaiMonAn = async (req, res) => {
  try {
    const { tenLoaiMonAn } = req.body;
    const loaiMonAn = await LoaiMonAn.create({
      TenLoaiMonAn: tenLoaiMonAn,
    });
    return res.status(201).json(loaiMonAn);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi tạo loại món ăn: ' + error.message });
  }
};

const getAllLoaiMonAn = async (req, res) => {
  try {
    const loaiMonAnList = await LoaiMonAn.findAll();
    return res.status(200).json(loaiMonAnList);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy danh sách loại món ăn: ' + error.message });
  }
};

const getLoaiMonAn = async (req, res) => {
  try {
    const { id } = req.params;
    const loaiMonAn = await LoaiMonAn.findById(id);
    if (!loaiMonAn) {
      return res.status(404).json({ error: 'Loại món ăn không tồn tại' });
    }
    return res.status(200).json(loaiMonAn);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy thông tin loại món ăn: ' + error.message });
  }
};

const updateLoaiMonAn = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenLoaiMonAn } = req.body;
    const loaiMonAn = await LoaiMonAn.findById(id);
    if (!loaiMonAn) {
      return res.status(404).json({ error: 'Loại món ăn không tồn tại' });
    }
    const updatedLoaiMonAn = await LoaiMonAn.update(id, {
      TenLoaiMonAn: tenLoaiMonAn,
    });
    return res.status(200).json(updatedLoaiMonAn);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi cập nhật loại món ăn: ' + error.message });
  }
};

const deleteLoaiMonAn = async (req, res) => {
  try {
    const { id } = req.params;
    const loaiMonAn = await LoaiMonAn.findById(id);
    if (!loaiMonAn) {
      return res.status(404).json({ error: 'Loại món ăn không tồn tại' });
    }
    const isUsed = await LoaiMonAn.isUsedByMonAn(id);
    if (isUsed) {
      return res.status(400).json({
        error: 'Không thể xóa loại món ăn đang được sử dụng bởi một món ăn',
      });
    }
    await LoaiMonAn.delete(id);
    return res.status(200).json({ message: 'Xóa loại món ăn thành công' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi xóa loại món ăn: ' + error.message });
  }
};

export default {
  createLoaiMonAn,
  getAllLoaiMonAn,
  getLoaiMonAn,
  updateLoaiMonAn,
  deleteLoaiMonAn,
};
