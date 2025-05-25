import { knex } from '../config/database.js';

const ThamSo = {
  findOne: async () => {
    return await knex('THAMSO').first();
  },
  update: async (data) => {
    const [thamSo] = await knex('THAMSO').update(data).returning('*');
    return thamSo;
  },
};

export default ThamSo;
