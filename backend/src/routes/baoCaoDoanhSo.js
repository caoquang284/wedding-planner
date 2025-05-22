import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import baoCaoDoanhSoController from '../controllers/baoCaoDoanhSoController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission(21),
  validation.validateBaoCaoDoanhSo,
  baoCaoDoanhSoController.createBaoCaoDoanhSo
);
router.get(
  '/danh-sach',
  auth,
  checkPermission(22),
  validation.validateBaoCaoDoanhSoFilters,
  baoCaoDoanhSoController.getAllBaoCaoDoanhSo
);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission(22),
  validation.validateIdParam,
  baoCaoDoanhSoController.getBaoCaoDoanhSo
);
router.post(
  '/them-chi-tiet/:id',
  auth,
  checkPermission(21),
  validation.validateIdParam,
  validation.validateChiTietBaoCaoDoanhSo,
  baoCaoDoanhSoController.themChiTiet
);

export default router;
