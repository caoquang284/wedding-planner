import express from 'express';
import NguoiDung from '../../src/models/NguoiDung.js';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { knex } from '../../src/config/database.js'; // Import knex từ config

const router = express.Router();

router.post('/login', async (req, res) => {
  const { tenDangNhap, matKhau } = req.body;

  try {
    const nguoiDung = await NguoiDung.findByTenDangNhap(tenDangNhap);
    if (!nguoiDung) {
      return res.status(400).json({ error: 'Tên đăng nhập không tồn tại!' });
    }

    const isMatch = await compare(matKhau, nguoiDung.MatKhau);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mật khẩu không đúng!' });
    }

    const { accessToken, refreshToken } = await NguoiDung.generateToken(nguoiDung);
    const permissions = await knex('PHANQUYEN')
      .join('CHUCNANG', 'PHANQUYEN.MaChucNang', 'CHUCNANG.MaChucNang')
      .where('PHANQUYEN.MaNhom', nguoiDung.MaNhom)
      .pluck('CHUCNANG.TenChucNang');

    res.json({
      accessToken,
      refreshToken,
      user: {
        MaNguoiDung: nguoiDung.MaNguoiDung,
        MaNhom: nguoiDung.MaNhom,
        TenNguoiDung: nguoiDung.TenNguoiDung,
        permissions,
      },
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ error: 'Lỗi server: ' + error.message });
  }
});

export const authRoutes = router;