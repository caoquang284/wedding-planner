import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import caController from '../controllers/caController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission('Quản lý ca'),
  validation.validateCa,
  caController.createCa
);
router.get(
  '/danh-sach',
  auth,
  checkPermission('Quản lý ca'),
  caController.getAllCa
);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission('Quản lý ca'),
  validation.validateIdParam,
  caController.getCa
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission('Quản lý ca'),
  validation.validateIdParam,
  validation.validateCa,
  caController.updateCa
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission('Quản lý ca'),
  validation.validateIdParam,
  caController.deleteCa
);

export default router;
