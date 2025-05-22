import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import monAnController from '../controllers/monAnController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission(9),
  validation.validateMonAn,
  monAnController.createMonAn
);
router.get(
  '/danh-sach',
  auth,
  checkPermission(10),
  monAnController.getAllMonAn
);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission(10),
  validation.validateIdParam,
  monAnController.getMonAn
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission(9),
  validation.validateIdParam,
  validation.validateMonAn,
  monAnController.updateMonAn
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission(9),
  validation.validateIdParam,
  monAnController.deleteMonAn
);

export default router;
