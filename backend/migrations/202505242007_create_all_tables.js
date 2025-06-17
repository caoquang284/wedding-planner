export const up = async (knex) => {
  // --- Các bảng quyền và người dùng ---
  await knex.schema.createTable('CHUCNANG', (table) => {
    table.increments('MaChucNang').primary();
    table.string('TenChucNang', 50).notNullable();
    table.string('TenManHinh', 50).notNullable();
  });

  await knex.schema.createTable('NHOMNGUOIDUNG', (table) => {
    table.increments('MaNhom').primary();
    table.string('TenNhom', 50).notNullable();
  });

  await knex.schema.createTable('PHANQUYEN', (table) => {
    table.integer('MaNhom').unsigned().notNullable();
    table.integer('MaChucNang').unsigned().notNullable();
    table.primary(['MaNhom', 'MaChucNang']);
    table.foreign('MaNhom').references('MaNhom').inTable('NHOMNGUOIDUNG');
    table.foreign('MaChucNang').references('MaChucNang').inTable('CHUCNANG');
  });

  await knex.schema.createTable('NGUOIDUNG', (table) => {
    table.increments('MaNguoiDung').primary();
    table.string('TenDangNhap', 50).notNullable().unique();
    table.string('MatKhau', 255).notNullable();
    table.string('TenNguoiDung', 100).notNullable();
    table.integer('MaNhom').unsigned().notNullable();
    table.foreign('MaNhom').references('MaNhom').inTable('NHOMNGUOIDUNG');
  });

  await knex.schema.createTable('REFRESH_TOKEN', (table) => {
    table.increments('MaRefreshToken').primary();
    table
      .integer('MaNguoiDung')
      .unsigned()
      .notNullable()
      .references('MaNguoiDung')
      .inTable('NGUOIDUNG');
    table.string('RefreshToken', 500).notNullable();
    table.dateTime('HanSuDung').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // --- Các bảng sảnh, loại sảnh ---
  await knex.schema.createTable('LOAISANH', (table) => {
    table.increments('MaLoaiSanh').primary();
    table.string('TenLoaiSanh', 50).notNullable();
    table.decimal('DonGiaBanToiThieu', 15, 2).notNullable();
    table.boolean('DaXoa').notNullable().defaultTo(false);
  });
  await knex.raw(
    'ALTER TABLE "LOAISANH" ADD CONSTRAINT "chk_dongia_bantoithieu" CHECK ("DonGiaBanToiThieu" >= 0)'
  );

  await knex.schema.createTable('SANH', (table) => {
    table.increments('MaSanh').primary();
    table.string('TenSanh', 50).notNullable();
    table.integer('MaLoaiSanh').unsigned().notNullable();
    table.integer('SoLuongBanToiDa').notNullable();
    table.text('GhiChu').nullable();
    table.text('AnhURL').nullable();
    table.boolean('DaXoa').notNullable().defaultTo(false);
    table.foreign('MaLoaiSanh').references('MaLoaiSanh').inTable('LOAISANH');
  });
  await knex.raw(
    'ALTER TABLE "SANH" ADD CONSTRAINT "chk_soluong_bantoida" CHECK ("SoLuongBanToiDa" >= 0)'
  );

  // --- Món ăn ---
  await knex.schema.createTable('LOAIMONAN', (table) => {
    table.increments('MaLoaiMonAn').primary();
    table.string('TenLoaiMonAn', 50).notNullable();
    table.boolean('DaXoa').notNullable().defaultTo(false);
  });

  await knex.schema.createTable('MONAN', (table) => {
    table.increments('MaMonAn').primary();
    table.string('TenMonAn', 100).notNullable();
    table.integer('MaLoaiMonAn').unsigned().notNullable();
    table.decimal('DonGia', 15, 2).notNullable();
    table.text('GhiChu').nullable();
    table.text('AnhURL').nullable();
    table.boolean('DaXoa').notNullable().defaultTo(false);
    table.foreign('MaLoaiMonAn').references('MaLoaiMonAn').inTable('LOAIMONAN');
  });
  await knex.raw(
    'ALTER TABLE "MONAN" ADD CONSTRAINT "chk_dongia_monan" CHECK ("DonGia" >= 0)'
  );

  // Tạo function cho trigger
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_thucdon_price()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Cập nhật DonGiaHienTai cho tất cả các thực đơn có chứa món ăn được cập nhật
      UPDATE "THUCDON" td
      SET "DonGiaHienTai" = td."DonGiaHienTai" + (NEW."DonGia" - OLD."DonGia")
      FROM "THUCDON_MONAN" tdm
      WHERE tdm."MaThucDon" = td."MaThucDon"
      AND tdm."MaMonAn" = NEW."MaMonAn";
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Tạo trigger
  await knex.raw(`
    CREATE TRIGGER trigger_update_thucdon_price
    AFTER UPDATE OF "DonGia" ON "MONAN"
    FOR EACH ROW
    EXECUTE FUNCTION update_thucdon_price();
  `);

  await knex.schema.createTable('THUCDON', (table) => {
    table.increments('MaThucDon').primary();
    table.string('TenThucDon', 100).notNullable();
    table.decimal('DonGiaThoiDiemDat', 15, 2).notNullable();
    table.decimal('DonGiaHienTai', 15, 2).notNullable();
    table.text('GhiChu').nullable();
    table.boolean('DaXoa').notNullable().defaultTo(false);
  });
  await knex.raw(
    'ALTER TABLE "THUCDON" ADD CONSTRAINT "chk_dongia_thoidiemdat_thucdon" CHECK ("DonGiaThoiDiemDat" >= 0)'
  );
  await knex.raw(
    'ALTER TABLE "THUCDON" ADD CONSTRAINT "chk_dongia_hientai" CHECK ("DonGiaHienTai" >= 0)'
  );

  await knex.schema.createTable('THUCDON_MONAN', (table) => {
    table.integer('MaThucDon').unsigned().notNullable();
    table.integer('MaMonAn').unsigned().notNullable();
    table.decimal('DonGiaThoiDiemDat', 15, 2).notNullable();
    table.primary(['MaThucDon', 'MaMonAn']);
    table.foreign('MaThucDon').references('MaThucDon').inTable('THUCDON');
    table.foreign('MaMonAn').references('MaMonAn').inTable('MONAN');
  });
  await knex.raw(
    'ALTER TABLE "THUCDON_MONAN" ADD CONSTRAINT "chk_dongia_thoidiemdat_monan" CHECK ("DonGiaThoiDiemDat" >= 0)'
  );

  // --- Dịch vụ ---
  await knex.schema.createTable('LOAIDICHVU', (table) => {
    table.increments('MaLoaiDichVu').primary();
    table.string('TenLoaiDichVu', 50).notNullable();
    table.boolean('DaXoa').notNullable().defaultTo(false);
  });

  await knex.schema.createTable('DICHVU', (table) => {
    table.increments('MaDichVu').primary();
    table.string('TenDichVu', 100).notNullable();
    table.integer('MaLoaiDichVu').unsigned().notNullable();
    table.decimal('DonGia', 15, 2).notNullable();
    table.text('GhiChu').nullable();
    table.text('AnhURL').nullable();
    table.boolean('DaXoa').notNullable().defaultTo(false);
    table
      .foreign('MaLoaiDichVu')
      .references('MaLoaiDichVu')
      .inTable('LOAIDICHVU');
  });
  await knex.raw(
    'ALTER TABLE "DICHVU" ADD CONSTRAINT "chk_dongia_dichvu" CHECK ("DonGia" >= 0)'
  );

  // --- Tiệc cưới ---
  await knex.schema.createTable('CA', (table) => {
    table.increments('MaCa').primary();
    table.string('TenCa', 50).notNullable();
    table.boolean('DaXoa').notNullable().defaultTo(false);
  });

  await knex.schema.createTable('DATTIEC', (table) => {
    table.increments('MaDatTiec').primary();
    table.string('TenChuRe', 100).notNullable();
    table.string('TenCoDau', 100).notNullable();
    table.string('DienThoai', 15).notNullable();
    table.date('NgayDatTiec').notNullable();
    table.date('NgayDaiTiec').notNullable();
    table.integer('MaCa').unsigned().notNullable();
    table.integer('MaSanh').unsigned().notNullable();
    table.integer('MaThucDon').unsigned().notNullable();
    table.decimal('TienDatCoc', 15, 2).notNullable();
    table.integer('SoLuongBan').notNullable();
    table.integer('SoBanDuTru').notNullable();
    table.boolean('DaHuy').notNullable().defaultTo(false);
    table.foreign('MaCa').references('MaCa').inTable('CA');
    table.foreign('MaSanh').references('MaSanh').inTable('SANH');
    table.foreign('MaThucDon').references('MaThucDon').inTable('THUCDON');
  });
  await knex.raw(
    'ALTER TABLE "DATTIEC" ADD CONSTRAINT "chk_tiendatcoc" CHECK ("TienDatCoc" >= 0)'
  );
  await knex.raw(
    'ALTER TABLE "DATTIEC" ADD CONSTRAINT "chk_soluongban" CHECK ("SoLuongBan" >= 0)'
  );
  await knex.raw(
    'ALTER TABLE "DATTIEC" ADD CONSTRAINT "chk_sobandutru" CHECK ("SoBanDuTru" >= 0)'
  );

  await knex.schema.createTable('DATTIEC_DICHVU', (table) => {
    table.integer('MaDatTiec').unsigned().notNullable();
    table.integer('MaDichVu').unsigned().notNullable();
    table.integer('SoLuong').notNullable();
    table.decimal('DonGiaThoiDiemDat', 15, 2).notNullable();
    table.decimal('ThanhTien', 15, 2).notNullable();
    table.primary(['MaDatTiec', 'MaDichVu']);
    table.foreign('MaDatTiec').references('MaDatTiec').inTable('DATTIEC');
    table.foreign('MaDichVu').references('MaDichVu').inTable('DICHVU');
  });
  await knex.raw(
    'ALTER TABLE "DATTIEC_DICHVU" ADD CONSTRAINT "chk_soluong" CHECK ("SoLuong" >= 0)'
  );
  await knex.raw(
    'ALTER TABLE "DATTIEC_DICHVU" ADD CONSTRAINT "chk_dongia_thoidiemdat" CHECK ("DonGiaThoiDiemDat" >= 0)'
  );
  await knex.raw(
    'ALTER TABLE "DATTIEC_DICHVU" ADD CONSTRAINT "chk_thanhtien" CHECK ("ThanhTien" >= 0)'
  );

  await knex.schema.createTable('HOADON', (table) => {
    table.increments('MaHoaDon').primary();
    table.integer('MaDatTiec').unsigned().notNullable();
    table.date('NgayThanhToan').notNullable();
    table.date('NgayLapHoaDon').notNullable();
    table.decimal('TongTienBan', 15, 2).notNullable();
    table.decimal('TongTienDichVu', 15, 2).notNullable();
    table.decimal('TongTienHoaDon', 15, 2).notNullable();
    table.boolean('ApDungQuyDinhPhat').notNullable().defaultTo(false);
    table.decimal('PhanTramPhatMotNgay', 5, 2).notNullable().defaultTo(0.0);
    table.decimal('TongTienPhat', 15, 2).notNullable();
    table.decimal('TongTienConLai', 15, 2).notNullable();
    table.integer('TrangThai').notNullable(); // 0: Chưa thanh toán, 1: Đã thanh toán, 2: Đã hủy
    table.foreign('MaDatTiec').references('MaDatTiec').inTable('DATTIEC');
  });
  await knex.raw(
    'ALTER TABLE "HOADON" ADD CONSTRAINT "chk_tongtienban" CHECK ("TongTienBan" >= 0)'
  );
  await knex.raw(
    'ALTER TABLE "HOADON" ADD CONSTRAINT "chk_tongtiendichvu" CHECK ("TongTienDichVu" >= 0)'
  );
  await knex.raw(
    'ALTER TABLE "HOADON" ADD CONSTRAINT "chk_tongtienhoadon" CHECK ("TongTienHoaDon" >= 0)'
  );
  await knex.raw(
    'ALTER TABLE "HOADON" ADD CONSTRAINT "chk_phantrampatmongay" CHECK ("PhanTramPhatMotNgay" >= 0 AND "PhanTramPhatMotNgay" <= 100)'
  );
  await knex.raw(
    'ALTER TABLE "HOADON" ADD CONSTRAINT "chk_tongtienphat" CHECK ("TongTienPhat" >= 0)'
  );

  // aplicativos--- Báo cáo doanh số ---
  await knex.schema.createTable('BAOCAODOANHSO', (table) => {
    table.increments('MaBaoCaoDoanhSo').primary();
    table.integer('Thang').notNullable();
    table.integer('Nam').notNullable();
    table.decimal('TongDoanhThu', 15, 2).notNullable();
  });
  await knex.raw(
    'ALTER TABLE "BAOCAODOANHSO" ADD CONSTRAINT "chk_thang" CHECK ("Thang" BETWEEN 1 AND 12)'
  );
  await knex.raw(
    'ALTER TABLE "BAOCAODOANHSO" ADD CONSTRAINT "chk_tongdoanhthu" CHECK ("TongDoanhThu" >= 0)'
  );

  await knex.schema.createTable('CHITIET_BAOCAODOANHSO', (table) => {
    table.integer('MaBaoCaoDoanhSo').unsigned().notNullable();
    table.date('Ngay').notNullable();
    table.integer('SoLuongTiec').notNullable();
    table.decimal('DoanhThu', 15, 2).notNullable();
    table.decimal('TiLe', 5, 2).notNullable();
    table.primary(['MaBaoCaoDoanhSo', 'Ngay']);
    table
      .foreign('MaBaoCaoDoanhSo')
      .references('MaBaoCaoDoanhSo')
      .inTable('BAOCAODOANHSO');
  });
  await knex.raw(
    'ALTER TABLE "CHITIET_BAOCAODOANHSO" ADD CONSTRAINT "chk_soluongtiec" CHECK ("SoLuongTiec" >= 0)'
  );
  await knex.raw(
    'ALTER TABLE "CHITIET_BAOCAODOANHSO" ADD CONSTRAINT "chk_doanhthu" CHECK ("DoanhThu" >= 0)'
  );
  await knex.raw(
    'ALTER TABLE "CHITIET_BAOCAODOANHSO" ADD CONSTRAINT "chk_tile" CHECK ("TiLe" >= 0 AND "TiLe" <= 100)'
  );

  await knex.schema.createTable('THAMSO', (table) => {
    table.decimal('PhanTramPhatTrenNgay', 5, 2).notNullable();
  });
  await knex.raw(
    'ALTER TABLE "THAMSO" ADD CONSTRAINT "chk_phantrampattrenngay" CHECK ("PhanTramPhatTrenNgay" >= 0 AND "PhanTramPhatTrenNgay" <= 100)'
  );
};

export const down = async (knex) => {
  // Drop trigger and function first
  await knex.raw(
    'DROP TRIGGER IF EXISTS trigger_update_thucdon_price ON "MONAN"'
  );
  await knex.raw('DROP FUNCTION IF EXISTS update_thucdon_price()');

  await knex.schema.dropTableIfExists('THAMSO');
  await knex.schema.dropTableIfExists('CHITIET_BAOCAODOANHSO');
  await knex.schema.dropTableIfExists('BAOCAODOANHSO');
  await knex.schema.dropTableIfExists('HOADON');
  await knex.schema.dropTableIfExists('DATTIEC_DICHVU');
  await knex.schema.dropTableIfExists('DATTIEC');
  await knex.schema.dropTableIfExists('CA');
  await knex.schema.dropTableIfExists('DICHVU');
  await knex.schema.dropTableIfExists('LOAIDICHVU');
  await knex.schema.dropTableIfExists('THUCDON_MONAN');
  await knex.schema.dropTableIfExists('THUCDON');
  await knex.schema.dropTableIfExists('MONAN');
  await knex.schema.dropTableIfExists('LOAIMONAN');
  await knex.schema.dropTableIfExists('SANH');
  await knex.schema.dropTableIfExists('LOAISANH');
  await knex.schema.dropTableIfExists('REFRESH_TOKEN');
  await knex.schema.dropTableIfExists('NGUOIDUNG');
  await knex.schema.dropTableIfExists('PHANQUYEN');
  await knex.schema.dropTableIfExists('NHOMNGUOIDUNG');
  await knex.schema.dropTableIfExists('CHUCNANG');
};
