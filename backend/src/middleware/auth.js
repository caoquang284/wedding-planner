import jwt from 'jsonwebtoken';
import process from 'node:process';

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Không có token, truy cập bị từ chối' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin user vào req để sử dụng ở các middleware/controller sau
    next();
  } catch (error) {
    console.error('Lỗi xác thực token:', error);
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

export default auth;