import { knex } from '../config/database.js';

const PhanQuyen = {
  create: async (data) => {
    const [phanQuyen] = await knex('PHANQUYEN').insert(data).returning('*');
    return phanQuyen;
  },
  findByNhomAndChucNang: async (maNhom, maChucNang) => {
    return await knex('PHANQUYEN')
      .where({ MaNhom: maNhom, MaChucNang: maChucNang })
      .first();
  },
  findByNhom: async (maNhom) => {
    return await knex('PHANQUYEN').where({ MaNhom: maNhom });
  },
  delete: async (maNhom, maChucNang) => {
    return await knex('PHANQUYEN')
      .where({ MaNhom: maNhom, MaChucNang: maChucNang })
      .delete();
  },
};

export default PhanQuyen;
