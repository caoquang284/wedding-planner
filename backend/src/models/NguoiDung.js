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
    return await knex('NGUOIDUNG');
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
    const payload = {
      id: nguoiDung.MaNguoiDung,
      maNhom: nguoiDung.MaNhom,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    await knex('REFRESH_TOKEN').insert({
      MaNguoiDung: nguoiDung.MaNguoiDung,
      RefreshToken: refreshToken,
      HanSuDung: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return { accessToken, refreshToken };
  },
  findRefreshToken: async (refreshToken) => {
    return await knex('REFRESH_TOKEN')
      .where({ RefreshToken: refreshToken })
      .andWhere('HanSuDung', '>', new Date())
      .first();
  },
  deleteRefreshToken: async (refreshToken) => {
    return await knex('REFRESH_TOKEN').where({ RefreshToken: refreshToken }).delete();
  },
};

export default NguoiDung;