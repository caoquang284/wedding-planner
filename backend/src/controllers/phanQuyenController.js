import PhanQuyen from '../models/PhanQuyen.js';

const createPhanQuyen = async (req, res) => {
  try {
    const { maNhom, maChucNang } = req.body;
    const existingPhanQuyen = await PhanQuyen.findByNhomAndChucNang(maNhom, maChucNang);
    if (existingPhanQuyen) {
      return res.status(400).json({ error: 'Quyền này đã được gán cho nhóm' });
    }
    const phanQuyen = await PhanQuyen.create({ MaNhom: maNhom, MaChucNang: maChucNang });
    res.status(201).json(phanQuyen);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi gán quyền: ' + error.message });
  }
};

const getPhanQuyenByNhom = async (req, res) => {
  console.log('Entering getPhanQuyenByNhom, maNhom:', req.params.maNhom);
  try {
    const { maNhom } = req.params;
    const parsedMaNhom = parseInt(maNhom);
    if (isNaN(parsedMaNhom)) {
      console.log('Invalid MaNhom:', maNhom);
      return res.status(400).json({ error: 'Mã nhóm không hợp lệ' });
    }
    const phanQuyenList = await PhanQuyen.findByNhom(parsedMaNhom);
    console.log('Permissions fetched:', phanQuyenList);
    res.status(200).json(phanQuyenList);
  } catch (error) {
    console.error('Error in getPhanQuyenByNhom:', error.stack);
    res.status(500).json({ error: 'Lỗi khi lấy quyền: ' + error.message });
  }
};

const deletePhanQuyen = async (req, res) => {
  try {
    const maNhom = parseInt(req.params.maNhom);
    const maChucNang = parseInt(req.params.maChucNang);
    const result = await PhanQuyen.delete(maNhom, maChucNang);
    if (result === 0) {
      return res.status(404).json({ error: 'Quyền không tồn tại' });
    }
    res.status(200).json({ message: 'Xóa quyền thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xóa quyền: ' + error.message });
  }
};

export default {
  createPhanQuyen,
  getPhanQuyenByNhom,
  deletePhanQuyen,
};