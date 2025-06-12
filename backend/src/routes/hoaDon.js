import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import hoaDonController from '../controllers/hoaDonController.js';

const router = Router();

// Tạo hóa đơn
router.post(
  '/tao',
  // auth,
  // checkPermission(19), // Quyền tạo hóa đơn
  // validation.validateHoaDon,
  hoaDonController.createHoaDon
);

// Lấy danh sách hóa đơn
router.get(
  '/danh-sach',
  // auth,
  // checkPermission(20), // Quyền xem danh sách hóa đơn
  hoaDonController.getAllHoaDon
);

// Lấy chi tiết hóa đơn
router.get(
  '/chi-tiet/:id',
  // auth,
  // checkPermission(20), // Quyền xem chi tiết hóa đơn
  // validation.validateIdParam,
  hoaDonController.getHoaDon
);

// Sửa hóa đơn
router.put(
  '/sua/:id',
  // auth,
  // checkPermission(21), // Quyền sửa hóa đơn
  // validation.validateHoaDon, // Sử dụng validation tương tự tạo hóa đơn
  // validation.validateIdParam,
  hoaDonController.updateHoaDon
);

// Xóa hóa đơn
router.delete(
  '/xoa/:id',
  // auth,
  // checkPermission(22), // Quyền xóa hóa đơn
  // validation.validateIdParam,
  hoaDonController.deleteHoaDon
);

export default router;
