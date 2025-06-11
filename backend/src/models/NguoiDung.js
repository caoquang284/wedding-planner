import { knex } from '../config/database.js';
import jwt from 'jsonwebtoken';
import process from 'node:process';

const NguoiDung = {
  create: async (data) => {
    const [nguoiDung] = await knex('NGUOIDUNG').insert(data).returning('*');
    return nguoiDung;
  },
  findById: async (id) => {
    return await knex('NGUOIDUNG').where({ MaNguoiDung: id }).first();
  },
  findAll: async () => {
    return await knex('NGUOIDUNG').orderBy('TenNguoiDung', 'asc');
  },
  findByTenDangNhap: async (tenDangNhap) => {
    return await knex('NGUOIDUNG').where({ TenDangNhap: tenDangNhap }).first();
  },
  update: async (id, data) => {
    const [nguoiDung] = await knex('NGUOIDUNG')
      .where({ MaNguoiDung: id })
      .update(data)
      .returning('*');
    return nguoiDung;
  },
  delete: async (id) => {
    return await knex('NGUOIDUNG').where({ MaNguoiDung: id }).delete();
  },
  generateToken: async (nguoiDung) => {
    if (!nguoiDung || !nguoiDung.MaNguoiDung || !nguoiDung.MaNhom) {
      throw new Error('Thông tin người dùng không hợp lệ');
    }
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error('Cấu hình JWT không đầy đủ');
    }

    const payload = {
      id: nguoiDung.MaNguoiDung,
      maNhom: nguoiDung.MaNhom,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    try {
      await knex('REFRESH_TOKEN')
        .where({ MaNguoiDung: nguoiDung.MaNguoiDung })
        .delete(); // Xóa token cũ
      await knex('REFRESH_TOKEN').insert({
        MaNguoiDung: nguoiDung.MaNguoiDung,
        RefreshToken: refreshToken,
        HanSuDung: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    } catch (error) {
      throw new Error('Lỗi khi lưu refresh token: ' + error.message);
    }

    return { accessToken, refreshToken };
  },
  findRefreshToken: async (refreshToken) => {
    const tokenRecord = await knex('REFRESH_TOKEN')
      .where({ RefreshToken: refreshToken })
      .andWhere('HanSuDung', '>', new Date())
      .first();

    if (!tokenRecord) {
      await knex('REFRESH_TOKEN')
        .where({ RefreshToken: refreshToken })
        .delete();
    }
    return tokenRecord;
  },
  deleteRefreshToken: async (refreshToken) => {
    return await knex('REFRESH_TOKEN')
      .where({ RefreshToken: refreshToken })
      .delete();
  },
  refreshAccessToken: async (refreshToken) => {
    if (!process.env.JWT_REFRESH_SECRET || !process.env.JWT_SECRET) {
      throw new Error('Cấu hình JWT không đầy đủ');
    }

    const tokenRecord = await NguoiDung.findRefreshToken(refreshToken);
    if (!tokenRecord) {
      throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const nguoiDung = await NguoiDung.findById(decoded.id);
      if (!nguoiDung) {
        throw new Error('Người dùng không tồn tại');
      }

      const payload = {
        id: nguoiDung.MaNguoiDung,
        maNhom: nguoiDung.MaNhom,
      };
      const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      await NguoiDung.deleteRefreshToken(refreshToken);
      throw new Error('Lỗi làm mới token: ' + error.message);
    }
  },
};

export default NguoiDung;