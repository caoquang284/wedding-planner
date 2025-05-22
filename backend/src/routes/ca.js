import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import caController from '../controllers/caController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission(15),
  validation.validateCa,
  caController.createCa
);
router.get('/danh-sach', auth, checkPermission(16), caController.getAllCa);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission(16),
  validation.validateIdParam,
  caController.getCa
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission(15),
  validation.validateIdParam,
  validation.validateCa,
  caController.updateCa
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission(15),
  validation.validateIdParam,
  caController.deleteCa
);

export default router;
