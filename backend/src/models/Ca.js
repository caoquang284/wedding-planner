import { knex } from '../config/database.js';

const Ca = {
  create: async (data) => {
    const [ca] = await knex('CA').insert(data).returning('*');
    return ca;
  },
  findById: async (id) => {
    return await knex('CA').where({ MaCa: id }).first();
  },
  findAll: async () => {
    return await knex('CA').select('*');
  },
  findByTenCa: async (tenCa) => {
    return await knex('CA').where({ TenCa: tenCa }).first();
  },
  update: async (id, data) => {
    const [ca] = await knex('CA')
      .where({ MaCa: id })
      .update(data)
      .returning('*');
    return ca;
  },
  delete: async (id) => {
    return await knex('CA').where({ MaCa: id }).delete();
  },
};

export default Ca;
