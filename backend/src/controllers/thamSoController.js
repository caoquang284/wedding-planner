import ThamSo from '../models/ThamSo.js';

const getThamSo = async (req, res) => {
  try {
    const thamSo = await ThamSo.findOne();
    if (!thamSo) {
      return res.status(404).json({ error: 'Thông tin tham số không tồn tại' });
    }
    return res.status(200).json(thamSo);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy thông tin tham số: ' + error.message });
  }
};

const updateThamSo = async (req, res) => {
  try {
    const { phanTramPhatTrenNgay } = req.body;
    const thamSo = await ThamSo.findOne();
    if (!thamSo) {
      return res.status(404).json({ error: 'Thông tin tham số không tồn tại' });
    }
    const updatedThamSo = await ThamSo.update({
      PhanTramPhatTrenNgay: phanTramPhatTrenNgay,
    });
    return res.status(200).json(updatedThamSo);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi cập nhật tham số: ' + error.message });
  }
};

export default {
  getThamSo,
  updateThamSo,
};
