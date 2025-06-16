import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import dichVuController from '../controllers/dichVuController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission('Quản lý dịch vụ'),
  validation.validateDichVu,
  dichVuController.createDichVu
);
router.get(
  '/danh-sach',
  auth,
  checkPermission('Lấy danh sách dịch vụ'),
  dichVuController.getAllDichVu
);
router.get(
  '/chi-tiet/:id',
  auth,
  (req, res, next) => {
    console.log('🛤 Route: /chi-tiet/:id được gọi');
    next();
  },
  checkPermission('Lấy chi tiết dịch vụ'),
  dichVuController.getDichVu
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission('Quản lý dịch vụ'),
  validation.validateIdParam,
  validation.validateDichVu,
  dichVuController.updateDichVu
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission('Quản lý dịch vụ'),
  validation.validateIdParam,
  dichVuController.deleteDichVu
);
router.get(
  '/theo-ma-dat-tiec/:maDatTiec',
  auth,
  checkPermission('Lấy dịch vụ theo mã đặt tiệc'),
  dichVuController.getDichVuByMaDatTiec
);
export default router;
