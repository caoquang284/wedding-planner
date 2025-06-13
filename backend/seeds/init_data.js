import { hash } from 'bcrypt';

export async function seed(knex) {
  await knex('HOADON').del();
  await knex('DATTIEC_DICHVU').del();
  await knex('DATTIEC').del();
  await knex('THUCDON_MONAN').del();
  await knex('THUCDON').del();
  await knex('MONAN').del();
  await knex('LOAIMONAN').del();
  await knex('PHANQUYEN').del();
  await knex('REFRESH_TOKEN').del();
  await knex('NGUOIDUNG').del();
  await knex('NHOMNGUOIDUNG').del();
  await knex('CHUCNANG').del();
  await knex('SANH').del();
  await knex('LOAISANH').del();
  await knex('CA').del();
  await knex('THAMSO').del();
  await knex('DICHVU').del();
  await knex('LOAIDICHVU').del();

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
    { MaChucNang: 5, TenChucNang: 'Quản lý sảnh', TenManHinh: 'sanh' },
    {
      MaChucNang: 6,
      TenChucNang: 'Quản lý loại món ăn',
      TenManHinh: 'loai-mon-an',
    },
    { MaChucNang: 7, TenChucNang: 'Quản lý món ăn', TenManHinh: 'mon-an' },
    { MaChucNang: 8, TenChucNang: 'Quản lý thực đơn', TenManHinh: 'thuc-don' },
    {
      MaChucNang: 9,
      TenChucNang: 'Quản lý loại dịch vụ',
      TenManHinh: 'loai-dich-vu',
    },
    { MaChucNang: 10, TenChucNang: 'Quản lý dịch vụ', TenManHinh: 'dich-vu' },
    { MaChucNang: 11, TenChucNang: 'Quản lý ca', TenManHinh: 'ca' },
    { MaChucNang: 12, TenChucNang: 'Quản lý đặt tiệc', TenManHinh: 'dat-tiec' },
    { MaChucNang: 13, TenChucNang: 'Quản lý hóa đơn', TenManHinh: 'hoa-don' },
    {
      MaChucNang: 14,
      TenChucNang: 'Quản lý báo cáo doanh thu',
      TenManHinh: 'bao-cao-doanh-so',
    },
    { MaChucNang: 15, TenChucNang: 'Quản lý tham số', TenManHinh: 'tham-so' },
  ]);

  // Seed bảng NHOMNGUOIDUNG
  await knex('NHOMNGUOIDUNG').insert([
    { MaNhom: 1, TenNhom: 'Super Admin' },
    { MaNhom: 2, TenNhom: 'Admin' },
    { MaNhom: 3, TenNhom: 'Nhân viên Kinh doanh' },
    { MaNhom: 4, TenNhom: 'Nhân viên Kế toán' },
    { MaNhom: 5, TenNhom: 'Người dùng thông thường' },
  ]);

  // Seed bảng PHANQUYEN
  await knex('PHANQUYEN').insert([
    // Super Admin (MaNhom = 1): Toàn quyền
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
    { MaNhom: 1, MaChucNang: 12 },
    { MaNhom: 1, MaChucNang: 13 },
    { MaNhom: 1, MaChucNang: 14 },
    { MaNhom: 1, MaChucNang: 15 },
    // Admin (MaNhom = 2): Quản lý sảnh, thực đơn, dịch vụ, đặt tiệc, hóa đơn
    { MaNhom: 2, MaChucNang: 4 },
    { MaNhom: 2, MaChucNang: 5 },
    { MaNhom: 2, MaChucNang: 6 },
    { MaNhom: 2, MaChucNang: 7 },
    { MaNhom: 2, MaChucNang: 8 },
    { MaNhom: 2, MaChucNang: 9 },
    { MaNhom: 2, MaChucNang: 10 },
    { MaNhom: 2, MaChucNang: 12 },
    { MaNhom: 2, MaChucNang: 13 },
    // Nhân viên Kinh doanh (MaNhom = 3): Quản lý đặt tiệc
    { MaNhom: 3, MaChucNang: 12 },
    // Nhân viên Kế toán (MaNhom = 4): Quản lý hóa đơn và báo cáo doanh thu
    { MaNhom: 4, MaChucNang: 13 },
    { MaNhom: 4, MaChucNang: 14 },
    // Người dùng thông thường (MaNhom = 5): Chỉ xem sảnh, thực đơn, dịch vụ
    { MaNhom: 5, MaChucNang: 5 },
    { MaNhom: 5, MaChucNang: 8 },
    { MaNhom: 5, MaChucNang: 10 },
  ]);

  // Seed bảng NGUOIDUNG
  const hashedPassword = await hash('admin123', 10); // Mã hóa mật khẩu
  await knex('NGUOIDUNG').insert([
    {
      MaNguoiDung: 1,
      TenDangNhap: 'superadmin',
      MatKhau: hashedPassword,
      TenNguoiDung: 'Super Administrator',
      MaNhom: 1,
    },
    {
      MaNguoiDung: 2,
      TenDangNhap: 'admin1',
      MatKhau: hashedPassword,
      TenNguoiDung: 'Admin 1',
      MaNhom: 2,
    },
    {
      MaNguoiDung: 3,
      TenDangNhap: 'kinhdoanh1',
      MatKhau: hashedPassword,
      TenNguoiDung: 'Kinh doanh 1',
      MaNhom: 3,
    },
    {
      MaNguoiDung: 4,
      TenDangNhap: 'ketoan1',
      MatKhau: hashedPassword,
      TenNguoiDung: 'Kế toán 1',
      MaNhom: 4,
    },
    {
      MaNguoiDung: 5,
      TenDangNhap: 'user1',
      MatKhau: hashedPassword,
      TenNguoiDung: 'Người dùng 1',
      MaNhom: 5,
    },
  ]);

  // Seed bảng CA (2 ca: Trưa, Tối)
  await knex('CA').insert([
    { MaCa: 1, TenCa: 'Trưa' },
    { MaCa: 2, TenCa: 'Tối' },
    { MaCa: 3, TenCa: 'Sáng' },
    { MaCa: 4, TenCa: 'Chiều' },
    { MaCa: 5, TenCa: 'Đêm' },
  ]);

  await knex('LOAISANH').insert([
    {
      MaLoaiSanh: 1,
      TenLoaiSanh: 'Thường',
      DonGiaBanToiThieu: 1000000.0,
    },
    {
      MaLoaiSanh: 2,
      TenLoaiSanh: 'VIP',
      DonGiaBanToiThieu: 2000000.0,
    },
    {
      MaLoaiSanh: 3,
      TenLoaiSanh: 'Cao cấp',
      DonGiaBanToiThieu: 4000000.0,
    },
  ]);

  // Seed bảng SANH (10 sảnh)
  await knex('SANH').insert([
    {
      MaSanh: 1,
      TenSanh: 'Sảnh Ngọc',
      MaLoaiSanh: 1, // Thường
      SoLuongBanToiDa: 250,
      GhiChu: 'Sảnh nhỏ gọn, phù hợp cho tiệc gia đình',
      AnhURL:
        'https://crystalpalacevn.com/wp-content/uploads/2020/06/classic.jpg',
    },
    {
      MaSanh: 2,
      TenSanh: 'Sảnh Bích Thủy',
      MaLoaiSanh: 1, // Thường
      SoLuongBanToiDa: 250,
      GhiChu: 'Sảnh ấm cúng, thích hợp cho tiệc sinh nhật',
      AnhURL:
        'https://crystalpalacevn.com/wp-content/uploads/2023/03/T4_07087-scaled.jpg',
    },
    {
      MaSanh: 3,
      TenSanh: 'Sảnh Kim Cương',
      MaLoaiSanh: 2, // VIP
      SoLuongBanToiDa: 350,
      GhiChu: 'Sảnh sang trọng, thích hợp cho tiệc cưới lớn',
      AnhURL:
        'https://crystalpalacevn.com/wp-content/uploads/2020/06/royal.png',
    },
    {
      MaSanh: 4,
      TenSanh: 'Sảnh Pha Lê',
      MaLoaiSanh: 2, // VIP
      SoLuongBanToiDa: 350,
      GhiChu: 'Sảnh hiện đại với hệ thống ánh sáng cao cấp',
      AnhURL:
        'https://crystalpalacevn.com/wp-content/uploads/2020/06/diamond.jpg',
    },
    {
      MaSanh: 5,
      TenSanh: 'Sảnh Hồng Ngọc',
      MaLoaiSanh: 2, // VIP
      SoLuongBanToiDa: 350,
      GhiChu: 'Sảnh tinh tế, phù hợp cho sự kiện doanh nghiệp',
      AnhURL:
        'https://crystalpalacevn.com/wp-content/uploads/2022/07/4W9A6001-2.jpg',
    },
    {
      MaSanh: 6,
      TenSanh: 'Sảnh Hoàng Gia',
      MaLoaiSanh: 3, // Cao cấp
      SoLuongBanToiDa: 400,
      GhiChu: 'Sảnh đẳng cấp, dành cho các sự kiện đặc biệt',
      AnhURL:
        'https://asiana-plaza.com/wp-content/uploads/2021/03/trang-tri-sanh-tiec-cuoi-dep-3.jpg',
    },
    {
      MaSanh: 7,
      TenSanh: 'Sảnh Thiên Thanh',
      MaLoaiSanh: 3, // Cao cấp
      SoLuongBanToiDa: 400,
      GhiChu: 'Sảnh rộng rãi, trang trí lộng lẫy',
      AnhURL:
        'https://asiana-plaza.com/wp-content/uploads/2021/03/trang-tri-sanh-cuoi-dep-va-sang-trong-1.jpg',
    },
    {
      MaSanh: 8,
      TenSanh: 'Sảnh Vàng',
      MaLoaiSanh: 3, // Cao cấp
      SoLuongBanToiDa: 400,
      GhiChu: 'Sảnh lớn nhất, phù hợp cho tiệc cưới hoàng tráng',
      AnhURL:
        'https://asiana-plaza.com/wp-content/uploads/2021/03/cach-trang-tri-tiec-cuoi-tai-nha-hang-1.jpg',
    },
    {
      MaSanh: 9,
      TenSanh: 'Sảnh Lục Bảo',
      MaLoaiSanh: 1, // Thường
      SoLuongBanToiDa: 250,
      GhiChu: 'Sảnh thân thiện, phù hợp cho tiệc họp mặt',
      AnhURL:
        'https://asiana-plaza.com/wp-content/uploads/2021/03/trang-tri-sanh-cuoi-tai-nha-1.jpg',
    },
    {
      MaSanh: 10,
      TenSanh: 'Sảnh Sapphire',
      MaLoaiSanh: 2, // VIP
      SoLuongBanToiDa: 350,
      GhiChu: 'Sảnh thanh lịch, lý tưởng cho tiệc cưới trung bình',
      AnhURL:
        'https://asiana-plaza.com/wp-content/uploads/2021/03/sanh-cuoi-dep-nhat-1.jpg',
    },
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
      AnhURL:
        'https://www.blissvn.com/Data/Sites/1/News/1723/thumbs/img_0304.jpg',
    },
    {
      MaDichVu: 2,
      TenDichVu: 'Trang trí sân khấu cưới',
      MaLoaiDichVu: 1,
      DonGia: 10000000,
      GhiChu: 'Bao gồm backdrop và đèn LED',
      AnhURL:
        'https://omni.vn/wp-content/uploads/2024/08/449298337_897539409069240_5065201684509641361_n.jpg',
    },
    {
      MaDichVu: 3,
      TenDichVu: 'Cổng hoa chào khách',
      MaLoaiDichVu: 1,
      DonGia: 3000000,
      GhiChu: 'Hoa tươi kết hợp với khung sắt',
      AnhURL:
        'https://file.hstatic.net/200000427529/article/329697641_3156064171352310_3517658923531420979_n_a24c6054266d40ee8f93dd8851e6c3d3_1024x1024.jpeg',
    },
    {
      MaDichVu: 4,
      TenDichVu: 'Trang trí lối đi hoa tươi',
      MaLoaiDichVu: 1,
      DonGia: 4000000,
      GhiChu: 'Dùng hoa hồng và hoa baby',
      AnhURL:
        'https://www.yamewedding.vn/resource/images/2021/03/d9bef89e3920db0806d12b1a3778d118.JPG',
    },
    {
      MaDichVu: 5,
      TenDichVu: 'Trang trí bàn gallery',
      MaLoaiDichVu: 1,
      DonGia: 2000000,
      GhiChu: 'Trang trí ảnh cưới và phụ kiện',
      AnhURL: 'https://luxurypalace.vn/wp-content/uploads/2023/10/fd.jpg',
    },
    // Loại 2: Âm thanh và ánh sáng (4 dịch vụ)
    {
      MaDichVu: 6,
      TenDichVu: 'Ban nhạc sống',
      MaLoaiDichVu: 2,
      DonGia: 15000000,
      GhiChu: 'Biểu diễn 2 giờ, 5 nhạc công',
      AnhURL:
        'https://donduongband.com/wp-content/uploads/2024/05/Ban-nhac-dam-cuoi-HCM-1024x684.jpg',
    },
    {
      MaDichVu: 7,
      TenDichVu: 'DJ tiệc cưới',
      MaLoaiDichVu: 2,
      DonGia: 8000000,
      GhiChu: 'Bao gồm thiết bị âm thanh',
      AnhURL:
        'https://phamgiamedia.vn/wp-content/uploads/2024/05/thue-dj-cho-dam-cuoi-1-1024x683.jpg',
    },
    {
      MaDichVu: 8,
      TenDichVu: 'Hệ thống ánh sáng sân khấu',
      MaLoaiDichVu: 2,
      DonGia: 5000000,
      GhiChu: 'Đèn LED đổi màu',
      AnhURL:
        'https://7799wedding.vn/data/media/2458/images/mau-phong-cuoi-dep-hoi-truong%20(2).jpg',
    },
    {
      MaDichVu: 9,
      TenDichVu: 'Hệ thống âm thanh cao cấp',
      MaLoaiDichVu: 2,
      DonGia: 6000000,
      GhiChu: 'Loa JBL, âm thanh vòm',
      AnhURL:
        'https://khangphudataudio.com/wp-content/uploads/2015/12/dan-am-thanh-dam-cuoi-gia-re.jpg',
    },
    // Loại 3: Chụp ảnh và quay phim (4 dịch vụ)
    {
      MaDichVu: 10,
      TenDichVu: 'Chụp ảnh cưới sự kiện',
      MaLoaiDichVu: 3,
      DonGia: 7000000,
      GhiChu: 'Chụp 300 ảnh, chỉnh sửa cơ bản',
      AnhURL:
        'https://thanhdanhwedding.com/thumb/1366x620/1/upload/hinhanh/2-1695627704.jpg',
    },
    {
      MaDichVu: 11,
      TenDichVu: 'Quay phim tiệc cưới',
      MaLoaiDichVu: 3,
      DonGia: 10000000,
      GhiChu: 'Video 5 phút highlight',
      AnhURL:
        'https://producer.vn/wp-content/uploads/2017/04/huong-dan-quay-video-dam-cuoi-chi-tiet-nhat-1.jpg',
    },
    {
      MaDichVu: 12,
      TenDichVu: 'Chụp ảnh bàn tiệc',
      MaLoaiDichVu: 3,
      DonGia: 3000000,
      GhiChu: 'Chụp tất cả bàn tiệc',
      AnhURL:
        'https://images.squarespace-cdn.com/content/v1/5bf7bf0b506fbeeca9e55208/9474acba-5d45-4cab-a8a6-52ce31bed6fb/Annie+Vy-chup+anh+cuoi+phong+su-phong+su+cuoi-chup+anh+cuoi+quan+10-dich+vu+cuoi+tron+goi-dam+cuoi-tiec+cuoi-chup+hinh+ngay+cuoi-tron+goi+ngay+cuoi-chup+le+gia+tien-chup+le+ruoc+dau-chup+le+nha+tho1TQB+%28249%29.jpg',
    },
    {
      MaDichVu: 13,
      TenDichVu: 'Quay phim toàn bộ tiệc',
      MaLoaiDichVu: 3,
      DonGia: 12000000,
      GhiChu: 'Video 2 giờ, đầy đủ nghi lễ',
      AnhURL: 'https://addevent.vn/wp-content/uploads/2024/10/a-chau-4.jpg',
    },
    // Loại 4: Dịch vụ nhân sự (4 dịch vụ)
    {
      MaDichVu: 14,
      TenDichVu: 'MC dẫn chương trình',
      MaLoaiDichVu: 4,
      DonGia: 5000000,
      GhiChu: 'MC chuyên nghiệp, nói 2 ngôn ngữ',
      AnhURL:
        'https://anhvienmimosa.com.vn/wp-content/uploads/2023/02/kich-ban-mc-dam-cuoi-nha-trai-8.jpg',
    },
    {
      MaDichVu: 15,
      TenDichVu: 'Nhân viên phục vụ',
      MaLoaiDichVu: 4,
      DonGia: 2000000,
      GhiChu: 'Tính giá cho 10 nhân viên',
      AnhURL:
        'https://www.hoteljob.vn/files/Anh-HTJ-Hong/kinh-nghiem-lam-phuc-vu-tiec-cuoi-5.jpg',
    },
    {
      MaDichVu: 16,
      TenDichVu: 'Quản lý sự kiện',
      MaLoaiDichVu: 4,
      DonGia: 3000000,
      GhiChu: 'Điều phối toàn bộ tiệc',
      AnhURL:
        'https://7799wedding.vn/mediacenter/media/images/2458/products/2458/2825/s1000_1000/kyahz-wedding---psc-vannavi-1386-1563347118.jpg',
    },
    {
      MaDichVu: 17,
      TenDichVu: 'Đội bê tráp',
      MaLoaiDichVu: 4,
      DonGia: 2500000,
      GhiChu: '5 người, đồng phục truyền thống',
      AnhURL:
        'https://cuoihoihungthinh.com/wp-content/uploads/2022/04/IMG_1035.jpg',
    },
    // Loại 5: Dịch vụ bổ sung (3 dịch vụ)
    {
      MaDichVu: 18,
      TenDichVu: 'Xe hoa đón dâu',
      MaLoaiDichVu: 5,
      DonGia: 5000000,
      GhiChu: 'Xe 16 chỗ, trang trí hoa tươi',
      AnhURL:
        'https://dichvutieccuoihcm.com/uploads/source/trang-tri-xe-hoa/xe-hoa-cuoi-dep.jpg',
    },
    {
      MaDichVu: 19,
      TenDichVu: 'Pháo hoa sân khấu',
      MaLoaiDichVu: 5,
      DonGia: 4000000,
      GhiChu: 'Pháo hoa lạnh, an toàn',
      AnhURL:
        'https://cuoihoihoangvu.com.vn/wp-content/uploads/2014/03/phao-dien-dam-cuoi.jpg',
    },
    {
      MaDichVu: 20,
      TenDichVu: 'Bánh cưới 3 tầng',
      MaLoaiDichVu: 5,
      DonGia: 3000000,
      GhiChu: 'Thiết kế theo yêu cầu',
      AnhURL:
        'https://cuoihoiphuonganh.com/sites/default/files/2018-11/banh-cuoi-dep-4.jpg',
    },
  ]);

  // 1. Seed bảng LOAIMONAN
  const loaiMonAnData = [
    { MaLoaiMonAn: 1, TenLoaiMonAn: 'Khai vị' },
    { MaLoaiMonAn: 2, TenLoaiMonAn: 'Gỏi - Salad' },
    { MaLoaiMonAn: 3, TenLoaiMonAn: 'Súp' },
    { MaLoaiMonAn: 4, TenLoaiMonAn: 'Món Gà' },
    { MaLoaiMonAn: 5, TenLoaiMonAn: 'Món Bò' },
    { MaLoaiMonAn: 6, TenLoaiMonAn: 'Món Heo' },
    { MaLoaiMonAn: 7, TenLoaiMonAn: 'Món Hải Sản' },
    { MaLoaiMonAn: 8, TenLoaiMonAn: 'Món Rau - Củ' },
    { MaLoaiMonAn: 9, TenLoaiMonAn: 'Cơm - Mì - Miến' },
    { MaLoaiMonAn: 10, TenLoaiMonAn: 'Lẩu' },
    { MaLoaiMonAn: 11, TenLoaiMonAn: 'Tráng miệng' },
    { MaLoaiMonAn: 12, TenLoaiMonAn: 'Đồ uống đặc biệt' },
  ];
  await knex('LOAIMONAN').insert(loaiMonAnData);

  const monAnData = [];
  const baseMonAn = [
    // Khai vị (MaLoaiMonAn: 1)
    {
      TenMonAn: 'Chả giò hải sản',
      MaLoaiMonAn: 1,
      DonGia: 95000,
      GhiChu: 'Giòn rụm, nhân đầy đặn',
    },
    {
      TenMonAn: 'Nem nướng Nha Trang',
      MaLoaiMonAn: 1,
      DonGia: 120000,
      GhiChu: 'Ăn kèm rau sống, bánh tráng',
    },
    { TenMonAn: 'Bánh tôm Hồ Tây', MaLoaiMonAn: 1, DonGia: 85000 },
    { TenMonAn: 'Phồng tôm chiên', MaLoaiMonAn: 1, DonGia: 45000 },
    { TenMonAn: 'Đậu hũ chiên sả', MaLoaiMonAn: 1, DonGia: 65000 },
    // Gỏi - Salad (MaLoaiMonAn: 2)
    {
      TenMonAn: 'Gỏi ngó sen tôm thịt',
      MaLoaiMonAn: 2,
      DonGia: 130000,
      GhiChu: 'Vị chua ngọt thanh mát',
    },
    { TenMonAn: 'Salad Caesar gà nướng', MaLoaiMonAn: 2, DonGia: 150000 },
    { TenMonAn: 'Gỏi cuốn tôm thịt', MaLoaiMonAn: 2, DonGia: 80000 },
    { TenMonAn: 'Nộm sứa dừa tươi', MaLoaiMonAn: 2, DonGia: 110000 },
    { TenMonAn: 'Salad dầu giấm trứng', MaLoaiMonAn: 2, DonGia: 90000 },
    // Súp (MaLoaiMonAn: 3)
    {
      TenMonAn: 'Súp cua tuyết nhĩ',
      MaLoaiMonAn: 3,
      DonGia: 75000,
      GhiChu: 'Bổ dưỡng, thơm ngon',
    },
    { TenMonAn: 'Súp hải sản tóc tiên', MaLoaiMonAn: 3, DonGia: 85000 },
    { TenMonAn: 'Súp gà ngô non', MaLoaiMonAn: 3, DonGia: 65000 },
    { TenMonAn: 'Súp bí đỏ kem tươi', MaLoaiMonAn: 3, DonGia: 70000 },
    { TenMonAn: 'Súp măng tây cua', MaLoaiMonAn: 3, DonGia: 90000 },
    // Món Gà (MaLoaiMonAn: 4)
    {
      TenMonAn: 'Gà hấp lá chanh',
      MaLoaiMonAn: 4,
      DonGia: 350000,
      GhiChu: 'Gà ta thả vườn',
    },
    { TenMonAn: 'Gà nướng mật ong', MaLoaiMonAn: 4, DonGia: 380000 },
    {
      TenMonAn: 'Cà ri gà kiểu Thái',
      MaLoaiMonAn: 4,
      DonGia: 280000,
      GhiChu: 'Cay nồng đặc trưng',
    },
    { TenMonAn: 'Gà rang muối Hồng Kông', MaLoaiMonAn: 4, DonGia: 360000 },
    { TenMonAn: 'Lẩu gà nấm thiên nhiên', MaLoaiMonAn: 4, DonGia: 450000 },
    { TenMonAn: 'Cánh gà chiên nước mắm', MaLoaiMonAn: 4, DonGia: 180000 },
    {
      TenMonAn: 'Chân gà rút xương ngâm sả tắc',
      MaLoaiMonAn: 4,
      DonGia: 150000,
    },
    // Món Bò (MaLoaiMonAn: 5)
    {
      TenMonAn: 'Bò lúc lắc khoai tây',
      MaLoaiMonAn: 5,
      DonGia: 250000,
      GhiChu: 'Bò mềm, khoai giòn',
    },
    { TenMonAn: 'Bò bít tết sốt tiêu xanh', MaLoaiMonAn: 5, DonGia: 280000 },
    { TenMonAn: 'Bò nhúng dấm', MaLoaiMonAn: 5, DonGia: 320000 },
    { TenMonAn: 'Nạm bò xào sả ớt', MaLoaiMonAn: 5, DonGia: 220000 },
    { TenMonAn: 'Bò cuộn nấm kim châm nướng', MaLoaiMonAn: 5, DonGia: 260000 },
    { TenMonAn: 'Phở bò tái lăn', MaLoaiMonAn: 5, DonGia: 120000 },
    // Món Heo (MaLoaiMonAn: 6)
    {
      TenMonAn: 'Sườn non nướng BBQ',
      MaLoaiMonAn: 6,
      DonGia: 300000,
      GhiChu: 'Sốt đậm đà',
    },
    { TenMonAn: 'Ba chỉ rang cháy cạnh', MaLoaiMonAn: 6, DonGia: 180000 },
    {
      TenMonAn: 'Thịt kho tàu trứng cút',
      MaLoaiMonAn: 6,
      DonGia: 220000,
      GhiChu: 'Truyền thống',
    },
    { TenMonAn: 'Tai heo ngâm giấm', MaLoaiMonAn: 6, DonGia: 150000 },
    { TenMonAn: 'Giò heo muối chiên giòn', MaLoaiMonAn: 6, DonGia: 280000 },
    // Món Hải Sản (MaLoaiMonAn: 7)
    {
      TenMonAn: 'Tôm hùm nướng bơ tỏi',
      MaLoaiMonAn: 7,
      DonGia: 1200000,
      GhiChu: 'Tôm hùm bông size lớn',
    },
    { TenMonAn: 'Cua rang me', MaLoaiMonAn: 7, DonGia: 750000 },
    { TenMonAn: 'Mực nướng sa tế', MaLoaiMonAn: 7, DonGia: 320000 },
    { TenMonAn: 'Cá diêu hồng hấp Hồng Kông', MaLoaiMonAn: 7, DonGia: 450000 },
    {
      TenMonAn: 'Hàu nướng mỡ hành',
      MaLoaiMonAn: 7,
      DonGia: 180000,
      GhiChu: '10 con',
    },
    { TenMonAn: 'Ốc hương rang muối ớt', MaLoaiMonAn: 7, DonGia: 280000 },
    { TenMonAn: 'Sò điệp nướng phô mai', MaLoaiMonAn: 7, DonGia: 250000 },
    // Món Rau - Củ (MaLoaiMonAn: 8)
    { TenMonAn: 'Rau muống xào tỏi', MaLoaiMonAn: 8, DonGia: 70000 },
    {
      TenMonAn: 'Cải thìa sốt dầu hào nấm đông cô',
      MaLoaiMonAn: 8,
      DonGia: 95000,
    },
    { TenMonAn: 'Bông thiên lý xào thịt bò', MaLoaiMonAn: 8, DonGia: 130000 },
    { TenMonAn: 'Mướp đắng xào trứng', MaLoaiMonAn: 8, DonGia: 80000 },
    { TenMonAn: 'Đậu que xào tôm', MaLoaiMonAn: 8, DonGia: 110000 },
    // Cơm - Mì - Miến (MaLoaiMonAn: 9)
    { TenMonAn: 'Cơm chiên Dương Châu', MaLoaiMonAn: 9, DonGia: 120000 },
    { TenMonAn: 'Mì xào hải sản', MaLoaiMonAn: 9, DonGia: 150000 },
    { TenMonAn: 'Miến xào cua bể', MaLoaiMonAn: 9, DonGia: 180000 },
    { TenMonAn: 'Cơm niêu cá kho tộ', MaLoaiMonAn: 9, DonGia: 160000 },
    { TenMonAn: 'Phở xào bò mềm', MaLoaiMonAn: 9, DonGia: 130000 },
    // Lẩu (MaLoaiMonAn: 10)
    {
      TenMonAn: 'Lẩu Thái Tomyum hải sản',
      MaLoaiMonAn: 10,
      DonGia: 550000,
      GhiChu: 'Đủ vị chua cay',
    },
    { TenMonAn: 'Lẩu riêu cua bắp bò', MaLoaiMonAn: 10, DonGia: 480000 },
    { TenMonAn: 'Lẩu nấm thập cẩm chay', MaLoaiMonAn: 10, DonGia: 350000 },
    { TenMonAn: 'Lẩu cá kèo lá giang', MaLoaiMonAn: 10, DonGia: 420000 },
    { TenMonAn: 'Lẩu dê tiềm thuốc bắc', MaLoaiMonAn: 10, DonGia: 600000 },
    // Tráng miệng (MaLoaiMonAn: 11)
    { TenMonAn: 'Chè khúc bạch', MaLoaiMonAn: 11, DonGia: 45000 },
    { TenMonAn: 'Trái cây thập cẩm theo mùa', MaLoaiMonAn: 11, DonGia: 90000 },
    { TenMonAn: 'Bánh flan caramen', MaLoaiMonAn: 11, DonGia: 35000 },
    { TenMonAn: 'Rau câu dừa xiêm', MaLoaiMonAn: 11, DonGia: 40000 },
    { TenMonAn: 'Panna cotta chanh dây', MaLoaiMonAn: 11, DonGia: 55000 },
    // Đồ uống đặc biệt (MaLoaiMonAn: 12)
    { TenMonAn: 'Nước ép dưa hấu', MaLoaiMonAn: 12, DonGia: 50000 },
    { TenMonAn: 'Sinh tố bơ sáp', MaLoaiMonAn: 12, DonGia: 65000 },
    { TenMonAn: 'Trà đào cam sả', MaLoaiMonAn: 12, DonGia: 55000 },
    { TenMonAn: 'Mojito chanh bạc hà', MaLoaiMonAn: 12, DonGia: 70000 },
    { TenMonAn: 'Cà phê trứng Hà Nội', MaLoaiMonAn: 12, DonGia: 60000 },
  ];

  let maMonAnCounter = 1;
  for (const mon of baseMonAn) {
    monAnData.push({
      MaMonAn: maMonAnCounter++,
      ...mon,
      AnhURL: `k co`,
    });
  }

  // Tạo thêm món ăn để đạt gần 100 món
  const prefixes = [
    'Đặc biệt',
    'Siêu ngon',
    'Hảo hạng',
    'Truyền thống',
    'Hiện đại',
  ];
  const suffixes = [
    'kiểu mới',
    'sốt cay',
    'sốt me',
    'hấp',
    'nướng',
    'xào',
    'chiên',
  ];
  let additionalDishesCount = monAnData.length;

  while (additionalDishesCount < 100) {
    const randomBaseDish =
      baseMonAn[Math.floor(Math.random() * baseMonAn.length)];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    let newTenMonAn = `${randomPrefix} ${randomBaseDish.TenMonAn.split(' ')[0]} ${randomSuffix}`;
    if (monAnData.some((m) => m.TenMonAn === newTenMonAn)) {
      newTenMonAn = `${newTenMonAn} #${maMonAnCounter}`;
    }

    monAnData.push({
      MaMonAn: maMonAnCounter++,
      TenMonAn: newTenMonAn.substring(0, 100),
      MaLoaiMonAn: randomBaseDish.MaLoaiMonAn,
      DonGia:
        Math.floor(
          (randomBaseDish.DonGia * (0.8 + Math.random() * 0.4)) / 1000
        ) * 1000,
      GhiChu: `Biến tấu từ ${randomBaseDish.TenMonAn}`,
      AnhURL: `k co`,
    });
    additionalDishesCount++;
  }
  await knex('MONAN').insert(monAnData);

  // Seed bảng THUCDON (18 thực đơn: 6 mức giá 1-2tr, 6 mức giá 2-4tr, 6 mức giá 4tr+)
  const thucDonEntries = [];
  const thucDonMonAnEntries = [];

  const priceRanges = [
    { min: 1000000, max: 2000000, count: 6 }, // 6 thực đơn 1-2 triệu
    { min: 2000001, max: 4000000, count: 6 }, // 6 thực đơn 2-4 triệu
    { min: 4000001, max: 6000000, count: 6 }, // 6 thực đơn 4 triệu trở lên
  ];

  let maThucDonCounter = 1;
  const originalMenus = []; // Lưu trữ 9 thực đơn đầu tiên để sao chép

  for (const range of priceRanges) {
    for (let i = 0; i < range.count / 2; i++) {
      // Tạo 3 thực đơn đầu tiên cho mỗi mức giá
      const tenThucDon = `Thực đơn mẫu ${maThucDonCounter}`;
      const soNguoi = Math.floor(Math.random() * 4 + 4); // 4-7 người
      const ghiChuThucDon = `Set menu bao gồm các món ăn chọn lọc, phù hợp cho ${soNguoi} người.`;

      const monAnTrongThucDon = [];
      let tongGiaThucDon = 0;
      let soLuongMon;

      // Xác định số lượng món dựa trên mức giá
      if (range.min <= 2000000) {
        soLuongMon = Math.floor(Math.random() * 3) + 5; // 5-7 món cho 1-2 triệu
      } else if (range.min <= 4000000) {
        soLuongMon = Math.floor(Math.random() * 4) + 7; // 7-10 món cho 2-4 triệu
      } else {
        soLuongMon = Math.floor(Math.random() * 5) + 10; // 10-14 món cho 4 triệu+
      }

      // Chọn món ngẫu nhiên, ưu tiên món đắt cho mức giá cao
      const availableMonAnIds = [...monAnData.map((m) => m.MaMonAn)];
      let attempts = 0;
      const maxAttempts = 100;

      while (tongGiaThucDon < range.min && attempts < maxAttempts) {
        if (availableMonAnIds.length === 0) break;
        const randomIndex = Math.floor(
          Math.random() * availableMonAnIds.length
        );
        const selectedMonAnId = availableMonAnIds.splice(randomIndex, 1)[0];
        const monAnDetail = monAnData.find(
          (m) => m.MaMonAn === selectedMonAnId
        );

        if (monAnDetail) {
          // Ưu tiên món đắt (như hải sản) cho thực đơn giá cao
          if (
            range.min > 2000000 &&
            monAnDetail.DonGia < 300000 &&
            Math.random() > 0.3
          ) {
            continue; // Bỏ qua món rẻ với xác suất 70% cho thực đơn giá cao
          }
          monAnTrongThucDon.push({
            MaThucDon: maThucDonCounter,
            MaMonAn: monAnDetail.MaMonAn,
            DonGiaThoiDiemDat: monAnDetail.DonGia,
          });
          tongGiaThucDon += monAnDetail.DonGia;
        }
        attempts++;
      }

      // Đảm bảo tổng giá nằm trong khoảng yêu cầu
      if (tongGiaThucDon < range.min || tongGiaThucDon > range.max) {
        // Điều chỉnh bằng cách thêm hoặc bớt món
        if (tongGiaThucDon < range.min) {
          const highPriceMonAn = monAnData
            .filter(
              (m) =>
                m.DonGia >= 300000 &&
                !monAnTrongThucDon.some((item) => item.MaMonAn === m.MaMonAn)
            )
            .sort((a, b) => b.DonGia - a.DonGia);
          for (const mon of highPriceMonAn) {
            if (tongGiaThucDon >= range.min && tongGiaThucDon <= range.max)
              break;
            if (tongGiaThucDon + mon.DonGia <= range.max) {
              monAnTrongThucDon.push({
                MaThucDon: maThucDonCounter,
                MaMonAn: mon.MaMonAn,
                DonGiaThoiDiemDat: mon.DonGia,
              });
              tongGiaThucDon += mon.DonGia;
            }
          }
        } else if (tongGiaThucDon > range.max) {
          monAnTrongThucDon.sort(
            (a, b) => b.DonGiaThoiDiemDat - a.DonGiaThoiDiemDat
          );
          while (tongGiaThucDon > range.max && monAnTrongThucDon.length > 0) {
            const removed = monAnTrongThucDon.pop();
            tongGiaThucDon -= removed.DonGiaThoiDiemDat;
            availableMonAnIds.push(removed.MaMonAn);
          }
        }
      }

      // Đảm bảo có ít nhất số lượng món tối thiểu
      while (
        monAnTrongThucDon.length < soLuongMon &&
        availableMonAnIds.length > 0
      ) {
        const randomIndex = Math.floor(
          Math.random() * availableMonAnIds.length
        );
        const selectedMonAnId = availableMonAnIds.splice(randomIndex, 1)[0];
        const monAnDetail = monAnData.find(
          (m) => m.MaMonAn === selectedMonAnId
        );
        if (monAnDetail && tongGiaThucDon + monAnDetail.DonGia <= range.max) {
          monAnTrongThucDon.push({
            MaThucDon: maThucDonCounter,
            MaMonAn: monAnDetail.MaMonAn,
            DonGiaThoiDiemDat: monAnDetail.DonGia,
          });
          tongGiaThucDon += monAnDetail.DonGia;
        }
      }

      thucDonEntries.push({
        MaThucDon: maThucDonCounter,
        TenThucDon: tenThucDon,
        DonGiaThoiDiemDat: tongGiaThucDon,
        DonGiaHienTai: tongGiaThucDon,
        GhiChu: ghiChuThucDon,
      });
      thucDonMonAnEntries.push(...monAnTrongThucDon);
      originalMenus.push({
        TenThucDon: tenThucDon,
        DonGiaThoiDiemDat: tongGiaThucDon,
        DonGiaHienTai: tongGiaThucDon,
        GhiChu: ghiChuThucDon,
        MonAnList: [...monAnTrongThucDon],
      });
      maThucDonCounter++;
    }
  }

  // Sao chép 9 thực đơn đầu tiên để tạo 9 thực đơn tiếp theo
  for (let i = 0; i < originalMenus.length; i++) {
    const original = originalMenus[i];
    const newMaThucDon = maThucDonCounter++;
    const newTenThucDon = `Thực đơn cho tiệc cưới ${newMaThucDon}`;
    thucDonEntries.push({
      MaThucDon: newMaThucDon,
      TenThucDon: newTenThucDon,
      DonGiaThoiDiemDat: original.DonGiaThoiDiemDat,
      DonGiaHienTai: original.DonGiaHienTai,
      GhiChu: original.GhiChu,
    });
    const duplicatedMonAn = original.MonAnList.map((mon) => ({
      MaThucDon: newMaThucDon,
      MaMonAn: mon.MaMonAn,
      DonGiaThoiDiemDat: mon.DonGiaThoiDiemDat,
    }));
    thucDonMonAnEntries.push(...duplicatedMonAn);
  }

  await knex('THUCDON').insert(thucDonEntries);

  // Seed bảng THUCDON_MONAN
  await knex('THUCDON_MONAN').insert(thucDonMonAnEntries);

  // Bảng THUCDON_MONAN không có cột SERIAL nên không cần reset sequence cho nó.
  await knex('DATTIEC').insert([
    {
      MaDatTiec: 1,
      TenChuRe: 'Nguyễn Văn An',
      TenCoDau: 'Trần Thị Bình',
      DienThoai: '0901234567',
      NgayDaiTiec: '2025-06-15',
      MaCa: 1,
      MaSanh: 1,
      MaThucDon: 10,
      TienDatCoc: 12000000.0,
      SoLuongBan: 30,
      SoBanDuTru: 5,
    },
    {
      MaDatTiec: 2,
      TenChuRe: 'Lê Hoàng Bảo',
      TenCoDau: 'Phạm Ngọc Châu',
      DienThoai: '0912345678',
      NgayDaiTiec: '2025-07-20',
      MaCa: 2,
      MaSanh: 2,
      MaThucDon: 11,
      TienDatCoc: 15000000.0,
      SoLuongBan: 40,
      SoBanDuTru: 8,
    },
    {
      MaDatTiec: 3,
      TenChuRe: 'Trần Quốc Cường',
      TenCoDau: 'Nguyễn Thị Dung',
      DienThoai: '0923456789',
      NgayDaiTiec: '2025-08-10',
      MaCa: 3,
      MaSanh: 3,
      MaThucDon: 12,
      TienDatCoc: 10000000.0,
      SoLuongBan: 25,
      SoBanDuTru: 3,
    },
    {
      MaDatTiec: 4,
      TenChuRe: 'Phạm Văn Dũng',
      TenCoDau: 'Lê Thị Hà',
      DienThoai: '0934567890',
      NgayDaiTiec: '2025-09-05',
      MaCa: 4,
      MaSanh: 4,
      MaThucDon: 13,
      TienDatCoc: 13000000.0,
      SoLuongBan: 35,
      SoBanDuTru: 5,
    },
    {
      MaDatTiec: 5,
      TenChuRe: 'Ngô Minh Hùng',
      TenCoDau: 'Võ Thị Kim',
      DienThoai: '0945678901',
      NgayDaiTiec: '2025-10-12',
      MaCa: 5,
      MaSanh: 5,
      MaThucDon: 14,
      TienDatCoc: 11000000.0,
      SoLuongBan: 28,
      SoBanDuTru: 4,
    },
    {
      MaDatTiec: 6,
      TenChuRe: 'Vũ Thành Long',
      TenCoDau: 'Đỗ Thị Mai',
      DienThoai: '0956789012',
      NgayDaiTiec: '2025-11-18',
      MaCa: 1,
      MaSanh: 6,
      MaThucDon: 15,
      TienDatCoc: 14000000.0,
      SoLuongBan: 38,
      SoBanDuTru: 6,
    },
    {
      MaDatTiec: 7,
      TenChuRe: 'Bùi Quốc Nam',
      TenCoDau: 'Hà Thị Ngọc',
      DienThoai: '0967890123',
      NgayDaiTiec: '2025-12-01',
      MaCa: 2,
      MaSanh: 7,
      MaThucDon: 16,
      TienDatCoc: 9000000.0,
      SoLuongBan: 20,
      SoBanDuTru: 2,
    },
    {
      MaDatTiec: 8,
      TenChuRe: 'Đặng Văn Phong',
      TenCoDau: 'Trương Thị Quỳnh',
      DienThoai: '0978901234',
      NgayDaiTiec: '2025-06-25',
      MaCa: 3,
      MaSanh: 8,
      MaThucDon: 17,
      TienDatCoc: 16000000.0,
      SoLuongBan: 45,
      SoBanDuTru: 5,
    },
    {
      MaDatTiec: 9,
      TenChuRe: 'Hoàng Minh Quân',
      TenCoDau: 'Ngô Thị Thu',
      DienThoai: '0989012345',
      NgayDaiTiec: '2025-07-30',
      MaCa: 4,
      MaSanh: 9,
      MaThucDon: 18,
      TienDatCoc: 10500000.0,
      SoLuongBan: 27,
      SoBanDuTru: 3,
    },
    {
      MaDatTiec: 10,
      TenChuRe: 'Lý Văn Sơn',
      TenCoDau: 'Phan Thị Uyên',
      DienThoai: '0990123456',
      NgayDaiTiec: '2025-08-15',
      MaCa: 5,
      MaSanh: 10,
      MaThucDon: 18,
      TienDatCoc: 12500000.0,
      SoLuongBan: 32,
      SoBanDuTru: 4,
    },
  ]);
  // Thêm dữ liệu vào DATTIEC_DICHVU
  await knex('DATTIEC_DICHVU').insert([
    // Đặt tiệc 1
    {
      MaDatTiec: 1,
      MaDichVu: 1,
      SoLuong: 2,
      DonGiaThoiDiemDat: 5000000,
      ThanhTien: 10000000,
    },
    {
      MaDatTiec: 1,
      MaDichVu: 6,
      SoLuong: 1,
      DonGiaThoiDiemDat: 15000000,
      ThanhTien: 15000000,
    },
    {
      MaDatTiec: 1,
      MaDichVu: 10,
      SoLuong: 1,
      DonGiaThoiDiemDat: 7000000,
      ThanhTien: 7000000,
    },
    // Đặt tiệc 2
    {
      MaDatTiec: 2,
      MaDichVu: 2,
      SoLuong: 1,
      DonGiaThoiDiemDat: 10000000,
      ThanhTien: 10000000,
    },
    {
      MaDatTiec: 2,
      MaDichVu: 7,
      SoLuong: 1,
      DonGiaThoiDiemDat: 8000000,
      ThanhTien: 8000000,
    },
    {
      MaDatTiec: 2,
      MaDichVu: 14,
      SoLuong: 1,
      DonGiaThoiDiemDat: 5000000,
      ThanhTien: 5000000,
    },
    {
      MaDatTiec: 2,
      MaDichVu: 18,
      SoLuong: 1,
      DonGiaThoiDiemDat: 5000000,
      ThanhTien: 5000000,
    },
    // Đặt tiệc 3
    {
      MaDatTiec: 3,
      MaDichVu: 3,
      SoLuong: 1,
      DonGiaThoiDiemDat: 3000000,
      ThanhTien: 3000000,
    },
    {
      MaDatTiec: 3,
      MaDichVu: 8,
      SoLuong: 1,
      DonGiaThoiDiemDat: 5000000,
      ThanhTien: 5000000,
    },
    // Đặt tiệc 4
    {
      MaDatTiec: 4,
      MaDichVu: 4,
      SoLuong: 1,
      DonGiaThoiDiemDat: 4000000,
      ThanhTien: 4000000,
    },
    {
      MaDatTiec: 4,
      MaDichVu: 11,
      SoLuong: 1,
      DonGiaThoiDiemDat: 10000000,
      ThanhTien: 10000000,
    },
    {
      MaDatTiec: 4,
      MaDichVu: 15,
      SoLuong: 2,
      DonGiaThoiDiemDat: 2000000,
      ThanhTien: 4000000,
    },
    // Đặt tiệc 5
    {
      MaDatTiec: 5,
      MaDichVu: 5,
      SoLuong: 1,
      DonGiaThoiDiemDat: 2000000,
      ThanhTien: 2000000,
    },
    {
      MaDatTiec: 5,
      MaDichVu: 9,
      SoLuong: 1,
      DonGiaThoiDiemDat: 6000000,
      ThanhTien: 6000000,
    },
    {
      MaDatTiec: 5,
      MaDichVu: 12,
      SoLuong: 1,
      DonGiaThoiDiemDat: 3000000,
      ThanhTien: 3000000,
    },
    // Đặt tiệc 6
    {
      MaDatTiec: 6,
      MaDichVu: 1,
      SoLuong: 3,
      DonGiaThoiDiemDat: 5000000,
      ThanhTien: 15000000,
    },
    {
      MaDatTiec: 6,
      MaDichVu: 13,
      SoLuong: 1,
      DonGiaThoiDiemDat: 12000000,
      ThanhTien: 12000000,
    },
    {
      MaDatTiec: 6,
      MaDichVu: 16,
      SoLuong: 1,
      DonGiaThoiDiemDat: 3000000,
      ThanhTien: 3000000,
    },
    // Đặt tiệc 7
    {
      MaDatTiec: 7,
      MaDichVu: 2,
      SoLuong: 1,
      DonGiaThoiDiemDat: 10000000,
      ThanhTien: 10000000,
    },
    {
      MaDatTiec: 7,
      MaDichVu: 19,
      SoLuong: 1,
      DonGiaThoiDiemDat: 4000000,
      ThanhTien: 4000000,
    },
    // Đặt tiệc 8
    {
      MaDatTiec: 8,
      MaDichVu: 3,
      SoLuong: 2,
      DonGiaThoiDiemDat: 3000000,
      ThanhTien: 6000000,
    },
    {
      MaDatTiec: 8,
      MaDichVu: 6,
      SoLuong: 1,
      DonGiaThoiDiemDat: 15000000,
      ThanhTien: 15000000,
    },
    {
      MaDatTiec: 8,
      MaDichVu: 20,
      SoLuong: 1,
      DonGiaThoiDiemDat: 3000000,
      ThanhTien: 3000000,
    },
    {
      MaDatTiec: 8,
      MaDichVu: 14,
      SoLuong: 1,
      DonGiaThoiDiemDat: 5000000,
      ThanhTien: 5000000,
    },
    // Đặt tiệc 9
    {
      MaDatTiec: 9,
      MaDichVu: 4,
      SoLuong: 1,
      DonGiaThoiDiemDat: 4000000,
      ThanhTien: 4000000,
    },
    {
      MaDatTiec: 9,
      MaDichVu: 10,
      SoLuong: 1,
      DonGiaThoiDiemDat: 7000000,
      ThanhTien: 7000000,
    },
    // Đặt tiệc 10
    {
      MaDatTiec: 10,
      MaDichVu: 5,
      SoLuong: 2,
      DonGiaThoiDiemDat: 2000000,
      ThanhTien: 4000000,
    },
    {
      MaDatTiec: 10,
      MaDichVu: 7,
      SoLuong: 1,
      DonGiaThoiDiemDat: 8000000,
      ThanhTien: 8000000,
    },
    {
      MaDatTiec: 10,
      MaDichVu: 17,
      SoLuong: 1,
      DonGiaThoiDiemDat: 2500000,
      ThanhTien: 2500000,
    },
  ]);
  await knex('HOADON').insert([
    {
      MaHoaDon: 1,
      MaDatTiec: 1,
      NgayThanhToan: '2025-06-17',
      TongTienBan: 30000000.0, // 30 bàn * 1,000,000
      TongTienDichVu: 2000000.0,
      TongTienHoaDon: 32000000.0, // 30,000,000 + 2,000,000
      ApDungQuyDinhPhat: true,
      PhanTramPhatMotNgay: 5.0,
      TongTienPhat: 3200000.0, // (32,000,000 * 5% * 2 ngày)
      TongTienConLai: 23200000.0, // 32,000,000 + 3,200,000 - 12,000,000
      TrangThai: 0,
    },
    {
      MaHoaDon: 2,
      MaDatTiec: 2,
      NgayThanhToan: '2025-07-22',
      TongTienBan: 40000000.0, // 40 bàn * 1,000,000
      TongTienDichVu: 3000000.0,
      TongTienHoaDon: 43000000.0, // 40,000,000 + 3,000,000
      ApDungQuyDinhPhat: false,
      PhanTramPhatMotNgay: 0.0,
      TongTienPhat: 0.0,
      TongTienConLai: 28000000.0, // 43,000,000 - 15,000,000
      TrangThai: 1,
    },
    {
      MaHoaDon: 3,
      MaDatTiec: 3,
      NgayThanhToan: '2025-08-12',
      TongTienBan: 25000000.0, // 25 bàn * 1,000,000
      TongTienDichVu: 0.0,
      TongTienHoaDon: 25000000.0,
      ApDungQuyDinhPhat: true,
      PhanTramPhatMotNgay: 3.0,
      TongTienPhat: 1500000.0, // (25,000,000 * 3% * 2 ngày)
      TongTienConLai: 16500000.0, // 25,000,000 + 1,500,000 - 10,000,000
      TrangThai: 0,
    },
    {
      MaHoaDon: 4,
      MaDatTiec: 4,
      NgayThanhToan: '2025-09-07',
      TongTienBan: 35000000.0, // 35 bàn * 1,000,000
      TongTienDichVu: 4000000.0,
      TongTienHoaDon: 39000000.0, // 35,000,000 + 4,000,000
      ApDungQuyDinhPhat: false,
      PhanTramPhatMotNgay: 0.0,
      TongTienPhat: 0.0,
      TongTienConLai: 26000000.0, // 39,000,000 - 13,000,000
      TrangThai: 1,
    },
    {
      MaHoaDon: 5,
      MaDatTiec: 5,
      NgayThanhToan: '2025-10-14',
      TongTienBan: 28000000.0, // 28 bàn * 1,000,000
      TongTienDichVu: 1000000.0,
      TongTienHoaDon: 29000000.0, // 28,000,000 + 1,000,000
      ApDungQuyDinhPhat: true,
      PhanTramPhatMotNgay: 7.0,
      TongTienPhat: 4060000.0, // (29,000,000 * 7% * 2 ngày)
      TongTienConLai: 22060000.0, // 29,000,000 + 4,060,000 - 11,000,000
      TrangThai: 0,
    },
    {
      MaHoaDon: 6,
      MaDatTiec: 6,
      NgayThanhToan: '2025-11-20',
      TongTienBan: 38000000.0, // 38 bàn * 1,000,000
      TongTienDichVu: 5000000.0,
      TongTienHoaDon: 43000000.0, // 38,000,000 + 5,000,000
      ApDungQuyDinhPhat: false,
      PhanTramPhatMotNgay: 0.0,
      TongTienPhat: 0.0,
      TongTienConLai: 29000000.0, // 43,000,000 - 14,000,000
      TrangThai: 1,
    },
    {
      MaHoaDon: 7,
      MaDatTiec: 7,
      NgayThanhToan: '2025-12-03',
      TongTienBan: 20000000.0, // 20 bàn * 1,000,000
      TongTienDichVu: 0.0,
      TongTienHoaDon: 20000000.0,
      ApDungQuyDinhPhat: true,
      PhanTramPhatMotNgay: 4.0,
      TongTienPhat: 800000.0, // (20,000,000 * 4% * 1 ngày)
      TongTienConLai: 11800000.0, // 20,000,000 + 800,000 - 9,000,000
      TrangThai: 2,
    },
    {
      MaHoaDon: 8,
      MaDatTiec: 8,
      NgayThanhToan: '2025-06-27',
      TongTienBan: 45000000.0, // 45 bàn * 1,000,000
      TongTienDichVu: 3000000.0,
      TongTienHoaDon: 48000000.0, // 45,000,000 + 3,000,000
      ApDungQuyDinhPhat: false,
      PhanTramPhatMotNgay: 0.0,
      TongTienPhat: 0.0,
      TongTienConLai: 32000000.0, // 48,000,000 - 16,000,000
      TrangThai: 1,
    },
    {
      MaHoaDon: 9,
      MaDatTiec: 9,
      NgayThanhToan: '2025-08-01',
      TongTienBan: 27000000.0, // 27 bàn * 1,000,000
      TongTienDichVu: 2000000.0,
      TongTienHoaDon: 29000000.0, // 27,000,000 + 2,000,000
      ApDungQuyDinhPhat: true,
      PhanTramPhatMotNgay: 6.0,
      TongTienPhat: 1740000.0, // (29,000,000 * 6% * 1 ngày)
      TongTienConLai: 20240000.0, // 29,000,000 + 1,740,000 - 10,500,000
      TrangThai: 0,
    },
    {
      MaHoaDon: 10,
      MaDatTiec: 10,
      NgayThanhToan: '2025-08-17',
      TongTienBan: 32000000.0, // 32 bàn * 1,000,000
      TongTienDichVu: 4000000.0,
      TongTienHoaDon: 36000000.0, // 32,000,000 + 4,000,000
      ApDungQuyDinhPhat: false,
      PhanTramPhatMotNgay: 0.0,
      TongTienPhat: 0.0,
      TongTienConLai: 23500000.0, // 36,000,000 - 12,500,000
      TrangThai: 1,
    },
  ]);
  // Đặt lại sequence sau khi chèn dữ liệu
  await knex.raw('SELECT setval(\'"CHUCNANG_MaChucNang_seq"\', 15)'); // Sau MaChucNang: 11
  await knex.raw('SELECT setval(\'"NHOMNGUOIDUNG_MaNhom_seq"\', 5)'); // Sau MaNhom: 1
  await knex.raw('SELECT setval(\'"NGUOIDUNG_MaNguoiDung_seq"\', 5)'); // Sau MaNguoiDung: 1
  await knex.raw('SELECT setval(\'"LOAISANH_MaLoaiSanh_seq"\', 3)'); // Sau MaLoaiSanh: 5
  await knex.raw('SELECT setval(\'"CA_MaCa_seq"\', 5)'); // Sau MaCa: 2
  await knex.raw('SELECT setval(\'"LOAIDICHVU_MaLoaiDichVu_seq"\', 5)'); // Sau MaLoaiDichVu: 5
  await knex.raw('SELECT setval(\'"DICHVU_MaDichVu_seq"\', 20)'); // Sau MaDichVu: 20
  await knex.raw('SELECT setval(\'"HOADON_MaHoaDon_seq"\', 10)'); // Sau MaHoaDon: 11
  // Đặt lại sequence cho các bảng
  await knex.raw(
    `SELECT setval('"LOAIMONAN_MaLoaiMonAn_seq"', (SELECT MAX("MaLoaiMonAn") FROM "LOAIMONAN"))`
  );
  await knex.raw(
    `SELECT setval('"MONAN_MaMonAn_seq"', (SELECT MAX("MaMonAn") FROM "MONAN"))`
  );
  await knex.raw(
    `SELECT setval('"THUCDON_MaThucDon_seq"', (SELECT MAX("MaThucDon") FROM "THUCDON"))`
  );
  await knex.raw('SELECT setval(\'"DATTIEC_MaDatTiec_seq"\', 10)'); // Sau MaDatTiec: 11
}
