import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import loaiDichVuController from '../controllers/loaiDichVuController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission('Quản lý loại dịch vụ'),
  validation.validateLoaiDichVu,
  loaiDichVuController.createLoaiDichVu
);
router.get(
  '/danh-sach',
  // auth,
  // checkPermission('Quản lý loại dịch vụ'),
  loaiDichVuController.getAllLoaiDichVu
);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission('Quản lý loại dịch vụ'),
  validation.validateIdParam,
  loaiDichVuController.getLoaiDichVu
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission('Quản lý loại dịch vụ'),
  validation.validateIdParam,
  validation.validateLoaiDichVu,
  loaiDichVuController.updateLoaiDichVu
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission('Quản lý loại dịch vụ'),
  validation.validateIdParam,
  loaiDichVuController.deleteLoaiDichVu
);

export default router;
