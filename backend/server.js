import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import routes from './src/routes/index.js';
import process from 'node:process';
import dichVuRoutes from './src/routes/dichVu.js';
import loaiDichVuRoutes from './src/routes/loaiDichVu.js';
import loaiMonAnRoutes from './src/routes/loaiMonAn.js';
import monAnRoutes from './src/routes/monAn.js';
import thucDonRoutes from './src/routes/thucDon.js';
import sanhRoutes from './src/routes/sanh.js';
import loaiSanhRoutes from './src/routes/loaiSanh.js';
import caRoutes from './src/routes/ca.js';

config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(json());

// Routes
app.use('/api', routes);

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
// Error handling
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Đã xảy ra lỗi!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chạy trên cổng ${PORT}`);
});
