import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import sanhController from '../controllers/sanhController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission(5),
  validation.validateSanh,
  sanhController.createSanh
);
router.get('/danh-sach', auth, checkPermission(6), sanhController.getAllSanh);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission(6),
  validation.validateIdParam,
  sanhController.getSanh
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission(5),
  validation.validateIdParam,
  validation.validateSanh,
  sanhController.updateSanh
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission(5),
  validation.validateIdParam,
  sanhController.deleteSanh
);

export default router;
