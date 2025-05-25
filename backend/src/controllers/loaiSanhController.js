import LoaiSanh from '../models/LoaiSanh.js';
import { knex } from '../config/database.js';

const createLoaiSanh = async (req, res) => {
  try {
    const { tenLoaiSanh, donGiaBanToiThieu } = req.body;
    // Kiểm tra trùng TenLoaiSanh
    const existingLoaiSanh = await LoaiSanh.findByTenLoaiSanh(tenLoaiSanh);
    if (existingLoaiSanh) {
      return res.status(400).json({ error: 'Tên loại sảnh đã tồn tại' });
    }
    const loaiSanh = await LoaiSanh.create({
      TenLoaiSanh: tenLoaiSanh,
      DonGiaBanToiThieu: donGiaBanToiThieu,
    });
    return res.status(201).json(loaiSanh);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi tạo loại sảnh: ' + error.message });
  }
};

const getAllLoaiSanh = async (req, res) => {
  try {
    const loaiSanhs = await LoaiSanh.findAll();
    return res.status(200).json(loaiSanhs);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy danh sách loại sảnh: ' + error.message });
  }
};

const getLoaiSanh = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const loaiSanh = await LoaiSanh.findById(id);
    if (!loaiSanh) {
      return res.status(404).json({ error: 'Loại sảnh không tồn tại' });
    }
    return res.status(200).json(loaiSanh);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy thông tin loại sảnh: ' + error.message });
  }
};

const updateLoaiSanh = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { tenLoaiSanh, donGiaBanToiThieu } = req.body;
    const loaiSanh = await LoaiSanh.findById(id);
    if (!loaiSanh) {
      return res.status(404).json({ error: 'Loại sảnh không tồn tại' });
    }
    // Kiểm tra trùng TenLoaiSanh (trừ bản ghi hiện tại)
    if (tenLoaiSanh) {
      const existingLoaiSanh = await knex('LOAISANH')
        .where({ TenLoaiSanh: tenLoaiSanh })
        .whereNot({ MaLoaiSanh: id })
        .first();
      if (existingLoaiSanh) {
        return res.status(400).json({ error: 'Tên loại sảnh đã tồn tại' });
      }
    }
    const updatedLoaiSanh = await LoaiSanh.update(id, {
      TenLoaiSanh: tenLoaiSanh || loaiSanh.TenLoaiSanh,
      DonGiaBanToiThieu:
        donGiaBanToiThieu !== undefined
          ? donGiaBanToiThieu
          : loaiSanh.DonGiaBanToiThieu,
    });
    return res.status(200).json(updatedLoaiSanh);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi cập nhật loại sảnh: ' + error.message });
  }
};

const deleteLoaiSanh = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const loaiSanh = await LoaiSanh.findById(id);
    if (!loaiSanh) {
      return res.status(404).json({ error: 'Loại sảnh không tồn tại' });
    }
    // Kiểm tra ràng buộc khóa ngoại
    const sanhCount = await knex('SANH')
      .where({ MaLoaiSanh: id })
      .count('MaSanh as count')
      .first();
    if (parseInt(sanhCount.count) > 0) {
      return res
        .status(400)
        .json({ error: 'Loại sảnh đang được sử dụng, không thể xóa' });
    }
    await LoaiSanh.delete(id);
    return res.status(200).json({ message: 'Xóa loại sảnh thành công' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi xóa loại sảnh: ' + error.message });
  }
};

export default {
  createLoaiSanh,
  getAllLoaiSanh,
  getLoaiSanh,
  updateLoaiSanh,
  deleteLoaiSanh,
};
