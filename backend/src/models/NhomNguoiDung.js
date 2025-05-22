import { knex } from '../config/database.js';

const NhomNguoiDung = {
  create: async (data) => {
    const [nhom] = await knex('NHOMNGUOIDUNG').insert(data).returning('*');
    return nhom;
  },
  findById: async (id) => {
    return await knex('NHOMNGUOIDUNG').where({ MaNhom: id }).first();
  },
  findAll: async () => {
    return await knex('NHOMNGUOIDUNG');
  },
  update: async (id, data) => {
    const [nhom] = await knex('NHOMNGUOIDUNG')
      .where({ MaNhom: id })
      .update(data)
      .returning('*');
    return nhom;
  },
  delete: async (id) => {
    return await knex('NHOMNGUOIDUNG').where({ MaNhom: id }).delete();
  },
};

export default NhomNguoiDung;
