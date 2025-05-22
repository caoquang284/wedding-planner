import { knex } from '../config/database.js';

const ChiTietBaoCaoDoanhSo = {
  create: async (data) => {
    const [chiTiet] = await knex('CHITIET_BAOCAODOANHSO')
      .insert(data)
      .returning('*');
    return chiTiet;
  },
};

export default ChiTietBaoCaoDoanhSo;
