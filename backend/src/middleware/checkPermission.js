import PhanQuyen from '../models/PhanQuyen.js';
import ChucNang from '../models/ChucNang.js';

const checkPermission = (tenChucNang) => async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.id || !user.maNhom) {
      return res.status(401).json({ error: 'Không có thông tin người dùng' });
    }

    // Tìm chức năng dựa trên TenChucNang
    const chucNang = await ChucNang.findByTenChucNang(tenChucNang);
    if (!chucNang) {
      return res.status(404).json({ error: 'Chức năng không tồn tại' });
    }

    // Kiểm tra quyền của nhóm người dùng
    const phanQuyen = await PhanQuyen.findByNhomAndChucNang(user.maNhom, chucNang.MaChucNang);
    if (!phanQuyen) {
      return res.status(403).json({ error: 'Không có quyền truy cập chức năng này' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Lỗi kiểm tra quyền: ' + error.message });
  }
};

export default checkPermission;