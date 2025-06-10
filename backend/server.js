import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import routes from './src/routes/index.js';
import dichVuRoutes from './src/routes/dichVu.js';
import loaiDichVuRoutes from './src/routes/loaiDichVu.js';
import loaiMonAnRoutes from './src/routes/loaiMonAn.js';
import monAnRoutes from './src/routes/monAn.js';
import thucDonRoutes from './src/routes/thucDon.js';
import sanhRoutes from './src/routes/sanh.js';
import loaiSanhRoutes from './src/routes/loaiSanh.js';
import caRoutes from './src/routes/ca.js';
import HoaDonRoutes from './src/routes/hoaDon.js';

import nguoiDungRoutes from './src/routes/nguoiDung.js';
import nhomNguoiDungRoutes from './src/routes/nhomNguoiDung.js';
import phanQuyenRoutes from './src/routes/phanQuyen.js';
import auth from './src/middleware/auth.js';
import checkPermission from './src/middleware/checkPermission.js';
import validation from './src/middleware/validation.js';
import { authRoutes } from './src/routes/auth.js'; // Named import
config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(json());

// Routes
app.use('/api', routes);

// Authentication routes
app.use('/api/auth', authRoutes); // Sử dụng authRoutes đã import

// Protected routes with permissions
app.use('/api/nguoiDung', auth, nguoiDungRoutes); // Chỉ Super Admin
app.use(
  '/api/nhomNguoiDung',
  auth,
  checkPermission('Quản lý nhóm người dùng'),
  nhomNguoiDungRoutes
); // Chỉ Super Admin
app.use(
  '/api/phanQuyen',
  auth,
  checkPermission('Quản lý phân quyền'),
  phanQuyenRoutes
); // Chỉ Super Admin
app.use('/api/loaiSanh', loaiSanhRoutes);
app.use('/api/sanh', sanhRoutes);
app.use('/api/loaiMonAn', loaiMonAnRoutes);
app.use('/api/monAn', monAnRoutes);
app.use('/api/thucDon', thucDonRoutes);
app.use('/api/loaiDichVu', loaiDichVuRoutes);
app.use('/api/dichVu', dichVuRoutes);
app.use('/api/ca', caRoutes);
app.use('/api/datTiec', (await import('./src/routes/datTiec.js')).default);
app.use('/api/hoaDon', (await import('./src/routes/hoaDon.js')).default);
app.use(
  '/api/baoCaoDoanhSo',
  (await import('./src/routes/baoCaoDoanhSo.js')).default
);

// Default route
app.get('/', (_req, res) => {
  res.json({ message: 'QuanLyTiecCuoi Backend API' });
});
// Gắn router
app.use('/api/dichvu', dichVuRoutes);
app.use('/api/loaidichvu', loaiDichVuRoutes);
app.use('/api/loaimonan', loaiMonAnRoutes);
app.use('/api/monan', monAnRoutes);
app.use('/api/thucdon', thucDonRoutes);
app.use('/api/sanh', sanhRoutes);
app.use('/api/loaisanh', loaiSanhRoutes);
app.use('/api/ca', caRoutes);
app.use('/api/hoadon', HoaDonRoutes);
// Error handling
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Đã xảy ra lỗi!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chạy trên cổng ${PORT}`);
});
