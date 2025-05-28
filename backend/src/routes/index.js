import { Router } from 'express';
import nguoiDungRoutes from './nguoiDung.js';
import nhomNguoiDungRoutes from './nhomNguoiDung.js';
import phanQuyenRoutes from './phanQuyen.js';
import loaiSanhRoutes from './loaiSanh.js';
import sanhRoutes from './sanh.js';
import loaiMonAnRoutes from './loaiMonAn.js';
import monAnRoutes from './monAn.js';
import thucDonRoutes from './thucDon.js';
import loaiDichVuRoutes from './loaiDichVu.js';
import dichVuRoutes from './dichVu.js';
import caRoutes from './ca.js';
import datTiecRoutes from './datTiec.js';
import hoaDonRoutes from './hoaDon.js';
import baoCaoDoanhSoRoutes from './baoCaoDoanhSo.js';
import thamSoRoutes from './thamSo.js';

const router = Router();

router.use('/nguoi-dung', nguoiDungRoutes);
router.use('/nhom-nguoi-dung', nhomNguoiDungRoutes);
router.use('/phan-quyen', phanQuyenRoutes);
router.use('/loai-sanh', loaiSanhRoutes);
router.use('/sanh', sanhRoutes);
router.use('/loai-mon-an', loaiMonAnRoutes);
router.use('/mon-an', monAnRoutes);
router.use('/thuc-don', thucDonRoutes);
router.use('/loai-dich-vu', loaiDichVuRoutes);
router.use('/dich-vu', dichVuRoutes);
router.use('/ca', caRoutes);
router.use('/dat-tiec', datTiecRoutes);
router.use('/hoa-don', hoaDonRoutes);
router.use('/bao-cao-doanh-so', baoCaoDoanhSoRoutes);
router.use('/tham-so', thamSoRoutes);

export default router;
