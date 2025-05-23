import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import nguoiDungController from '../controllers/nguoiDungController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission('Quản lý người dùng'),
  validation.validateUserCreation,
  nguoiDungController.createNguoiDung
);
router.post('/dang-nhap', validation.validateLogin, nguoiDungController.login);
router.get('/thong-tin', auth, nguoiDungController.getNguoiDung);
router.get(
  '/danh-sach',
  auth,
  checkPermission('Quản lý người dùng'),
  nguoiDungController.getAllNguoiDung
);
router.put(
  '/cap-nhat',
  auth,
  validation.validateUserUpdate,
  nguoiDungController.updateNguoiDung
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission('Quản lý người dùng'),
  validation.validateIdParam,
  nguoiDungController.deleteNguoiDung
);
router.get('/chuc-nang', auth, nguoiDungController.getChucNang);
router.post('/refresh', nguoiDungController.refreshToken);
router.post('/dang-xuat', nguoiDungController.logout);

export default router;