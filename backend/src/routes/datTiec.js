import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import datTiecController from '../controllers/datTiecController.js';

const router = Router();

router.post(
  '/tao',
  // auth,
  // checkPermission(17),
  // validation.validateDatTiec,
  datTiecController.createDatTiec
);
router.get(
  '/danh-sach',
  // auth,
  // checkPermission(18),
  // validation.validateDatTiecFilters,
  datTiecController.getAllDatTiec
);
router.get(
  '/chi-tiet/:id',
  // auth,
  // checkPermission(18),
  // validation.validateIdParam,
  datTiecController.getDatTiecById
);
router.put(
  '/cap-nhat/:id',
  auth,
  checkPermission(17),
  validation.validateIdParam,
  validation.validateDatTiec,
  datTiecController.updateDatTiec
);
router.delete(
  '/xoa/:id',
  auth,
  checkPermission(17),
  validation.validateIdParam,
  datTiecController.deleteDatTiec
);
router.post(
  '/them-mon-an/:id',
  auth,
  checkPermission(17),
  validation.validateIdParam,
  validation.validateThemMonAn,
  datTiecController.themMonAn
);
router.delete(
  '/xoa-mon-an/:id/:maMonAn',
  auth,
  checkPermission(17),
  validation.validateIdParam,
  validation.validateMaMonAnParam,
  datTiecController.xoaMonAn
);
router.post(
  '/them-dich-vu/:id',
  auth,
  checkPermission(17),
  validation.validateIdParam,
  validation.validateThemDichVu,
  datTiecController.themDichVu
);
router.delete(
  '/xoa-dich-vu/:id/:maDichVu',
  auth,
  checkPermission(17),
  validation.validateIdParam,
  validation.validateMaDichVuParam,
  datTiecController.xoaDichVu
);

export default router;
