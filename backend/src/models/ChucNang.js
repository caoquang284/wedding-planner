import { knex } from '../config/database.js';

const ChucNang = {
  findById: async (id) => {
    return await knex('CHUCNANG').where({ MaChucNang: id }).first();
  },
};

export default ChucNang;
