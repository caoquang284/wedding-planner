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
import nguoiDungRoutes from './src/routes/nguoiDung.js';
import nhomNguoiDungRoutes from './src/routes/nhomNguoiDung.js';
import phanQuyenRoutes from './src/routes/phanQuyen.js';
import auth from './src/middleware/auth.js';
import checkPermission from './src/middleware/checkPermission.js';
import validation from './src/middleware/validation.js';
import { authRoutes } from './src/routes/auth.js';
import datTiecRoutes from './src/routes/datTiec.js';
import hoaDonRoutes from './src/routes/hoaDon.js';
import baoCaoDoanhSoRoutes from './src/routes/baoCaoDoanhSo.js';

config();

const app = express();

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
app.use(
  '/api/loaiSanh',
  auth,
  checkPermission('Quản lý loại sảnh'),
  loaiSanhRoutes
);
app.use('/api/sanh', auth, checkPermission('Quản lý sảnh'), sanhRoutes);
app.use(
  '/api/loaiMonAn',
  auth,
  checkPermission('Quản lý loại món ăn'),
  loaiMonAnRoutes
);
app.use('/api/monAn', auth, checkPermission('Quản lý món ăn'), monAnRoutes);
app.use(
  '/api/thucDon',
  auth,
  checkPermission('Quản lý thực đơn'),
  thucDonRoutes
);
app.use(
  '/api/loaiDichVu',
  auth,
  checkPermission('Quản lý loại dịch vụ'),
  loaiDichVuRoutes
);
app.use('/api/dichVu', auth, checkPermission('Quản lý dịch vụ'), dichVuRoutes);
app.use('/api/ca', auth, checkPermission('Quản lý ca'), caRoutes);
app.use(
  '/api/datTiec',
  auth,
  checkPermission('Quản lý đặt tiệc'),
  datTiecRoutes
);
app.use('/api/hoaDon', auth, checkPermission('Quản lý hóa đơn'), hoaDonRoutes);
app.use(
  '/api/baoCaoDoanhSo',
  auth,
  checkPermission('Quản lý báo cáo doanh thu'),
  baoCaoDoanhSoRoutes
);

app.get('/', (_req, res) => {
  res.json({ message: 'QuanLyTiecCuoi Backend API' });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Đã xảy ra lỗi!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chạy trên cổng ${PORT}`);
});
