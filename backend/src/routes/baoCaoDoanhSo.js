import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import baoCaoDoanhSoController from '../controllers/baoCaoDoanhSoController.js';

const router = Router();

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

// Cập nhật báo cáo
router.put(
  '/update/:id',
  auth,
  checkPermission('Quản lý báo cáo doanh thu'),
  validation.validateIdParam,
  baoCaoDoanhSoController.updateBaoCaoDoanhSo
);

// Lấy thống kê theo khoảng thời gian
router.get(
  '/stats-by-date',
  auth,
  checkPermission('Quản lý báo cáo doanh thu'),
  baoCaoDoanhSoController.getRevenueStatsByDateRange
);

export default router;