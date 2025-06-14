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
  checkPermission('Quản lý đặt tiệc'),
  validation.validateDatTiecFilters,
  datTiecController.getAllDatTiec
);

// Lấy chi tiết đặt tiệc
router.get(
  '/chi-tiet/:id',
  // auth,
  // checkPermission(18),
  // validation.validateIdParam,
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
  // auth,
  // checkPermission(17),
  // validation.validateIdParam,
  datTiecController.cancelDatTiec
);

// Thêm món ăn vào thực đơn
router.post(
  '/them-mon-an/:id',
  auth,
  checkPermission('Quản lý đặt tiệc'),
  validation.validateIdParam,
  validation.validateThemMonAn,
  datTiecController.themMonAn
);

// Xóa món ăn khỏi thực đơn
router.delete(
  '/xoa-mon-an/:id/:maMonAn',
  auth,
  checkPermission('Quản lý đặt tiệc'),
  validation.validateIdParam,
  validation.validateMaMonAnParam,
  datTiecController.xoaMonAn
);

// Thêm dịch vụ vào đặt tiệc
router.post(
  '/them-dich-vu/:id',
  auth,
  checkPermission('Quản lý đặt tiệc'),
  validation.validateIdParam,
  validation.validateThemDichVu,
  datTiecController.themDichVu
);

// Xóa dịch vụ khỏi đặt tiệc
router.delete(
  '/xoa-dich-vu/:id/:maDichVu',
  auth,
  checkPermission('Quản lý đặt tiệc'),
  validation.validateIdParam,
  validation.validateMaDichVuParam,
  datTiecController.xoaDichVu
);

export default router;