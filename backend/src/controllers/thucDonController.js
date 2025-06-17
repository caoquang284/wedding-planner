/* eslint-disable no-unused-vars */
import ThucDon from '../models/ThucDon.js';
import { knex } from '../config/database.js';
const createThucDon = async (req, res) => {
  try {
    const { tenThucDon, donGiaThoiDiemDat, donGiaHienTai, ghiChu, monAnIds } =
      req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!tenThucDon || !donGiaThoiDiemDat || !donGiaHienTai || !monAnIds) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    if (!Array.isArray(monAnIds) || monAnIds.length === 0) {
      return res.status(400).json({ error: 'Danh sách món ăn không hợp lệ' });
    }

    if (donGiaThoiDiemDat < 0 || donGiaHienTai < 0) {
      return res.status(400).json({ error: 'Đơn giá không được âm' });
    }

    // Kiểm tra món ăn tồn tại
    for (const maMonAn of monAnIds) {
      const exists = await ThucDon.isMonAnExists(maMonAn);
      if (!exists) {
        return res
          .status(400)
          .json({ error: `Món ăn với ID ${maMonAn} không tồn tại` });
      }
    }

    // Tạo thực đơn
    const thucDonData = {
      TenThucDon: tenThucDon,
      DonGiaThoiDiemDat: Number(donGiaThoiDiemDat),
      DonGiaHienTai: Number(donGiaHienTai),
      GhiChu: ghiChu || null,
    };

    const thucDon = await ThucDon.create(thucDonData);

    // Thêm món ăn vào THUCDON_MONAN
    for (const maMonAn of monAnIds) {
      // Lấy DonGia từ MONAN làm DonGiaThoiDiemDat
      const monAn = await knex('MONAN').where({ MaMonAn: maMonAn }).first();
      await ThucDon.addMonAn(thucDon.MaThucDon, maMonAn, monAn.DonGia);
    }

    // Trả về thực đơn với danh sách món ăn
    const thucDonWithDetails = await ThucDon.findByIdWithMonAn(
      thucDon.MaThucDon
    );
    return res.status(201).json(thucDonWithDetails);
  } catch (error) {
    console.error('Error creating thuc don:', error.stack);
    return res
      .status(500)
      .json({ error: 'Lỗi khi tạo thực đơn: ' + error.message });
  }
};

const getAllThucDon = async (req, res) => {
  try {
    const thucDonList = await ThucDon.findAllWithMonAnNames();
    return res.status(200).json(thucDonList);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy danh sách thực đơn: ' + error.message });
  }
};

const getThucDon = async (req, res) => {
  try {
    const { id } = req.params;
    const thucDon = await ThucDon.findByIdWithMonAn(id);

    if (!thucDon) {
      return res.status(404).json({ error: 'Thực đơn không tồn tại' });
    }

    // Tính tổng tiền của thực đơn
    const tongTien = await ThucDon.calculateTotalPrice(id);
    thucDon.TongTien = tongTien;

    return res.status(200).json(thucDon);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi lấy thông tin thực đơn: ' + error.message });
  }
};

const updateThucDon = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenThucDon, donGiaThoiDiemDat, donGiaHienTai, ghiChu, monAnIds } =
      req.body;

    const thucDon = await ThucDon.findById(id);
    if (!thucDon) {
      return res.status(404).json({ error: 'Thực đơn không tồn tại' });
    }

    // Kiểm tra món ăn tồn tại
    if (monAnIds && Array.isArray(monAnIds)) {
      for (const maMonAn of monAnIds) {
        const exists = await ThucDon.isMonAnExists(maMonAn);
        if (!exists) {
          return res
            .status(400)
            .json({ error: `Món ăn với ID ${maMonAn} không tồn tại` });
        }
      }
    }

    // Cập nhật thông tin cơ bản của thực đơn
    const updatedThucDon = await ThucDon.update(id, {
      TenThucDon: tenThucDon,
      DonGiaThoiDiemDat: donGiaThoiDiemDat,
      DonGiaHienTai: donGiaHienTai,
      GhiChu: ghiChu || null,
    });
    const monAnInThucDon = await ThucDon.getMonAnInThucDon(id);

    // Nếu có danh sách món ăn mới, cập nhật THUCDON_MONAN
    if (monAnIds && Array.isArray(monAnIds)) {
      // Xóa tất cả món ăn cũ
      //Toi muon xoa nhung mon an ma khong co trong monAnInThucDon
      if (monAnInThucDon.length > 0) {
        const monAnInThucDonIds = monAnInThucDon.map((item) => item.MaMonAn);
        const monAnIdsNotInThucDon = monAnIds.filter(
          (maMonAn) => !monAnInThucDonIds.includes(maMonAn)
        );
        for (const maMonAn of monAnIdsNotInThucDon) {
          await ThucDon.removeMonAn(id, maMonAn);
        }
      }

      // Thêm các món ăn mới
      for (const maMonAn of monAnIds) {
        // Lấy DonGia từ MONAN làm DonGiaThoiDiemDat
        const monAn = await knex('MONAN').where({ MaMonAn: maMonAn }).first();
        //Toi muon so sanh monAnInThucDon.MaMonAn voi monAnIds
        const isMonAnInThucDon = monAnInThucDon.some(
          (item) => item.MaMonAn === maMonAn
        );
        if (!isMonAnInThucDon) {
          await ThucDon.addMonAn(id, maMonAn, monAn.DonGia);
        }
      }
    }

    // Trả về thực đơn với danh sách món ăn đã cập nhật
    const thucDonWithDetails = await ThucDon.findByIdWithMonAn(id);
    return res.status(200).json(thucDonWithDetails);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi cập nhật thực đơn: ' + error.message });
  }
};

const deleteThucDon = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    console.log('deleteThucDonController - ID:', id, 'Type:', typeof id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID không hợp lệ, phải là số' });
    }

    console.log('Finding ThucDon with ID:', id);
    const thucDon = await ThucDon.findById(id);
    console.log('ThucDon found:', thucDon);

    if (!thucDon) {
      return res.status(404).json({ error: 'Thực đơn không tồn tại' });
    }

    console.log('Checking if ThucDon is used by DatTiec');
    const isUsed = await ThucDon.isUsedByDatTiec(id);
    console.log('Is ThucDon used:', isUsed);

    if (isUsed) {
      return res.status(400).json({
        error: 'Không thể xóa thực đơn đang được sử dụng trong một đặt tiệc',
      });
    }

    console.log('Deleting ThucDon with ID:', id);
    await ThucDon.delete(id);
    console.log('ThucDon deleted successfully');

    return res.status(200).json({ message: 'Xóa thực đơn thành công' });
  } catch (error) {
    console.error(
      'Error in deleteThucDonController:',
      error.message,
      error.stack
    );
    return res
      .status(500)
      .json({ error: 'Lỗi khi xóa thực đơn: ' + error.message });
  }
};

// Thêm món ăn vào thực đơn
const addMonAnToThucDon = async (req, res) => {
  try {
    const { id } = req.params;
    const { maMonAn, donGiaThoiDiemDat } = req.body;

    // Kiểm tra thực đơn tồn tại
    const thucDon = await ThucDon.findById(id);
    if (!thucDon) {
      return res.status(404).json({ error: 'Thực đơn không tồn tại' });
    }

    // Kiểm tra món ăn tồn tại
    const monAnExists = await ThucDon.isMonAnExists(maMonAn);
    if (!monAnExists) {
      return res.status(400).json({ error: 'Món ăn không tồn tại' });
    }

    // Kiểm tra món ăn đã có trong thực đơn chưa
    const isAlreadyInThucDon = await ThucDon.isMonAnInThucDon(id, maMonAn);
    if (isAlreadyInThucDon) {
      return res.status(400).json({ error: 'Món ăn đã có trong thực đơn' });
    }

    const thucDonMonAn = await ThucDon.addMonAn(id, maMonAn, donGiaThoiDiemDat);
    return res.status(201).json({
      message: 'Thêm món ăn vào thực đơn thành công',
      data: thucDonMonAn,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi thêm món ăn vào thực đơn: ' + error.message });
  }
};

// Xóa món ăn khỏi thực đơn
const removeMonAnFromThucDon = async (req, res) => {
  try {
    const { id, maMonAn } = req.params;

    // Kiểm tra thực đơn tồn tại
    const thucDon = await ThucDon.findById(id);
    if (!thucDon) {
      return res.status(404).json({ error: 'Thực đơn không tồn tại' });
    }

    // Kiểm tra món ăn có trong thực đơn không
    const isInThucDon = await ThucDon.isMonAnInThucDon(id, maMonAn);
    if (!isInThucDon) {
      return res.status(404).json({ error: 'Món ăn không có trong thực đơn' });
    }

    await ThucDon.removeMonAn(id, maMonAn);
    return res
      .status(200)
      .json({ message: 'Xóa món ăn khỏi thực đơn thành công' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Lỗi khi xóa món ăn khỏi thực đơn: ' + error.message });
  }
};

// Cập nhật giá món ăn trong thực đơn
const updateMonAnInThucDon = async (req, res) => {
  try {
    const { id, maMonAn } = req.params;
    const { donGiaThoiDiemDat } = req.body;

    // Kiểm tra thực đơn tồn tại
    const thucDon = await ThucDon.findById(id);
    if (!thucDon) {
      return res.status(404).json({ error: 'Thực đơn không tồn tại' });
    }

    // Kiểm tra món ăn có trong thực đơn không
    const isInThucDon = await ThucDon.isMonAnInThucDon(id, maMonAn);
    if (!isInThucDon) {
      return res.status(404).json({ error: 'Món ăn không có trong thực đơn' });
    }

    const updatedThucDonMonAn = await ThucDon.updateMonAn(
      id,
      maMonAn,
      donGiaThoiDiemDat
    );
    return res.status(200).json({
      message: 'Cập nhật giá món ăn trong thực đơn thành công',
      data: updatedThucDonMonAn,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Lỗi khi cập nhật món ăn trong thực đơn: ' + error.message,
    });
  }
};

const getMonAnInThucDon = async (req, res) => {
  try {
    const { id } = req.params;
    const monAnInThucDon = await ThucDon.getMonAnInThucDon(id);
    return res.status(200).json(monAnInThucDon);
  } catch (error) {
    return res.status(500).json({
      error: 'Lỗi khi lấy món ăn trong thực đơn: ' + error.message,
    });
  }
};
export default {
  createThucDon,
  getAllThucDon,
  getThucDon,
  updateThucDon,
  deleteThucDon,
  addMonAnToThucDon,
  removeMonAnFromThucDon,
  updateMonAnInThucDon,
  getMonAnInThucDon,
};
