// baoCaoDoanhSoRoutes.js
import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import baoCaoDoanhSoController from '../controllers/baoCaoDoanhSoController.js';

const router = Router();

// Tạo báo cáo doanh thu
router.post(
  '/tao',
  auth,
  checkPermission('Quản lý báo cáo doanh thu'), 
  validation.validateBaoCaoDoanhSo,
  baoCaoDoanhSoController.createBaoCaoDoanhSo
);

// Lấy danh sách báo cáo doanh thu
router.get(
  '/danh-sach',
  auth,
  checkPermission('Quản lý báo cáo doanh thu'), 
  validation.validateBaoCaoDoanhSoFilters,
  baoCaoDoanhSoController.getAllBaoCaoDoanhSo
);

// Lấy chi tiết báo cáo
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission('Quản lý báo cáo doanh thu'),
  validation.validateIdParam,
  baoCaoDoanhSoController.getBaoCaoDoanhSo
);

// Thêm chi tiết báo cáo
router.post(
  '/them-chi-tiet/:id',
  auth,
  checkPermission('Quản lý báo cáo doanh thu'),
  validation.validateIdParam,
  validation.validateChiTietBaoCaoDoanhSo,
  baoCaoDoanhSoController.themChiTiet
);

router.put(
  '/update/:id',
  auth,
  checkPermission('Quản lý báo cáo doanh thu'),
  validation.validateIdParam,
  baoCaoDoanhSoController.updateBaoCaoDoanhSo
);

export default router;