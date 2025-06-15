import NguoiDung from '../models/NguoiDung.js';
import PhanQuyen from '../models/PhanQuyen.js';
import ChucNang from '../models/ChucNang.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import process from 'node:process';
import { knex } from '../config/database.js';

const createNguoiDung = async (req, res) => {
  try {
    const { tenDangNhap, matKhau, tenNguoiDung, maNhom } = req.body;
    const existingUser = await NguoiDung.findByTenDangNhap(tenDangNhap);
    if (existingUser) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
    }
    const nhomExists = await knex('NHOMNGUOIDUNG').where({ MaNhom: maNhom }).first();
    if (!nhomExists) {
      return res.status(400).json({ error: 'Mã nhóm không tồn tại' });
    }
    const hashedPassword = await bcrypt.hash(matKhau, 10);
    const nguoiDung = await NguoiDung.create({
      TenDangNhap: tenDangNhap,
      MatKhau: hashedPassword,
      TenNguoiDung: tenNguoiDung,
      MaNhom: maNhom,
    });
    res.status(201).json(nguoiDung);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi tạo người dùng: ' + error.message });
  }
};

const login = async (req, res) => {
  try {
    const { tenDangNhap, matKhau } = req.body;
    if (!tenDangNhap || !matKhau) {
      return res.status(400).json({ error: 'Tên đăng nhập và mật khẩu không được để trống' });
    }

    const nguoiDung = await NguoiDung.findByTenDangNhap(tenDangNhap);
    if (!nguoiDung) {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(matKhau, nguoiDung.MatKhau);
    if (!isMatch) {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const tokens = await NguoiDung.generateToken(nguoiDung);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi đăng nhập: ' + error.message });
  }
};

const getNguoiDung = async (req, res) => {
  try {
    const nguoiDung = await NguoiDung.findById(req.user.id);
    if (!nguoiDung) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }
    res.status(200).json(nguoiDung);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy thông tin người dùng: ' + error.message });
  }
};

const getAllNguoiDung = async (req, res) => {
  try {
    const nguoiDungList = await NguoiDung.findAll();
    res.status(200).json(nguoiDungList);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng: ' + error.message });
  }
};

const updateNguoiDung = async (req, res) => {
  try {
    const { tenNguoiDung, maNhom } = req.body;
    const nguoiDung = await NguoiDung.findById(req.user.id);
    if (!nguoiDung) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }
    const updatedData = {};
    if (tenNguoiDung) updatedData.TenNguoiDung = tenNguoiDung;
    if (maNhom) {
      const nhomExists = await knex('NHOMNGUOIDUNG').where({ MaNhom: maNhom }).first();
      if (!nhomExists) {
        return res.status(400).json({ error: 'Mã nhóm không tồn tại' });
      }
      updatedData.MaNhom = maNhom;
    }
    const updatedNguoiDung = await NguoiDung.update(req.user.id, updatedData);
    res.status(200).json(updatedNguoiDung);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi cập nhật người dùng: ' + error.message });
  }
};

const deleteNguoiDung = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (id === req.user.id) {
      return res.status(403).json({ error: 'Không thể xóa chính tài khoản đang đăng nhập' });
    }
    const result = await NguoiDung.delete(id);
    if (result === 0) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }
    res.status(200).json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xóa người dùng: ' + error.message });
  }
};

const getChucNang = async (req, res) => {
  try {
    const maNhom = req.user.maNhom;
    const phanQuyenList = await PhanQuyen.findByNhom(maNhom);
    const chucNangIds = phanQuyenList.map((pq) => pq.MaChucNang);
    const chucNangList = await ChucNang.findAll();
    const permittedChucNang = chucNangList.filter((cn) =>
      chucNangIds.includes(cn.MaChucNang)
    );
    res.status(200).json(permittedChucNang);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách chức năng: ' + error.message });
  }
};

const getAllChucNang = async (req, res) => {
  try {
    const chucNangList = await ChucNang.findAll(); 
    res.status(200).json(chucNangList);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách chức năng: ' + error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token không được cung cấp' });
    }

    const tokenRecord = await NguoiDung.findRefreshToken(refreshToken);
    if (!tokenRecord) {
      return res.status(401).json({ error: 'Refresh token không hợp lệ hoặc đã hết hạn' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const nguoiDung = await NguoiDung.findById(decoded.id);
    if (!nguoiDung) {
      return res.status(401).json({ error: 'Người dùng không tồn tại' });
    }

    await NguoiDung.deleteRefreshToken(refreshToken);
    const newTokens = await NguoiDung.generateToken(nguoiDung);
    res.status(200).json(newTokens);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi làm mới token: ' + error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token không được cung cấp' });
    }

    const deleted = await NguoiDung.deleteRefreshToken(refreshToken);
    if (deleted === 0) {
      return res.status(404).json({ error: 'Refresh token không tồn tại' });
    }

    res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi đăng xuất: ' + error.message });
  }
};

export default {
  createNguoiDung,
  login,
  getNguoiDung,
  getAllNguoiDung,
  updateNguoiDung,
  deleteNguoiDung,
  getChucNang,
  getAllChucNang,
  refreshToken,
  logout,
};