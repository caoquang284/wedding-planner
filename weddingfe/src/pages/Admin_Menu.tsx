import { useState, useEffect } from "react";
import {
  getAllMonAn,
  getMonAnById,
  createMonAn,
  updateMonAn,
  deleteMonAn,
  getAllLoaiMonAn,
  createLoaiMonAn,
  updateLoaiMonAn,
  deleteLoaiMonAn,
} from "../../Api/monAnApi"; // Giả sử bạn đã tạo các API này trong monAnApi.ts

import {
  getAllThucDon,
  getThucDonById,
  createThucDon,
  updateThucDon,
  deleteThucDon,
} from "../../Api/thucDonApi"; // Giả sử bạn đã tạo các API này trong monAnApi.ts
import { getAllDatTiec } from "../../Api/datTiecApi";
// Định nghĩa interface
interface Dish {
  MaMonAn: number | null;
  TenMonAn: string;
  MaLoaiMonAn: number | null;
  DonGia: number;
  GhiChu: string;
  AnhURL?: string;
}

const formatVND = (value: number | string) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "0 VNĐ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numValue);
};

interface Category {
  id: number | null;
  name: string;
}

interface Menu {
  id: number | null;
  name: string;
  price: number;
  orderprice: number;
  dishIds: number[];
  dishNames?: string[];
  dishPrices?: number[];
  note?: string;
}

interface MenuFormData {
  id: number | null;
  name: string;
  price: number | null;
  dishIds: number[];
}

interface DishFormData {
  id: number | null;
  name: string;
  categoryId: number | null;
  price: number | null;
  note: string;
  imageUrl: string;
}

interface ConfirmationModal {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
}

interface IDatTiec {
  MaDatTiec: number;
  TenChuRe: string;
  TenCoDau: string;
  DienThoai: string;
  NgayDaiTiec: Date;
  MaThucDon?: number;
}

function Menus() {
  // State cho danh sách thực đơn, món ăn và loại món ăn
  const [menus, setMenus] = useState<Menu[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [weddingBookings, setWeddingBookings] = useState<IDatTiec[]>([]);
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch menus
        const menusData = await getAllThucDon();
        console.log(menusData);
        const menusWithDetails = await Promise.all(
          menusData.map(async (menu: any) => {
            const menuDetail = await getThucDonById(menu.MaThucDon);
            return {
              id: menu.MaThucDon,
              name: menu.TenThucDon,
              price: menu.DonGiaHienTai,
              orderprice: menu.DonGiaThoiDiemDat,
              dishIds: menu.MonAnList?.map((monAn: any) => monAn.MaMonAn) || [],
              dishNames:
                menuDetail.MonAnList?.map((monAn: any) => monAn.TenMonAn) || [],
              note: menuDetail.GhiChu,
              dishPrices:
                menuDetail.MonAnList?.map(
                  (monAn: any) => monAn.DonGiaThoiDiemDat
                ) || [],
            };
          })
        );
        setMenus(menusWithDetails);

        // Fetch dishes
        const dishesData = await getAllMonAn();
        setDishes(dishesData);

        // Fetch categories
        const categoriesData = await getAllLoaiMonAn();
        setCategories(
          categoriesData.map((cat: any) => ({
            id: cat.MaLoaiMonAn,
            name: cat.TenLoaiMonAn,
          }))
        );

        // Fetch wedding bookings
        const bookingsData = await getAllDatTiec();
        setWeddingBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Có lỗi xảy ra khi tải dữ liệu!");
      }
    };

    fetchData();
  }, []);

  // State cho modal và form
  const [isMenuModalOpen, setIsMenuModalOpen] = useState<boolean>(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] =
    useState<boolean>(false);
  const [menuFormData, setMenuFormData] = useState<MenuFormData>({
    id: null,
    name: "",
    price: null,
    dishIds: [],
  });
  const [dishFormData, setDishFormData] = useState<DishFormData>({
    id: null,
    name: "",
    categoryId: null,
    price: null,
    note: "",
    imageUrl: "",
  });
  const [categoryFormData, setCategoryFormData] = useState<Category>({
    id: null,
    name: "",
  });
  const [isMenuEditMode, setIsMenuEditMode] = useState<boolean>(false);
  const [isDishEditMode, setIsDishEditMode] = useState<boolean>(false);
  const [isCategoryEditMode, setIsCategoryEditMode] = useState<boolean>(false);

  // State cho tìm kiếm và lọc
  const [menuSearchTerm, setMenuSearchTerm] = useState<string>("");
  const [dishSearchTerm, setDishSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // State cho modal xác nhận
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal>(
    {
      isOpen: false,
      message: "",
      onConfirm: () => {},
    }
  );

  // Mở modal để thêm/sửa thực đơn
  const openAddMenuModal = () => {
    setMenuFormData({ id: null, name: "", price: null, dishIds: [] });
    setIsMenuEditMode(false);
    setIsMenuModalOpen(true);
  };

  const openEditMenuModal = async (menu: Menu) => {
    try {
      if (!menu.id) {
        throw new Error("Menu ID is required");
      }
      // Fetch full menu details
      const menuDetail = await getThucDonById(menu.id);
      setMenuFormData({
        id: menu.id,
        name: menu.name,
        price: menuDetail.DonGiaHienTai,
        dishIds: menuDetail.MonAnList?.map((monAn: any) => monAn.MaMonAn) || [],
      });
      setIsMenuEditMode(true);
      setIsMenuModalOpen(true);
    } catch (error) {
      console.error("Error loading menu details:", error);
      alert("Có lỗi xảy ra khi tải thông tin thực đơn!");
    }
  };

  // Mở modal để thêm/sửa món ăn
  const openAddDishModal = () => {
    if (categories.length === 0) {
      alert("Vui lòng thêm ít nhất một loại món ăn trước khi thêm món ăn");
      return;
    }

    setDishFormData({
      id: null,
      name: "",
      categoryId: categories[0]?.id || null, // Đặt loại món ăn mặc định là loại đầu tiên
      price: null,
      note: "",
      imageUrl: "",
    });
    setIsDishEditMode(false);
    setIsDishModalOpen(true);
  };

  const openEditDishModal = (dish: Dish) => {
    setDishFormData({
      id: dish.MaMonAn,
      name: dish.TenMonAn,
      categoryId: dish.MaLoaiMonAn,
      price: dish.DonGia,
      note: dish.GhiChu,
      imageUrl: dish.AnhURL || "",
    });
    setIsDishEditMode(true);
    setIsDishModalOpen(true);
  };

  // Mở modal để thêm/sửa loại món ăn
  const openAddCategoryModal = () => {
    setCategoryFormData({ id: null, name: "" });
    setIsCategoryEditMode(false);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setCategoryFormData({ id: category.id, name: category.name });
    setIsCategoryEditMode(true);
    setIsCategoryModalOpen(true);
  };

  // Đóng modal
  const closeMenuModal = () => setIsMenuModalOpen(false);
  const closeDishModal = () => setIsDishModalOpen(false);
  const closeCategoryModal = () => setIsCategoryModalOpen(false);

  // Đóng modal xác nhận
  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, message: "", onConfirm: () => {} });
  };

  // Xử lý xác nhận hành động
  const handleConfirm = () => {
    confirmationModal.onConfirm();
    closeConfirmationModal();
  };

  // Xử lý thay đổi input trong form
  const handleMenuInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMenuFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDishInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDishFormData((prev) => ({
      ...prev,
      [name]: name === "categoryId" ? Number(value) : value,
    }));
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCategoryFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Thêm hoặc sửa thực đơn
  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNumber = menuFormData.dishIds.reduce((total, dishId) => {
      const dish = dishes.find((d) => d.MaMonAn === dishId);
      const dishPrice = dish ? Number(dish.DonGia) : 0;
      if (isNaN(dishPrice)) {
        console.warn(`Invalid DonGia for dishId ${dishId}:`, dish?.DonGia);
        return total;
      }
      return total + dishPrice;
    }, 0);

    if (menuFormData.dishIds.length === 0) {
      alert("Vui lòng chọn ít nhất một món ăn!");
      return;
    }

    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert("Tổng giá không hợp lệ!");
      return;
    }

    const action = async () => {
      try {
        if (isMenuEditMode && menuFormData.id) {
          const updatedMenu = await updateThucDon(menuFormData.id, {
            tenThucDon: menuFormData.name,
            donGiaThoiDiemDat: priceNumber,
            donGiaHienTai: priceNumber,
            monAnIds: menuFormData.dishIds,
          });
          const updatedMenuDetail = await getThucDonById(menuFormData.id);
          setMenus((prev) =>
            prev.map((menu) =>
              menu.id === menuFormData.id
                ? {
                    ...menu,
                    name: updatedMenu.TenThucDon,
                    price: updatedMenu.DonGiaHienTai,
                    dishIds: menuFormData.dishIds,
                    dishNames:
                      updatedMenuDetail.MonAnList?.map(
                        (monAn: any) => monAn.TenMonAn
                      ) || [],
                    note: updatedMenuDetail.GhiChu,
                  }
                : menu
            )
          );
        } else {
          const newMenu = await createThucDon({
            tenThucDon: menuFormData.name,
            donGiaThoiDiemDat: priceNumber,
            donGiaHienTai: priceNumber,
            monAnIds: menuFormData.dishIds,
          });
          const newMenuDetail = await getThucDonById(newMenu.MaThucDon);
          setMenus((prev) => [
            ...prev,
            {
              id: newMenu.MaThucDon,
              name: newMenu.TenThucDon,
              price: newMenu.DonGiaHienTai,
              orderprice: newMenu.DonGiaThoiDiemDat,
              dishIds: menuFormData.dishIds,
              dishNames:
                newMenuDetail.MonAnList?.map((monAn: any) => monAn.TenMonAn) ||
                [],
              note: newMenuDetail.GhiChu,
            },
          ]);
        }
        closeMenuModal();
      } catch (error: any) {
        console.error("Error saving menu:", error);
        console.error("Error response:", error.response?.data);
        alert(
          "Lỗi khi lưu thực đơn: " +
            (error.response?.data?.error || error.message)
        );
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: `Bạn có chắc chắn muốn ${
        isMenuEditMode ? "sửa" : "thêm"
      } thực đơn này không?`,
      onConfirm: action,
    });
  };

  // Thêm hoặc sửa món ăn
  const handleDishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNumber = Number(dishFormData.price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert("Giá phải là số dương");
      return;
    }

    if (!dishFormData.categoryId) {
      alert("Vui lòng chọn loại món ăn");
      return;
    }

    const action = async () => {
      try {
        if (isDishEditMode && dishFormData.id) {
          const updatedDish = await updateMonAn(dishFormData.id, {
            tenMonAn: dishFormData.name,
            maLoaiMonAn: dishFormData.categoryId,
            donGia: priceNumber,
            ghiChu: dishFormData.note || "",
            anhURL: dishFormData.imageUrl || "",
          });
          setDishes((prev) =>
            prev.map((dish) =>
              dish.MaMonAn === dishFormData.id ? updatedDish : dish
            )
          );
        } else {
          const newDish = await createMonAn({
            tenMonAn: dishFormData.name,
            maLoaiMonAn: dishFormData.categoryId,
            donGia: priceNumber,
            ghiChu: dishFormData.note || "",
            anhURL: dishFormData.imageUrl || "",
          });
          setDishes((prev) => [...prev, newDish]);
        }
        closeDishModal();
      } catch (error: any) {
        console.error("Error saving dish:", error);
        console.error("Error response:", error.response?.data);
        alert(
          "Lỗi khi lưu món ăn: " +
            (error.response?.data?.error || error.message)
        );
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: `Bạn có chắc chắn muốn ${
        isDishEditMode ? "sửa" : "thêm"
      } món ăn này không?`,
      onConfirm: action,
    });
  };

  // Thêm hoặc sửa loại món ăn
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryFormData.name.length < 2) {
      alert("Tên loại món ăn phải dài ít nhất 2 ký tự");
      return;
    }

    const action = async () => {
      try {
        if (isCategoryEditMode && categoryFormData.id) {
          const updatedCategory = await updateLoaiMonAn(categoryFormData.id, {
            tenLoaiMonAn: categoryFormData.name,
          });
          setCategories((prev) =>
            prev.map((category) =>
              category.id === categoryFormData.id
                ? {
                    id: updatedCategory.MaLoaiMonAn,
                    name: updatedCategory.TenLoaiMonAn,
                  }
                : category
            )
          );
        } else {
          const newCategory = await createLoaiMonAn({
            tenLoaiMonAn: categoryFormData.name,
          });
          setCategories((prev) => [
            ...prev,
            { id: newCategory.MaLoaiMonAn, name: newCategory.TenLoaiMonAn },
          ]);
        }
        closeCategoryModal();
      } catch (error: any) {
        console.error("Error saving category:", error);
        console.error("Error response:", error.response?.data);
        alert(
          "Lỗi khi lưu loại món ăn: " +
            (error.response?.data?.error || error.message)
        );
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: `Bạn có chắc chắn muốn ${
        isCategoryEditMode ? "sửa" : "thêm"
      } loại món ăn này không?`,
      onConfirm: action,
    });
  };

  // Xóa thực đơn
  const handleDeleteMenu = (id: number | null) => {
    const action = async () => {
      try {
        if (id) {
          await deleteThucDon(id);
          setMenus((prev) => prev.filter((menu) => menu.id !== id));
        }
      } catch (error) {
        console.error("Error deleting menu:", error);
        alert("Có lỗi xảy ra khi xóa thực đơn!");
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa thực đơn này không?",
      onConfirm: action,
    });
  };

  // Xóa món ăn
  const handleDeleteDish = (id: number | null) => {
    const action = async () => {
      try {
        if (id) {
          await deleteMonAn(id);
          setDishes((prev) => prev.filter((dish) => dish.MaMonAn !== id));
          setMenus((prev) =>
            prev.map((menu) => ({
              ...menu,
              dishIds: menu.dishIds.filter((dishId) => dishId !== id),
            }))
          );
        }
      } catch (error) {
        console.error("Error deleting dish:", error);
        alert("Có lỗi xảy ra khi xóa món ăn!");
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa món ăn này không?",
      onConfirm: action,
    });
  };

  // Xóa loại món ăn
  const handleDeleteCategory = (id: number | null) => {
    const isCategoryInUse = dishes.some((dish) => dish.MaLoaiMonAn === id);
    if (isCategoryInUse) {
      alert("Không thể xóa loại món ăn đang được sử dụng!");
      return;
    }

    const action = async () => {
      try {
        if (id) {
          await deleteLoaiMonAn(id);
          setCategories((prev) =>
            prev.filter((category) => category.id !== id)
          );
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Có lỗi xảy ra khi xóa loại món ăn!");
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa loại món ăn này không?",
      onConfirm: action,
    });
  };

  // Thêm món ăn vào thực đơn
  const addDishToMenu = (dishId: number) => {
    setMenuFormData((prev) => ({
      ...prev,
      dishIds: [...prev.dishIds, dishId],
    }));
  };

  // Xóa món ăn khỏi thực đơn
  const removeDishFromMenu = (dishId: number) => {
    setMenuFormData((prev) => ({
      ...prev,
      dishIds: prev.dishIds.filter((id) => id !== dishId),
    }));
  };

  // Lọc thực đơn và món ăn
  const filteredMenus = menus.filter(
    (menu) =>
      menu.name.toLowerCase().includes(menuSearchTerm.toLowerCase()) ||
      menu.price.toString().includes(menuSearchTerm)
  );

  const filteredDishes = dishes.filter(
    (dish) =>
      dish.TenMonAn.toLowerCase().includes(dishSearchTerm.toLowerCase()) &&
      (categoryFilter === "" || dish.MaLoaiMonAn === Number(categoryFilter))
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hàng đầu tiên: Tìm kiếm và thêm thực đơn */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#001F3F] mb-4">
            Danh sách thực đơn mẫu
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm thực đơn..."
              value={menuSearchTerm}
              onChange={(e) => setMenuSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4B2B2]"
            />
            <button
              onClick={openAddMenuModal}
              className="w-full sm:w-auto bg-[#001F3F] text-white py-2 px-4 rounded hover:bg-[#00152A]"
            >
              Thêm thực đơn
            </button>
          </div>
        </div>

        {/* Danh sách thực đơn mẫu */}
        <div className="mb-8">
          {/* Ẩn bảng trên mobile */}
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Tên thực đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Giá hiện tại (VNĐ)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Giá tại thời điểm đặt (VNĐ)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Danh sách món ăn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Ghi chú
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMenus.slice(0, 9).map((menu) => (
                  <tr key={menu.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {menu.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatVND(menu.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatVND(menu.orderprice)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className="line-clamp-2">
                        {menu.dishNames?.join(", ") || "Chưa có món ăn"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {menu.note || "Không có ghi chú"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditMenuModal(menu)}
                        className="text-[#B8860B] hover:text-[#8B6508] mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(menu.id)}
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

          {/* Hiển thị dạng card trên mobile cho thực đơn mẫu */}
          <div className="block sm:hidden space-y-4">
            {filteredMenus.slice(0, 9).map((menu) => (
              <div
                key={menu.id}
                className="bg-white shadow-md rounded-lg p-4 border-l-4 border-[#D4B2B2]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {menu.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Giá: {formatVND(menu.price)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Giá đặt: {formatVND(menu.orderprice)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      Món ăn: {menu.dishNames?.join(", ") || "Chưa có món ăn"}
                    </p>
                    {menu.note && (
                      <p className="text-sm text-gray-500 mt-1">
                        Ghi chú: {menu.note}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditMenuModal(menu)}
                      className="text-[#B8860B] hover:text-[#8B6508] text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(menu.id)}
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

        {/* Danh sách thực đơn tiệc cưới */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#001F3F] mb-4">
            Danh sách thực đơn tiệc cưới
          </h2>
        </div>

        <div className="mb-8">
          {/* Ẩn bảng trên mobile */}
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Mã tiệc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Tên cô dâu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Tên chú rể
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Ngày tiệc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Thực đơn
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {weddingBookings.map((booking) => {
                  const menu = menus.find((m) => m.id === booking.MaThucDon);
                  return (
                    <tr key={booking.MaDatTiec}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.MaDatTiec}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.TenCoDau}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.TenChuRe}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.NgayDaiTiec).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <button
                          onClick={() =>
                            setExpandedBooking(
                              expandedBooking === booking.MaDatTiec
                                ? null
                                : booking.MaDatTiec
                            )
                          }
                          className="text-[#B8860B] hover:text-[#8B6508] font-medium"
                        >
                          {expandedBooking === booking.MaDatTiec
                            ? "Ẩn chi tiết"
                            : "Xem chi tiết"}
                        </button>
                        {expandedBooking === booking.MaDatTiec && menu && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-[#001F3F] mb-2">
                              {menu.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Giá: {formatVND(menu.orderprice)}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              Danh sách món:
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {menu.dishNames?.map((dishName, index) => (
                                <li key={index}>{dishName}</li>
                              ))}
                            </ul>
                            {menu.note && (
                              <p className="text-sm text-gray-600 mt-2">
                                Ghi chú: {menu.note}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Hiển thị dạng card trên mobile cho thực đơn tiệc cưới */}
          <div className="block sm:hidden space-y-4">
            {weddingBookings.map((booking) => {
              const menu = menus.find((m) => m.id === booking.MaThucDon);
              return (
                <div
                  key={booking.MaDatTiec}
                  className="bg-white shadow-md rounded-lg p-4 border-l-4 border-[#D4B2B2]"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Tiệc #{booking.MaDatTiec}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Cô dâu: {booking.TenCoDau}
                        </p>
                        <p className="text-sm text-gray-500">
                          Chú rể: {booking.TenChuRe}
                        </p>
                        <p className="text-sm text-gray-500">
                          Ngày tiệc:{" "}
                          {new Date(booking.NgayDaiTiec).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setExpandedBooking(
                            expandedBooking === booking.MaDatTiec
                              ? null
                              : booking.MaDatTiec
                          )
                        }
                        className="text-[#B8860B] hover:text-[#8B6508] font-medium"
                      >
                        {expandedBooking === booking.MaDatTiec
                          ? "Ẩn chi tiết"
                          : "Xem chi tiết"}
                      </button>
                    </div>
                    {expandedBooking === booking.MaDatTiec && menu && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-[#001F3F] mb-2">
                          {menu.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Giá: {formatVND(menu.price)}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Danh sách món:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {menu.dishNames?.map((dishName, index) => (
                            <li key={index}>{dishName}</li>
                          ))}
                        </ul>
                        {menu.note && (
                          <p className="text-sm text-gray-600 mt-2">
                            Ghi chú: {menu.note}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hàng thứ hai: Tìm kiếm và thêm món ăn, loại món ăn */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#001F3F] mb-4">
            Quản lý món ăn
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Tìm kiếm món ăn..."
                value={dishSearchTerm}
                onChange={(e) => setDishSearchTerm(e.target.value)}
                className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4B2B2]"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4B2B2]"
              >
                <option value="">Tất cả loại món ăn</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id || ""}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={openAddDishModal}
                className="w-full sm:w-auto bg-[#D4B2B2] text-white py-2 px-4 rounded hover:bg-[#B89999]"
              >
                Thêm món ăn
              </button>
              <button
                onClick={openAddCategoryModal}
                className="w-full sm:w-auto bg-[#B8860B] text-white py-2 px-4 rounded hover:bg-[#8B6508]"
              >
                Thêm loại món ăn
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách món ăn: Thay thế bảng bằng danh sách card trên mobile */}
        <div>
          {/* Ẩn bảng trên mobile */}
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên món ăn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại món ăn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn giá (VNĐ)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ghi chú
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ảnh
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDishes.map((dish) => {
                  const category = categories.find(
                    (cat) => cat.id === dish.MaLoaiMonAn
                  );
                  return (
                    <tr key={dish.MaMonAn}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dish.TenMonAn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category ? category.name : "Chưa phân loại"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatVND(dish.DonGia)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {dish.GhiChu || "Không có ghi chú"}
                      </td>
                      <td className="px-6 py-4">
                        {dish.AnhURL ? (
                          <img
                            src={dish.AnhURL}
                            alt={dish.TenMonAn}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-500">Không có ảnh</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditDishModal(dish)}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteDish(dish.MaMonAn)}
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
            {filteredDishes.map((dish) => {
              const category = categories.find(
                (cat) => cat.id === dish.MaLoaiMonAn
              );
              return (
                <div
                  key={dish.MaMonAn}
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {dish.TenMonAn}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Loại: {category ? category.name : "Chưa phân loại"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Giá: {formatVND(dish.DonGia)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Ghi chú: {dish.GhiChu || "Không có ghi chú"}
                      </p>
                      {dish.AnhURL && (
                        <img
                          src={dish.AnhURL}
                          alt={dish.TenMonAn}
                          className="w-16 h-16 object-cover rounded-lg mt-2"
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditDishModal(dish)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteDish(dish.MaMonAn)}
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

        {/* Modal thêm/sửa thực đơn */}
        {isMenuModalOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-[#E6C3C3] transform -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
              {isMenuEditMode ? "Sửa thực đơn" : "Thêm thực đơn"}
            </h3>
            <form onSubmit={handleMenuSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên thực đơn
                </label>
                <input
                  type="text"
                  name="name"
                  value={menuFormData.name}
                  onChange={handleMenuInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Giá tổng (VNĐ)
                </label>
                <p className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 text-gray-700">
                  {formatVND(
                    menuFormData.dishIds.reduce((total, dishId, index) => {
                      const dish = dishes.find((d) => d.MaMonAn === dishId);
                      const menu = menus.find((m) => m.id === menuFormData.id);
                      const dishPrice =
                        menu?.dishPrices?.[index] ||
                        (dish ? Number(dish.DonGia) : 0);
                      if (isNaN(dishPrice)) {
                        console.warn(
                          `Invalid DonGia for dishId ${dishId}:`,
                          dish?.DonGia
                        );
                        return total;
                      }
                      return total + dishPrice;
                    }, 0)
                  )}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Danh sách món ăn
                </label>
                <div className="mt-1">
                  {menuFormData.dishIds.map((dishId, index) => {
                    const dish = dishes.find((d) => d.MaMonAn === dishId);
                    const menu = menus.find((m) => m.id === menuFormData.id);
                    const dishPrice =
                      menu?.dishPrices?.[index] ||
                      (dish ? Number(dish.DonGia) : 0);
                    return dish ? (
                      <div
                        key={dishId}
                        className="flex items-center gap-2 mb-2"
                      >
                        <span>
                          {dish.TenMonAn} ({formatVND(dishPrice)})
                        </span>
                        <button
                          type="button"
                          onClick={() => removeDishFromMenu(dishId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Xóa
                        </button>
                      </div>
                    ) : null;
                  })}
                  <select
                    value=""
                    onChange={(e) => {
                      const dishId = Number(e.target.value);
                      if (dishId && !menuFormData.dishIds.includes(dishId)) {
                        addDishToMenu(dishId);
                      }
                    }}
                    className="py-2 px-3 mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <option value="">Chọn món ăn để thêm</option>
                    {dishes
                      .filter(
                        (dish) =>
                          !menuFormData.dishIds.includes(dish.MaMonAn || 0)
                      )
                      .map((dish) => (
                        <option key={dish.MaMonAn} value={dish.MaMonAn || ""}>
                          {dish.TenMonAn} ({formatVND(dish.DonGia)})
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeMenuModal}
                  className="bg-[#FAFAFA] text-[#001F3F] py-2 px-4 rounded hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#001F3F] text-white py-2 px-4 rounded hover:bg-[#00152A]"
                >
                  {isMenuEditMode ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal thêm/sửa món ăn */}
        {isDishModalOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-[#D4B2B2] transform -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
              {isDishEditMode ? "Sửa món ăn" : "Thêm món ăn"}
            </h3>
            <form onSubmit={handleDishSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên món ăn
                </label>
                <input
                  type="text"
                  name="name"
                  value={dishFormData.name}
                  onChange={handleDishInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Loại món ăn <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={dishFormData.categoryId || ""}
                  onChange={handleDishInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                  required
                >
                  <option value="">Chọn loại món ăn</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id || ""}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Đơn giá (VNĐ)
                </label>
                <input
                  type="number"
                  name="price"
                  value={dishFormData.price?.toString() || ""}
                  onChange={handleDishInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Ghi chú
                </label>
                <input
                  type="text"
                  name="note"
                  value={dishFormData.note}
                  onChange={handleDishInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Ảnh URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={dishFormData.imageUrl}
                  onChange={handleDishInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeDishModal}
                  className="bg-[#FAFAFA] text-[#001F3F] py-2 px-4 rounded hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#D4B2B2] text-white py-2 px-4 rounded hover:bg-[#B89999]"
                >
                  {isDishEditMode ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal thêm/sửa loại món ăn */}
        {isCategoryModalOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-[#B8860B] transform -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
              {isCategoryEditMode ? "Sửa loại món ăn" : "Thêm loại món ăn"}
            </h3>
            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên loại món ăn
                </label>
                <input
                  type="text"
                  name="name"
                  value={categoryFormData.name}
                  onChange={(e) =>
                    setCategoryFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                  minLength={2}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="bg-[#FAFAFA] text-[#001F3F] py-2 px-4 rounded hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#B8860B] text-white py-2 px-4 rounded hover:bg-[#8B6508]"
                >
                  {isCategoryEditMode ? "Cập nhật" : "Thêm"}
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

export default Menus;
