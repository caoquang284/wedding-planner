import { knex } from '../config/database.js';

const Sanh = {
  create: async (data) => {
    const [sanh] = await knex('SANH').insert(data).returning('*');
    return sanh;
  },
  findById: async (id) => {
    return await knex('SANH').where({ MaSanh: id }).first();
  },
  findAll: async () => {
    return await knex('SANH');
  },
  update: async (id, data) => {
    const [sanh] = await knex('SANH')
      .where({ MaSanh: id })
      .update(data)
      .returning('*');
    return sanh;
  },
  delete: async (id) => {
    return await knex('SANH').where({ MaSanh: id }).delete();
  },
};

export default Sanh;
