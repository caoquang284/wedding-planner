import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllHoaDon } from "../../Api/hoaDonApi";
import { getAllDatTiec } from "../../Api/datTiecApi";

const InvoiceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [datTiec, setDatTiec] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hoaDonList, datTiecList] = await Promise.all([
          getAllHoaDon(),
          getAllDatTiec(),
        ]);

        const foundInvoice = hoaDonList.data.find(
          (inv: any) => inv.MaHoaDon === Number(id)
        );
        setInvoice(foundInvoice);

        if (foundInvoice) {
          const foundDatTiec = datTiecList.data.find(
            (dt: any) => dt.MaDatTiec === foundInvoice.MaDatTiec
          );
          setDatTiec(foundDatTiec);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001F3F]"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Không tìm thấy hóa đơn</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Header - Ẩn khi in */}
        <div className="print:hidden mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-[#001F3F] hover:text-[#003366] transition-colors duration-300"
          >
            ← Quay lại
          </button>
          <button
            onClick={handlePrint}
            className="bg-[#001F3F] text-white px-4 py-2 rounded hover:bg-[#003366] transition-colors duration-300"
          >
            In hóa đơn
          </button>
        </div>

        {/* Nội dung hóa đơn */}
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-[#001F3F] mb-2">
              HÓA ĐƠN ĐẶT TIỆC
            </h1>
            <p className="text-gray-600">Mã hóa đơn: #{invoice.MaHoaDon}</p>
            <p className="text-gray-500 text-sm">
              Ngày lập:{" "}
              {new Date(invoice.NgayThanhToan).toLocaleDateString("vi-VN")}
            </p>
          </div>

          {/* Thông tin khách hàng và đặt tiệc */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold mb-2 text-[#001F3F]">
                Thông tin đặt tiệc:
              </h2>
              <div className="space-y-1">
                <p>
                  <span className="text-gray-600">Mã đặt tiệc:</span>{" "}
                  {invoice.MaDatTiec}
                </p>
                {datTiec && (
                  <>
                    <p>
                      <span className="text-gray-600">Chú rể:</span>{" "}
                      {datTiec.TenChuRe}
                    </p>
                    <p>
                      <span className="text-gray-600">Cô dâu:</span>{" "}
                      {datTiec.TenCoDau}
                    </p>
                    <p>
                      <span className="text-gray-600">Ngày đãi tiệc:</span>{" "}
                      {new Date(datTiec.NgayDaiTiec).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div>
              <h2 className="font-semibold mb-2 text-[#001F3F]">
                Thông tin thanh toán:
              </h2>
              <div className="space-y-1">
                <p>
                  <span className="text-gray-600">Ngày thanh toán:</span>{" "}
                  {new Date(invoice.NgayThanhToan).toLocaleDateString("vi-VN")}
                </p>
                <p>
                  <span className="text-gray-600">Trạng thái:</span>
                  <span
                    className={`ml-2 ${
                      invoice.TrangThai === 0
                        ? "text-red-500"
                        : invoice.TrangThai === 1
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {invoice.TrangThai === 0
                      ? "Chưa thanh toán"
                      : invoice.TrangThai === 1
                      ? "Đã thanh toán"
                      : "Đã hủy"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Chi tiết thanh toán */}
          <div className="border-t pt-6">
            <h2 className="font-semibold mb-4 text-[#001F3F]">
              Chi tiết thanh toán:
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">Tổng tiền bàn:</span>
                <span>{invoice.TongTienBan.toLocaleString("vi-VN")} VNĐ</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">Tổng tiền dịch vụ:</span>
                <span>
                  {invoice.TongTienDichVu.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
              {invoice.ApDungQuyDinhPhat && (
                <div className="flex justify-between items-center py-1 text-red-500">
                  <span>Tiền phạt ({invoice.PhanTramPhatMotNgay}%/ngày):</span>
                  <span>
                    {invoice.TongTienPhat.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-t border-dashed">
                <span className="font-semibold text-[#001F3F]">
                  Tổng tiền hóa đơn:
                </span>
                <span className="font-semibold text-[#001F3F]">
                  {invoice.TongTienHoaDon.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">Số tiền còn lại:</span>
                <span className="text-[#001F3F]">
                  {invoice.TongTienConLai.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-6 mt-8">
            <div className="text-center text-gray-500 text-sm space-y-2">
              <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
              <p className="print:hidden">
                Vui lòng giữ hóa đơn này để đối chiếu khi cần thiết.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
