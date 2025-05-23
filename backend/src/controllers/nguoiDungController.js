import NguoiDung from '../models/NguoiDung.js';
import PhanQuyen from '../models/PhanQuyen.js';
import ChucNang from '../models/ChucNang.js';

const createNguoiDung = async (req, res) => {
  try {
    const { tenDangNhap, matKhau, tenNguoiDung, maNhom } = req.body;
    const existingUser = await NguoiDung.findByTenDangNhap(tenDangNhap);
    if (existingUser) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
    }
    const nguoiDung = await NguoiDung.create({
      TenDangNhap: tenDangNhap,
      MatKhau: matKhau,
      TenNguoiDung: tenNguoiDung,
      MaNhom: maNhom,
    });
    res.status(201).json(nguoiDung);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi tạo người dùng: ' + error.message });
  }
};

const login = async (req, res) => {
  try {
    const { tenDangNhap, matKhau } = req.body;
    const nguoiDung = await NguoiDung.findByTenDangNhap(tenDangNhap);
    if (!nguoiDung) {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
    if (nguoiDung.MatKhau !== matKhau) {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
    const { accessToken, refreshToken } = await NguoiDung.generateToken(nguoiDung);
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi đăng nhập: ' + error.message });
  }
};

const getNguoiDung = async (req, res) => {
  try {
    const nguoiDung = await NguoiDung.findById(req.user.id);
    if (!nguoiDung) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }
    res.status(200).json(nguoiDung);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy thông tin người dùng: ' + error.message });
  }
};

const getAllNguoiDung = async (req, res) => {
  try {
    const nguoiDungList = await NguoiDung.findAll();
    res.status(200).json(nguoiDungList);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng: ' + error.message });
  }
};

const updateNguoiDung = async (req, res) => {
  try {
    const { tenNguoiDung, maNhom } = req.body;
    const nguoiDung = await NguoiDung.findById(req.user.id);
    if (!nguoiDung) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }
    const updatedData = {};
    if (tenNguoiDung) updatedData.TenNguoiDung = tenNguoiDung;
    if (maNhom) updatedData.MaNhom = maNhom;
    const updatedNguoiDung = await NguoiDung.update(req.user.id, updatedData);
    res.status(200).json(updatedNguoiDung);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi cập nhật người dùng: ' + error.message });
  }
};

const deleteNguoiDung = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (id === req.user.id) {
      return res.status(403).json({ error: 'Không thể xóa chính tài khoản đang đăng nhập' });
    }
    const result = await NguoiDung.delete(id);
    if (result === 0) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }
    res.status(200).json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xóa người dùng: ' + error.message });
  }
};

const getChucNang = async (req, res) => {
  try {
    const maNhom = req.user.maNhom;
    const phanQuyenList = await PhanQuyen.findByNhom(maNhom);
    const chucNangIds = phanQuyenList.map((pq) => pq.MaChucNang);
    const chucNangList = await ChucNang.findAll();
    const permittedChucNang = chucNangList.filter((cn) =>
      chucNangIds.includes(cn.MaChucNang)
    );
    res.status(200).json(permittedChucNang);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách chức năng: ' + error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token không được cung cấp' });
    }
    const tokenData = await NguoiDung.findRefreshToken(refreshToken);
    if (!tokenData) {
      return res.status(401).json({ error: 'Refresh token không hợp lệ hoặc đã hết hạn' });
    }
    const nguoiDung = await NguoiDung.findById(tokenData.MaNguoiDung);
    const { accessToken } = await NguoiDung.generateToken(nguoiDung);
    await NguoiDung.deleteRefreshToken(refreshToken); // Xóa refresh token cũ
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi làm mới token: ' + error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token không được cung cấp' });
    }
    await NguoiDung.deleteRefreshToken(refreshToken);
    res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi đăng xuất: ' + error.message });
  }
};

export default {
  createNguoiDung,
  login,
  getNguoiDung,
  getAllNguoiDung,
  updateNguoiDung,
  deleteNguoiDung,
  getChucNang,
  refreshToken,
  logout,
};