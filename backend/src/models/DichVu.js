import { knex } from '../config/database.js';

const DichVu = {
  create: async (data) => {
    const [dichVu] = await knex('DICHVU').insert(data).returning('*');
    return dichVu;
  },
  findById: async (id) => {
    return await knex('DICHVU').where({ MaDichVu: id }).first();
  },
  findAll: async () => {
    return await knex('DICHVU');
  },
  update: async (id, data) => {
    const [dichVu] = await knex('DICHVU')
      .where({ MaDichVu: id })
      .update(data)
      .returning('*');
    return dichVu;
  },
  delete: async (id) => {
    return await knex('DICHVU').where({ MaDichVu: id }).delete();
  },
};

export default DichVu;
