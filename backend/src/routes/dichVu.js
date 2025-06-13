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
  checkPermission('Quản lý dịch vụ'),
  dichVuController.getAllDichVu
);
router.get(
  '/chi-tiet/:id',
  // auth,
  // checkPermission('Quản lý dịch vụ'),
  // validation.validateIdParam,
  dichVuController.getDichVu
);
router.put(
  '/cap-nhat/:id',
  // auth,
  // checkPermission('Quản lý dịch vụ'),
  // validation.validateIdParam,
  // validation.validateDichVu,
  dichVuController.updateDichVu
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission('Quản lý dịch vụ'),
  validation.validateIdParam,
  dichVuController.deleteDichVu
);

export default router;
