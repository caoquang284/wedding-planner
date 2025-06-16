import React, { useState, useEffect } from "react";
import {
  getAllHoaDon,
  createHoaDon,
  updateHoaDon,
  deleteHoaDon,
} from "../../Api/hoaDonApi";
import { getAllDatTiec, getDatTiecById } from "../../Api/datTiecApi";
import { getThucDonById } from "../../Api/thucDonApi";
import { getSanhById } from "../../Api/sanhApi";
import { getCaById } from "../../Api/caApi";
import { getDichVuById } from "../../Api/dichVuApi";
import { getMonAnById } from "../../Api/monAnApi";
import { useNavigate } from "react-router-dom";

interface HoaDon {
  MaHoaDon: number;
  MaDatTiec: number;
  NgayThanhToan: string;
  TongTienBan: number;
  TongTienDichVu: number;
  TongTienHoaDon: number;
  ApDungQuyDinhPhat: boolean;
  PhanTramPhatMotNgay: number;
  TongTienPhat: number;
  TongTienConLai: number;
  TrangThai: number;
}

interface DatTiec {
  MaDatTiec: number;
  TenChuRe: string;
  TenCoDau: string;
  NgayDaiTiec: string;
}

interface FormData {
  MaDatTiec: number | null;
  NgayThanhToan: string;
  TongTienBan: string;
  TongTienDichVu: string;
  TongTienHoaDon: string;
  ApDungQuyDinhPhat: boolean;
  PhanTramPhatMotNgay: string;
  TongTienPhat: string;
  TongTienConLai: string;
  TrangThai: number;
}

interface ConfirmationModal {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
}

interface ChiTietDatTiec {
  MaDatTiec: number;
  TenChuRe: string;
  TenCoDau: string;
  DienThoai: string;
  NgayDaiTiec: string;
  MaCa: number;
  MaSanh: number;
  MaThucDon: number;
  SoLuongBan: number;
  SoBanDuTru: number;
  TienDatCoc: number;
  DichVus?: {
    MaDichVu: number;
    SoLuong: number;
    DonGiaThoiDiemDat: number;
  }[];
}

interface ThucDon {
  MaThucDon: number;
  TenThucDon: string;
  DonGia: number;
  MonAns?: {
    MaMonAn: number;
    TenMonAn: string;
    DonGia: number;
  }[];
}

interface Sanh {
  MaSanh: number;
  TenSanh: string;
  SucChua: number;
  DonGia: number;
  TenLoaiSanh: string;
}

interface Ca {
  MaCa: number;
  TenCa: string;
  ThoiGianBatDau: string;
  ThoiGianKetThuc: string;
}

interface DichVu {
  MaDichVu: number;
  TenDichVu: string;
  DonGia: number;
  TenLoaiDichVu: string;
}

interface MonAnDatTiec {
  MaMonAn: number;
  DonGiaThoiDiemDat: string;
}

interface DichVuDatTiec {
  MaDichVu: number;
  SoLuong: number;
  DonGiaThoiDiemDat: string;
  ThanhTien: string;
}

const formatVND = (value: number) => {
  if (typeof value !== "number") return "";
  return value.toLocaleString("vi-VN") + " VNĐ";
};

const AdminInvoice: React.FC = () => {
  const [invoices, setInvoices] = useState<HoaDon[]>([]);
  const [datTiecs, setDatTiecs] = useState<DatTiec[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    MaDatTiec: null,
    NgayThanhToan: "",
    TongTienBan: "",
    TongTienDichVu: "",
    TongTienHoaDon: "",
    ApDungQuyDinhPhat: false,
    PhanTramPhatMotNgay: "",
    TongTienPhat: "",
    TongTienConLai: "",
    TrangThai: 0,
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal>(
    {
      isOpen: false,
      message: "",
      onConfirm: () => {},
    }
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<HoaDon | null>(null);
  const [chiTietDatTiec, setChiTietDatTiec] = useState<ChiTietDatTiec | null>(
    null
  );
  const [thucDon, setThucDon] = useState<ThucDon | null>(null);
  const [sanh, setSanh] = useState<Sanh | null>(null);
  const [ca, setCa] = useState<Ca | null>(null);
  const [dichVus, setDichVus] = useState<DichVu[]>([]);
  const [monAns, setMonAns] = useState<
    { MaMonAn: number; TenMonAn: string; DonGia: number }[]
  >([]);
  const [monAnChiTiet, setMonAnChiTiet] = useState<any[]>([]);
  const [dichVuChiTiet, setDichVuChiTiet] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qr" | null>(
    null
  );
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [canConfirmPayment, setCanConfirmPayment] = useState(false);
  const navigate = useNavigate();

  // Đóng thông báo thành công sau 3 giây
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Load dữ liệu từ backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [hoaDonList, datTiecList] = await Promise.all([
          getAllHoaDon(),
          getAllDatTiec(),
        ]);
        setInvoices(hoaDonList.data || []);
        setDatTiecs(datTiecList.data || []);
      } catch (err: any) {
        setError(
          "Lỗi khi lấy dữ liệu: " + (err.response?.data?.error || err.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openAddModal = () => {
    setFormData({
      MaDatTiec: null,
      NgayThanhToan: "",
      TongTienBan: "",
      TongTienDichVu: "",
      TongTienHoaDon: "",
      ApDungQuyDinhPhat: false,
      PhanTramPhatMotNgay: "",
      TongTienPhat: "",
      TongTienConLai: "",
      TrangThai: 0,
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (invoice: HoaDon) => {
    setFormData({
      MaDatTiec: invoice.MaDatTiec,
      NgayThanhToan: invoice.NgayThanhToan.split("T")[0],
      TongTienBan: invoice.TongTienBan.toString(),
      TongTienDichVu: invoice.TongTienDichVu.toString(),
      TongTienHoaDon: invoice.TongTienHoaDon.toString(),
      ApDungQuyDinhPhat: invoice.ApDungQuyDinhPhat,
      PhanTramPhatMotNgay: invoice.PhanTramPhatMotNgay.toString(),
      TongTienPhat: invoice.TongTienPhat.toString(),
      TongTienConLai: invoice.TongTienConLai.toString(),
      TrangThai: invoice.TrangThai,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, message: "", onConfirm: () => {} });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Hàm xử lý in
  const handlePrint = (invoice: HoaDon) => {
    console.log("Starting print process...");
    const printContent = document.getElementById("printSection");
    if (printContent) {
      console.log(
        "printSection found, content length:",
        printContent.innerHTML.length
      );

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow!.document;
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <!-- Nhúng Tailwind CSS qua CDN -->
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              body {
                font-family: Arial, sans-serif;
                font-size: 12pt;
                color: #000;
                margin: 0;
                padding: 0;
              }
              .print-section {
                max-width: 210mm;
                margin: 15mm auto;
                padding: 20px;
              }
              /* Áp dụng style từ index.css */
              @media print {
                body * {
                  visibility: hidden;
                }
                .print-section, .print-section * {
                  visibility: visible;
                }
                .print-section {
                  position: static !important;
                  width: 100% !important;
                  max-width: 210mm !important;
                  margin: 15mm auto !important;
                  padding: 20px !important;
                  box-shadow: none !important;
                  overflow: visible !important;
                }
                .print\\:hidden {
                  display: none !important;
                }
                .text-gray-600 { color: #4B5563 !important; }
                .text-[#001F3F] { color: #001F3F !important; }
                .bg-gray-50 { background-color: #F9FAFB !important; }
                .text-red-500 { color: #EF4444 !important; }
                .text-green-600 { color: #16A34A !important; }
                .shadow-xl, .rounded-lg, .fixed, .z-50, .bg-black\\/30 {
                  box-shadow: none !important;
                  border-radius: 0 !important;
                  position: static !important;
                  background: none !important;
                }
                .grid-cols-1, .grid-cols-2 {
                  display: grid !important;
                }
                .md\\:grid-cols-2 {
                  grid-template-columns: repeat(2, 1fr) !important;
                }
                .bg-gray-50 {
                  break-inside: avoid !important;
                  border: 1px solid #E5E7EB !important;
                }
                @page {
                  size: A4;
                  margin: 15mm;
                }
                /* Đảm bảo Tailwind classes */
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
        console.log("Attempting to print iframe...");
        iframe.contentWindow!.focus();
        try {
          iframe.contentWindow!.print();
          console.log("Print command sent");
        } catch (error) {
          console.error("Error calling print:", error);
        }
        setTimeout(() => {
          document.body.removeChild(iframe);
          console.log("Iframe removed");
        }, 100);
      }, 100);

      console.log("Printed invoice:", invoice);
    } else {
      console.error("printSection not found");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      MaDatTiec,
      NgayThanhToan,
      TongTienBan,
      TongTienDichVu,
      TongTienHoaDon,
      ApDungQuyDinhPhat,
      PhanTramPhatMotNgay,
      TongTienPhat,
      TongTienConLai,
      TrangThai,
    } = formData;

    if (!MaDatTiec || !NgayThanhToan) {
      alert("Vui lòng nhập đầy đủ mã đặt tiệc và ngày thanh toán");
      return;
    }

    const tongTienBanNum = Number(TongTienBan);
    const tongTienDichVuNum = Number(TongTienDichVu);
    const tongTienHoaDonNum = Number(TongTienHoaDon);
    const phanTramPhatNum = Number(PhanTramPhatMotNgay);
    const tongTienPhatNum = Number(TongTienPhat);
    const tongTienConLaiNum = Number(TongTienConLai);

    if (
      isNaN(tongTienBanNum) ||
      isNaN(tongTienDichVuNum) ||
      isNaN(tongTienHoaDonNum) ||
      isNaN(tongTienPhatNum) ||
      isNaN(tongTienConLaiNum) ||
      tongTienBanNum < 0 ||
      tongTienDichVuNum < 0 ||
      tongTienHoaDonNum < 0 ||
      tongTienPhatNum < 0 ||
      tongTienConLaiNum < 0 ||
      (ApDungQuyDinhPhat &&
        (isNaN(phanTramPhatNum) ||
          phanTramPhatNum < 0 ||
          phanTramPhatNum > 100))
    ) {
      alert("Vui lòng kiểm tra các trường số và phần trăm phạt");
      return;
    }

    const action = async () => {
      try {
        const data = {
          MaDatTiec: Number(MaDatTiec),
          NgayThanhToan,
          TongTienBan: tongTienBanNum,
          TongTienDichVu: tongTienDichVuNum,
          TongTienHoaDon: tongTienHoaDonNum,
          ApDungQuyDinhPhat,
          PhanTramPhatMotNgay: ApDungQuyDinhPhat ? phanTramPhatNum : 0,
          TongTienPhat: ApDungQuyDinhPhat ? tongTienPhatNum : 0,
          TongTienConLai: tongTienConLaiNum,
          TrangThai: Number(TrangThai),
        };

        if (isEditMode) {
          await updateHoaDon(
            invoices.find((inv) => inv.MaDatTiec === MaDatTiec)!.MaHoaDon,
            data
          );
          setInvoices((prev) =>
            prev.map((inv) =>
              inv.MaDatTiec === MaDatTiec
                ? { ...inv, ...data, MaHoaDon: inv.MaHoaDon }
                : inv
            )
          );
          setSuccessMessage("Cập nhật hóa đơn thành công!");
        } else {
          const newInvoice = await createHoaDon(data);
          setInvoices((prev) => [...prev, newInvoice.data]);
          setSuccessMessage("Thêm hóa đơn thành công!");
        }
        closeModal();
      } catch (error: any) {
        alert(
          "Lỗi khi lưu hóa đơn: " +
            (error.response?.data?.error || error.message)
        );
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: `Bạn có chắc chắn muốn ${
        isEditMode ? "sửa" : "thêm"
      } hóa đơn này không?`,
      onConfirm: action,
    });
  };

  const handleDelete = async (id: number) => {
    const action = async () => {
      try {
        await deleteHoaDon(id);
        setInvoices((prev) =>
          prev.filter((invoice) => invoice.MaHoaDon !== id)
        );
        setSuccessMessage("Xóa hóa đơn thành công!");
      } catch (error: any) {
        alert(
          "Lỗi khi xóa hóa đơn: " +
            (error.response?.data?.error || error.message)
        );
      }
    };
    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa hóa đơn này không?",
      onConfirm: action,
    });
  };

  const handleViewDetail = async (invoice: HoaDon) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
    await fetchChiTietDatTiec(invoice.MaDatTiec);
  };

  const fetchChiTietDatTiec = async (maDatTiec: number) => {
    try {
      // Lấy chi tiết đặt tiệc
      const datTiecResponse = await getDatTiecById(maDatTiec);
      const datTiecData = datTiecResponse;
      setChiTietDatTiec(datTiecData);
      console.log("Chi tiết đặt tiệc:", datTiecData);

      // Lấy thông tin sảnh
      if (datTiecData.MaSanh) {
        try {
          const sanhResponse = await getSanhById(datTiecData.MaSanh);
          setSanh(sanhResponse);
        } catch (error) {
          setSanh(null);
        }
      } else {
        setSanh(null);
      }

      // Lấy thông tin ca
      if (datTiecData.MaCa) {
        try {
          const caResponse = await getCaById(datTiecData.MaCa);
          setCa(caResponse);
        } catch (error) {
          setCa(null);
        }
      } else {
        setCa(null);
      }

      // Lấy chi tiết món ăn
      if (datTiecData.MonAns && datTiecData.MonAns.length > 0) {
        const monAnPromises = datTiecData.MonAns.map(
          async (ma: MonAnDatTiec) => {
            const monAnResponse = await getMonAnById(ma.MaMonAn);
            return {
              ...monAnResponse,
              DonGiaThoiDiemDat: parseFloat(ma.DonGiaThoiDiemDat),
            };
          }
        );
        const monAnResults = await Promise.all(monAnPromises);
        setMonAnChiTiet(monAnResults);
      } else {
        setMonAnChiTiet([]);
      }

      // Lấy chi tiết dịch vụ
      if (datTiecData.DichVus && datTiecData.DichVus.length > 0) {
        const dichVuPromises = datTiecData.DichVus.map(
          async (dv: DichVuDatTiec) => {
            const dichVuResponse = await getDichVuById(dv.MaDichVu);
            return {
              ...dichVuResponse,
              SoLuong: dv.SoLuong,
              DonGiaThoiDiemDat: parseFloat(dv.DonGiaThoiDiemDat),
              ThanhTien: parseFloat(dv.ThanhTien),
            };
          }
        );
        const dichVuResults = await Promise.all(dichVuPromises);
        setDichVuChiTiet(dichVuResults);
      } else {
        setDichVuChiTiet([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết:", error);
      setChiTietDatTiec(null);
      setThucDon(null);
      setSanh(null);
      setCa(null);
      setMonAnChiTiet([]);
      setDichVuChiTiet([]);
    }
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      (invoice.MaDatTiec.toString().includes(searchTerm.toLowerCase()) ||
        datTiecs
          .find((dt) => dt.MaDatTiec === invoice.MaDatTiec)
          ?.TenChuRe.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        datTiecs
          .find((dt) => dt.MaDatTiec === invoice.MaDatTiec)
          ?.TenCoDau.toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (statusFilter === "" || invoice.TrangThai.toString() === statusFilter)
  );

  const generateQRCode = async (amount: number, invoiceId: number) => {
    try {
      const accountNo = "5622889955"; // Xác nhận tài khoản thuộc MBBank
      const accountName = "NHA HANG TIEC CUOI"; // Không dấu, in hoa, khớp với ngân hàng
      const acqId = "970418"; // MBBank
      const transferContent = `Thanh toan hoa don #${invoiceId}`.slice(0, 50); // Giới hạn 50 ký tự

      // Kiểm tra amount hợp lệ
      if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Số tiền phải là số nguyên lớn hơn 0");
      }

      // Tạo payload
      const payload = {
        accountNo: accountNo.trim(),
        accountName: accountName.trim(),
        acqId,
        amount,
        addInfo: transferContent,
        format: "text", // Hoặc "qr_only" nếu cần
        template: "compact2", // Thử template khác nếu compact không hoạt động
      };

      console.log("VietQR Payload:", payload);

      const response = await fetch("https://api.vietqr.io/v2/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": "658ae10f-8dbf-44bf-b943-31745299dd84",
          "x-api-key": "f1ac89af-9c63-48bb-9a09-9c635411954e",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`VietQR API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("VietQR Response:", data);

      if (data.code === "00" && data.data?.qrDataURL) {
        console.log("QR Code URL:", data.data.qrDataURL);
        setQrCodeUrl(data.data.qrDataURL);
      } else {
        throw new Error(`VietQR API failed: ${data.desc || "Unknown error"}`);
      }
    } catch (error) {
      console.error("generateQRCode - Error:", {});
      alert(`Lỗi khi tạo mã QR: ${error}`);
      throw error;
    }
  };

  const handlePayment = async (method: "cash" | "qr") => {
    if (!selectedInvoice) return;

    setPaymentMethod(method);
    setIsProcessingPayment(true);
    setCanConfirmPayment(false);

    if (method === "qr") {
      await generateQRCode(
        Number(selectedInvoice.TongTienConLai),
        selectedInvoice.MaHoaDon
      );
    }

    setShowPaymentModal(true);
    setIsLoadingPayment(true);

    // Tự động xác nhận sau 3 giây
    setTimeout(async () => {
      setIsLoadingPayment(false);
      await processPayment();
    }, 5000);
  };

  const processPayment = async () => {
    if (!selectedInvoice) return;

    try {
      setIsProcessingPayment(true);

      // Lấy thông tin đặt tiệc hiện tại
      const datTiecResponse = await getDatTiecById(selectedInvoice.MaDatTiec);

      // Cập nhật tiền đặt cọc thành tổng tiền còn lại
      const updatedDatTiec = {
        ...datTiecResponse,
        TienDatCoc: datTiecResponse.TienDatCoc + selectedInvoice.TongTienConLai,
      };

      // Cập nhật thông tin đặt tiệc
      await fetch(`/api/dattiec/${selectedInvoice.MaDatTiec}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDatTiec),
      });

      // Cập nhật hóa đơn
      const updatedInvoice = {
        ...selectedInvoice,
        TrangThai: 1, // Đã thanh toán
        NgayThanhToan: new Date().toISOString().split("T")[0],
        TongTienConLai: 0, // Set tiền còn lại về 0
      };

      await updateHoaDon(selectedInvoice.MaHoaDon, updatedInvoice);

      // Cập nhật UI
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.MaHoaDon === selectedInvoice.MaHoaDon
            ? { ...inv, ...updatedInvoice }
            : inv
        )
      );

      // Cập nhật lại thông tin đặt tiệc trong state nếu đang hiển thị
      if (
        chiTietDatTiec &&
        chiTietDatTiec.MaDatTiec === selectedInvoice.MaDatTiec
      ) {
        setChiTietDatTiec(updatedDatTiec);
      }

      setSuccessMessage("Thanh toán thành công!");
      setShowPaymentModal(false);
      setIsDetailModalOpen(false);
      setPaymentMethod(null);
      setQrCodeUrl("");
      setCanConfirmPayment(false);
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      alert("Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.");
    } finally {
      setIsProcessingPayment(false);
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
            Quản lý hóa đơn
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đặt tiệc, tên cô dâu/chú rể..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="0">Chưa thanh toán</option>
                <option value="1">Đã thanh toán</option>
                <option value="2">Đã hủy</option>
              </select>
            </div>
            {/* <button
              onClick={openAddModal}
              className="w-full sm:w-auto bg-[#001F3F] text-white py-2 px-4 rounded hover:bg-[#003366] transition-colors duration-300"
            >
              Thêm hóa đơn
            </button> */}
          </div>
        </div>

        <div className="mb-6">
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#001F3F]/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider align-middle">
                    Mã hóa đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider align-middle">
                    Đặt tiệc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider align-middle">
                    Ngày thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider align-middle">
                    Tổng tiền (VNĐ)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider align-middle">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider text-right align-middle">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredInvoices.map((invoice) => {
                  const datTiec = datTiecs.find(
                    (dt) => dt.MaDatTiec === invoice.MaDatTiec
                  );
                  return (
                    <tr
                      key={invoice.MaHoaDon}
                      className={`hover:bg-[#F8F9FA] transition-colors duration-200 ${
                        invoice.TrangThai === 0
                          ? "bg-red-100"
                          : invoice.TrangThai === 1
                          ? "bg-green-100"
                          : invoice.TrangThai === 3
                          ? "bg-blue-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#001F3F] align-middle">
                        {invoice.MaHoaDon}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 align-middle">
                        {datTiec
                          ? `${datTiec.TenChuRe} & ${datTiec.TenCoDau} (${invoice.MaDatTiec})`
                          : `Mã ${invoice.MaDatTiec}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 align-middle">
                        {new Date(invoice.NgayThanhToan).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 align-middle">
                        {formatVND(Number(invoice.TongTienHoaDon))}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 align-middle">
                        {invoice.TrangThai === 0
                          ? "Chưa thanh toán"
                          : invoice.TrangThai === 1
                          ? "Đã thanh toán"
                          : invoice.TrangThai === 3
                          ? "Đang xử lý thêm/hoàn tiền"
                          : "Đã hủy"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right align-middle">
                        <button
                          onClick={() => handleViewDetail(invoice)}
                          className="text-[#001F3F] hover:text-[#003366] mr-4 transition-colors duration-300"
                        >
                          Chi tiết
                        </button>
                        <button
                          onClick={() => openEditModal(invoice)}
                          className="text-[#B8860B] hover:text-[#8B6914] mr-4 transition-colors duration-300"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.MaHoaDon)}
                          className="text-[#D4B2B2] hover:text-[#C49898] transition-colors duration-300"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="block sm:hidden space-y-4">
            {filteredInvoices.map((invoice) => {
              const datTiec = datTiecs.find(
                (dt) => dt.MaDatTiec === invoice.MaDatTiec
              );
              return (
                <div
                  key={invoice.MaHoaDon}
                  className={`shadow-md rounded-lg p-4 border border-gray-100 ${
                    invoice.TrangThai === 0
                      ? "bg-red-100"
                      : invoice.TrangThai === 1
                      ? "bg-green-100"
                      : invoice.TrangThai === 3
                      ? "bg-blue-100"
                      : "bg-yellow-100"
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium text-[#001F3F]">
                      Hóa đơn #{invoice.MaHoaDon}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Đặt tiệc:{" "}
                      {datTiec
                        ? `${datTiec.TenChuRe} & ${datTiec.TenCoDau} (${invoice.MaDatTiec})`
                        : `Mã ${invoice.MaDatTiec}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      Ngày thanh toán:{" "}
                      {new Date(invoice.NgayThanhToan).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                    <p className="text-sm text-[#B8860B]">
                      Tổng tiền:{" "}
                      {invoice.TongTienHoaDon.toLocaleString("vi-VN")} VNĐ
                    </p>
                    <p className="text-sm text-gray-600">
                      Trạng thái:{" "}
                      {invoice.TrangThai === 0
                        ? "Chưa thanh toán"
                        : invoice.TrangThai === 1
                        ? "Đã thanh toán"
                        : invoice.TrangThai === 3
                        ? "Đang xử lý thêm/hoàn tiền"
                        : "Đã hủy"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleViewDetail(invoice)}
                        className="text-[#001F3F] hover:text-[#003366] text-sm transition-colors duration-300"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => openEditModal(invoice)}
                        className="text-[#B8860B] hover:text-[#8B6914] text-sm transition-colors duration-300"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(invoice.MaHoaDon)}
                        className="text-[#D4B2B2] hover:text-[#C49898] text-sm transition-colors duration-300"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white shadow-xl rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 relative">
              <button
                onClick={closeModal}
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
                {isEditMode ? "Sửa hóa đơn" : "Thêm hóa đơn"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="block text-sm font-medium">
                    Mã đặt tiệc
                  </label>
                  <input
                    type="number"
                    name="MaDatTiec"
                    value={formData.MaDatTiec || ""}
                    disabled={true}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">
                    Ngày thanh toán
                  </label>
                  <input
                    type="date"
                    name="NgayThanhToan"
                    value={formData.NgayThanhToan}
                    disabled={true}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">
                    Tổng tiền bàn (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="TongTienBan"
                    value={formData.TongTienBan}
                    disabled={true}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">
                    Tổng tiền dịch vụ (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="TongTienDichVu"
                    value={formData.TongTienDichVu}
                    disabled={true}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">
                    Tổng tiền hóa đơn (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="TongTienHoaDon"
                    value={formData.TongTienHoaDon}
                    disabled={true}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="ApDungQuyDinhPhat"
                      checked={formData.ApDungQuyDinhPhat}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                    />
                    <span>Áp dụng quy định phạt</span>
                  </label>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">
                    Phần trăm phạt mỗi ngày (%)
                  </label>
                  <input
                    type="number"
                    name="PhanTramPhatMotNgay"
                    value={formData.PhanTramPhatMotNgay}
                    onChange={handleInputChange}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    min="0"
                    max="100"
                    disabled={!formData.ApDungQuyDinhPhat}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">
                    Tổng tiền phạt (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="TongTienPhat"
                    value={formData.TongTienPhat}
                    onChange={handleInputChange}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                    min="0"
                    disabled={!formData.ApDungQuyDinhPhat}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium">
                    Tổng tiền còn lại (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="TongTienConLai"
                    value={formData.TongTienConLai}
                    disabled={true}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                    min="0"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Trạng thái
                  </label>
                  <select
                    name="TrangThai"
                    value={formData.TrangThai}
                    disabled={true}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  >
                    <option value="0">Chưa thanh toán</option>
                    <option value="1">Đã thanh toán</option>
                    <option value="2">Đã hủy</option>
                    <option value="3">Đang xử lý thêm/hoàn tiền</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-100 text-[#001F3F] rounded hover:bg-gray-200 transition-colors duration-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#001F3F] text-white rounded hover:bg-[#003366] transition-colors duration-300"
                  >
                    {isEditMode ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {confirmationModal.isOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white shadow-xl rounded-lg w-full max-w-sm p-6 relative">
              <button
                onClick={closeConfirmationModal}
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
                Xác nhận
              </h3>
              <p className="text-gray-600 mb-6">{confirmationModal.message}</p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeConfirmationModal}
                  className="px-4 py-2 bg-gray-100 text-[#001F3F] rounded hover:bg-gray-200 transition-colors duration-300"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={confirmationModal.onConfirm}
                  className="px-4 py-2 bg-[#D4B2B2] text-white rounded hover:bg-[#C49898] transition-colors duration-300"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Chi tiết hóa đơn */}
        {isDetailModalOpen && selectedInvoice && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white shadow-xl rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
              {/* Nút đóng */}
              <button
                onClick={() => setIsDetailModalOpen(false)}
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

              <div id="printSection">
                {/* Header */}
                <div className="text-center border-b pb-6">
                  <h1 className="text-3xl font-bold text-[#001F3F] mb-2">
                    HÓA ĐƠN ĐẶT TIỆC
                  </h1>
                  <p className="text-gray-600">
                    Mã hóa đơn: #{selectedInvoice.MaHoaDon}
                  </p>
                </div>

                <div className="space-y-8 mt-6">
                  {/* Phần 1: Thông tin đặt tiệc */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-[#001F3F] mb-4">
                      1. Thông tin đặt tiệc
                    </h2>

                    {chiTietDatTiec && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="mb-2">
                            <span className="text-gray-600">Chú rể:</span>{" "}
                            <span className="font-medium">
                              {chiTietDatTiec.TenChuRe}
                            </span>
                          </p>
                          <p className="mb-2">
                            <span className="text-gray-600">Cô dâu:</span>{" "}
                            <span className="font-medium">
                              {chiTietDatTiec.TenCoDau}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="mb-2">
                            <span className="text-gray-600">
                              Ngày đãi tiệc:
                            </span>{" "}
                            <span className="font-medium">
                              {new Date(
                                chiTietDatTiec.NgayDaiTiec
                              ).toLocaleDateString("vi-VN")}
                            </span>
                          </p>
                          <p className="mb-2">
                            <span className="text-gray-600">Điện thoại:</span>{" "}
                            <span className="font-medium">
                              {chiTietDatTiec.DienThoai}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phần 2: Thông tin sảnh và ca */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-[#001F3F] mb-4">
                      2. Thông tin sảnh và ca
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {sanh && (
                        <div>
                          <h3 className="font-medium text-lg mb-3">
                            Thông tin sảnh:
                          </h3>
                          <div className="space-y-2">
                            <p>
                              <span className="text-gray-600">Tên sảnh:</span>{" "}
                              <span className="font-medium">
                                {sanh.TenSanh}
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">Loại sảnh:</span>{" "}
                              <span className="font-medium">
                                {sanh.TenLoaiSanh}
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">
                                Số lượng bàn:{" "}
                              </span>{" "}
                              <span className="font-medium">
                                {Number(chiTietDatTiec?.SoLuongBan || 0)} bàn
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">
                                Số bàn dự trữ:{" "}
                              </span>{" "}
                              <span className="font-medium">
                                {Number(chiTietDatTiec?.SoBanDuTru || 0)} bàn
                              </span>
                            </p>

                            {/* <p>
                            <span className="text-gray-600">Đơn giá:</span>{" "}
                            <span className="font-medium">
                              {formatVND(sanh.DonGia)}
                            </span>
                          </p> */}
                          </div>
                        </div>
                      )}
                      {ca && (
                        <div>
                          <h3 className="font-medium text-lg mb-3">
                            Thông tin ca:
                          </h3>
                          <div className="space-y-2">
                            <p>
                              <span className="text-gray-600">Tên ca:</span>{" "}
                              <span className="font-medium">{ca.TenCa}</span>
                            </p>
                            {/* <p>
                            <span className="text-gray-600">Thời gian:</span>{" "}
                            <span className="font-medium">
                              {ca.ThoiGianBatDau} - {ca.ThoiGianKetThuc}
                            </span>
                          </p> */}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phần 3: Thực đơn */}
                  {monAnChiTiet.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-[#001F3F] mb-4">
                        3. Thực đơn
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {monAnChiTiet.map((monAn) => (
                          <div
                            key={monAn.MaMonAn}
                            className="flex justify-between items-center p-2 border-b border-gray-200"
                          >
                            <span className="font-medium">
                              {monAn.TenMonAn}
                            </span>
                            <span className="font-medium">
                              {formatVND(monAn.DonGiaThoiDiemDat)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Phần 4: Dịch vụ đi kèm */}
                  {dichVuChiTiet.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-[#001F3F] mb-4">
                        4. Dịch vụ đi kèm
                      </h2>
                      <div className="space-y-3">
                        {dichVuChiTiet.map((dichVu) => (
                          <div
                            key={dichVu.MaDichVu}
                            className="flex justify-between items-center p-2 border-b border-gray-200"
                          >
                            <div>
                              <span className="font-medium">
                                {dichVu.TenDichVu}
                              </span>
                              <span className="text-gray-500 text-sm ml-2">
                                ({dichVu.SoLuong} x{" "}
                                {formatVND(dichVu.DonGiaThoiDiemDat)})
                              </span>
                            </div>
                            <span className="font-medium">
                              {formatVND(dichVu.ThanhTien)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chi tiết thanh toán */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-[#001F3F] mb-4">
                      5. Chi tiết thanh toán
                    </h2>
                    {selectedInvoice && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Tổng tiền bàn:</span>
                          <span className="font-medium">
                            {formatVND(Number(selectedInvoice.TongTienBan))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">
                            Tổng tiền dịch vụ:
                          </span>
                          <span className="font-medium">
                            {formatVND(Number(selectedInvoice.TongTienDichVu))}
                          </span>
                        </div>
                        {selectedInvoice.ApDungQuyDinhPhat && (
                          <div className="flex justify-between items-center py-2 text-red-500">
                            <span>
                              Tiền phạt ({selectedInvoice.PhanTramPhatMotNgay}
                              %/ngày):
                            </span>
                            <span className="font-medium">
                              {formatVND(Number(selectedInvoice.TongTienPhat))}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Tiền đặt cọc:</span>
                          <span className="font-medium text-green-600">
                            -
                            {formatVND(Number(chiTietDatTiec?.TienDatCoc || 0))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-t border-dashed mt-2">
                          <span className="font-semibold text-[#001F3F]">
                            Tổng tiền hóa đơn:
                          </span>
                          <span className="font-semibold text-[#001F3F]">
                            {formatVND(Number(selectedInvoice.TongTienHoaDon))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">
                            Số tiền còn lại:
                          </span>
                          <span className="font-semibold text-[#001F3F]">
                            {formatVND(Number(selectedInvoice.TongTienConLai))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t pt-6 mt-8">
                  <div className="text-center text-gray-500 text-sm space-y-2">
                    <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
                  </div>
                </div>
              </div>
              {/* Nút in */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => handlePrint(selectedInvoice)}
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
                  In hóa đơn
                </button>
              </div>

              {/* Trong modal chi tiết hóa đơn, thêm nút thanh toán */}
              {selectedInvoice &&
                (selectedInvoice.TrangThai === 0 ||
                  selectedInvoice.TrangThai === 3) && (
                  <div className="flex justify-center mt-6 space-x-4">
                    <button
                      onClick={() => handlePayment("cash")}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center"
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
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Thanh toán tiền mặt
                    </button>
                    {/* //if tong tien con lai < 0 an nut qr */}
                    {Number(selectedInvoice.TongTienConLai) > 0 && (
                      <button
                        onClick={() => handlePayment("qr")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center"
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
                            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                          />
                        </svg>
                        Thanh toán QR
                      </button>
                    )}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Modal thanh toán */}
        {showPaymentModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60] p-4">
            <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-6 relative">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentMethod(null);
                  setQrCodeUrl("");
                  setCanConfirmPayment(false);
                  setIsLoadingPayment(false);
                  setIsProcessingPayment(false);
                }}
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

              <h3 className="text-xl font-semibold text-[#001F3F] mb-4">
                {paymentMethod === "cash"
                  ? "Thanh toán tiền mặt"
                  : "Thanh toán QR"}
              </h3>

              <div className="space-y-4">
                <p className="text-gray-600">
                  Số tiền cần thanh toán:{" "}
                  <span className="font-semibold text-[#001F3F]">
                    {formatVND(Number(selectedInvoice.TongTienConLai))}
                  </span>
                </p>

                {paymentMethod === "qr" && qrCodeUrl && (
                  <div className="flex flex-col items-center space-y-4">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-64 h-64 object-contain"
                    />
                    <p className="text-sm text-gray-500 text-center">
                      Quét mã QR để thanh toán
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentMethod(null);
                      setQrCodeUrl("");
                      setCanConfirmPayment(false);
                      setIsLoadingPayment(false);
                      setIsProcessingPayment(false);
                    }}
                    disabled={isProcessingPayment}
                    className="px-4 py-2 bg-gray-100 text-[#001F3F] rounded hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    disabled={true}
                    className="px-4 py-2 text-white rounded transition-all duration-300 flex items-center bg-blue-500 disabled:opacity-100"
                  >
                    {isLoadingPayment ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang xử lý thanh toán...
                      </div>
                    ) : isProcessingPayment ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang hoàn tất thanh toán...
                      </div>
                    ) : (
                      <span className="flex items-center">
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Xác nhận thanh toán
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInvoice;