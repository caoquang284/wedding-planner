import { useState, useEffect } from "react";
import {
  getAllDichVu,
  getDichVuById,
  createDichVu,
  updateDichVu,
  deleteDichVu,
  getAllLoaiDichVu,
  createLoaiDichVu,
  updateLoaiDichVu,
  deleteLoaiDichVu,
} from "../../Api/dichVuApi";

interface Service {
  MaDichVu: number;
  TenDichVu: string;
  GhiChu?: string;
  DonGia: number;
  MaLoaiDichVu: number | null;
  AnhURL?: string;
  TenLoaiDichVu?: string;
}

interface Category {
  MaLoaiDichVu: number | null;
  TenLoaiDichVu: string;
}

interface FormData {
  id: number | null;
  name: string;
  description: string;
  price: string;
  categoryId: number | null;
  imageUrl: string;
  note: string;
}

interface ConfirmationModal {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
}

function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    id: null,
    name: "",
    description: "",
    price: "",
    categoryId: null,
    imageUrl: "",
    note: "",
  });
  const [categoryFormData, setCategoryFormData] = useState<Category>({
    MaLoaiDichVu: null,
    TenLoaiDichVu: "",
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isCategoryEditMode, setIsCategoryEditMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal>(
    {
      isOpen: false,
      message: "",
      onConfirm: () => {},
    }
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load dữ liệu từ backend khi component được render
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dichVuList = await getAllDichVu();
        const loaiDichVuList = await getAllLoaiDichVu();
        setServices(dichVuList);
        setCategories(loaiDichVuList);
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu: " + (err as any).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openAddModal = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      price: "",
      categoryId: null,
      imageUrl: "",
      note: "",
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setFormData({
      id: service.MaDichVu,
      name: service.TenDichVu,
      description: service.GhiChu || "",
      price: service.DonGia.toString(),
      categoryId: service.MaLoaiDichVu,
      imageUrl: service.AnhURL || "",
      note: service.GhiChu || "",
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openAddCategoryModal = () => {
    setCategoryFormData({ MaLoaiDichVu: null, TenLoaiDichVu: "" });
    setIsCategoryEditMode(false);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setCategoryFormData({
      MaLoaiDichVu: category.MaLoaiDichVu,
      TenLoaiDichVu: category.TenLoaiDichVu,
    });
    setIsCategoryEditMode(true);
    setIsCategoryModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const closeCategoryModal = () => setIsCategoryModalOpen(false);
  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, message: "", onConfirm: () => {} });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : Number(value),
    }));
  };

  const handleConfirm = () => {
    confirmationModal.onConfirm();
    closeConfirmationModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNumber = Number(formData.price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert("Giá phải là số dương");
      return;
    }
    const action = async () => {
      try {
        if (isEditMode) {
          const updatedService = await updateDichVu(formData.id!, {
            tenDichVu: formData.name,
            maLoaiDichVu: formData.categoryId,
            donGia: priceNumber,
            ghiChu: formData.note || null,
            anhURL: formData.imageUrl || null,
          });
          setServices((prev) =>
            prev.map((service) =>
              service.MaDichVu === formData.id ? updatedService : service
            )
          );
        } else {
          const newService = await createDichVu({
            tenDichVu: formData.name,
            maLoaiDichVu: formData.categoryId,
            donGia: priceNumber,
            ghiChu: formData.note || null,
            anhURL: formData.imageUrl || null,
          });
          setServices((prev) => [...prev, newService]);
        }
        closeModal();
      } catch (error) {
        alert(
          "Lỗi khi lưu dịch vụ: " + (error as any).response?.data?.error ||
            (error as any).message
        );
      }
    };
    setConfirmationModal({
      isOpen: true,
      message: `Bạn có chắc chắn muốn ${
        isEditMode ? "sửa" : "thêm"
      } dịch vụ này không?`,
      onConfirm: action,
    });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryFormData.TenLoaiDichVu.length < 2) {
      alert("Tên loại dịch vụ phải dài ít nhất 2 ký tự");
      return;
    }
    const action = async () => {
      try {
        if (isCategoryEditMode) {
          const updatedCategory = await updateLoaiDichVu(
            categoryFormData.MaLoaiDichVu!,
            {
              tenLoaiDichVu: categoryFormData.TenLoaiDichVu,
            }
          );
          setCategories((prev) =>
            prev.map((category) =>
              category.MaLoaiDichVu === categoryFormData.MaLoaiDichVu
                ? updatedCategory
                : category
            )
          );
        } else {
          const newCategory = await createLoaiDichVu({
            tenLoaiDichVu: categoryFormData.TenLoaiDichVu,
          });
          setCategories((prev) => [...prev, newCategory]);
        }
        closeCategoryModal();
      } catch (error) {
        alert(
          "Lỗi khi lưu loại dịch vụ: " + (error as any).response?.data?.error ||
            (error as any).message
        );
      }
    };
    setConfirmationModal({
      isOpen: true,
      message: `Bạn có chắc chắn muốn ${
        isCategoryEditMode ? "sửa" : "thêm"
      } loại dịch vụ này không?`,
      onConfirm: action,
    });
  };

  const handleDelete = async (id: number | null) => {
    const action = async () => {
      try {
        await deleteDichVu(id!);
        setServices((prev) =>
          prev.filter((service) => service.MaDichVu !== id)
        );
      } catch (error) {
        alert(
          "Lỗi khi xóa dịch vụ: " + (error as any).response?.data?.error ||
            (error as any).message
        );
      }
    };
    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa dịch vụ này không?",
      onConfirm: action,
    });
  };

  const handleDeleteCategory = async (id: number | null) => {
    const isCategoryInUse = services.some(
      (service) => service.MaLoaiDichVu === id
    );
    if (isCategoryInUse) {
      alert("Không thể xóa loại dịch vụ đang được sử dụng!");
      return;
    }
    const action = async () => {
      try {
        await deleteLoaiDichVu(id!);
        setCategories((prev) =>
          prev.filter((category) => category.MaLoaiDichVu !== id)
        );
      } catch (error) {
        alert(
          "Lỗi khi xóa loại dịch vụ: " + (error as any).response?.data?.error ||
            (error as any).message
        );
      }
    };
    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa loại dịch vụ này không?",
      onConfirm: action,
    });
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCategoryFormData((prev) => ({ ...prev, [name]: value }));
  };

  const filteredServices = services.filter(
    (service) =>
      (service.TenDichVu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.GhiChu &&
          service.GhiChu.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (categoryFilter === "" || service.MaLoaiDichVu === Number(categoryFilter))
  );

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
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#001F3F] mb-4">
            Quản lý dịch vụ
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-48 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
              >
                <option value="">Tất cả loại dịch vụ</option>
                {categories.map((category) => (
                  <option
                    key={category.MaLoaiDichVu}
                    value={category.MaLoaiDichVu || ""}
                  >
                    {category.TenLoaiDichVu}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={openAddModal}
                className="w-full sm:w-auto bg-[#001F3F] text-white py-2 px-4 rounded hover:bg-[#003366] transition-colors duration-300"
              >
                Thêm dịch vụ
              </button>
              <button
                onClick={openAddCategoryModal}
                className="w-full sm:w-auto bg-[#D4B2B2] text-white py-2 px-4 rounded hover:bg-[#C49898] transition-colors duration-300"
              >
                Thêm loại dịch vụ
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#001F3F]/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider align-middle">
                    Tên dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider align-middle">
                    Giá (VNĐ)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider align-middle">
                    Loại dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-#001F3F] uppercase tracking-wider align-middle">
                    Ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider align-middle">
                    Ghi chú
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider text-right align-middle">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredServices.map((service) => (
                  <tr
                    key={service.MaDichVu}
                    className="hover:bg-[#F8F9FA] transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#001F3F] align-middle">
                      {service.TenDichVu}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 align-middle">
                      {service.GhiChu || "Không có mô tả"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 align-middle">
                      {service.DonGia.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 align-middle">
                      {service.TenLoaiDichVu || "Chưa phân loại"}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      {service.AnhURL ? (
                        <img
                          src={service.AnhURL}
                          alt={service.TenDichVu}
                          className="w-16 h-16 object-cover rounded-lg mx-auto"
                        />
                      ) : (
                        <span className="text-gray-500">Không có ảnh</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 align-middle">
                      {service.GhiChu || "Không có ghi chú"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right align-middle">
                      <button
                        onClick={() => openEditModal(service)}
                        className="text-[#B8860B] hover:text-[#8B6914] mr-4 transition-colors duration-300"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(service.MaDichVu)}
                        className="text-[#D4B2B2] hover:text-[#C49898] transition-colors duration-300"
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
            {filteredServices.map((service) => (
              <div
                key={service.MaDichVu}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-100"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium text-[#001F3F]">
                    {service.TenDichVu}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {service.GhiChu || "Không có mô tả"}
                  </p>
                  <p className="text-sm text-[#B8860B]">
                    Giá: {service.DonGia.toLocaleString("vi-VN")} VNĐ
                  </p>
                  <p className="text-sm text-gray-500">
                    Loại: {service.TenLoaiDichVu || "Chưa phân loại"}
                  </p>
                  {service.AnhURL && (
                    <img
                      src={service.AnhURL}
                      alt={service.TenDichVu}
                      className="w-16 h-16 object-cover rounded-lg mt-2"
                    />
                  )}
                  <p className="text-sm text-gray-500">
                    Ghi chú: {service.GhiChu || "Không có ghi chú"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="text-[#B8860B] hover:text-[#8B6914] text-sm transition-colors duration-300"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(service.MaDichVu)}
                      className="text-[#D4B2B2] hover:text-[#C49898] text-sm transition-colors duration-300"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-lg w-full max-w-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
              {isEditMode ? "Sửa dịch vụ" : "Thêm dịch vụ"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium">Tên dịch vụ</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  rows={3}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium">Giá (VNĐ)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium">Ảnh URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium">Ghi chú</label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Loại dịch vụ
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId || ""}
                  onChange={handleSelectChange}
                  className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <option value="">Chưa phân loại</option>
                  {categories.map((category) => (
                    <option
                      key={category.MaLoaiDichVu}
                      value={category.MaLoaiDichVu || ""}
                    >
                      {category.TenLoaiDichVu}
                    </option>
                  ))}
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
        )}

        {isCategoryModalOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-lg w-full max-w-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
              {isCategoryEditMode ? "Sửa loại dịch vụ" : "Thêm loại dịch vụ"}
            </h3>
            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên loại dịch vụ
                </label>
                <input
                  type="text"
                  name="TenLoaiDichVu"
                  value={categoryFormData.TenLoaiDichVu}
                  onChange={handleCategoryInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="px-4 py-2 bg-gray-100 text-[#001F3F] rounded hover:bg-gray-200 transition-colors duration-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4B2B2] text-white rounded hover:bg-[#C49898] transition-colors duration-300"
                >
                  {isCategoryEditMode ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}

        {confirmationModal.isOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-lg w-full max-w-sm p-6 border border-gray-100">
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
                onClick={handleConfirm}
                className="px-4 py-2 bg-[#D4B2B2] text-white rounded hover:bg-[#C49898] transition-colors duration-300"
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

export default Services;
