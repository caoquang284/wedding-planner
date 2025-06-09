import { knex } from '../config/database.js';

const ChucNang = {
  findById: async (id) => {
    try {
      const result = await knex('CHUCNANG').where({ MaChucNang: id }).first();
      if (!result) throw new Error('Chức năng không tồn tại');
      return result;
    } catch (error) {
      throw new Error('Lỗi khi tìm chức năng theo ID: ' + error.message);
    }
  },

  findAll: async () => {
    try {
      return await knex('CHUCNANG').orderBy('MaChucNang', 'asc');
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách chức năng: ' + error.message);
    }
  },

  findByTenChucNang: async (tenChucNang) => {
    try {
      const result = await knex('CHUCNANG').where({ TenChucNang: tenChucNang }).first();
      if (!result) throw new Error('Chức năng không tồn tại');
      return result;
    } catch (error) {
      throw new Error('Lỗi khi tìm chức năng theo tên: ' + error.message);
    }
  },
};

export default ChucNang;