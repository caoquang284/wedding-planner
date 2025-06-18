import React, { useState, useEffect } from 'react';
import {
  getAllBaoCaoDoanhSo,
  getBaoCaoDoanhSoById,
  getRevenueStatsByDateRange,
} from '../../Api/baoCaoDoanhSoApi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

interface DateRange {
  startDate: string;
  endDate: string;
}

interface StatsData {
  label: string;
  SoLuongTiec: number;
  DoanhThu: number;
}

const formatVND = (value: number | string) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (typeof numValue !== 'number' || isNaN(numValue)) return 'N/A';
  return numValue.toLocaleString('vi-VN') + ' VNĐ';
};

const AdminReport: React.FC = () => {
  const [reports, setReports] = useState<BaoCaoDoanhSo[]>([]);
  const [selectedReport, setSelectedReport] = useState<BaoCaoDoanhSo | null>(null);
  const [searchFilters, setSearchFilters] = useState<{ thang?: number; nam?: number }>({});
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: '', endDate: '' });
  const [statsData, setStatsData] = useState<StatsData[]>([]);
  const [formData, setFormData] = useState<FormData>({ thang: '', nam: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchReports();
  }, [searchFilters]);

  useEffect(() => {
    const fetchStats = async () => {
      if (dateRange.startDate && dateRange.endDate) {
        try {
          const response = await getRevenueStatsByDateRange(dateRange.startDate, dateRange.endDate);
          setStatsData(response.data || []);
        } catch (err: any) {
          setError('Lỗi khi lấy dữ liệu thống kê: ' + (err.response?.data?.error || err.message));
        }
      }
    };
    fetchStats();
  }, [dateRange]);

  useEffect(() => {
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, [searchFilters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as FormData));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters({
      thang: formData.thang ? Number(formData.thang) : undefined,
      nam: formData.nam ? Number(formData.nam) : undefined,
    });
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value } as DateRange));
  };

  const handleViewDetail = async (id: number) => {
    try {
      const response = await getBaoCaoDoanhSoById(id);
      setSelectedReport(response.data || null);
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

  const chartData = {
    labels: statsData.map((item) => item.label),
    datasets: [
      {
        label: 'Doanh Thu (VNĐ)',
        data: statsData.map((item) => Number(item.DoanhThu) || 0),
        borderColor: '#001F3F',
        backgroundColor: 'rgba(0, 31, 63, 0.2)',
        fill: true,
      },
      {
        label: 'Số Lượng Tiệc Cưới',
        data: statsData.map((item) => Number(item.SoLuongTiec) || 0),
        borderColor: '#B8860B',
        backgroundColor: 'rgba(184, 134, 11, 0.2)',
        fill: true,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text:
          dateRange.startDate && dateRange.endDate
            ? `Thống Kê Doanh Thu và Số Lượng Tiệc Cưới từ ${new Date(
                dateRange.startDate
              ).toLocaleDateString('vi-VN')} đến ${new Date(dateRange.endDate).toLocaleDateString(
                'vi-VN'
              )}`
            : 'Thống Kê Doanh Thu và Số Lượng Tiệc Cưới',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: statsData.some((item) => item.label.includes('/'))
            ? statsData.some((item) => item.label.includes('/20'))
              ? 'Tháng/Năm'
              : 'Ngày/Tháng/Năm'
            : 'Năm',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: { display: true, text: 'Doanh Thu (VNĐ)' },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: { display: true, text: 'Số Lượng Tiệc' },
        grid: { drawOnChartArea: false },
      },
    },
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
        <h2 className="text-2xl sm:text-3xl font-bold text-[#001F3F] mb-4">
          Quản lý báo cáo doanh thu
        </h2>

        {/* Bộ lọc tháng/năm và khoảng thời gian */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-2">Tìm kiếm theo tháng/năm</h3>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
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
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-2">Thống kê theo khoảng thời gian</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
                className="w-full sm:w-40 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
              />
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="w-full sm:w-40 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
              />
            </div>
          </div>
        </div>

        {/* Biểu đồ thống kê */}
        {statsData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        {/* Danh sách báo cáo */}
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
        </div>

        {/* Modal chi tiết báo cáo */}
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
                      )) || (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-sm text-gray-500 text-center">
                            Không có dữ liệu chi tiết
                          </td>
                        </tr>
                      )}
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