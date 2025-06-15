import { knex } from '../config/database.js';

const DatTiecDichVu = {
  create: async (data) => {
    const [datTiecDichVu] = await knex('DATTIEC_DICHVU')
      .insert(data)
      .returning('*');
    return datTiecDichVu;
  },
  getByMaDatTiec: async (maDatTiec) => {
    return await knex('DATTIEC_DICHVU')
      .where({ MaDatTiec: maDatTiec })
      .select('*');
  },
  delete: async (maDatTiec, maDichVu) => {
    return await knex('DATTIEC_DICHVU')
      .where({ MaDatTiec: maDatTiec, MaDichVu: maDichVu })
      .delete();
  },
  getByMaDichVu: async (maDichVu) => {
    return await knex('DATTIEC_DICHVU')
      .where({ MaDichVu: maDichVu })
      .select('*');
  },
};

export default DatTiecDichVu;
