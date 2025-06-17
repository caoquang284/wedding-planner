import { useState, useEffect } from "react";
import {
  getAllSanh,
  createSanh,
  updateSanh,
  deleteSanh,
  getAllLoaiSanh,
  createLoaiSanh,
  updateLoaiSanh,
  deleteLoaiSanh,
} from "../../Api/sanhApi";
import {
  getAllCa,
  createCa,
  updateCa,
  deleteCa,
} from "../../Api/caApi";

// Định nghĩa interface
interface Ca {
  MaCa: number;
  TenCa: string;
}

interface Sanh {
  MaSanh: number;
  TenSanh: string;
  MaLoaiSanh: number;
  TenLoaiSanh: string;
  SoLuongBanToiDa: number;
  GhiChu?: string;
  AnhURL?: string;
  DonGiaBanToiThieu: number;
}

interface LoaiSanh {
  MaLoaiSanh: number;
  TenLoaiSanh: string;
  DonGiaBanToiThieu: number;
}

interface CaFormData {
  id?: number;
  tenCa: string;
}

interface SanhFormData {
  id?: number;
  tenSanh: string;
  maLoaiSanh: number;
  soLuongBanToiDa: number;
  ghiChu?: string;
  anhURL?: string;
}

interface LoaiSanhFormData {
  id?: number;
  tenLoaiSanh: string;
  donGiaBanToiThieu: number;
}

interface ConfirmationModal {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
}

function AdminHall() {
  // State cho ca
  const [cas, setCas] = useState<Ca[]>([]);
  const [caSearchTerm, setCaSearchTerm] = useState<string>("");
  const [isCaModalOpen, setIsCaModalOpen] = useState<boolean>(false);
  const [isCaEditMode, setIsCaEditMode] = useState<boolean>(false);
  const [caFormData, setCaFormData] = useState<CaFormData>({
    tenCa: "",
  });

  // State cho sảnh
  const [sanhs, setSanhs] = useState<Sanh[]>([]);
  const [sanhSearchTerm, setSanhSearchTerm] = useState<string>("");
  const [isSanhModalOpen, setIsSanhModalOpen] = useState<boolean>(false);
  const [isSanhEditMode, setIsSanhEditMode] = useState<boolean>(false);
  const [sanhFormData, setSanhFormData] = useState<SanhFormData>({
    tenSanh: "",
    maLoaiSanh: 0,
    soLuongBanToiDa: 0,
    ghiChu: "",
    anhURL: "",
  });

  // State cho loại sảnh
  const [loaiSanhs, setLoaiSanhs] = useState<LoaiSanh[]>([]);
  const [loaiSanhSearchTerm, setLoaiSanhSearchTerm] = useState<string>("");
  const [isLoaiSanhModalOpen, setIsLoaiSanhModalOpen] = useState<boolean>(false);
  const [isLoaiSanhEditMode, setIsLoaiSanhEditMode] = useState<boolean>(false);
  const [loaiSanhFormData, setLoaiSanhFormData] = useState<LoaiSanhFormData>({
    tenLoaiSanh: "",
    donGiaBanToiThieu: 0,
  });

  // State chung cho modal xác nhận
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal>({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });

  // Lấy dữ liệu ca, sảnh và loại sảnh khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách ca
        const caData = await getAllCa();
        setCas(caData);
        // Nếu không có ca nào, thêm các ca mặc định
        if (caData.length === 0) {
          const defaultCas = ["Sáng", "Trưa", "Chiều", "Tối", "Đêm"];
          for (const tenCa of defaultCas) {
            await createCa({ tenCa });
          }
          const updatedCaData = await getAllCa();
          setCas(updatedCaData);
        }

        // Lấy danh sách sảnh
        const sanhData = await getAllSanh();
        setSanhs(sanhData);

        // Lấy danh sách loại sảnh
        const loaiSanhData = await getAllLoaiSanh();
        setLoaiSanhs(loaiSanhData);
        if (loaiSanhData.length > 0 && !sanhFormData.maLoaiSanh) {
          setSanhFormData((prev) => ({
            ...prev,
            maLoaiSanh: loaiSanhData[0].MaLoaiSanh,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Có lỗi xảy ra khi tải dữ liệu!");
      }
    };

    fetchData();
  }, []);

  // Hàm xử lý ca
  const openAddCaModal = () => {
    setCaFormData({ tenCa: "" });
    setIsCaEditMode(false);
    setIsCaModalOpen(true);
  };

  const openEditCaModal = (ca: Ca) => {
    setCaFormData({
      id: ca.MaCa,
      tenCa: ca.TenCa,
    });
    setIsCaEditMode(true);
    setIsCaModalOpen(true);
  };

  const closeCaModal = () => setIsCaModalOpen(false);

  const handleCaInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCaFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caFormData.tenCa || caFormData.tenCa.length < 2) {
      alert("Tên ca không được để trống và phải có ít nhất 2 ký tự");
      return;
    }

    const dataToSend = {
      tenCa: caFormData.tenCa,
    };

    const action = async () => {
      try {
        if (isCaEditMode && caFormData.id) {
          const updatedCa = await updateCa(caFormData.id, dataToSend);
          setCas((prev) =>
            prev.map((ca) =>
              ca.MaCa === caFormData.id ? updatedCa : ca
            )
          );
        } else {
          const newCa = await createCa(dataToSend);
          setCas((prev) => [...prev, newCa]);
        }
        closeCaModal();
      } catch (error: any) {
        console.error("Error saving ca:", error.response?.data || error);
        alert(
          `Lỗi khi lưu ca: ${error.response?.data?.error || error.message}`
        );
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: `Bạn có chắc chắn muốn ${isCaEditMode ? "sửa" : "thêm"} ca này không?`,
      onConfirm: action,
    });
  };

  const handleDeleteCa = (id: number) => {
    const action = async () => {
      try {
        await deleteCa(id);
        setCas((prev) => prev.filter((ca) => ca.MaCa !== id));
      } catch (error: any) {
        console.error("Error deleting ca:", error.response?.data || error);
        alert(
          `Lỗi khi xóa ca: ${error.response?.data?.error || error.message}`
        );
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa ca này không?",
      onConfirm: action,
    });
  };

  // Hàm xử lý sảnh
  const openAddSanhModal = () => {
    if (loaiSanhs.length === 0) {
      alert("Vui lòng thêm ít nhất một loại sảnh trước khi thêm sảnh");
      return;
    }
    setSanhFormData({
      tenSanh: "",
      maLoaiSanh: loaiSanhs[0]?.MaLoaiSanh || 0,
      soLuongBanToiDa: 0,
      ghiChu: "",
      anhURL: "",
    });
    setIsSanhEditMode(false);
    setIsSanhModalOpen(true);
  };

  const openEditSanhModal = (sanh: Sanh) => {
    setSanhFormData({
      id: sanh.MaSanh,
      tenSanh: sanh.TenSanh,
      maLoaiSanh: sanh.MaLoaiSanh,
      soLuongBanToiDa: sanh.SoLuongBanToiDa,
      ghiChu: sanh.GhiChu || "",
      anhURL: sanh.AnhURL || "",
    });
    setIsSanhEditMode(true);
    setIsSanhModalOpen(true);
  };

  const closeSanhModal = () => setIsSanhModalOpen(false);

  const handleSanhInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSanhFormData((prev) => ({
      ...prev,
      [name]: name === "maLoaiSanh" || name === "soLuongBanToiDa" ? Number(value) : value,
    }));
  };

  const handleSanhSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sanhFormData.tenSanh || sanhFormData.tenSanh.length < 3) {
      alert("Tên sảnh không được để trống và phải có ít nhất 3 ký tự");
      return;
    }
    if (!sanhFormData.maLoaiSanh || isNaN(sanhFormData.maLoaiSanh)) {
      alert("Vui lòng chọn loại sảnh hợp lệ");
      return;
    }
    if (sanhFormData.soLuongBanToiDa <= 0) {
      alert("Số lượng bàn tối đa phải lớn hơn 0");
      return;
    }

    const dataToSend = {
      tenSanh: sanhFormData.tenSanh,
      maLoaiSanh: sanhFormData.maLoaiSanh,
      soLuongBanToiDa: sanhFormData.soLuongBanToiDa,
      ghiChu: sanhFormData.ghiChu || "",
      anhURL: sanhFormData.anhURL || "",
    };

    const action = async () => {
      try {
        if (isSanhEditMode && sanhFormData.id) {
          const updatedSanh = await updateSanh(sanhFormData.id, dataToSend);
          setSanhs((prev) =>
            prev.map((sanh) =>
              sanh.MaSanh === sanhFormData.id
                ? {
                    ...sanh,
                    ...updatedSanh,
                    TenLoaiSanh: loaiSanhs.find(
                      (ls) => ls.MaLoaiSanh === updatedSanh.MaLoaiSanh
                    )?.TenLoaiSanh,
                  }
                : sanh
            )
          );
        } else {
          const newSanh = await createSanh(dataToSend);
          setSanhs((prev) => [
            ...prev,
            {
              ...newSanh,
              TenLoaiSanh: loaiSanhs.find(
                (ls) => ls.MaLoaiSanh === newSanh.MaLoaiSanh
              )?.TenLoaiSanh,
            },
          ]);
        }
        closeSanhModal();
      } catch (error: any) {
        console.error("Error saving sanh:", error.response?.data || error);
        alert(
          `Lỗi khi lưu sảnh: ${error.response?.data?.error || error.message}`
        );
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: `Bạn có chắc chắn muốn ${isSanhEditMode ? "sửa" : "thêm"} sảnh này không?`,
      onConfirm: action,
    });
  };

  const handleDeleteSanh = (id: number) => {
    const action = async () => {
      try {
        await deleteSanh(id);
        setSanhs((prev) => prev.filter((sanh) => sanh.MaSanh !== id));
      } catch (error: any) {
        console.error("Error deleting sanh:", error.response?.data || error);
        alert(
          `Lỗi khi xóa sảnh: ${error.response?.data?.error || error.message}`
        );
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa sảnh này không?",
      onConfirm: action,
    });
  };

  // Hàm xử lý loại sảnh
  const openAddLoaiSanhModal = () => {
    setLoaiSanhFormData({
      tenLoaiSanh: "",
      donGiaBanToiThieu: 0,
    });
    setIsLoaiSanhEditMode(false);
    setIsLoaiSanhModalOpen(true);
  };

  const openEditLoaiSanhModal = (loaiSanh: LoaiSanh) => {
    setLoaiSanhFormData({
      id: loaiSanh.MaLoaiSanh,
      tenLoaiSanh: loaiSanh.TenLoaiSanh,
      donGiaBanToiThieu: loaiSanh.DonGiaBanToiThieu,
    });
    setIsLoaiSanhEditMode(true);
    setIsLoaiSanhModalOpen(true);
  };

  const closeLoaiSanhModal = () => setIsLoaiSanhModalOpen(false);

  const handleLoaiSanhInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setLoaiSanhFormData((prev) => ({
      ...prev,
      [name]: name === "donGiaBanToiThieu" ? Number(value) : value,
    }));
  };

  const handleLoaiSanhSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loaiSanhFormData.tenLoaiSanh || loaiSanhFormData.tenLoaiSanh.length < 2) {
      alert("Tên loại sảnh không được để trống và phải có ít nhất 2 ký tự");
      return;
    }
    if (loaiSanhFormData.donGiaBanToiThieu < 0) {
      alert("Đơn giá bàn tối thiểu không được âm");
      return;
    }

    const dataToSend = {
      tenLoaiSanh: loaiSanhFormData.tenLoaiSanh,
      donGiaBanToiThieu: loaiSanhFormData.donGiaBanToiThieu,
    };

    const action = async () => {
      try {
        if (isLoaiSanhEditMode && loaiSanhFormData.id) {
          const updatedLoaiSanh = await updateLoaiSanh(loaiSanhFormData.id, dataToSend);
          setLoaiSanhs((prev) =>
            prev.map((ls) =>
              ls.MaLoaiSanh === loaiSanhFormData.id ? updatedLoaiSanh : ls
            )
          );
          // Cập nhật TenLoaiSanh trong danh sách sảnh
          setSanhs((prev) =>
            prev.map((sanh) =>
              sanh.MaLoaiSanh === loaiSanhFormData.id
                ? { ...sanh, TenLoaiSanh: updatedLoaiSanh.TenLoaiSanh }
                : sanh
            )
          );
        } else {
          const newLoaiSanh = await createLoaiSanh(dataToSend);
          setLoaiSanhs((prev) => [...prev, newLoaiSanh]);
          if (!sanhFormData.maLoaiSanh) {
            setSanhFormData((prev) => ({
              ...prev,
              maLoaiSanh: newLoaiSanh.MaLoaiSanh,
            }));
          }
        }
        closeLoaiSanhModal();
      } catch (error: any) {
        console.error("Error saving loai sanh:", error.response?.data || error);
        alert(
          `Lỗi khi lưu loại sảnh: ${error.response?.data?.error || error.message}`
        );
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: `Bạn có chắc chắn muốn ${isLoaiSanhEditMode ? "sửa" : "thêm"} loại sảnh này không?`,
      onConfirm: action,
    });
  };

  const handleDeleteLoaiSanh = (id: number) => {
    const isLoaiSanhInUse = sanhs.some((sanh) => sanh.MaLoaiSanh === id);
    if (isLoaiSanhInUse) {
      alert("Không thể xóa loại sảnh đang được sử dụng!");
      return;
    }

    const action = async () => {
      try {
        await deleteLoaiSanh(id);
        setLoaiSanhs((prev) => prev.filter((ls) => ls.MaLoaiSanh !== id));
      } catch (error: any) {
        console.error("Error deleting loai sanh:", error.response?.data || error);
        alert(
          `Lỗi khi xóa loại sảnh: ${error.response?.data?.error || error.message}`
        );
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa loại sảnh này không?",
      onConfirm: action,
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, message: "", onConfirm: () => {} });
  };

  const handleConfirm = () => {
    confirmationModal.onConfirm();
    closeConfirmationModal();
  };

  const filteredCas = cas.filter((ca) =>
    ca.TenCa.toLowerCase().includes(caSearchTerm.toLowerCase())
  );

  const filteredSanhs = sanhs.filter(
    (sanh) =>
      sanh.TenSanh.toLowerCase().includes(sanhSearchTerm.toLowerCase()) ||
      sanh.TenLoaiSanh.toLowerCase().includes(sanhSearchTerm.toLowerCase())
  );

  const filteredLoaiSanhs = loaiSanhs.filter((loaiSanh) =>
    loaiSanh.TenLoaiSanh.toLowerCase().includes(loaiSanhSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Phần quản lý ca */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#001F3F] mb-4">
            Quản lý ca
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm ca..."
              value={caSearchTerm}
              onChange={(e) => setCaSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4B2B2]"
            />
            <button
              onClick={openAddCaModal}
              className="w-full sm:w-auto bg-[#001F3F] text-white py-2 px-4 rounded hover:bg-[#00152A]"
            >
              Thêm ca
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Tên ca
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCas.map((ca) => (
                  <tr key={ca.MaCa}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ca.TenCa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditCaModal(ca)}
                        className="text-[#B8860B] hover:text-[#8B6508] mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteCa(ca.MaCa)}
                        className="text-[#D4B2B2] hover:text-[#B89999]"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="block sm:hidden space-y-4">
            {filteredCas.map((ca) => (
              <div
                key={ca.MaCa}
                className="bg-white shadow-md rounded-lg p-4 border-l-4 border-[#D4B2B2]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {ca.TenCa}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditCaModal(ca)}
                      className="text-[#B8860B] hover:text-[#8B6508] text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteCa(ca.MaCa)}
                      className="text-[#D4B2B2] hover:text-[#B89999] text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phần quản lý sảnh */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#001F3F] mb-4">
            Danh sách sảnh
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm sảnh..."
              value={sanhSearchTerm}
              onChange={(e) => setSanhSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4B2B2]"
            />
            <button
              onClick={openAddSanhModal}
              className="w-full sm:w-auto bg-[#001F3F] text-white py-2 px-4 rounded hover:bg-[#00152A]"
            >
              Thêm sảnh
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Tên sảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Loại sảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Số bàn tối đa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Ghi chú
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSanhs.map((sanh) => (
                  <tr key={sanh.MaSanh}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sanh.TenSanh}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sanh.TenLoaiSanh}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sanh.SoLuongBanToiDa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sanh.GhiChu || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sanh.AnhURL ? (
                        <img
                          src={sanh.AnhURL}
                          alt={sanh.TenSanh}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditSanhModal(sanh)}
                        className="text-[#B8860B] hover:text-[#8B6508] mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteSanh(sanh.MaSanh)}
                        className="text-[#D4B2B2] hover:text-[#B89999]"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="block sm:hidden space-y-4">
            {filteredSanhs.map((sanh) => (
              <div
                key={sanh.MaSanh}
                className="bg-white shadow-md rounded-lg p-4 border-l-4 border-[#D4B2B2]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {sanh.TenSanh}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Loại sảnh: {sanh.TenLoaiSanh}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Số bàn: {sanh.SoLuongBanToiDa}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Ghi chú: {sanh.GhiChu || "N/A"}
                    </p>
                    {sanh.AnhURL && (
                      <img
                        src={sanh.AnhURL}
                        alt={sanh.TenSanh}
                        className="w-16 h-16 object-cover rounded mt-2"
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditSanhModal(sanh)}
                      className="text-[#B8860B] hover:text-[#8B6508] text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteSanh(sanh.MaSanh)}
                      className="text-[#D4B2B2] hover:text-[#B89999] text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phần quản lý loại sảnh */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#001F3F] mb-4">
            Quản lý loại sảnh
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm loại sảnh..."
              value={loaiSanhSearchTerm}
              onChange={(e) => setLoaiSanhSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4B2B2]"
            />
            <button
              onClick={openAddLoaiSanhModal}
              className="w-full sm:w-auto bg-[#D4B2B2] text-white py-2 px-4 rounded hover:bg-[#B89999]"
            >
              Thêm loại sảnh
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên loại sảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn giá bàn tối thiểu
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoaiSanhs.map((loaiSanh) => (
                  <tr key={loaiSanh.MaLoaiSanh}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {loaiSanh.TenLoaiSanh}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {loaiSanh.DonGiaBanToiThieu.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditLoaiSanhModal(loaiSanh)}
                        className="text-[#B8860B] hover:text-[#8B6508] mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteLoaiSanh(loaiSanh.MaLoaiSanh)}
                        className="text-[#D4B2B2] hover:text-[#B89999]"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="block sm:hidden space-y-4">
            {filteredLoaiSanhs.map((loaiSanh) => (
              <div
                key={loaiSanh.MaLoaiSanh}
                className="bg-white shadow-md rounded-lg p-4 border-l-4 border-[#D4B2B2]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {loaiSanh.TenLoaiSanh}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Đơn giá: {loaiSanh.DonGiaBanToiThieu.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditLoaiSanhModal(loaiSanh)}
                      className="text-[#B8860B] hover:text-[#8B6508] text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteLoaiSanh(loaiSanh.MaLoaiSanh)}
                      className="text-[#D4B2B2] hover:text-[#B89999] text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal thêm/sửa ca */}
        {isCaModalOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-[#D4B2B2] transform -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
              {isCaEditMode ? "Sửa ca" : "Thêm ca"}
            </h3>
            <form onSubmit={handleCaSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên ca
                </label>
                <input
                  type="text"
                  name="tenCa"
                  value={caFormData.tenCa}
                  onChange={handleCaInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeCaModal}
                  className="bg-[#FAFAFA] text-[#001F3F] py-2 px-4 rounded hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#001F3F] text-white py-2 px-4 rounded hover:bg-[#00152A]"
                >
                  {isCaEditMode ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal thêm/sửa sảnh */}
        {isSanhModalOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-[#D4B2B2] transform -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
              {isSanhEditMode ? "Sửa sảnh" : "Thêm sảnh"}
            </h3>
            <form onSubmit={handleSanhSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên sảnh
                </label>
                <input
                  type="text"
                  name="tenSanh"
                  value={sanhFormData.tenSanh}
                  onChange={handleSanhInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Loại sảnh
                </label>
                <select
                  name="maLoaiSanh"
                  value={sanhFormData.maLoaiSanh || ""}
                  onChange={handleSanhInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                >
                  <option value="">Chọn loại sảnh</option>
                  {loaiSanhs.map((loai) => (
                    <option key={loai.MaLoaiSanh} value={loai.MaLoaiSanh}>
                      {loai.TenLoaiSanh}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Số bàn tối đa
                </label>
                <input
                  type="number"
                  name="soLuongBanToiDa"
                  value={sanhFormData.soLuongBanToiDa}
                  onChange={handleSanhInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                  min="1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Ghi chú
                </label>
                <textarea
                  name="ghiChu"
                  value={sanhFormData.ghiChu || ""}
                  onChange={handleSanhInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  URL hình ảnh
                </label>
                <input
                  type="text"
                  name="anhURL"
                  value={sanhFormData.anhURL || ""}
                  onChange={handleSanhInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeSanhModal}
                  className="bg-[#FAFAFA] text-[#001F3F] py-2 px-4 rounded hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#001F3F] text-white py-2 px-4 rounded hover:bg-[#00152A]"
                >
                  {isSanhEditMode ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal thêm/sửa loại sảnh */}
        {isLoaiSanhModalOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-[#B8860B] transform -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
              {isLoaiSanhEditMode ? "Sửa loại sảnh" : "Thêm loại sảnh"}
            </h3>
            <form onSubmit={handleLoaiSanhSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên loại sảnh
                </label>
                <input
                  type="text"
                  name="tenLoaiSanh"
                  value={loaiSanhFormData.tenLoaiSanh}
                  onChange={handleLoaiSanhInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Đơn giá bàn tối thiểu
                </label>
                <input
                  type="number"
                  name="donGiaBanToiThieu"
                  value={loaiSanhFormData.donGiaBanToiThieu}
                  onChange={handleLoaiSanhInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeLoaiSanhModal}
                  className="bg-[#FAFAFA] text-[#001F3F] py-2 px-4 rounded hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#B8860B] text-white py-2 px-4 rounded hover:bg-[#8B6508]"
                >
                  {isLoaiSanhEditMode ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal xác nhận */}
        {confirmationModal.isOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm bg-white rounded-lg p-6 shadow-lg border border-[#D4B2B2] transform -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
              Xác nhận
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {confirmationModal.message}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeConfirmationModal}
                className="bg-[#FAFAFA] text-[#001F3F] py-2 px-4 rounded hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="bg-[#D4B2B2] text-white py-2 px-4 rounded hover:bg-[#B89999]"
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminHall;