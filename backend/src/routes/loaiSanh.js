import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import loaiSanhController from '../controllers/loaiSanhController.js';

const router = Router();

router.post(
  '/tao',
  // auth,
  // checkPermission('Quản lý loại sảnh'),
  // validation.validateLoaiSanh,
  loaiSanhController.createLoaiSanh
);
router.get(
  '/danh-sach',
  // auth,
  // checkPermission('Quản lý loại sảnh'),
  loaiSanhController.getAllLoaiSanh
);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission('Quản lý loại sảnh'),
  validation.validateIdParam,
  loaiSanhController.getLoaiSanh
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission('Quản lý loại sảnh'),
  validation.validateIdParam,
  validation.validateLoaiSanh,
  loaiSanhController.updateLoaiSanh
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission('Quản lý loại sảnh'),
  validation.validateIdParam,
  loaiSanhController.deleteLoaiSanh
);

export default router;
