import { knex } from '../config/database.js';

const MonAn = {
  create: async (data) => {
    const [monAn] = await knex('MONAN').insert(data).returning('*');
    return monAn;
  },
  findById: async (id) => {
    return await knex('MONAN').where({ MaMonAn: id }).first();
  },
  findAll: async () => {
    return await knex('MONAN');
  },
  update: async (id, data) => {
    const [monAn] = await knex('MONAN')
      .where({ MaMonAn: id })
      .update(data)
      .returning('*');
    return monAn;
  },
  delete: async (id) => {
    return await knex('MONAN').where({ MaMonAn: id }).delete();
  },
};

export default MonAn;
