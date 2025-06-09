import { useState } from "react";
interface HallType {
  MaLoaiSanh: number | null;
  TenLoaiSanh: string;
  DonGiaBanToiThieu: number;
}

interface Hall {
  MaSanh: number | null;
  TenSanh: string;
  MaLoaiSanh: number | null;
  SoLuongBanToiDa: number;
  GhiChu: string;
  Cover_Img?: string;
}

interface HallFormData {
  MaSanh: number | null;
  TenSanh: string;
  MaLoaiSanh: number | null;
  SoLuongBanToiDa: string;
  GhiChu: string;
  Cover_Img?: string;
}

interface HallTypeFormData {
  MaLoaiSanh: number | null;
  TenLoaiSanh: string;
  DonGiaBanToiThieu: string;
}

function Admin_Hall() {
  const [halls, setHalls] = useState<Hall[]>([
    {
      MaSanh: 1,
      TenSanh: "Sảnh VIP 1",
      MaLoaiSanh: 1,
      SoLuongBanToiDa: 50,
      GhiChu: "Sảnh cao cấp với view đẹp",
      Cover_Img: "https://riversidepalace.vn/multidata/3-482.jpg",
    },
    {
      MaSanh: 2,
      TenSanh: "Sảnh Thường 1",
      MaLoaiSanh: 2,
      SoLuongBanToiDa: 30,
      GhiChu: "Sảnh phổ thông",
      Cover_Img: "https://i.imgur.com/MXjrTcw.jpg",
    },
  ]);

  const [hallTypes, setHallTypes] = useState<HallType[]>([
    { MaLoaiSanh: 1, TenLoaiSanh: "VIP", DonGiaBanToiThieu: 5000000 },
    { MaLoaiSanh: 2, TenLoaiSanh: "Thường", DonGiaBanToiThieu: 3000000 },
  ]);

  // State cho modal và form
  const [isHallModalOpen, setIsHallModalOpen] = useState<boolean>(false);
  const [isHallTypeModalOpen, setIsHallTypeModalOpen] =
    useState<boolean>(false);
  const [hallFormData, setHallFormData] = useState<HallFormData>({
    MaSanh: null,
    TenSanh: "",
    MaLoaiSanh: null,
    SoLuongBanToiDa: "",
    GhiChu: "",
    Cover_Img: "",
  });
  const [hallTypeFormData, setHallTypeFormData] = useState<HallTypeFormData>({
    MaLoaiSanh: null,
    TenLoaiSanh: "",
    DonGiaBanToiThieu: "",
  });
  const [isHallEditMode, setIsHallEditMode] = useState<boolean>(false);
  const [isHallTypeEditMode, setIsHallTypeEditMode] = useState<boolean>(false);

  // State cho tìm kiếm và lọc
  const [hallSearchTerm, setHallSearchTerm] = useState<string>("");
  const [hallTypeFilter, setHallTypeFilter] = useState<string>("");

  // Mở modal để thêm/sửa sảnh
  const openAddHallModal = () => {
    setHallFormData({
      MaSanh: null,
      TenSanh: "",
      MaLoaiSanh: null,
      SoLuongBanToiDa: "",
      GhiChu: "",
      Cover_Img: "",
    });
    setIsHallEditMode(false);
    setIsHallModalOpen(true);
  };

  const openEditHallModal = (hall: Hall) => {
    setHallFormData({
      MaSanh: hall.MaSanh,
      TenSanh: hall.TenSanh,
      MaLoaiSanh: hall.MaLoaiSanh,
      SoLuongBanToiDa: hall.SoLuongBanToiDa.toString(),
      GhiChu: hall.GhiChu,
      Cover_Img: hall.Cover_Img || "",
    });
    setIsHallEditMode(true);
    setIsHallModalOpen(true);
  };

  // Mở modal để thêm/sửa loại sảnh
  const openAddHallTypeModal = () => {
    setHallTypeFormData({
      MaLoaiSanh: null,
      TenLoaiSanh: "",
      DonGiaBanToiThieu: "",
    });
    setIsHallTypeEditMode(false);
    setIsHallTypeModalOpen(true);
  };

  const openEditHallTypeModal = (hallType: HallType) => {
    setHallTypeFormData({
      MaLoaiSanh: hallType.MaLoaiSanh,
      TenLoaiSanh: hallType.TenLoaiSanh,
      DonGiaBanToiThieu: hallType.DonGiaBanToiThieu.toString(),
    });
    setIsHallTypeEditMode(true);
    setIsHallTypeModalOpen(true);
  };

  // Đóng modal
  const closeHallModal = () => setIsHallModalOpen(false);
  const closeHallTypeModal = () => setIsHallTypeModalOpen(false);

  // Xử lý thay đổi input trong form
  const handleHallInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setHallFormData((prev) => ({
      ...prev,
      [name]: name === "MaLoaiSanh" ? Number(value) : value,
    }));
  };

  const handleHallTypeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setHallTypeFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Thêm hoặc sửa sảnh
  const handleHallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const soLuongBanToiDa = Number(hallFormData.SoLuongBanToiDa);
    if (isNaN(soLuongBanToiDa) || soLuongBanToiDa <= 0) {
      alert("Số lượng bàn tối đa phải là số dương");
      return;
    }
    if (isHallEditMode) {
      setHalls((prev) =>
        prev.map((hall) =>
          hall.MaSanh === hallFormData.MaSanh
            ? {
                ...hall,
                TenSanh: hallFormData.TenSanh,
                MaLoaiSanh: hallFormData.MaLoaiSanh,
                SoLuongBanToiDa: soLuongBanToiDa,
                GhiChu: hallFormData.GhiChu,
                Cover_Img: hallFormData.Cover_Img,
              }
            : hall
        )
      );
    } else {
      const newHall: Hall = {
        MaSanh:
          halls.length > 0
            ? Math.max(...halls.map((h) => h.MaSanh || 0)) + 1
            : 1,
        TenSanh: hallFormData.TenSanh,
        MaLoaiSanh: hallFormData.MaLoaiSanh,
        SoLuongBanToiDa: soLuongBanToiDa,
        GhiChu: hallFormData.GhiChu,
        Cover_Img: hallFormData.Cover_Img,
      };
      setHalls((prev) => [...prev, newHall]);
    }
    closeHallModal();
  };

  // Thêm hoặc sửa loại sảnh
  const handleHallTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const donGiaBanToiThieu = Number(hallTypeFormData.DonGiaBanToiThieu);
    if (isNaN(donGiaBanToiThieu) || donGiaBanToiThieu < 0) {
      alert("Đơn giá bàn tối thiểu phải là số không âm");
      return;
    }
    if (isHallTypeEditMode) {
      setHallTypes((prev) =>
        prev.map((hallType) =>
          hallType.MaLoaiSanh === hallTypeFormData.MaLoaiSanh
            ? {
                ...hallType,
                TenLoaiSanh: hallTypeFormData.TenLoaiSanh,
                DonGiaBanToiThieu: donGiaBanToiThieu,
              }
            : hallType
        )
      );
    } else {
      const newHallType: HallType = {
        MaLoaiSanh:
          hallTypes.length > 0
            ? Math.max(...hallTypes.map((ht) => ht.MaLoaiSanh || 0)) + 1
            : 1,
        TenLoaiSanh: hallTypeFormData.TenLoaiSanh,
        DonGiaBanToiThieu: donGiaBanToiThieu,
      };
      setHallTypes((prev) => [...prev, newHallType]);
    }
    closeHallTypeModal();
  };

  // Xóa sảnh
  const handleDeleteHall = (MaSanh: number | null) => {
    // Kiểm tra nếu sảnh đang được sử dụng trong DATTIEC
    // Giả sử bạn có một API hoặc logic kiểm tra, ở đây chỉ minh họa
    const isHallInUse = false; // Thay bằng logic kiểm tra thực tế
    if (isHallInUse) {
      alert("Không thể xóa sảnh đang được sử dụng trong đặt tiệc!");
      return;
    }
    setHalls((prev) => prev.filter((hall) => hall.MaSanh !== MaSanh));
  };

  // Xóa loại sảnh
  const handleDeleteHallType = (MaLoaiSanh: number | null) => {
    const isHallTypeInUse = halls.some(
      (hall) => hall.MaLoaiSanh === MaLoaiSanh
    );
    if (isHallTypeInUse) {
      alert("Không thể xóa loại sảnh đang được sử dụng!");
      return;
    }
    setHallTypes((prev) =>
      prev.filter((hallType) => hallType.MaLoaiSanh !== MaLoaiSanh)
    );
  };

  // Lọc sảnh
  const filteredHalls = halls.filter(
    (hall) =>
      hall.TenSanh.toLowerCase().includes(hallSearchTerm.toLowerCase()) &&
      (hallTypeFilter === "" || hall.MaLoaiSanh === Number(hallTypeFilter))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hàng đầu tiên: Tìm kiếm và thêm sảnh */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Danh sách sảnh có sẵn
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm sảnh..."
              value={hallSearchTerm}
              onChange={(e) => setHallSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={openAddHallModal}
              className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Thêm sảnh
            </button>
          </div>
        </div>

        {/* Danh sách sảnh: Thay thế bảng bằng danh sách card trên mobile */}
        <div className="mb-8">
          {/* Ẩn bảng trên mobile */}
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên sảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại sảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng bàn tối đa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ghi chú
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ảnh bìa
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHalls.map((hall) => {
                  const hallType = hallTypes.find(
                    (ht) => ht.MaLoaiSanh === hall.MaLoaiSanh
                  );
                  return (
                    <tr key={hall.MaSanh}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {hall.TenSanh}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hallType ? hallType.TenLoaiSanh : "Chưa phân loại"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hall.SoLuongBanToiDa}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {hall.GhiChu || "Không có ghi chú"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hall.Cover_Img ? (
                          <img
                            src={hall.Cover_Img}
                            alt={hall.TenSanh}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          "Không có ảnh"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditHallModal(hall)}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteHall(hall.MaSanh)}
                          className="text-red-600 hover:text-red-800"
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

          {/* Hiển thị dạng card trên mobile */}
          <div className="block sm:hidden space-y-4">
            {filteredHalls.map((hall) => {
              const hallType = hallTypes.find(
                (ht) => ht.MaLoaiSanh === hall.MaLoaiSanh
              );
              return (
                <div
                  key={hall.MaSanh}
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {hall.TenSanh}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Loại:{" "}
                        {hallType ? hallType.TenLoaiSanh : "Chưa phân loại"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Số bàn tối đa: {hall.SoLuongBanToiDa}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        Ghi chú: {hall.GhiChu || "Không có ghi chú"}
                      </p>
                      {hall.Cover_Img && (
                        <img
                          src={hall.Cover_Img}
                          alt={hall.TenSanh}
                          className="w-24 h-24 object-cover rounded mt-2"
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditHallModal(hall)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteHall(hall.MaSanh)}
                        className="text-red-600 hover:text-red-800 text-sm"
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

        {/* Hàng thứ hai: Tìm kiếm và thêm loại sảnh */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Quản lý loại sảnh
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <select
                value={hallTypeFilter}
                onChange={(e) => setHallTypeFilter(e.target.value)}
                className="w-full sm:w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả loại sảnh</option>
                {hallTypes.map((hallType) => (
                  <option
                    key={hallType.MaLoaiSanh}
                    value={hallType.MaLoaiSanh || ""}
                  >
                    {hallType.TenLoaiSanh}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={openAddHallTypeModal}
              className="w-full sm:w-auto bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
            >
              Thêm loại sảnh
            </button>
          </div>
        </div>

        {/* Danh sách loại sảnh: Thay thế bảng bằng danh sách card trên mobile */}
        <div>
          {/* Ẩn bảng trên mobile */}
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên loại sảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn giá bàn tối thiểu (VNĐ)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hallTypes.map((hallType) => (
                  <tr key={hallType.MaLoaiSanh}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {hallType.TenLoaiSanh}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {hallType.DonGiaBanToiThieu.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditHallTypeModal(hallType)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteHallType(hallType.MaLoaiSanh)
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hiển thị dạng card trên mobile */}
          <div className="block sm:hidden space-y-4">
            {hallTypes.map((hallType) => (
              <div
                key={hallType.MaLoaiSanh}
                className="bg-white shadow-md rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {hallType.TenLoaiSanh}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Đơn giá:{" "}
                      {hallType.DonGiaBanToiThieu.toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditHallTypeModal(hallType)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteHallType(hallType.MaLoaiSanh)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal thêm/sửa sảnh */}
        {isHallModalOpen && (
          <div
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-gray-300
                  transform -translate-x-1/2 -translate-y-1/2"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {isHallEditMode ? "Sửa sảnh" : "Thêm sảnh"}
            </h3>
            <form onSubmit={handleHallSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên sảnh
                </label>
                <input
                  type="text"
                  name="TenSanh"
                  value={hallFormData.TenSanh}
                  onChange={handleHallInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Loại sảnh
                </label>
                <select
                  name="MaLoaiSanh"
                  value={hallFormData.MaLoaiSanh || ""}
                  onChange={handleHallInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <option value="">Chọn loại sảnh</option>
                  {hallTypes.map((hallType) => (
                    <option
                      key={hallType.MaLoaiSanh}
                      value={hallType.MaLoaiSanh || ""}
                    >
                      {hallType.TenLoaiSanh}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Số lượng bàn tối đa
                </label>
                <input
                  type="number"
                  name="SoLuongBanToiDa"
                  value={hallFormData.SoLuongBanToiDa}
                  onChange={handleHallInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Ghi chú
                </label>
                <textarea
                  name="GhiChu"
                  value={hallFormData.GhiChu}
                  onChange={handleHallInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Ảnh bìa
                </label>
                <input
                  type="text"
                  name="Cover_Img"
                  value={hallFormData.Cover_Img}
                  onChange={handleHallInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="Nhập URL ảnh bìa"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeHallModal}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  {isHallEditMode ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal thêm/sửa loại sảnh */}
        {isHallTypeModalOpen && (
          <div
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-gray-300
                  transform -translate-x-1/2 -translate-y-1/2"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {isHallTypeEditMode ? "Sửa loại sảnh" : "Thêm loại sảnh"}
            </h3>
            <form onSubmit={handleHallTypeSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên loại sảnh
                </label>
                <input
                  type="text"
                  name="TenLoaiSanh"
                  value={hallTypeFormData.TenLoaiSanh}
                  onChange={handleHallTypeInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Đơn giá bàn tối thiểu (VNĐ)
                </label>
                <input
                  type="number"
                  name="DonGiaBanToiThieu"
                  value={hallTypeFormData.DonGiaBanToiThieu}
                  onChange={handleHallTypeInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeHallTypeModal}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                >
                  {isHallTypeEditMode ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin_Hall;
