import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import thucDonController from '../controllers/thucDonController.js';

const router = Router();

router.post(
  '/tao',
  auth,
  checkPermission('Tạo thực đơn'),
  // validation.validateThucDon,
  thucDonController.createThucDon
);
router.get(
  '/danh-sach',
  auth,
  checkPermission('Lấy danh sách thực đơn'),
  thucDonController.getAllThucDon
);
router.get(
  '/chi-tiet/:id',
  auth,
  checkPermission('Lấy chi tiết thực đơn'),
  // validation.validateIdParam,
  thucDonController.getThucDon
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission('Cập nhật thực đơn'),
  // validation.validateIdParam,
  // validation.validateThucDon,
  thucDonController.updateThucDon
);

router.delete(
  '/xoa/:id',
  auth,
  checkPermission('Quản lý thực đơn'),
  // validation.validateIdParam,
  (req, res, next) => {
    console.log(
      'Route hit - Method:',
      req.method,
      'URL:',
      req.url,
      'ID:',
      req.params.id
    );
    next();
  },
  thucDonController.deleteThucDon
);
router.get('/mon-an-trong-thuc-don/:id', thucDonController.getMonAnInThucDon);

export default router;
