import { hash } from 'bcrypt';

export async function seed(knex) {
  // Xóa dữ liệu cũ (nếu có) theo thứ tự phụ thuộc ngược
  await knex('PHANQUYEN').del();
  await knex('NGUOIDUNG').del();
  await knex('NHOMNGUOIDUNG').del();
  await knex('CHUCNANG').del();

  // Seed bảng CHUCNANG
  await knex('CHUCNANG').insert([
    {
      MaChucNang: 1,
      TenChucNang: 'Quản lý người dùng',
      TenManHinh: 'nguoi-dung',
    },
    {
      MaChucNang: 2,
      TenChucNang: 'Quản lý nhóm người dùng',
      TenManHinh: 'nhom-nguoi-dung',
    },
    {
      MaChucNang: 3,
      TenChucNang: 'Quản lý phân quyền',
      TenManHinh: 'phan-quyen',
    },
  ]);

  // Seed bảng NHOMNGUOIDUNG
  await knex('NHOMNGUOIDUNG').insert([{ MaNhom: 1, TenNhom: 'Nhóm Admin' }]);

  // Seed bảng PHANQUYEN (gán tất cả chức năng cho Nhóm Admin)
  await knex('PHANQUYEN').insert([
    { MaNhom: 1, MaChucNang: 1 },
    { MaNhom: 1, MaChucNang: 2 },
    { MaNhom: 1, MaChucNang: 3 },
  ]);

  // Seed bảng NGUOIDUNG (tạo tài khoản admin)
  const hashedPassword = await hash('admin123', 10); // Mã hóa mật khẩu
  await knex('NGUOIDUNG').insert([
    {
      MaNguoiDung: 1,
      TenDangNhap: 'admin',
      MatKhau: hashedPassword,
      TenNguoiDung: 'Administrator',
      MaNhom: 1,
    },
  ]);

  // Đặt lại sequence sau khi chèn dữ liệu
  await knex.raw('SELECT setval(\'"CHUCNANG_MaChucNang_seq"\', 3)'); // Sau MaChucNang: 3
  await knex.raw('SELECT setval(\'"NHOMNGUOIDUNG_MaNhom_seq"\', 1)'); // Sau MaNhom: 1
  await knex.raw('SELECT setval(\'"NGUOIDUNG_MaNguoiDung_seq"\', 1)'); // Sau MaNguoiDung: 1
}
