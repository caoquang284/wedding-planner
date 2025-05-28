import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import thucDonController from '../controllers/thucDonController.js';

const router = Router();

router.post(
  '/tao',
  // auth,
  // checkPermission('Quản lý món ăn'),
  // validation.validateThucDon,
  thucDonController.createThucDon
);
router.get(
  '/danh-sach',
  // auth,
  // checkPermission('Quản lý món ăn'),
  thucDonController.getAllThucDon
);
router.get(
  '/chi-tiet/:id',
  // auth,
  // checkPermission('Quản lý món ăn'),
  // validation.validateIdParam,
  thucDonController.getThucDon
);
router.put(
  '/cap-nhat/:id',
  auth,
  // checkPermission('Quản lý món ăn'),
  // validation.validateIdParam,
  // validation.validateThucDon,
  thucDonController.updateThucDon
);
router.delete(
  '/xoa/:id',
  // auth,
  // checkPermission('Quản lý món ăn'),
  // validation.validateIdParam,
  thucDonController.deleteThucDon
);

// Routes cho quản lý món ăn trong thực đơn
router.post(
  '/:id/them-mon-an',
  // auth,
  // checkPermission('Quản lý món ăn'),
  // validation.validateIdParam,
  // validation.validateThucDonMonAn,
  thucDonController.addMonAnToThucDon
);

router.delete(
  '/:id/xoa-mon-an/:maMonAn',
  // auth,
  // checkPermission('Quản lý món ăn'),
  // validation.validateIdParam,
  thucDonController.removeMonAnFromThucDon
);

router.put(
  '/:id/cap-nhat-mon-an/:maMonAn',
  // auth,
  // checkPermission('Quản lý món ăn'),
  // validation.validateIdParam,
  // validation.validateThucDonMonAnUpdate,
  thucDonController.updateMonAnInThucDon
);

export default router;
