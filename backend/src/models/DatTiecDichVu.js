import { knex } from '../config/database.js';

const DatTiecDichVu = {
  create: async (data) => {
    const [datTiecDichVu] = await knex('DATTIEC_DICHVU')
      .insert(data)
      .returning('*');
    return datTiecDichVu;
  },
  delete: async (maDatTiec, maDichVu) => {
    return await knex('DATTIEC_DICHVU')
      .where({ MaDatTiec: maDatTiec, MaDichVu: maDichVu })
      .delete();
  },
};

export default DatTiecDichVu;
