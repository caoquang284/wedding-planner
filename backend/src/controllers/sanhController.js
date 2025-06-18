import Sanh from '../models/Sanh.js';
import { knex } from '../config/database.js';

const createSanh = async (req, res) => {
  try {
    const { tenSanh, maLoaiSanh, soLuongBanToiDa, ghiChu, anhURL } = req.body;
    // Kiểm tra MaLoaiSanh tồn tại
    const loaiSanh = await knex('LOAISANH')
      .where({ MaLoaiSanh: maLoaiSanh })
      .first();
    if (!loaiSanh) {
      return res.status(400).json({ error: 'Mã loại sảnh không tồn tại' });
    }
    // Kiểm tra trùng TenSanh
    const existingSanh = await Sanh.findByTenSanh(tenSanh);
    if (existingSanh) {
      return res.status(400).json({ error: 'Tên sảnh đã tồn tại' });
    }
    const sanh = await Sanh.create({
      TenSanh: tenSanh,
      MaLoaiSanh: maLoaiSanh,
      SoLuongBanToiDa: soLuongBanToiDa,
      GhiChu: ghiChu,
      AnhURL: anhURL,
    });
    return res.status(201).json(sanh);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi tạo sảnh: ' + error.message });
  }
};

const getAllSanh = async (req, res) => {
  try {
    const sanhs = await Sanh.findAll();
    return res.status(200).json(sanhs);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy danh sách sảnh: ' + error.message });
  }
};

const getSanh = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sanh = await Sanh.findById(id);
    if (!sanh) {
      return res.status(404).json({ error: 'Sảnh không tồn tại' });
    }
    return res.status(200).json(sanh);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy thông tin sảnh: ' + error.message });
  }
};

const updateSanh = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { tenSanh, maLoaiSanh, soLuongBanToiDa, ghiChu, anhURL } = req.body;
    const sanh = await Sanh.findById(id);
    if (!sanh) {
      return res.status(404).json({ error: 'Sảnh không tồn tại' });
    }
    // Kiểm tra MaLoaiSanh tồn tại nếu được cung cấp
    if (maLoaiSanh) {
      const loaiSanh = await knex('LOAISANH')
        .where({ MaLoaiSanh: maLoaiSanh })
        .first();
      if (!loaiSanh) {
        return res.status(400).json({ error: 'Mã loại sảnh không tồn tại' });
      }
    }
    // Kiểm tra trùng TenSanh (trừ bản ghi hiện tại)
    if (tenSanh) {
      const existingSanh = await knex('SANH')
        .where({ TenSanh: tenSanh })
        .whereNot({ MaSanh: id })
        .first();
      if (existingSanh) {
        return res.status(400).json({ error: 'Tên sảnh đã tồn tại' });
      }
    }
    const daDuocDatTiec = await Sanh.checkDaDuocDatTiec(id);
    if (daDuocDatTiec) {
      return res
        .status(400)
        .json({ error: 'Sảnh đã được đặt tiệc, không thể cập nhật' });
    }
    const updatedSanh = await Sanh.update(id, {
      TenSanh: tenSanh || sanh.TenSanh,
      MaLoaiSanh: maLoaiSanh || sanh.MaLoaiSanh,
      SoLuongBanToiDa:
        soLuongBanToiDa !== undefined ? soLuongBanToiDa : sanh.SoLuongBanToiDa,
      GhiChu: ghiChu !== undefined ? ghiChu : sanh.GhiChu,
      AnhURL: anhURL !== undefined ? anhURL : sanh.AnhURL,
    });
    return res.status(200).json(updatedSanh);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi cập nhật sảnh: ' + error.message });
  }
};

const deleteSanh = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sanh = await Sanh.findById(id);
    if (!sanh) {
      return res.status(404).json({ error: 'Sảnh không tồn tại' });
    }
    // Kiểm tra ràng buộc khóa ngoại
    const datTiecCount = await knex('DATTIEC')
      .where({ MaSanh: id })
      .count('MaDatTiec as count')
      .first();
    if (parseInt(datTiecCount.count) > 0) {
      return res.status(400).json({
        error: 'Sảnh đang được sử dụng trong đặt tiệc, không thể xóa',
      });
    }
    await Sanh.temDelete(id);
    return res.status(200).json({ message: 'Xóa sảnh thành công' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi xóa sảnh: ' + error.message });
  }
};

const getDonGiaBanToiThieuTuMaSanh = async (req, res) => {
  try {
    const maSanh = parseInt(req.params.maSanh);
    const donGiaBanToiThieu = await Sanh.getDonGiaBanToiThieuTuMaSanh(maSanh);
    console.log(donGiaBanToiThieu);
    return res.status(200).json(donGiaBanToiThieu);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy đơn giá bàn tối thiểu: ' + error.message });
  }
};

export default {
  createSanh,
  getAllSanh,
  getSanh,
  updateSanh,
  deleteSanh,
  getDonGiaBanToiThieuTuMaSanh,
};
