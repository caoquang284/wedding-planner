import LoaiDichVu from '../models/LoaiDichVu.js';

const createLoaiDichVu = async (req, res) => {
  try {
    const { tenLoaiDichVu } = req.body;
    const loaiDichVu = await LoaiDichVu.create({
      TenLoaiDichVu: tenLoaiDichVu,
    });
    return res.status(201).json(loaiDichVu);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi tạo loại dịch vụ: ' + error.message });
  }
};

const getAllLoaiDichVu = async (req, res) => {
  try {
    const loaiDichVuList = await LoaiDichVu.findAll();
    return res.status(200).json(loaiDichVuList);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy danh sách loại dịch vụ: ' + error.message });
  }
};

const getLoaiDichVu = async (req, res) => {
  try {
    const { id } = req.params;
    const loaiDichVu = await LoaiDichVu.findById(id);
    if (!loaiDichVu) {
      return res.status(404).json({ error: 'Loại dịch vụ không tồn tại' });
    }
    return res.status(200).json(loaiDichVu);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy thông tin loại dịch vụ: ' + error.message });
  }
};

const updateLoaiDichVu = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenLoaiDichVu } = req.body;
    const loaiDichVu = await LoaiDichVu.findById(id);
    if (!loaiDichVu) {
      return res.status(404).json({ error: 'Loại dịch vụ không tồn tại' });
    }
    const updatedLoaiDichVu = await LoaiDichVu.update(id, {
      TenLoaiDichVu: tenLoaiDichVu,
    });
    return res.status(200).json(updatedLoaiDichVu);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi cập nhật loại dịch vụ: ' + error.message });
  }
};

const deleteLoaiDichVu = async (req, res) => {
  try {
    const { id } = req.params;
    const loaiDichVu = await LoaiDichVu.findById(id);
    if (!loaiDichVu) {
      return res.status(404).json({ error: 'Loại dịch vụ không tồn tại' });
    }
    const isUsed = await LoaiDichVu.isUsedByDichVu(id);
    if (isUsed) {
      return res
        .status(400)
        .json({
          error: 'Không thể xóa loại dịch vụ đang được sử dụng bởi một dịch vụ',
        });
    }
    await LoaiDichVu.delete(id);
    return res.status(200).json({ message: 'Xóa loại dịch vụ thành công' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi xóa loại dịch vụ: ' + error.message });
  }
};

export default {
  createLoaiDichVu,
  getAllLoaiDichVu,
  getLoaiDichVu,
  updateLoaiDichVu,
  deleteLoaiDichVu,
};
