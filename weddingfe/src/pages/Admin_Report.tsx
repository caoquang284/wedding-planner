import React, { useState, useEffect } from 'react';
import {
  getAllBaoCaoDoanhSo,
  getBaoCaoDoanhSoById,
  createBaoCaoDoanhSo,
} from '../../Api/baoCaoDoanhSoApi';
import { useNavigate } from 'react-router-dom';

interface BaoCaoDoanhSo {
  MaBaoCaoDoanhSo: number;
  Thang: number;
  Nam: number;
  TongDoanhThu: number;
  chiTiet?: {
    Ngay: string;
    SoLuongTiec: number;
    DoanhThu: number;
    TiLe: number | null;
  }[];
}

interface FormData {
  thang: string;
  nam: string;
}

const formatVND = (value: number) => {
  if (typeof value !== 'number') return '';
  return value.toLocaleString('vi-VN') + ' VNĐ';
};

const AdminReport: React.FC = () => {
  const [reports, setReports] = useState<BaoCaoDoanhSo[]>([]);
  const [selectedReport, setSelectedReport] = useState<BaoCaoDoanhSo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    thang: '',
    nam: '',
  });
  const [searchFilters, setSearchFilters] = useState<{ thang?: number; nam?: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllBaoCaoDoanhSo(searchFilters);
        setReports(response.data || []);
      } catch (err: any) {
        setError('Lỗi khi lấy dữ liệu báo cáo: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [searchFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters({
      thang: formData.thang ? Number(formData.thang) : undefined,
      nam: formData.nam ? Number(formData.nam) : undefined,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const thang = Number(formData.thang);
    const nam = Number(formData.nam);
    console.log('Dữ liệu gửi lên:', { thang, nam });
    if (!thang || !nam || thang < 1 || thang > 12 || nam < 2000) {
      alert('Vui lòng nhập tháng (1-12) và năm hợp lệ (>= 2000)');
      return;
    }
    try {
      const response = await createBaoCaoDoanhSo({ thang, nam });
      console.log('Phản hồi từ server:', response.data);
      setReports((prev) => [...prev, response.data]);
      setSuccessMessage('Tạo báo cáo thành công!');
      setFormData({ thang: '', nam: '' });
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Lỗi khi tạo báo cáo:', error.response?.data || error.message);
      alert('Lỗi khi tạo báo cáo: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const response = await getBaoCaoDoanhSoById(id);
      setSelectedReport(response.data.data || response.data); // Điều chỉnh dựa trên cấu trúc
    } catch (error: any) {
      alert('Lỗi khi lấy chi tiết báo cáo: ' + (error.response?.data?.error || error.message));
    }
  };

  const handlePrint = (report: BaoCaoDoanhSo) => {
    const printContent = document.getElementById(`report-${report.MaBaoCaoDoanhSo}`);
    if (printContent) {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow!.document;
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              body { font-family: Arial, sans-serif; font-size: 12pt; color: #000; margin: 0; padding: 0; }
              .print-section { max-width: 210mm; margin: 15mm auto; padding: 20px; }
              @media print {
                body * { visibility: hidden; }
                .print-section, .print-section * { visibility: visible; }
                .print-section {
                  position: static !important;
                  width: 100% !important;
                  max-width: 210mm !important;
                  margin: 15mm auto !important;
                  padding: 20px !important;
                  box-shadow: none !important;
                  overflow: visible !important;
                }
                .print\\:hidden { display: none !important; }
                .text-gray-600 { color: #4B5563 !important; }
                .text-[#001F3F] { color: #001F3F !important; }
                .bg-gray-50 { background-color: #F9FAFB !important; }
                .shadow-xl, .rounded-lg, .fixed, .z-50, .bg-black\\/30 {
                  box-shadow: none !important;
                  border-radius: 0 !important;
                  position: static !important;
                  background: none !important;
                }
                .grid-cols-1, .grid-cols-2 { display: grid !important; }
                .md\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
                .bg-gray-50 { break-inside: avoid !important; border: 1px solid #E5E7EB !important; }
                @page { size: A4; margin: 15mm; }
                .space-y-2 > * + * { margin-top: 0.5rem !important; }
                .space-y-3 > * + * { margin-top: 0.75rem !important; }
                .space-y-8 > * + * { margin-top: 2rem !important; }
                .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
                .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
                .py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
                .p-6 { padding: 1.5rem !important; }
                .mb-2 { margin-bottom: 0.5rem !important; }
                .mb-3 { margin-bottom: 0.75rem !important; }
                .mb-4 { margin-bottom: 1rem !important; }
                .mt-2 { margin-top: 0.5rem !important; }
                .mt-6 { margin-top: 1.5rem !important; }
                .pb-6 { padding-bottom: 1.5rem !important; }
                .font-medium { font-weight: 500 !important; }
                .font-semibold { font-weight: 600 !important; }
                .text-lg { font-size: 1.125rem !important; }
                .text-xl { font-size: 1.25rem !important; }
                .text-3xl { font-size: 1.875rem !important; }
                .font-bold { font-weight: 700 !important; }
                .border-dashed { border-style: dashed !important; }
                .border-gray-200 { border-color: #E5E7EB !important; }
              }
            </style>
          </head>
          <body>
            <div class="print-section">${printContent.innerHTML}</div>
          </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        iframe.contentWindow!.focus();
        iframe.contentWindow!.print();
        setTimeout(() => document.body.removeChild(iframe), 100);
      }, 100);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001F3F] mx-auto mb-4"></div>
          <p className="text-[#001F3F]">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <p className="text-[#D4B2B2]">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
            {successMessage}
          </div>
        )}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#001F3F] mb-4">
            Quản lý báo cáo doanh thu
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <input
                type="number"
                name="thang"
                placeholder="Tháng (1-12)"
                value={formData.thang}
                onChange={handleInputChange}
                className="w-full sm:w-32 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
              />
              <input
                type="number"
                name="nam"
                placeholder="Năm"
                value={formData.nam}
                onChange={handleInputChange}
                className="w-full sm:w-32 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#001F3F] text-white py-2 px-4 rounded hover:bg-[#003366] transition-colors duration-300"
              >
                Tìm kiếm
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-[#001F3F] text-white py-2 px-4 rounded hover:bg-[#003366] transition-colors duration-300"
            >
              Tạo báo cáo
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#001F3F]/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider align-middle">
                    Mã báo cáo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider align-middle">
                    Tháng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider align-middle">
                    Năm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider align-middle">
                    Tổng doanh thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider text-right align-middle">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report.MaBaoCaoDoanhSo} className="hover:bg-[#F8F9FA] transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-[#001F3F] align-middle">
                      {report.MaBaoCaoDoanhSo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 align-middle">
                      {report.Thang}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 align-middle">
                      {report.Nam}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 align-middle">
                      {formatVND(report.TongDoanhThu)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right align-middle">
                      <button
                        onClick={() => handleViewDetail(report.MaBaoCaoDoanhSo)}
                        className="text-[#001F3F] hover:text-[#003366] transition-colors duration-300"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="block sm:hidden space-y-4">
            {reports.map((report) => (
              <div
                key={report.MaBaoCaoDoanhSo}
                className="shadow-md rounded-lg p-4 border border-gray-100"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium text-[#001F3F]">
                    Báo cáo #{report.MaBaoCaoDoanhSo}
                  </h3>
                  <p className="text-sm text-gray-600">Tháng: {report.Thang}</p>
                  <p className="text-sm text-gray-600">Năm: {report.Nam}</p>
                  <p className="text-sm text-[#B8860B]">
                    Tổng doanh thu: {formatVND(report.TongDoanhThu)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleViewDetail(report.MaBaoCaoDoanhSo)}
                      className="text-[#001F3F] hover:text-[#003366] text-sm transition-colors duration-300"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white shadow-xl rounded-lg w-full max-w-lg p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
                Tạo báo cáo doanh thu
              </h3>
              <form onSubmit={handleCreateReport}>
                <div className="mb-3">
                  <label className="block text-sm font-medium">Tháng</label>
                  <input
                    type="number"
                    name="thang"
                    value={formData.thang}
                    onChange={handleInputChange}
                    placeholder="Nhập tháng (1-12)"
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                    min="1"
                    max="12"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">Năm</label>
                  <input
                    type="number"
                    name="nam"
                    value={formData.nam}
                    onChange={handleInputChange}
                    placeholder="Nhập năm (>= 2000)"
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                    min="2000"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-[#001F3F] rounded hover:bg-gray-200 transition-colors duration-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#001F3F] text-white rounded hover:bg-[#003366] transition-colors duration-300"
                  >
                    Tạo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedReport && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white shadow-xl rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div id={`report-${selectedReport.MaBaoCaoDoanhSo}`}>
                <div className="text-center border-b pb-6">
                  <h1 className="text-3xl font-bold text-[#001F3F] mb-2">
                    BÁO CÁO DOANH THU
                  </h1>
                  <p className="text-gray-600">
                    Tháng {selectedReport.Thang}/{selectedReport.Nam}
                  </p>
                  <p className="text-gray-600">
                    Tổng doanh thu: {formatVND(selectedReport.TongDoanhThu)}
                  </p>
                </div>

                <div className="mt-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#001F3F]/10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                          STT
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                          Ngày
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                          Số lượng tiệc cưới
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                          Doanh thu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                          Tỉ lệ (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {selectedReport?.chiTiet?.map((item, index) => (
                        <tr key={item.Ngay} className="hover:bg-[#F8F9FA]">
                          <td className="px-6 py-4 text-sm font-medium text-[#001F3F]">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(item.Ngay).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {item.SoLuongTiec}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatVND(item.DoanhThu)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {typeof item.TiLe === 'number' && !isNaN(item.TiLe)
                              ? `${item.TiLe.toFixed(2)}%`
                              : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t pt-6 mt-8">
                  <div className="text-center text-gray-500 text-sm space-y-2">
                    <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => handlePrint(selectedReport)}
                  className="bg-[#001F3F] text-white px-6 py-2 rounded-lg hover:bg-[#003366] transition-colors duration-300 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  In báo cáo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReport;