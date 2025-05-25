import Ca from '../models/Ca.js';
import { knex } from '../config/database.js';

const createCa = async (req, res) => {
  try {
    const { tenCa } = req.body;
    // Kiểm tra trùng TenCa
    const existingCa = await Ca.findByTenCa(tenCa);
    if (existingCa) {
      return res.status(400).json({ error: 'Tên ca đã tồn tại' });
    }
    const ca = await Ca.create({ TenCa: tenCa });
    return res.status(201).json(ca);
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi khi tạo ca: ' + error.message });
  }
};

const getAllCa = async (req, res) => {
  try {
    const caList = await Ca.findAll();
    return res.status(200).json(caList);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy danh sách ca: ' + error.message });
  }
};

const getCa = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const ca = await Ca.findById(id);
    if (!ca) {
      return res.status(404).json({ error: 'Ca không tồn tại' });
    }
    return res.status(200).json(ca);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy thông tin ca: ' + error.message });
  }
};

const updateCa = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { tenCa } = req.body;
    const ca = await Ca.findById(id);
    if (!ca) {
      return res.status(404).json({ error: 'Ca không tồn tại' });
    }
    // Kiểm tra trùng TenCa (trừ bản ghi hiện tại)
    if (tenCa) {
      const existingCa = await knex('CA')
        .where({ TenCa: tenCa })
        .whereNot({ MaCa: id })
        .first();
      if (existingCa) {
        return res.status(400).json({ error: 'Tên ca đã tồn tại' });
      }
    }
    const updatedCa = await Ca.update(id, { TenCa: tenCa || ca.TenCa });
    return res.status(200).json(updatedCa);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi cập nhật ca: ' + error.message });
  }
};

const deleteCa = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const ca = await Ca.findById(id);
    if (!ca) {
      return res.status(404).json({ error: 'Ca không tồn tại' });
    }
    // Kiểm tra ràng buộc khóa ngoại với DATTIEC
    const datTiecCount = await knex('DATTIEC')
      .where({ MaCa: id })
      .count('MaDatTiec as count')
      .first();
    if (parseInt(datTiecCount.count) > 0) {
      return res
        .status(400)
        .json({ error: 'Ca đang được sử dụng trong đặt tiệc, không thể xóa' });
    }
    await Ca.delete(id);
    return res.status(200).json({ message: 'Xóa ca thành công' });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi khi xóa ca: ' + error.message });
  }
};

export default {
  createCa,
  getAllCa,
  getCa,
  updateCa,
  deleteCa,
};
