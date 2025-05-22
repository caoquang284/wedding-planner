import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import loaiSanhController from '../controllers/loaiSanhController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission(3),
  validation.validateLoaiSanh,
  loaiSanhController.createLoaiSanh
);
router.get(
  '/danh-sach',
  auth,
  checkPermission(4),
  loaiSanhController.getAllLoaiSanh
);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission(4),
  validation.validateIdParam,
  loaiSanhController.getLoaiSanh
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission(3),
  validation.validateIdParam,
  validation.validateLoaiSanh,
  loaiSanhController.updateLoaiSanh
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission(3),
  validation.validateIdParam,
  loaiSanhController.deleteLoaiSanh
);

export default router;
