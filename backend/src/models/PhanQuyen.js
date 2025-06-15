import { knex } from '../config/database.js';

const PhanQuyen = {
  // Tạo mới phân quyền
  create: async (data) => {
    const { MaNhom, MaChucNang } = data;
    const existing = await PhanQuyen.findByNhomAndChucNang(MaNhom, MaChucNang);
    if (existing) throw new Error('Phân quyền đã tồn tại');
    const [phanQuyen] = await knex('PHANQUYEN').insert(data).returning('*');
    return phanQuyen;
  },

  // Lấy tất cả phân quyền theo nhóm
  findByNhom: async (maNhom) => {
    return await knex('PHANQUYEN')
      .select('PHANQUYEN.*', 'CHUCNANG.TenChucNang', 'CHUCNANG.TenManHinh')
      .leftJoin('CHUCNANG', 'PHANQUYEN.MaChucNang', 'CHUCNANG.MaChucNang')
      .where({ MaNhom: maNhom });
  },

  // Lấy tất cả phân quyền
  findAll: async () => {
    return await knex('PHANQUYEN')
      .select('PHANQUYEN.*', 'NHOMNGUOIDUNG.TenNhom', 'CHUCNANG.TenChucNang', 'CHUCNANG.TenManHinh')
      .leftJoin('NHOMNGUOIDUNG', 'PHANQUYEN.MaNhom', 'NHOMNGUOIDUNG.MaNhom')
      .leftJoin('CHUCNANG', 'PHANQUYEN.MaChucNang', 'CHUCNANG.MaChucNang');
  },

  // Kiểm tra phân quyền theo nhóm và chức năng
  findByNhomAndChucNang: async (maNhom, maChucNang) => {
    return await knex('PHANQUYEN')
      .where({ MaNhom: maNhom, MaChucNang: maChucNang })
      .first();
  },

  // Cập nhật phân quyền (thêm hoặc xóa)
  update: async (maNhom, maChucNang, action) => {
    const existing = await PhanQuyen.findByNhomAndChucNang(maNhom, maChucNang);
    if (action === 'add' && !existing) {
      const [phanQuyen] = await knex('PHANQUYEN').insert({ MaNhom: maNhom, MaChucNang: maChucNang }).returning('*');
      return phanQuyen;
    } else if (action === 'remove' && existing) {
      await knex('PHANQUYEN').where({ MaNhom: maNhom, MaChucNang: maChucNang }).delete();
      return { message: 'Phân quyền đã được xóa' };
    }
    throw new Error('Hành động không hợp lệ hoặc phân quyền không tồn tại');
  },

  // Xóa phân quyền
  delete: async (maNhom, maChucNang) => {
    return await knex('PHANQUYEN')
      .where({ MaNhom: maNhom, MaChucNang: maChucNang })
      .delete();
  },

  // Kiểm tra xem nhóm có quyền không
  hasPermission: async (maNhom, maChucNang) => {
    const permission = await PhanQuyen.findByNhomAndChucNang(maNhom, maChucNang);
    return !!permission;
  },
};

export default PhanQuyen;