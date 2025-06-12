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
import { authRoutes } from './src/routes/auth.js';

config();

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend URL (Vite default)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(morgan('dev'));
app.use(json());

// Routes
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/nguoiDung', auth, nguoiDungRoutes);
app.use(
  '/api/nhomNguoiDung',
  auth,
  checkPermission('Quản lý nhóm người dùng'),
  nhomNguoiDungRoutes
);
app.use(
  '/api/phanQuyen',
  auth,
  checkPermission('Quản lý phân quyền'),
  phanQuyenRoutes
);
app.use('/api/loaiSanh', loaiSanhRoutes);
app.use('/api/sanh', sanhRoutes);
app.use('/api/loaiMonAn', loaiMonAnRoutes);
app.use('/api/monAn', monAnRoutes);
app.use('/api/thucDon', thucDonRoutes); // Giữ một tuyến duy nhất, thống nhất chữ thường
app.use('/api/loaiDichVu', loaiDichVuRoutes);
app.use('/api/dichVu', dichVuRoutes);
app.use('/api/ca', caRoutes);
app.use('/api/datTiec', (await import('./src/routes/datTiec.js')).default);
app.use('/api/hoaDon', HoaDonRoutes);
app.use(
  '/api/baoCaoDoanhSo',
  (await import('./src/routes/baoCaoDoanhSo.js')).default
);

// Default route
app.get('/', (_req, res) => {
  res.json({ message: 'QuanLyTiecCuoi Backend API' });
});

// Error handling
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Đã xảy ra lỗi!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chạy trên cổng ${PORT}`);
});
