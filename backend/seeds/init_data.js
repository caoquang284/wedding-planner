import { hash } from 'bcrypt';

export async function seed(knex) {
  await knex('THUCDON_MONAN').del();
  await knex('THUCDON').del();
  await knex('MONAN').del();
  await knex('LOAIMONAN').del();
  await knex('PHANQUYEN').del();
  await knex('REFRESH_TOKEN').del();
  await knex('NGUOIDUNG').del();
  await knex('NHOMNGUOIDUNG').del();
  await knex('CHUCNANG').del();
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

  // 2. Seed bảng MONAN (Khoảng 100 món ăn)
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
    { TenMonAn: 'Lẩu gà nấm thiên nhiên', MaLoaiMonAn: 4, DonGia: 450000 }, // Cũng có thể là loại Lẩu
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
    { TenMonAn: 'Phở bò tái lăn', MaLoaiMonAn: 5, DonGia: 120000 }, // Cũng có thể là Cơm - Mì
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
    { TenMonAn: 'Bông thiên lý xào thịt bò', MaLoaiMonAn: 8, DonGia: 130000 }, // Có thể là món bò
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
      AnhURL: `https://via.placeholder.com/150?text=${encodeURIComponent(mon.TenMonAn)}`,
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
    // Đảm bảo tên không quá dài và duy nhất (trong phạm vi seed này)
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
        ) * 1000, // Giá biến đổi chút
      GhiChu: `Biến tấu từ ${randomBaseDish.TenMonAn}`,
      AnhURL: `https://via.placeholder.com/150?text=${encodeURIComponent(newTenMonAn.substring(0, 15))}`,
    });
    additionalDishesCount++;
  }
  await knex('MONAN').insert(monAnData);

  // 3. Seed bảng THUCDON (10 thực đơn)
  const thucDonEntries = [];
  const thucDonMonAnEntries = [];

  for (let i = 1; i <= 10; i++) {
    const tenThucDon = `Thực đơn Đặc Biệt ${i}`;
    const ghiChuThucDon = `Set menu bao gồm các món ăn chọn lọc, phù hợp cho ${Math.floor(Math.random() * 4 + 4)} người.`;

    const monAnTrongThucDon = [];
    let tongGiaThucDon = 0;
    const soLuongMon = Math.floor(Math.random() * 6) + 5; // 5-10 món mỗi thực đơn

    // Chọn món ngẫu nhiên, đảm bảo không trùng lặp trong một thực đơn
    const availableMonAnIds = [...monAnData.map((m) => m.MaMonAn)];
    for (let j = 0; j < soLuongMon; j++) {
      if (availableMonAnIds.length === 0) break;
      const randomIndex = Math.floor(Math.random() * availableMonAnIds.length);
      const selectedMonAnId = availableMonAnIds.splice(randomIndex, 1)[0];
      const monAnDetail = monAnData.find((m) => m.MaMonAn === selectedMonAnId);

      if (monAnDetail) {
        monAnTrongThucDon.push({
          MaThucDon: i,
          MaMonAn: monAnDetail.MaMonAn,
          DonGiaThoiDiemDat: monAnDetail.DonGia, // Lấy giá hiện tại của món ăn làm giá tại thời điểm đặt
        });
        tongGiaThucDon += monAnDetail.DonGia;
      }
    }

    thucDonEntries.push({
      MaThucDon: i,
      TenThucDon: tenThucDon,
      DonGiaThoiDiemDat: tongGiaThucDon,
      DonGiaHienTai: tongGiaThucDon, // Ban đầu có thể giống nhau
      GhiChu: ghiChuThucDon,
    });
    thucDonMonAnEntries.push(...monAnTrongThucDon);
  }
  await knex('THUCDON').insert(thucDonEntries);

  // 4. Seed bảng THUCDON_MONAN
  await knex('THUCDON_MONAN').insert(thucDonMonAnEntries);

  // 5. Đặt lại sequence cho các bảng (Quan trọng cho PostgreSQL)
  // Tên sequence có thể khác nhau tùy theo cách Knex tạo bảng, thường là TênBảng_TênCộtPK_seq
  await knex.raw(
    `SELECT setval('"LOAIMONAN_MaLoaiMonAn_seq"', (SELECT MAX("MaLoaiMonAn") FROM "LOAIMONAN"))`
  );
  await knex.raw(
    `SELECT setval('"MONAN_MaMonAn_seq"', (SELECT MAX("MaMonAn") FROM "MONAN"))`
  );
  await knex.raw(
    `SELECT setval('"THUCDON_MaThucDon_seq"', (SELECT MAX("MaThucDon") FROM "THUCDON"))`
  );
  // Bảng THUCDON_MONAN không có cột SERIAL nên không cần reset sequence cho nó.
}
