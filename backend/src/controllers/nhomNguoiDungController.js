import NhomNguoiDung from '../models/NhomNguoiDung.js';
import { knex } from '../config/database.js';

const createNhomNguoiDung = async (req, res) => {
  try {
    const { tenNhom } = req.body;
    const existingNhom = await knex('NHOMNGUOIDUNG').where({ TenNhom: tenNhom }).first();
    if (existingNhom) {
      return res.status(400).json({ error: 'Tên nhóm đã tồn tại' });
    }
    const nhom = await NhomNguoiDung.create({ TenNhom: tenNhom });
    res.status(201).json(nhom);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi tạo nhóm người dùng: ' + error.message });
  }
};

const getAllNhomNguoiDung = async (req, res) => {
  try {
    const nhomList = await NhomNguoiDung.findAll();
    res.status(200).json(nhomList);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách nhóm người dùng: ' + error.message });
  }
};

const getNhomNguoiDung = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const nhom = await NhomNguoiDung.findById(id);
    if (!nhom) {
      return res.status(404).json({ error: 'Nhóm người dùng không tồn tại' });
    }
    res.status(200).json(nhom);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy thông tin nhóm người dùng: ' + error.message });
  }
};

const updateNhomNguoiDung = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { tenNhom } = req.body;
    const nhom = await NhomNguoiDung.findById(id);
    if (!nhom) {
      return res.status(404).json({ error: 'Nhóm người dùng không tồn tại' });
    }
    if (tenNhom) {
      const existingNhom = await knex('NHOMNGUOIDUNG')
        .where({ TenNhom: tenNhom })
        .whereNot({ MaNhom: id })
        .first();
      if (existingNhom) {
        return res.status(400).json({ error: 'Tên nhóm đã tồn tại' });
      }
    }
    const updatedNhom = await NhomNguoiDung.update(id, { TenNhom: tenNhom });
    res.status(200).json(updatedNhom);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi cập nhật nhóm người dùng: ' + error.message });
  }
};

const deleteNhomNguoiDung = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const nhom = await NhomNguoiDung.findById(id);
    if (!nhom) {
      return res.status(404).json({ error: 'Nhóm người dùng không tồn tại' });
    }
    // Kiểm tra ràng buộc khóa ngoại
    const nguoiDungCount = await knex('NGUOIDUNG').where({ MaNhom: id }).count('MaNguoiDung as count').first();
    const phanQuyenCount = await knex('PHANQUYEN').where({ MaNhom: id }).count('MaNhom as count').first();
    if (parseInt(nguoiDungCount.count) > 0 || parseInt(phanQuyenCount.count) > 0) {
      return res.status(400).json({ error: 'Không thể xóa nhóm vì đang được sử dụng trong NGUOIDUNG hoặc PHANQUYEN' });
    }
    await NhomNguoiDung.delete(id);
    res.status(200).json({ message: 'Xóa nhóm người dùng thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xóa nhóm người dùng: ' + error.message });
  }
};

export default {
  createNhomNguoiDung,
  getAllNhomNguoiDung,
  getNhomNguoiDung,
  updateNhomNguoiDung,
  deleteNhomNguoiDung,
};