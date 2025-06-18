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
  checkDaDuocDatTiec: async (maCa) => {
    const ca = await knex('DATTIEC').where({ MaCa: maCa }).first();
    if (ca) {
      return true;
    }
    return false;
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
  temDelete: async (id) => {
    return await knex('CA').where({ MaCa: id }).update({ DaXoa: true });
  },
};

export default Ca;
