import jwt from 'jsonwebtoken';
import process from 'node:process';
import NguoiDung from '../models/NguoiDung.js';

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Không có token, truy cập bị từ chối' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const nguoiDung = await NguoiDung.findById(decoded.id);
    if (!nguoiDung) {
      return res.status(401).json({ error: 'Người dùng không tồn tại' });
    }
    req.user = { id: decoded.id, maNhom: decoded.maNhom };
    next();
  } catch (error) {
    console.error('Lỗi xác thực token:', error);
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

export default auth;