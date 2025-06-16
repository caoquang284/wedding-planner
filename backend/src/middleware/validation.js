import { body, param, query, validationResult } from 'express-validator';

const validateUserCreation = [
  body('tenDangNhap')
    .notEmpty()
    .withMessage('Tên đăng nhập không được để trống')
    .isLength({ min: 3 })
    .withMessage('Tên đăng nhập phải có ít nhất 3 ký tự'),
  body('matKhau')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('tenNguoiDung')
    .notEmpty()
    .withMessage('Tên người dùng không được để trống'),
  body('maNhom').isInt().withMessage('Mã nhóm phải là số nguyên'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  body('tenDangNhap')
    .notEmpty()
    .withMessage('Tên đăng nhập không được để trống'),
  body('matKhau').notEmpty().withMessage('Mật khẩu không được để trống'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateUserUpdate = [
  body('tenNguoiDung')
    .optional()
    .notEmpty()
    .withMessage('Tên người dùng không được để trống'),
  body('maNhom').optional().isInt().withMessage('Mã nhóm phải là số nguyên'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.body.tenNguoiDung && !req.body.maNhom) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Cần ít nhất một trường để cập nhật' }] });
    }
    next();
  },
];

const validateNhomNguoiDung = [
  body('tenNhom')
    .notEmpty()
    .withMessage('Tên nhóm không được để trống')
    .isLength({ min: 3 })
    .withMessage('Tên nhóm phải có ít nhất 3 ký tự'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validatePhanQuyen = [
  body('maNhom').isInt().withMessage('Mã nhóm phải là số nguyên'),
  body('maChucNang').isInt().withMessage('Mã chức năng phải là số nguyên'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLoaiSanh = [
  body('tenLoaiSanh')
    .notEmpty()
    .withMessage('Tên loại sảnh không được để trống'),
  body('donGiaBanToiThieu')
    .isFloat({ min: 0 })
    .withMessage('Đơn giá bàn tối thiểu phải là số không âm'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateSanh = [
  body('tenSanh').notEmpty().withMessage('Tên sảnh không được để trống'),
  body('maLoaiSanh').isInt().withMessage('Mã loại sảnh phải là số nguyên'),
  body('soLuongBanToiDa')
    .isInt({ min: 1 })
    .withMessage('Số lượng bàn tối đa phải là số nguyên dương'),
  body('ghiChu').optional().isString().withMessage('Ghi chú phải là chuỗi'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLoaiMonAn = [
  body('tenLoaiMonAn')
    .notEmpty()
    .withMessage('Tên loại món ăn không được để trống'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateMonAn = [
  body('tenMonAn').notEmpty().withMessage('Tên món ăn không được để trống'),
  body('maLoaiMonAn').isInt().withMessage('Mã loại món ăn phải là số nguyên'),
  body('donGia').isFloat({ min: 0 }).withMessage('Đơn giá phải là số không âm'),
  body('ghiChu').optional().isString().withMessage('Ghi chú phải là chuỗi'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation cho tạo/cập nhật thực đơn
const validateThucDon = [
  body('tenThucDon')
    .notEmpty()
    .withMessage('Tên thực đơn không được để trống')
    .isString()
    .withMessage('Tên thực đơn phải là chuỗi'),
  body('donGiaThoiDiemDat')
    .isFloat({ min: 0 })
    .withMessage('Đơn giá thời điểm đặt phải là số không âm'),
  body('donGiaHienTai')
    .isFloat({ min: 0 })
    .withMessage('Đơn giá hiện tại phải là số không âm'),
  body('ghiChu').optional().isString().withMessage('Ghi chú phải là chuỗi'),
  body('coverImg').optional().isString().withMessage('Ảnh bìa phải là chuỗi'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation cho cập nhật món ăn trong thực đơn
const validateThucDonMonAnUpdate = [
  body('donGiaThoiDiemDat')
    .isFloat({ min: 0 })
    .withMessage('Đơn giá thời điểm đặt phải là số không âm'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLoaiDichVu = [
  body('tenLoaiDichVu')
    .notEmpty()
    .withMessage('Tên loại dịch vụ không được để trống'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateDichVu = [
  body('tenDichVu').notEmpty().withMessage('Tên dịch vụ không được để trống'),
  body('donGia').isFloat({ min: 0 }).withMessage('Đơn giá phải là số không âm'),
  body('ghiChu').optional().isString().withMessage('Ghi chú phải là chuỗi'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateCa = [
  body('tenCa').notEmpty().withMessage('Tên ca không được để trống'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateDatTiec = [
  body('tenChuRe').notEmpty().withMessage('Tên chú rể không được để trống'),
  body('tenCoDau').notEmpty().withMessage('Tên cô dâu không được để trống'),
  body('dienThoai')
    .notEmpty()
    .withMessage('Số điện thoại không được để trống')
    .isLength({ min: 10, max: 15 })
    .withMessage('Số điện thoại phải có từ 10 đến 15 ký tự'),
  body('ngayDaiTiec')
    .isDate()
    .withMessage('Ngày đại tiệc phải là định dạng ngày hợp lệ'),
  body('maCa').isInt().withMessage('Mã ca phải là số nguyên'),
  body('maSanh').isInt().withMessage('Mã sảnh phải là số nguyên'),
  body('tienDatCoc')
    .isFloat({ min: 0 })
    .withMessage('Tiền đặt cọc phải là số không âm'),
  body('soLuongBan')
    .isInt({ min: 1 })
    .withMessage('Số lượng bàn phải là số nguyên dương'),
  body('soBanDuTru')
    .isInt({ min: 0 })
    .withMessage('Số bàn dự trữ phải là số không âm'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateDatTiecFilters = [
  query('ngayDaiTiec')
    .optional()
    .isDate()
    .withMessage('Ngày đại tiệc phải là định dạng ngày hợp lệ'),
  query('maCa').optional().isInt().withMessage('Mã ca phải là số nguyên'),
  query('maSanh').optional().isInt().withMessage('Mã sảnh phải là số nguyên'),
  query('tenChuRe')
    .optional()
    .isString()
    .withMessage('Tên chú rể phải là chuỗi'),
  query('tenCoDau')
    .optional()
    .isString()
    .withMessage('Tên cô dâu phải là chuỗi'),
  query('dienThoai')
    .optional()
    .isString()
    .withMessage('Số điện thoại phải là chuỗi'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateThemMonAn = [
  body('maMonAn').isInt().withMessage('Mã món ăn phải là số nguyên'),
  body('donGiaThoiDiemDat')
    .isFloat({ min: 0 })
    .withMessage('Đơn giá thời điểm đặt phải là số không âm'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateThemDichVu = [
  body('maDichVu').isInt().withMessage('Mã dịch vụ phải là số nguyên'),
  body('soLuong')
    .isInt({ min: 1 })
    .withMessage('Số lượng phải là số nguyên dương'),
  body('donGiaThoiDiemDat')
    .isFloat({ min: 0 })
    .withMessage('Đơn giá thời điểm đặt phải là số không âm'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateHoaDon = [
  body('maDatTiec').isInt().withMessage('Mã đặt tiệc phải là số nguyên'),
  body('ngayThanhToan')
    .isDate()
    .withMessage('Ngày thanh toán phải là định dạng ngày hợp lệ'),
  body('tongTienBan')
    .isFloat({ min: 0 })
    .withMessage('Tổng tiền bàn phải là số không âm'),
  body('tongTienDichVu')
    .isFloat({ min: 0 })
    .withMessage('Tổng tiền dịch vụ phải là số không âm'),
  body('tongTienHoaDon')
    .isFloat({ min: 0 })
    .withMessage('Tổng tiền hóa đơn phải là số không âm'),
  body('apDungQuyDinhPhat')
    .isBoolean()
    .withMessage('Áp dụng quy định phạt phải là giá trị boolean'),
  body('phanTramPhatMotNgay')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Phần trăm phạt một ngày phải từ 0 đến 100'),
  body('tongTienPhat')
    .isFloat({ min: 0 })
    .withMessage('Tổng tiền phạt phải là số không âm'),
  body('tongTienConLai')
    .isFloat({ min: 0 })
    .withMessage('Tổng tiền còn lại phải là số không âm'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateBaoCaoDoanhSo = [
  body('thang')
    .isInt({ min: 1, max: 12 })
    .withMessage('Tháng phải là số từ 1 đến 12'),
  body('nam')
    .isInt({ min: 2000 })
    .withMessage('Năm phải lớn hơn hoặc bằng 2000'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateBaoCaoDoanhSoFilters = [
  query('thang')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Tháng phải là số từ 1 đến 12'),
  query('nam')
    .optional()
    .isInt({ min: 2000 })
    .withMessage('Năm phải lớn hơn hoặc bằng 2000'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateChiTietBaoCaoDoanhSo = [
  body('ngay').isDate().withMessage('Ngày phải là định dạng ngày hợp lệ'),
  body('soLuongTiec')
    .isInt({ min: 0 })
    .withMessage('Số lượng tiệc phải là số không âm'),
  body('doanhThu')
    .isFloat({ min: 0 })
    .withMessage('Doanh thu phải là số không âm'),
  body('tiLe')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Tỉ lệ phải từ 0 đến 100'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateThamSo = [
  body('phanTramPhatTrenNgay')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Phần trăm phạt trên ngày phải từ 0 đến 100'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateIdParam = [
  param('id').isInt().withMessage('ID phải là số nguyên'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateMaNhomParam = [
  param('maNhom').isInt().withMessage('Mã nhóm phải là số nguyên'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateMaChucNangParam = [
  param('maChucNang').isInt().withMessage('Mã chức năng phải là số nguyên'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateMaMonAnParam = [
  param('maMonAn').isInt().withMessage('Mã món ăn phải là số nguyên'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateMaDichVuParam = [
  param('maDichVu').isInt().withMessage('Mã dịch vụ phải là số nguyên'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default {
  validateUserCreation,
  validateLogin,
  validateUserUpdate,
  validateNhomNguoiDung,
  validatePhanQuyen,
  validateLoaiSanh,
  validateSanh,
  validateLoaiMonAn,
  validateMonAn,
  validateLoaiDichVu,
  validateDichVu,
  validateCa,
  validateDatTiec,
  validateDatTiecFilters,
  validateThemMonAn,
  validateThemDichVu,
  validateHoaDon,
  validateBaoCaoDoanhSo,
  validateBaoCaoDoanhSoFilters,
  validateChiTietBaoCaoDoanhSo,
  validateThamSo,
  validateIdParam,
  validateMaNhomParam,
  validateMaChucNangParam,
  validateMaMonAnParam,
  validateMaDichVuParam,
};
