import { knex } from '../config/database.js';

const BaoCaoDoanhSo = {
  create: async (data) => {
    const [baoCao] = await knex('BAOCAODOANHSO').insert(data).returning('*');
    return baoCao;
  },
  findById: async (id) => {
    return await knex('BAOCAODOANHSO').where({ MaBaoCaoDoanhSo: id }).first();
  },
  findAllWithFilters: async (filters) => {
    let query = knex('BAOCAODOANHSO');
    if (filters.thang) query = query.where('Thang', filters.thang);
    if (filters.nam) query = query.where('Nam', filters.nam);
    return await query;
  },
};

export default BaoCaoDoanhSo;
