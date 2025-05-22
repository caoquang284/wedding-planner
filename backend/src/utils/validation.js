import { body, param, query } from 'express-validator';

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
];

const validateLogin = [
  body('tenDangNhap')
    .notEmpty()
    .withMessage('Tên đăng nhập không được để trống'),
  body('matKhau').notEmpty().withMessage('Mật khẩu không được để trống'),
];

const validateIdParam = [
  param('id').isInt().withMessage('ID phải là số nguyên'),
];

const validateDatTiecFilters = [
  query('ngayDaiTiec')
    .optional()
    .isDate()
    .withMessage('Ngày đại tiệc phải là định dạng ngày hợp lệ'),
  query('maCa')
    .optional()
    .isInt()
    .withMessage('Mã ca phải là số nguyên'),
  query('maSanh')
    .optional()
    .isInt()
    .withMessage('Mã sảnh phải là số nguyên'),
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
];

export default {
  validateUserCreation,
  validateLogin,
  validateIdParam,
  validateDatTiecFilters,
};