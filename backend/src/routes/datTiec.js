import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import datTiecController from '../controllers/datTiecController.js';

const router = Router();

// Tạo đặt tiệc
router.post(
  '/dat-tiec',
  auth,
  checkPermission('Quản lý đặt tiệc'),
  validation.validateDatTiec,
  datTiecController.createDatTiec
);

// Lấy danh sách đặt tiệc
router.get(
  '/danh-sach',
  auth,
  checkPermission('Lấy danh sách đặt tiệc'),
  validation.validateDatTiecFilters,
  datTiecController.getAllDatTiec
);

// Lấy chi tiết đặt tiệc
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission('Lấy chi tiết đặt tiệc'),
  validation.validateIdParam,
  datTiecController.getDatTiecById
);

// Cập nhật đặt tiệc
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission('Quản lý đặt tiệc'),
  validation.validateIdParam,
  validation.validateDatTiec,
  datTiecController.updateDatTiec
);

// Xóa đặt tiệc
router.delete(
  '/xoa/:id',
  auth,
  checkPermission('Quản lý đặt tiệc'),
  validation.validateIdParam,
  datTiecController.deleteDatTiec
);

// Hủy đặt tiệc
router.put(
  '/huy/:id',
  auth,
  checkPermission('Quản lý đặt tiệc'),
  validation.validateIdParam,
  datTiecController.cancelDatTiec
);

export default router;
