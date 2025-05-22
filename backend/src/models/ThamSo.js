import { knex } from '../config/database.js';

const ThamSo = {
  findAll: async () => {
    return await knex('THAMSO');
  },
  update: async (data) => {
    const [thamSo] = await knex('THAMSO').update(data).returning('*');
    return thamSo;
  },
};

export default ThamSo;
