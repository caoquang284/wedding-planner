exports.seed = async function (knex) {
  // Xóa dữ liệu cũ trong bảng CHUCNANG (nếu có)
  await knex('CHUCNANG').del();

  // Chèn dữ liệu cố định
  await knex('CHUCNANG').insert([
    { MaChucNang: 1, TenChucNang: 'Quản lý người dùng', TenManHinh: 'Quản lý người dùng' },
    { MaChucNang: 2, TenChucNang: 'Quản lý nhóm người dùng', TenManHinh: 'Quản lý nhóm người dùng' },
    { MaChucNang: 3, TenChucNang: 'Quản lý phân quyền', TenManHinh: 'Quản lý phân quyền' },
    { MaChucNang: 4, TenChucNang: 'Quản lý loại sảnh', TenManHinh: 'Quản lý loại sảnh' },
    { MaChucNang: 5, TenChucNang: 'Quản lý sảnh', TenManHinh: 'Quản lý sảnh' },
    { MaChucNang: 6, TenChucNang: 'Quản lý loại món ăn', TenManHinh: 'Quản lý loại món ăn' },
    { MaChucNang: 7, TenChucNang: 'Quản lý món ăn', TenManHinh: 'Quản lý món ăn' },
    { MaChucNang: 8, TenChucNang: 'Quản lý loại dịch vụ', TenManHinh: 'Quản lý loại dịch vụ' },
    { MaChucNang: 9, TenChucNang: 'Quản lý dịch vụ', TenManHinh: 'Quản lý dịch vụ' },
    { MaChucNang: 10, TenChucNang: 'Quản lý ca', TenManHinh: 'Quản lý ca' },
    { MaChucNang: 11, TenChucNang: 'Quản lý đặt tiệc', TenManHinh: 'Quản lý đặt tiệc' },
    { MaChucNang: 12, TenChucNang: 'Quản lý hóa đơn', TenManHinh: 'Quản lý hóa đơn' },
    { MaChucNang: 13, TenChucNang: 'Quản lý báo cáo doanh số', TenManHinh: 'Báo cáo doanh số' },
    { MaChucNang: 14, TenChucNang: 'Quản lý tham số', TenManHinh: 'Quản lý tham số' },
  ]);
};