import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import monAnController from '../controllers/monAnController.js';

const router = Router();

router.post(
  '/tao',
  // auth,
  // checkPermission('Quản lý món ăn'),
  // validation.validateMonAn,
  monAnController.createMonAn
);
router.get(
  '/danh-sach',
  // auth,
  // checkPermission('Quản lý món ăn'),
  monAnController.getAllMonAn
);
router.get(
  '/chi-tiet/:id',
  // auth,
  // checkPermission('Quản lý món ăn'),
  // validation.validateIdParam,
  monAnController.getMonAn
);
router.put(
  '/cap-nhat/:id',
  // auth,
  // checkPermission('Quản lý món ăn'),
  // validation.validateIdParam,
  // validation.validateMonAn,
  monAnController.updateMonAn
);
router.delete(
  '/xoa/:id',
  // auth,
  // checkPermission('Quản lý món ăn'),
  // validation.validateIdParam,
  monAnController.deleteMonAn
);

export default router;
