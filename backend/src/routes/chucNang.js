import { Router } from 'express';
import auth from '../middleware/auth.js';
import checkPermission from '../middleware/checkPermission.js';
import db from '../config/db.js';

const router = Router();

router.get(
  '/danh-sach',
  auth,
  checkPermission('Quản lý phân quyền'),
  async (req, res) => {
    try {
      const chucNang = await db('CHUCNANG').select(
        'MaChucNang',
        'TenChucNang',
        'TenManHinh'
      );
      return res.status(200).json(chucNang);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export default router;