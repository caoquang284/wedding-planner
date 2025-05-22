import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import loaiMonAnController from '../controllers/loaiMonAnController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission(7),
  validation.validateLoaiMonAn,
  loaiMonAnController.createLoaiMonAn
);
router.get(
  '/danh-sach',
  auth,
  checkPermission(8),
  loaiMonAnController.getAllLoaiMonAn
);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission(8),
  validation.validateIdParam,
  loaiMonAnController.getLoaiMonAn
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission(7),
  validation.validateIdParam,
  validation.validateLoaiMonAn,
  loaiMonAnController.updateLoaiMonAn
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission(7),
  validation.validateIdParam,
  loaiMonAnController.deleteLoaiMonAn
);

export default router;
