import { knex } from '../config/database.js';

const HoaDon = {
  // Thêm hóa đơn mới
  create: async (data) => {
    try {
      const [hoaDon] = await knex('HOADON').insert(data).returning('*');
      return hoaDon;
    } catch (error) {
      throw new Error(`Lỗi khi tạo hóa đơn: ${error.message}`);
    }
  },

  // Lấy hóa đơn theo ID
  findById: async (id) => {
    try {
      const hoaDon = await knex('HOADON').where({ MaHoaDon: id }).first();
      if (!hoaDon) {
        throw new Error('Hóa đơn không tồn tại');
      }
      return hoaDon;
    } catch (error) {
      throw new Error(`Lỗi khi tìm hóa đơn: ${error.message}`);
    }
  },

  // Lấy tất cả hóa đơn
  findAll: async () => {
    try {
      return await knex('HOADON').select('*');
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách hóa đơn: ${error.message}`);
    }
  },

  // Cập nhật hóa đơn
  update: async (id, data) => {
    try {
      // Kiểm tra hóa đơn tồn tại
      const hoaDonExists = await knex('HOADON').where('MaHoaDon', id).first();
      if (!hoaDonExists) {
        throw new Error('Hóa đơn không tồn tại');
      }

      // Kiểm tra MaDatTiec nếu được cập nhật
      if (data.MaDatTiec) {
        const datTiecExists = await knex('DATTIEC')
          .where('MaDatTiec', data.MaDatTiec)
          .first();
        if (!datTiecExists) {
          throw new Error('Mã đặt tiệc không tồn tại');
        }
      }

      // Kiểm tra các trường số không âm nếu được cập nhật
      if (
        (data.TongTienBan !== undefined && data.TongTienBan < 0) ||
        (data.TongTienDichVu !== undefined && data.TongTienDichVu < 0) ||
        (data.TongTienHoaDon !== undefined && data.TongTienHoaDon < 0) ||
        (data.PhanTramPhatMotNgay !== undefined &&
          (data.PhanTramPhatMotNgay < 0 || data.PhanTramPhatMotNgay > 100)) ||
        (data.TongTienPhat !== undefined && data.TongTienPhat < 0) ||
        (data.TongTienConLai !== undefined && data.TongTienConLai < 0)
      ) {
        throw new Error('Các trường tiền hoặc phần trăm phạt phải hợp lệ');
      }

      // Kiểm tra TrangThai nếu được cập nhật
      if (data.TrangThai !== undefined && ![0, 1, 2].includes(data.TrangThai)) {
        throw new Error('Trạng thái không hợp lệ (phải là 0, 1 hoặc 2)');
      }

      const [updatedHoaDon] = await knex('HOADON')
        .where({ MaHoaDon: id })
        .update(data)
        .returning('*');
      return updatedHoaDon;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật hóa đơn: ${error.message}`);
    }
  },

  delete: async (id) => {
    try {
      console.log('HoaDon.delete - ID:', id);
      const hoaDonExists = await knex('HOADON').where({ MaHoaDon: id }).first();
      console.log('HoaDon.delete - HoaDon exists:', !!hoaDonExists);
      if (!hoaDonExists) {
        throw new Error('Hóa đơn không tồn tại');
      }
      if (hoaDonExists.MaDatTiec) {
        const datTiec = await knex('DATTIEC')
          .where({ MaDatTiec: hoaDonExists.MaDatTiec })
          .first();
        console.log(
          'HoaDon.delete - DatTiec exists for MaDatTiec:',
          hoaDonExists.MaDatTiec,
          'Result:',
          !!datTiec
        );
        if (datTiec) {
          throw new Error('Không thể xóa hóa đơn vì còn đặt tiệc liên quan');
        }
      } else {
        console.log('HoaDon.delete - No MaDatTiec associated with this HoaDon');
      }
      const deletedCount = await knex('HOADON').where({ MaHoaDon: id }).del();
      console.log('HoaDon.delete - Deleted rows:', deletedCount);
      return deletedCount > 0;
    } catch (error) {
      console.error('HoaDon.delete - Error:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw new Error(`Lỗi khi xóa hóa đơn: ${error.message}`);
    }
  },
};

export default HoaDon;
