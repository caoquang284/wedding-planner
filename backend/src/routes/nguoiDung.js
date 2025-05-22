import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import nguoiDungController from '../controllers/nguoiDungController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission(1),
  validation.validateUserCreation,
  nguoiDungController.createNguoiDung
);
router.post('/dang-nhap', validation.validateLogin, nguoiDungController.login);
router.get('/thong-tin', auth, nguoiDungController.getNguoiDung);
router.get(
  '/danh-sach',
  auth,
  checkPermission(1),
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
  checkPermission(1),
  validation.validateIdParam,
  nguoiDungController.deleteNguoiDung
);

export default router;
