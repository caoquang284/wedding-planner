import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import loaiDichVuController from '../controllers/loaiDichVuController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission(11),
  validation.validateLoaiDichVu,
  loaiDichVuController.createLoaiDichVu
);
router.get(
  '/danh-sach',
  auth,
  checkPermission(12),
  loaiDichVuController.getAllLoaiDichVu
);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission(12),
  validation.validateIdParam,
  loaiDichVuController.getLoaiDichVu
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission(11),
  validation.validateIdParam,
  validation.validateLoaiDichVu,
  loaiDichVuController.updateLoaiDichVu
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission(11),
  validation.validateIdParam,
  loaiDichVuController.deleteLoaiDichVu
);

export default router;
