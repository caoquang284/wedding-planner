import { knex } from '../config/database.js';

const HoaDon = {
  create: async (data) => {
    const [hoaDon] = await knex('HOADON').insert(data).returning('*');
    return hoaDon;
  },
  findById: async (id) => {
    return await knex('HOADON').where({ MaHoaDon: id }).first();
  },
  findAll: async () => {
    return await knex('HOADON');
  },
};

export default HoaDon;