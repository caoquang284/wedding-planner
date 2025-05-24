import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import nhomNguoiDungController from '../controllers/nhomNguoiDungController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission('Quản lý nhóm người dùng'),
  validation.validateNhomNguoiDung,
  nhomNguoiDungController.createNhomNguoiDung
);
router.get(
  '/danh-sach',
  auth,
  checkPermission('Quản lý nhóm người dùng'),
  nhomNguoiDungController.getAllNhomNguoiDung
);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission('Quản lý nhóm người dùng'),
  validation.validateIdParam,
  nhomNguoiDungController.getNhomNguoiDung
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission('Quản lý nhóm người dùng'),
  validation.validateIdParam,
  validation.validateNhomNguoiDung,
  nhomNguoiDungController.updateNhomNguoiDung
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission('Quản lý nhóm người dùng'),
  validation.validateIdParam,
  nhomNguoiDungController.deleteNhomNguoiDung
);

export default router;