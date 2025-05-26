import { useState } from "react";

// Định nghĩa interface
interface Dish {
  id: number | null;
  name: string;
  categoryId: number | null;
  price: number;
  note: string;
  imageUrl?: string;
}

interface Category {
  id: number | null;
  name: string;
}

interface Menu {
  id: number | null;
  name: string;
  price: number;
  dishIds: number[];
}

interface MenuFormData {
  id: number | null;
  name: string;
  price: string;
  dishIds: number[];
}

interface DishFormData {
  id: number | null;
  name: string;
  categoryId: number | null;
  price: string;
  note: string;
  imageUrl: string;
}

interface ConfirmationModal {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
}

function Menus() {
  // State cho danh sách thực đơn, món ăn và loại món ăn
  const [menus, setMenus] = useState<Menu[]>([
    {
      id: 1,
      name: "Menu 1",
      price: 1290000,
      dishIds: [1, 2, 3],
    },
    {
      id: 2,
      name: "Menu 2",
      price: 1330000,
      dishIds: [4, 5],
    },
  ]);

  const [dishes, setDishes] = useState<Dish[]>([
    {
      id: 1,
      name: "Soup bò củ quả xào",
      categoryId: 1,
      price: 150000,
      note: "Hương vị đậm đà, bổ dưỡng",
      imageUrl: "https://via.placeholder.com/100?text=Soup+Bo",
    },
    {
      id: 2,
      name: "Gỏi cuốn tôm thịt",
      categoryId: 1,
      price: 80000,
      note: "Tôm tươi, rau sạch",
      imageUrl: "https://via.placeholder.com/100?text=Goi+Cuon",
    },
    {
      id: 3,
      name: "Cà ri gà + Bánh mì",
      categoryId: 2,
      price: 200000,
      note: "Cà ri thơm lừng, bánh mì giòn",
      imageUrl: "https://via.placeholder.com/100?text=Ca+Ri+Ga",
    },
    {
      id: 4,
      name: "Soup củ nâu bắp",
      categoryId: 1,
      price: 120000,
      note: "Thanh nhẹ, tốt cho sức khỏe",
      imageUrl: "https://via.placeholder.com/100?text=Soup+Cu",
    },
    {
      id: 5,
      name: "Chả giò hongkong",
      categoryId: 3,
      price: 100000,
      note: "Giòn rụm, nhân tôm thịt",
      imageUrl: "https://via.placeholder.com/100?text=Cha+Gio",
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Khai vị" },
    { id: 2, name: "Chính" },
    { id: 3, name: "Tráng miệng" },
  ]);

  // State cho modal và form
  const [isMenuModalOpen, setIsMenuModalOpen] = useState<boolean>(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] =
    useState<boolean>(false);
  const [menuFormData, setMenuFormData] = useState<MenuFormData>({
    id: null,
    name: "",
    price: "",
    dishIds: [],
  });
  const [dishFormData, setDishFormData] = useState<DishFormData>({
    id: null,
    name: "",
    categoryId: null,
    price: "",
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
    setMenuFormData({ id: null, name: "", price: "", dishIds: [] });
    setIsMenuEditMode(false);
    setIsMenuModalOpen(true);
  };

  const openEditMenuModal = (menu: Menu) => {
    setMenuFormData({
      id: menu.id,
      name: menu.name,
      price: menu.price.toString(),
      dishIds: [...menu.dishIds],
    });
    setIsMenuEditMode(true);
    setIsMenuModalOpen(true);
  };

  // Mở modal để thêm/sửa món ăn
  const openAddDishModal = () => {
    setDishFormData({
      id: null,
      name: "",
      categoryId: null,
      price: "",
      note: "",
      imageUrl: "",
    });
    setIsDishEditMode(false);
    setIsDishModalOpen(true);
  };

  const openEditDishModal = (dish: Dish) => {
    setDishFormData({
      id: dish.id,
      name: dish.name,
      categoryId: dish.categoryId,
      price: dish.price.toString(),
      note: dish.note,
      imageUrl: dish.imageUrl || "",
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
  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNumber = menuFormData.dishIds.reduce((total, dishId) => {
      const dish = dishes.find((d) => d.id === dishId);
      return total + (dish ? dish.price : 0);
    }, 0);
    if (menuFormData.dishIds.length === 0) {
      alert("Vui lòng chọn ít nhất một món ăn!");
      return;
    }
    const action = () => {
      if (isMenuEditMode) {
        setMenus((prev) =>
          prev.map((menu) =>
            menu.id === menuFormData.id
              ? {
                  ...menu,
                  name: menuFormData.name,
                  price: priceNumber,
                  dishIds: menuFormData.dishIds,
                }
              : menu
          )
        );
      } else {
        const newMenu: Menu = {
          id:
            menus.length > 0 ? Math.max(...menus.map((m) => m.id || 0)) + 1 : 1,
          name: menuFormData.name,
          price: priceNumber,
          dishIds: menuFormData.dishIds,
        };
        setMenus((prev) => [...prev, newMenu]);
      }
      closeMenuModal();
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
  const handleDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNumber = Number(dishFormData.price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert("Giá phải là số dương");
      return;
    }
    const action = () => {
      if (isDishEditMode) {
        setDishes((prev) =>
          prev.map((dish) =>
            dish.id === dishFormData.id
              ? {
                  ...dish,
                  name: dishFormData.name,
                  categoryId: dishFormData.categoryId,
                  price: priceNumber,
                  note: dishFormData.note,
                  imageUrl: dishFormData.imageUrl || undefined,
                }
              : dish
          )
        );
      } else {
        const newDish: Dish = {
          id:
            dishes.length > 0
              ? Math.max(...dishes.map((d) => d.id || 0)) + 1
              : 1,
          name: dishFormData.name,
          categoryId: dishFormData.categoryId,
          price: priceNumber,
          note: dishFormData.note,
          imageUrl: dishFormData.imageUrl || undefined,
        };
        setDishes((prev) => [...prev, newDish]);
      }
      closeDishModal();
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
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const action = () => {
      if (isCategoryEditMode) {
        setCategories((prev) =>
          prev.map((category) =>
            category.id === categoryFormData.id
              ? { ...category, name: categoryFormData.name }
              : category
          )
        );
      } else {
        const newCategory: Category = {
          id:
            categories.length > 0
              ? Math.max(...categories.map((c) => c.id || 0)) + 1
              : 1,
          name: categoryFormData.name,
        };
        setCategories((prev) => [...prev, newCategory]);
      }
      closeCategoryModal();
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
    const action = () => {
      setMenus((prev) => prev.filter((menu) => menu.id !== id));
    };
    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa thực đơn này không?",
      onConfirm: action,
    });
  };

  // Xóa món ăn
  const handleDeleteDish = (id: number | null) => {
    const action = () => {
      setDishes((prev) => prev.filter((dish) => dish.id !== id));
      setMenus((prev) =>
        prev.map((menu) => ({
          ...menu,
          dishIds: menu.dishIds.filter((dishId) => dishId !== id),
        }))
      );
    };
    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa món ăn này không?",
      onConfirm: action,
    });
  };

  // Xóa loại món ăn
  const handleDeleteCategory = (id: number | null) => {
    const isCategoryInUse = dishes.some((dish) => dish.categoryId === id);
    if (isCategoryInUse) {
      alert("Không thể xóa loại món ăn đang được sử dụng!");
      return;
    }
    const action = () => {
      setCategories((prev) => prev.filter((category) => category.id !== id));
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
      dish.name.toLowerCase().includes(dishSearchTerm.toLowerCase()) &&
      (categoryFilter === "" || dish.categoryId === Number(categoryFilter))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hàng đầu tiên: Tìm kiếm và thêm thực đơn */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Danh sách thực đơn có sẵn
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm thực đơn..."
              value={menuSearchTerm}
              onChange={(e) => setMenuSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={openAddMenuModal}
              className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Thêm thực đơn
            </button>
          </div>
        </div>

        {/* Danh sách thực đơn: Thay thế bảng bằng danh sách card trên mobile */}
        <div className="mb-8">
          {/* Ẩn bảng trên mobile */}
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên thực đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá (VNĐ)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh sách món ăn
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMenus.map((menu) => {
                  const menuDishes = menu.dishIds
                    .map((dishId) => dishes.find((dish) => dish.id === dishId))
                    .filter(Boolean);
                  return (
                    <tr key={menu.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {menu.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {menu.price.toLocaleString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="line-clamp-2">
                          {menuDishes.map((dish) => dish?.name).join(", ") ||
                            "Chưa có món ăn"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditMenuModal(menu)}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteMenu(menu.id)}
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
            {filteredMenus.map((menu) => {
              const menuDishes = menu.dishIds
                .map((dishId) => dishes.find((dish) => dish.id === dishId))
                .filter(Boolean);
              return (
                <div
                  key={menu.id}
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {menu.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Giá: {menu.price.toLocaleString("vi-VN")} VNĐ
                      </p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        Món ăn:{" "}
                        {menuDishes.map((dish) => dish?.name).join(", ") ||
                          "Chưa có món ăn"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditMenuModal(menu)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(menu.id)}
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

        {/* Hàng thứ hai: Tìm kiếm và thêm món ăn, loại món ăn */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Quản lý món ăn
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Tìm kiếm món ăn..."
                value={dishSearchTerm}
                onChange={(e) => setDishSearchTerm(e.target.value)}
                className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full sm:w-auto bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Thêm món ăn
              </button>
              <button
                onClick={openAddCategoryModal}
                className="w-full sm:w-auto bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
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
                    (cat) => cat.id === dish.categoryId
                  );
                  return (
                    <tr key={dish.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dish.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category ? category.name : "Chưa phân loại"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dish.price.toLocaleString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {dish.note || "Không có ghi chú"}
                      </td>
                      <td className="px-6 py-4">
                        {dish.imageUrl ? (
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
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
                          onClick={() => handleDeleteDish(dish.id)}
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
                (cat) => cat.id === dish.categoryId
              );
              return (
                <div
                  key={dish.id}
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {dish.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Loại: {category ? category.name : "Chưa phân loại"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Giá: {dish.price.toLocaleString("vi-VN")} VNĐ
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Ghi chú: {dish.note || "Không có ghi chú"}
                      </p>
                      {dish.imageUrl && (
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
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
                        onClick={() => handleDeleteDish(dish.id)}
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
          <div
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-gray-300
                transform -translate-x-1/2 -translate-y-1/2"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
                  {menuFormData.dishIds
                    .reduce((total, dishId) => {
                      const dish = dishes.find((d) => d.id === dishId);
                      return total + (dish ? dish.price : 0);
                    }, 0)
                    .toLocaleString("vi-VN")}{" "}
                  VNĐ
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Danh sách món ăn
                </label>
                <div className="mt-1">
                  {menuFormData.dishIds.map((dishId) => {
                    const dish = dishes.find((d) => d.id === dishId);
                    return dish ? (
                      <div
                        key={dishId}
                        className="flex items-center gap-2 mb-2"
                      >
                        <span>
                          {dish.name} ({dish.price.toLocaleString("vi-VN")} VNĐ)
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
                        (dish) => !menuFormData.dishIds.includes(dish.id || 0)
                      )
                      .map((dish) => (
                        <option key={dish.id} value={dish.id || ""}>
                          {dish.name} ({dish.price.toLocaleString("vi-VN")} VNĐ)
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeMenuModal}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  {isMenuEditMode ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal thêm/sửa món ăn */}
        {isDishModalOpen && (
          <div
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-gray-300
                  transform -translate-x-1/2 -translate-y-1/2"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
                  Loại món ăn
                </label>
                <select
                  name="categoryId"
                  value={dishFormData.categoryId || ""}
                  onChange={handleDishInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                >
                  <option value="">Chưa phân loại</option>
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
                  value={dishFormData.price}
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
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  {isDishEditMode ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal thêm/sửa loại món ăn */}
        {isCategoryModalOpen && (
          <div
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-gray-300
                  transform -translate-x-1/2 -translate-y-1/2"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
                  onChange={handleCategoryInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                >
                  {isCategoryEditMode ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal xác nhận */}
        {confirmationModal.isOpen && (
          <div
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm bg-white rounded-lg p-6 shadow-lg border border-gray-300
                transform -translate-x-1/2 -translate-y-1/2"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Xác nhận
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {confirmationModal.message}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeConfirmationModal}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
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
