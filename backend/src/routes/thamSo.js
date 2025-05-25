import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import thamSoController from '../controllers/thamSoController.js';

const router = Router();

router.get(
  '/lay',
  auth,
  checkPermission('Quản lý tham số'),
  thamSoController.getThamSo
);
router.put(
  '/cap-nhat',
  auth,
  checkPermission('Quản lý tham số'),
  validation.validateThamSo,
  thamSoController.updateThamSo
);

export default router;
