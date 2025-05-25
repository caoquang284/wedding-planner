import { hash } from 'bcrypt';

export async function seed(knex) {
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
    {
      MaChucNang: 4,
      TenChucNang: 'Quản lý loại sảnh',
      TenManHinh: 'loai-sanh',
    },
    {
      MaChucNang: 5,
      TenChucNang: 'Quản lý sảnh',
      TenManHinh: 'sanh',
    },
    {
      MaChucNang: 6,
      TenChucNang: 'Quản lý loại món ăn',
      TenManHinh: 'loai-mon-an',
    },
    {
      MaChucNang: 7,
      TenChucNang: 'Quản lý món ăn',
      TenManHinh: 'mon-an',
    },
    {
      MaChucNang: 8,
      TenChucNang: 'Quản lý loại dịch vụ',
      TenManHinh: 'loai-dich-vu',
    },
    {
      MaChucNang: 9,
      TenChucNang: 'Quản lý dịch vụ',
      TenManHinh: 'dich-vu',
    },
    {
      MaChucNang: 10,
      TenChucNang: 'Quản lý ca',
      TenManHinh: 'ca',
    },
    {
      MaChucNang: 11,
      TenChucNang: 'Quản lý tham số',
      TenManHinh: 'tham-so',
    },
  ]);

  // Seed bảng NHOMNGUOIDUNG
  await knex('NHOMNGUOIDUNG').insert([{ MaNhom: 1, TenNhom: 'Nhóm Admin' }]);

  // Seed bảng PHANQUYEN (gán tất cả chức năng cho Nhóm Admin)
  await knex('PHANQUYEN').insert([
    { MaNhom: 1, MaChucNang: 1 },
    { MaNhom: 1, MaChucNang: 2 },
    { MaNhom: 1, MaChucNang: 3 },
    { MaNhom: 1, MaChucNang: 4 },
    { MaNhom: 1, MaChucNang: 5 },
    { MaNhom: 1, MaChucNang: 6 },
    { MaNhom: 1, MaChucNang: 7 },
    { MaNhom: 1, MaChucNang: 8 },
    { MaNhom: 1, MaChucNang: 9 },
    { MaNhom: 1, MaChucNang: 10 },
    { MaNhom: 1, MaChucNang: 11 },
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

  // Seed bảng LOAISANH (5 loại sảnh với đơn giá bàn tối thiểu)
  await knex('LOAISANH').insert([
    { MaLoaiSanh: 1, TenLoaiSanh: 'A', DonGiaBanToiThieu: 1000000 },
    { MaLoaiSanh: 2, TenLoaiSanh: 'B', DonGiaBanToiThieu: 1100000 },
    { MaLoaiSanh: 3, TenLoaiSanh: 'C', DonGiaBanToiThieu: 1200000 },
    { MaLoaiSanh: 4, TenLoaiSanh: 'D', DonGiaBanToiThieu: 1400000 },
    { MaLoaiSanh: 5, TenLoaiSanh: 'E', DonGiaBanToiThieu: 1600000 },
  ]);

  // Seed bảng CA (2 ca: Trưa, Tối)
  await knex('CA').insert([
    { MaCa: 1, TenCa: 'Trưa' },
    { MaCa: 2, TenCa: 'Tối' },
  ]);

  // Seed bảng THAMSO (phạt 1% mỗi ngày)
  await knex('THAMSO').insert([{ PhanTramPhatTrenNgay: 1.0 }]);

  // Seed bảng LOAIDICHVU (5 loại dịch vụ)
  await knex('LOAIDICHVU').insert([
    { MaLoaiDichVu: 1, TenLoaiDichVu: 'Trang trí' },
    { MaLoaiDichVu: 2, TenLoaiDichVu: 'Âm thanh và ánh sáng' },
    { MaLoaiDichVu: 3, TenLoaiDichVu: 'Chụp ảnh và quay phim' },
    { MaLoaiDichVu: 4, TenLoaiDichVu: 'Dịch vụ nhân sự' },
    { MaLoaiDichVu: 5, TenLoaiDichVu: 'Dịch vụ bổ sung' },
  ]);

  // Seed bảng DICHVU (20 dịch vụ)
  await knex('DICHVU').insert([
    // Loại 1: Trang trí (5 dịch vụ)
    {
      MaDichVu: 1,
      TenDichVu: 'Trang trí bàn tiệc hoa tươi',
      MaLoaiDichVu: 1,
      DonGia: 5000000,
      GhiChu: 'Hoa tươi nhập khẩu, thiết kế theo yêu cầu',
      AnhURL: null,
    },
    {
      MaDichVu: 2,
      TenDichVu: 'Trang trí sân khấu cưới',
      MaLoaiDichVu: 1,
      DonGia: 10000000,
      GhiChu: 'Bao gồm backdrop và đèn LED',
      AnhURL: null,
    },
    {
      MaDichVu: 3,
      TenDichVu: 'Cổng hoa chào khách',
      MaLoaiDichVu: 1,
      DonGia: 3000000,
      GhiChu: 'Hoa tươi kết hợp với khung sắt',
      AnhURL: null,
    },
    {
      MaDichVu: 4,
      TenDichVu: 'Trang trí lối đi hoa tươi',
      MaLoaiDichVu: 1,
      DonGia: 4000000,
      GhiChu: 'Dùng hoa hồng và hoa baby',
      AnhURL: null,
    },
    {
      MaDichVu: 5,
      TenDichVu: 'Trang trí bàn gallery',
      MaLoaiDichVu: 1,
      DonGia: 2000000,
      GhiChu: 'Trang trí ảnh cưới và phụ kiện',
      AnhURL: null,
    },
    // Loại 2: Âm thanh và ánh sáng (4 dịch vụ)
    {
      MaDichVu: 6,
      TenDichVu: 'Ban nhạc sống',
      MaLoaiDichVu: 2,
      DonGia: 15000000,
      GhiChu: 'Biểu diễn 2 giờ, 5 nhạc công',
      AnhURL: null,
    },
    {
      MaDichVu: 7,
      TenDichVu: 'DJ tiệc cưới',
      MaLoaiDichVu: 2,
      DonGia: 8000000,
      GhiChu: 'Bao gồm thiết bị âm thanh',
      AnhURL: null,
    },
    {
      MaDichVu: 8,
      TenDichVu: 'Hệ thống ánh sáng sân khấu',
      MaLoaiDichVu: 2,
      DonGia: 5000000,
      GhiChu: 'Đèn LED đổi màu',
      AnhURL: null,
    },
    {
      MaDichVu: 9,
      TenDichVu: 'Hệ thống âm thanh cao cấp',
      MaLoaiDichVu: 2,
      DonGia: 6000000,
      GhiChu: 'Loa JBL, âm thanh vòm',
      AnhURL: null,
    },
    // Loại 3: Chụp ảnh và quay phim (4 dịch vụ)
    {
      MaDichVu: 10,
      TenDichVu: 'Chụp ảnh cưới sự kiện',
      MaLoaiDichVu: 3,
      DonGia: 7000000,
      GhiChu: 'Chụp 300 ảnh, chỉnh sửa cơ bản',
      AnhURL: null,
    },
    {
      MaDichVu: 11,
      TenDichVu: 'Quay phim tiệc cưới',
      MaLoaiDichVu: 3,
      DonGia: 10000000,
      GhiChu: 'Video 5 phút highlight',
      AnhURL: null,
    },
    {
      MaDichVu: 12,
      TenDichVu: 'Chụp ảnh bàn tiệc',
      MaLoaiDichVu: 3,
      DonGia: 3000000,
      GhiChu: 'Chụp tất cả bàn tiệc',
      AnhURL: null,
    },
    {
      MaDichVu: 13,
      TenDichVu: 'Quay phim toàn bộ tiệc',
      MaLoaiDichVu: 3,
      DonGia: 12000000,
      GhiChu: 'Video 2 giờ, đầy đủ nghi lễ',
      AnhURL: null,
    },
    // Loại 4: Dịch vụ nhân sự (4 dịch vụ)
    {
      MaDichVu: 14,
      TenDichVu: 'MC dẫn chương trình',
      MaLoaiDichVu: 4,
      DonGia: 5000000,
      GhiChu: 'MC chuyên nghiệp, nói 2 ngôn ngữ',
      AnhURL: null,
    },
    {
      MaDichVu: 15,
      TenDichVu: 'Nhân viên phục vụ',
      MaLoaiDichVu: 4,
      DonGia: 2000000,
      GhiChu: 'Tính giá cho 10 nhân viên',
      AnhURL: null,
    },
    {
      MaDichVu: 16,
      TenDichVu: 'Quản lý sự kiện',
      MaLoaiDichVu: 4,
      DonGia: 3000000,
      GhiChu: 'Điều phối toàn bộ tiệc',
      AnhURL: null,
    },
    {
      MaDichVu: 17,
      TenDichVu: 'Đội bê tráp',
      MaLoaiDichVu: 4,
      DonGia: 2500000,
      GhiChu: '5 người, đồng phục truyền thống',
      AnhURL: null,
    },
    // Loại 5: Dịch vụ bổ sung (3 dịch vụ)
    {
      MaDichVu: 18,
      TenDichVu: 'Xe hoa đón dâu',
      MaLoaiDichVu: 5,
      DonGia: 5000000,
      GhiChu: 'Xe 16 chỗ, trang trí hoa tươi',
      AnhURL: null,
    },
    {
      MaDichVu: 19,
      TenDichVu: 'Pháo hoa sân khấu',
      MaLoaiDichVu: 5,
      DonGia: 4000000,
      GhiChu: 'Pháo hoa lạnh, an toàn',
      AnhURL: null,
    },
    {
      MaDichVu: 20,
      TenDichVu: 'Bánh cưới 3 tầng',
      MaLoaiDichVu: 5,
      DonGia: 3000000,
      GhiChu: 'Thiết kế theo yêu cầu',
      AnhURL: null,
    },
  ]);

  // Đặt lại sequence sau khi chèn dữ liệu
  await knex.raw('SELECT setval(\'"CHUCNANG_MaChucNang_seq"\', 11)'); // Sau MaChucNang: 11
  await knex.raw('SELECT setval(\'"NHOMNGUOIDUNG_MaNhom_seq"\', 1)'); // Sau MaNhom: 1
  await knex.raw('SELECT setval(\'"NGUOIDUNG_MaNguoiDung_seq"\', 1)'); // Sau MaNguoiDung: 1
  await knex.raw('SELECT setval(\'"LOAISANH_MaLoaiSanh_seq"\', 5)'); // Sau MaLoaiSanh: 5
  await knex.raw('SELECT setval(\'"CA_MaCa_seq"\', 2)'); // Sau MaCa: 2
  await knex.raw('SELECT setval(\'"LOAIDICHVU_MaLoaiDichVu_seq"\', 5)'); // Sau MaLoaiDichVu: 5
  await knex.raw('SELECT setval(\'"DICHVU_MaDichVu_seq"\', 20)'); // Sau MaDichVu: 20
}
