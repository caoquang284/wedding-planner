import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import sanhController from '../controllers/sanhController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission('Quản lý sảnh'),
  validation.validateSanh,
  sanhController.createSanh
);
router.get(
  '/danh-sach',
  auth,
  checkPermission('Lấy danh sách sảnh'),
  sanhController.getAllSanh
);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission('Lấy chi tiết sảnh'),
  validation.validateIdParam,
  sanhController.getSanh
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission('Quản lý sảnh'),
  validation.validateIdParam,
  validation.validateSanh,
  sanhController.updateSanh
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission('Quản lý sảnh'),
  validation.validateIdParam,
  sanhController.deleteSanh
);
router.get(
  '/don-gia-ban-toi-thieu/:maSanh',
  auth,
  checkPermission('Lấy đơn giá bàn tối thiểu'),
  sanhController.getDonGiaBanToiThieuTuMaSanh
);

export default router;
