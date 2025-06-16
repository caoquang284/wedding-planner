import PhanQuyen from '../models/PhanQuyen.js';
import ChucNang from '../models/ChucNang.js';

const checkPermission = (tenChucNang) => async (req, res, next) => {
  try {
    const user = req.user;
    console.log(`🎯 Đang kiểm tra quyền: ${tenChucNang}`);
    console.log('📜 Danh sách quyền hiện tại:', req.user.permissions);
    if (!user || !user.id || !user.maNhom) {
      return res.status(401).json({ error: 'Không có thông tin người dùng' });
    }

    // Kiểm tra quyền từ permissions đã được tải trong middleware auth
    if (!user.permissions.includes(tenChucNang)) {
      return res
        .status(403)
        .json({ error: 'Không có quyền truy cập chức năng này' });
    }
    console.log('✅ Đã có quyền truy cập!');
    next();
  } catch (error) {
    res.status(500).json({ error: 'Lỗi kiểm tra quyền: ' + error.message });
  }
};

export default checkPermission;
