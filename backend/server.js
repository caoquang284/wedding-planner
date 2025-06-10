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
app.use('/api/nhomNguoiDung', auth, checkPermission('Quản lý nhóm người dùng'), nhomNguoiDungRoutes); // Chỉ Super Admin
app.use('/api/phanQuyen', auth, checkPermission('Quản lý phân quyền'), phanQuyenRoutes); // Chỉ Super Admin
app.use('/api/loaiSanh', auth, checkPermission('Quản lý loại sảnh'), loaiSanhRoutes);
app.use('/api/sanh', auth, checkPermission('Quản lý sảnh'), sanhRoutes);
app.use('/api/loaiMonAn', auth, checkPermission('Quản lý loại món ăn'), loaiMonAnRoutes);
app.use('/api/monAn', auth, checkPermission('Quản lý món ăn'), monAnRoutes);
app.use('/api/thucDon', auth, checkPermission('Quản lý thực đơn'), thucDonRoutes);
app.use('/api/loaiDichVu', auth, checkPermission('Quản lý loại dịch vụ'), loaiDichVuRoutes);
app.use('/api/dichVu', auth, checkPermission('Quản lý dịch vụ'), dichVuRoutes);
app.use('/api/ca', auth, checkPermission('Quản lý ca'), caRoutes);
app.use('/api/datTiec', auth, checkPermission('Quản lý đặt tiệc'), (await import('./src/routes/datTiec.js')).default);
app.use('/api/hoaDon', auth, checkPermission('Quản lý hóa đơn'), (await import('./src/routes/hoaDon.js')).default);
app.use('/api/baoCaoDoanhSo', auth, checkPermission('Quản lý báo cáo doanh thu'), (await import('./src/routes/baoCaoDoanhSo.js')).default);

// Default route
app.get('/', (_req, res) => {
  res.json({ message: 'QuanLyTiecCuoi Backend API' });
});
<<<<<<< HEAD
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
=======

>>>>>>> c2e9c95438c0d6b8f0b749b289e05fc88067acfb
// Error handling
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Đã xảy ra lỗi!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chạy trên cổng ${PORT}`);
});
