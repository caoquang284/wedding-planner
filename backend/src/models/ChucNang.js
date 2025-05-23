import { knex } from '../config/database.js';

const ChucNang = {
  findById: async (id) => {
    return await knex('CHUCNANG').where({ MaChucNang: id }).first();
  },
  findByTenChucNang: async (tenChucNang) => {
    return await knex('CHUCNANG').where({ TenChucNang: tenChucNang }).first();
  },
};

export default ChucNang;
