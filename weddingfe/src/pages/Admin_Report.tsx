import { useState } from "react";

// interfaces
interface RevenueReport {
  MaBaoCaoDoanhSo: number | null;
  Thang: number;
  Nam: number;
  TongDoanhThu: number;
}

interface RevenueReportDetail {
  MaBaoCaoDoanhSo: number | null;
  Ngay: string;
  SoLuongTiec: number;
  DoanhThu: number;
  TiLe: number;
}

// Sample data (thay thế bằng API call trong thực tế)
const initialReports: RevenueReport[] = [
  { MaBaoCaoDoanhSo: 1, Thang: 1, Nam: 2025, TongDoanhThu: 1500000000 },
  { MaBaoCaoDoanhSo: 2, Thang: 2, Nam: 2025, TongDoanhThu: 1800000000 },
];

const initialReportDetails: RevenueReportDetail[] = [
  {
    MaBaoCaoDoanhSo: 1,
    Ngay: "2025-01-01",
    SoLuongTiec: 5,
    DoanhThu: 500000000,
    TiLe: 33.33,
  },
  {
    MaBaoCaoDoanhSo: 1,
    Ngay: "2025-01-02",
    SoLuongTiec: 3,
    DoanhThu: 300000000,
    TiLe: 20.0,
  },
  {
    MaBaoCaoDoanhSo: 2,
    Ngay: "2025-02-01",
    SoLuongTiec: 4,
    DoanhThu: 600000000,
    TiLe: 33.33,
  },
];

function Admin_Report() {
  // State
  const [reports, setReports] = useState<RevenueReport[]>(initialReports);
  const [reportDetails, setReportDetails] =
    useState<RevenueReportDetail[]>(initialReportDetails);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Lọc báo cáo theo tháng/năm
  const filteredReports = reports.filter(
    (report) =>
      report.Thang.toString().includes(searchTerm) ||
      report.Nam.toString().includes(searchTerm) ||
      report.TongDoanhThu.toString().includes(searchTerm)
  );

  // Lấy chi tiết báo cáo cho báo cáo được chọn
  const selectedReportDetails = reportDetails.filter(
    (detail) => detail.MaBaoCaoDoanhSo === selectedReportId
  );

  // Xử lý chọn báo cáo để xem chi tiết
  const handleSelectReport = (reportId: number | null) => {
    setSelectedReportId(reportId);
  };

  // Đóng chi tiết báo cáo
  const closeReportDetails = () => {
    setSelectedReportId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tìm kiếm báo cáo */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Báo cáo doanh thu
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm theo tháng, năm hoặc doanh thu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Danh sách báo cáo */}
        <div className="mb-8">
          {/* Ẩn bảng trên mobile */}
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tháng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Năm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng doanh thu (VNĐ)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.MaBaoCaoDoanhSo}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.Thang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.Nam}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.TongDoanhThu.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          handleSelectReport(report.MaBaoCaoDoanhSo)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hiển thị dạng card trên mobile */}
          <div className="block sm:hidden space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.MaBaoCaoDoanhSo}
                className="bg-white shadow-md rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Tháng {report.Thang}/{report.Nam}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Doanh thu: {report.TongDoanhThu.toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectReport(report.MaBaoCaoDoanhSo)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal chi tiết báo cáo */}
        {selectedReportId && (
          <div
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-gray-300
              transform -translate-x-1/2 -translate-y-1/2"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Chi tiết báo cáo tháng{" "}
              {
                reports.find((r) => r.MaBaoCaoDoanhSo === selectedReportId)
                  ?.Thang
              }
              /
              {reports.find((r) => r.MaBaoCaoDoanhSo === selectedReportId)?.Nam}
            </h3>
            <div className="mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng tiệc
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doanh thu (VNĐ)
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tỷ lệ (%)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedReportDetails.map((detail) => (
                    <tr key={detail.Ngay}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Date(detail.Ngay).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {detail.SoLuongTiec}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {detail.DoanhThu.toLocaleString("vi-VN")}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {detail.TiLe.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeReportDetails}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin_Report;
