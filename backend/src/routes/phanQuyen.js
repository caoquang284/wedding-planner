import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import phanQuyenController from '../controllers/phanQuyenController.js';

const router = Router();

router.post(
  '/gan-quyen',
  auth,
  checkPermission('Quản lý phân quyền'),
  validation.validatePhanQuyen,
  phanQuyenController.createPhanQuyen
);
router.get(
  '/danh-sach/:maNhom',
  auth,
  checkPermission('Quản lý phân quyền'),
  validation.validateMaNhomParam,
  phanQuyenController.getPhanQuyenByNhom
);
router.delete(
  '/xoa-quyen/:maNhom/:maChucNang',
  auth,
  checkPermission('Quản lý phân quyền'),
  validation.validateMaNhomParam,
  validation.validateMaChucNangParam,
  phanQuyenController.deletePhanQuyen
);

export default router;