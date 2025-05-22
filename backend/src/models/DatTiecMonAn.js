import { knex } from '../config/database.js';

const DatTiecMonAn = {
  create: async (data) => {
    const [datTiecMonAn] = await knex('DATTIEC_MONAN')
      .insert(data)
      .returning('*');
    return datTiecMonAn;
  },
  delete: async (maDatTiec, maMonAn) => {
    return await knex('DATTIEC_MONAN')
      .where({ MaDatTiec: maDatTiec, MaMonAn: maMonAn })
      .delete();
  },
};

export default DatTiecMonAn;
