import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import loaiMonAnController from '../controllers/loaiMonAnController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission('Quản lý loại món ăn'),
  validation.validateLoaiMonAn,
  loaiMonAnController.createLoaiMonAn
);
router.get(
  '/danh-sach',
  auth,
  checkPermission('Quản lý loại món ăn'),
  loaiMonAnController.getAllLoaiMonAn
);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission('Quản lý loại món ăn'),
  validation.validateIdParam,
  loaiMonAnController.getLoaiMonAn
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission('Quản lý loại món ăn'),
  validation.validateIdParam,
  validation.validateLoaiMonAn,
  loaiMonAnController.updateLoaiMonAn
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission('Quản lý loại món ăn'),
  validation.validateIdParam,
  loaiMonAnController.deleteLoaiMonAn
);

export default router;
