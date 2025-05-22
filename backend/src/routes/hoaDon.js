import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import hoaDonController from '../controllers/hoaDonController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission(19),
  validation.validateHoaDon,
  hoaDonController.createHoaDon
);
router.get(
  '/danh-sach',
  auth,
  checkPermission(20),
  hoaDonController.getAllHoaDon
);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission(20),
  validation.validateIdParam,
  hoaDonController.getHoaDon
);

export default router;
