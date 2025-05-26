import { useState } from "react";
import { useEffect } from "react";
interface WeddingBooking {
  id: number;
  tenchure: string;
  tencodau: string;
  dienthoai: string;
  ngaydactiec: string;
  tiendatcoc: number;
  soluongban: number;
  soluongbandutru: number;
  hall?: string;
  dishes?: number[];
  services?: string[]; // Sửa từ service thành services
}

interface Hall {
  id: number;
  name: string;
  capacity: number;
  imageUrl: string;
  note: string;
}

interface Dish {
  id: number;
  name: string;
  categoryId: number;
  imageUrl?: string;
  note: string; // Thêm trường mô tả
  dongia: number; // Thêm trường đơn giá (giả định là số nguyên, đơn vị VNĐ)
}

interface Menu {
  id: number;
  name: string;
  dishIds: number[];
}

interface Category {
  id: number;
  name: string;
}

interface ServiceType {
  id: number;
  name: string;
  imageUrl: string;
}

interface Service {
  id: number;
  name: string;
  typeId: number; // Liên kết với ServiceType
  price: number; // Giá tiền
  note: string;
}

interface FormData {
  id: number | null;
  tenchure: string;
  tencodau: string;
  dienthoai: string;
  ngaydactiec: string;
  soluongban: string;
  soluongbandutru: string;
  tiendatcoc: number; // Sửa thành number
}
interface ConfirmationModal {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
}

function Admin_Wedding() {
  // Dữ liệu mẫu
  const [bookings, setBookings] = useState<WeddingBooking[]>([
    {
      id: 1,
      tenchure: "Nguyễn Văn A",
      tencodau: "Trần Thị B",
      dienthoai: "0901234567",
      ngaydactiec: "2025-06-15",
      tiendatcoc: 5000000,
      soluongban: 20,
      soluongbandutru: 2,
    },
    {
      id: 2,
      tenchure: "Lê Minh C",
      tencodau: "Phạm Thị D",
      dienthoai: "0912345678",
      ngaydactiec: "2025-07-20",
      tiendatcoc: 7000000,
      soluongban: 30,
      soluongbandutru: 3,
    },
  ]);

  const [halls] = useState<Hall[]>([
    {
      id: 1,
      name: "Sảnh Ngọc Trai",
      capacity: 50,
      imageUrl:
        "https://crystalpalacevn.com/wp-content/uploads/2020/06/classic.jpg",
      note: "Sảnh sang trọng với ánh sáng lung linh, phù hợp cho tiệc cưới cao cấp.",
    },
    {
      id: 2,
      name: "Sảnh Phượng Hoàng",
      capacity: 80,
      imageUrl:
        "https://crystalpalacevn.com/wp-content/uploads/2023/03/T4_07087-scaled.jpg",
      note: "Không gian rộng rãi, phong cách hoàng gia, lý tưởng cho tiệc đông khách.",
    },
    {
      id: 3,
      name: "Sảnh Hoa Sen",
      capacity: 30,
      imageUrl:
        "https://crystalpalacevn.com/wp-content/uploads/2020/06/royal.png",
      note: "Sảnh ấm cúng, thiết kế gần gũi thiên nhiên, phù hợp tiệc thân mật.",
    },
  ]);

  const [dishes] = useState<Dish[]>([
    {
      id: 1,
      name: "Soup bò củ quả xào",
      categoryId: 1,
      note: "Món khai vị nóng hổi, kết hợp thịt bò mềm và rau củ tươi ngon.",
      dongia: 150000,
      imageUrl: "https://via.placeholder.com/300x200?text=Soup+Bo",
    },
    {
      id: 2,
      name: "Gỏi cuốn tôm thịt",
      categoryId: 1,
      note: "Gỏi cuốn tươi mát với tôm, thịt heo và rau sống, ăn kèm nước chấm đặc biệt.",
      dongia: 120000,
      imageUrl: "https://via.placeholder.com/300x200?text=Goi+Cuon",
    },
    {
      id: 3,
      name: "Cà ri gà + Bánh mì",
      categoryId: 2,
      note: "Món chính đậm đà với gà nấu cà ri, phục vụ cùng bánh mì giòn rụm.",
      dongia: 180000,
      imageUrl: "https://via.placeholder.com/300x200?text=Ca+Ri+Ga",
    },
    {
      id: 4,
      name: "Soup củ nâu bắp",
      categoryId: 1,
      note: "Soup chay thanh đạm, kết hợp củ nâu và bắp ngọt tự nhiên.",
      dongia: 100000,
      imageUrl: "https://via.placeholder.com/300x200?text=Soup+Cu+Nau",
    },
    {
      id: 5,
      name: "Chả giò hongkong",
      categoryId: 3,
      note: "Chả giò giòn rụm theo phong cách Hồng Kông, nhân tôm và rau củ.",
      dongia: 130000,
      imageUrl: "https://via.placeholder.com/300x200?text=Cha+Gio",
    },
  ]);
  const [menus, setMenus] = useState<Menu[]>([
    { id: 1, name: "Menu 1", dishIds: [1, 2, 3] },
    { id: 2, name: "Menu 2", dishIds: [4, 5] },
  ]);

  const [categories] = useState<Category[]>([
    { id: 1, name: "Khai vị" },
    { id: 2, name: "Chính" },
    { id: 3, name: "Tráng miệng" },
  ]);

  // Dữ liệu mẫu cho loại dịch vụ và dịch vụ
  const [serviceTypes] = useState<ServiceType[]>([
    {
      id: 1,
      name: "Chụp Ảnh",
      imageUrl:
        "https://khoistudio.vn/wp-content/uploads/2023/09/chup-anh-cuoi-27.jpg",
    },
    {
      id: 2,
      name: "Âm Thanh Ánh Sáng",
      imageUrl:
        "https://amthanhanhsangsukien.com/wp-content/uploads/2019/10/IMG_8655.jpg",
    },
    {
      id: 3,
      name: "Thiệp Cưới",
      imageUrl: "https://thiepcuoikk.com/upload/news/1-7-8216.jpg",
    },
    {
      id: 4,
      name: "Váy Cưới",
      imageUrl:
        "https://maxi.vn/wp-content/uploads/2024/06/z5544165856412_593d24ced318fd7645232a00f00dc759.jpg",
    },
  ]);

  const [services] = useState<Service[]>([
    {
      id: 1,
      name: "Chụp Ảnh Cơ Bản",
      typeId: 1,
      price: 5000000,
      note: "Gói chụp ảnh cơ bản với 200 ảnh chỉnh sửa, phù hợp cho tiệc cưới nhỏ.",
    },
    {
      id: 2,
      name: "Chụp Ảnh Chuyên Nghiệp",
      typeId: 1,
      price: 10000000,
      note: "Gói chụp ảnh chuyên nghiệp với 400 ảnh chỉnh sửa, bao gồm album cao cấp.",
    },
    {
      id: 3,
      name: "Chụp Ảnh Drone",
      typeId: 1,
      price: 15000000,
      note: "Chụp ảnh flycam toàn cảnh, lý tưởng cho không gian ngoài trời.",
    },
    {
      id: 4,
      name: "Âm Thanh Cơ Bản",
      typeId: 2,
      price: 3000000,
      note: "Hệ thống âm thanh cơ bản, phù hợp cho tiệc cưới dưới 50 bàn.",
    },
    {
      id: 5,
      name: "Ánh Sáng Sân Khấu",
      typeId: 2,
      price: 5000000,
      note: "Hệ thống ánh sáng sân khấu đa sắc, tạo không gian lung linh cho tiệc cưới.",
    },
    {
      id: 6,
      name: "Ban Nhạc Sống",
      typeId: 2,
      price: 8000000,
      note: "Ban nhạc sống biểu diễn 2 giờ, phong cách đa dạng từ cổ điển đến hiện đại.",
    },
    {
      id: 7,
      name: "Thiệp Cưới Tiêu Chuẩn",
      typeId: 3,
      price: 2000000,
      note: "Gói 100 thiệp cưới thiết kế đơn giản, in ấn chất lượng cao.",
    },
    {
      id: 8,
      name: "Thiệp Cưới Cao Cấp",
      typeId: 3,
      price: 4000000,
      note: "Gói 100 thiệp cưới thiết kế tinh tế, chất liệu nhập khẩu, kèm phong bì sang trọng.",
    },
    {
      id: 9,
      name: "Váy Cưới Thiết Kế",
      typeId: 4,
      price: 10000000,
      note: "Váy cưới thiết kế riêng, phong cách hiện đại, may đo theo số đo cô dâu.",
    },
    {
      id: 10,
      name: "Váy Cưới Nhập Khẩu",
      typeId: 4,
      price: 20000000,
      note: "Váy cưới nhập khẩu từ Ý, chất liệu cao cấp, đính đá thủ công tinh xảo.",
    },
  ]);

  // State quản lý wizard
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<number[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]); // Sửa từ selectedService

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    id: null,
    tenchure: "",
    tencodau: "",
    dienthoai: "",
    ngaydactiec: "",
    tiendatcoc: 0,
    soluongban: "",
    soluongbandutru: "",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedServiceType, setSelectedServiceType] = useState<number | null>(
    null
  );
  // State cho modal xác nhận
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal>(
    {
      isOpen: false,
      message: "",
      onConfirm: () => {},
    }
  );

  // Handler mở modal thêm
  const openAddModal = () => {
    setFormData({
      id: null,
      tenchure: "",
      tencodau: "",
      dienthoai: "",
      ngaydactiec: "",
      tiendatcoc: 0,
      soluongban: "",
      soluongbandutru: "",
    });
    setIsEditMode(false);
    setCurrentStep(1);
    setSelectedHall(null);
    setSelectedDishes([]);
    setSelectedMenu(null);
    setSelectedServices([]); // Reset danh sách dịch vụ
    setSelectedServiceType(null); // Reset loại dịch vụ
    setShowWizard(true);
  };

  // Handler mở modal sửa
  const openEditModal = (booking: WeddingBooking) => {
    setFormData({
      id: booking.id,
      tenchure: booking.tenchure,
      tencodau: booking.tencodau,
      dienthoai: booking.dienthoai,
      ngaydactiec: booking.ngaydactiec,
      tiendatcoc: booking.tiendatcoc,
      soluongban: booking.soluongban.toString(),
      soluongbandutru: booking.soluongbandutru.toString(),
    });
    setIsEditMode(true);
    setCurrentStep(1);
    setSelectedHall(booking.hall || null);
    setSelectedDishes(booking.dishes || []);
    setSelectedMenu(null);
    setSelectedServices(booking.services || []);
    setSelectedServiceType(null);
    setShowWizard(true);
  };

  // Handler đóng wizard
  const closeWizard = () => {
    setShowWizard(false);
    setCurrentStep(1);
    setSelectedHall(null);
    setSelectedDishes([]);
    setSelectedMenu(null);
    setSelectedServices([]); // Sửa từ setSelectedService(null)
    setSelectedServiceType(null); // Reset loại dịch vụ
  };
  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, message: "", onConfirm: () => {} });
  };
  const handleConfirm = () => {
    confirmationModal.onConfirm();
    closeConfirmationModal();
  };
  // Handler thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "tiendatcoc") {
      const soluongban =
        (Number(formData.soluongban) || 0) +
        (Number(formData.soluongbandutru) || 0);
      const totalDishCost = selectedDishes.reduce((total, dishId) => {
        const dish = dishes.find((d) => d.id === dishId);
        return total + (dish ? dish.dongia : 0);
      }, 0);
      const totalServiceCost = selectedServices.reduce((total, serviceName) => {
        const service = services.find((s) => s.name === serviceName);
        return total + (service ? service.price : 0);
      }, 0);
      const totalCost = totalDishCost * soluongban + totalServiceCost;
      const minDeposit = Math.ceil(totalCost * 0.2);
      const newValue = Number(value);
      if (newValue < minDeposit) {
        alert(
          `Tiền đặt cọc phải ít nhất ${minDeposit.toLocaleString(
            "vi-VN"
          )} VNĐ (20% tổng tiền).`
        );
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handler chọn thực đơn
  const handleMenuSelect = (menu: Menu) => {
    setSelectedMenu(menu.id);
    setSelectedDishes(menu.dishIds);
  };

  // Handler submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dữ liệu
    const tiendatcocNumber = Number(formData.tiendatcoc);
    const soluongbanNumber = Number(formData.soluongban);
    const soluongbandutruNumber = Number(formData.soluongbandutru);

    if (isNaN(tiendatcocNumber) || tiendatcocNumber < 0) {
      alert("Tiền đặt cọc phải là số không âm");
      return;
    }
    if (isNaN(soluongbanNumber) || soluongbanNumber <= 0) {
      alert("Số lượng bàn phải là số dương");
      return;
    }
    if (isNaN(soluongbandutruNumber) || soluongbandutruNumber < 0) {
      alert("Số lượng bàn dự trữ phải là số không âm");
      return;
    }
    if (!selectedHall) {
      alert("Vui lòng chọn sảnh");
      return;
    }
    if (selectedDishes.length === 0) {
      alert("Vui lòng chọn ít nhất một món ăn");
      return;
    }
    if (selectedServices.length === 0) {
      alert("Vui lòng chọn ít nhất một dịch vụ");
      return;
    }
    // Kiểm tra sức chứa sảnh
    const selectedHallData = halls.find((hall) => hall.name === selectedHall);
    if (
      selectedHallData &&
      soluongbanNumber + soluongbandutruNumber > selectedHallData.capacity
    ) {
      alert("Tổng số bàn vượt quá sức chứa của sảnh");
      return;
    }

    // Mở dialog xác nhận
    setConfirmationModal({
      isOpen: true,
      message: isEditMode
        ? "Bạn có chắc chắn muốn cập nhật thông tin đặt tiệc này?"
        : "Bạn có chắc chắn muốn thêm đặt tiệc này?",
      onConfirm: () => {
        if (isEditMode) {
          setBookings((prev) =>
            prev.map((booking) =>
              booking.id === formData.id
                ? {
                    ...booking,
                    tenchure: formData.tenchure,
                    tencodau: formData.tencodau,
                    dienthoai: formData.dienthoai,
                    ngaydactiec: formData.ngaydactiec,
                    tiendatcoc: tiendatcocNumber,
                    soluongban: soluongbanNumber,
                    soluongbandutru: soluongbandutruNumber,
                    hall: selectedHall,
                    dishes: selectedDishes,
                    services: selectedServices,
                  }
                : booking
            )
          );
        } else {
          const newBooking: WeddingBooking = {
            id:
              bookings.length > 0
                ? Math.max(...bookings.map((b) => b.id)) + 1
                : 1,
            tenchure: formData.tenchure,
            tencodau: formData.tencodau,
            dienthoai: formData.dienthoai,
            ngaydactiec: formData.ngaydactiec,
            tiendatcoc: tiendatcocNumber,
            soluongban: soluongbanNumber,
            soluongbandutru: soluongbandutruNumber,
            hall: selectedHall,
            dishes: selectedDishes,
            services: selectedServices,
          };
          setBookings((prev) => [...prev, newBooking]);
        }
        closeWizard();
      },
    });
  };

  // Handler chọn dịch vụ
  const handleServiceSelect = (serviceName: string, checked: boolean) => {
    setSelectedServices((prev) =>
      checked
        ? [...prev, serviceName]
        : prev.filter((name) => name !== serviceName)
    );
  };

  // Handler xóa đặt tiệc
  const handleDelete = (id: number) => {
    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa đặt tiệc này?",
      onConfirm: () => {
        setBookings((prev) => prev.filter((booking) => booking.id !== id));
      },
    });
  };

  // Handler tìm kiếm
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.tenchure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tencodau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.dienthoai.includes(searchTerm)
  );
  useEffect(() => {
    const totalTables =
      (Number(formData.soluongban) || 0) +
      (Number(formData.soluongbandutru) || 0);
    const totalDishCost = selectedDishes.reduce((total, dishId) => {
      const dish = dishes.find((d) => d.id === dishId);
      return total + (dish ? dish.dongia : 0);
    }, 0);
    const totalServiceCost = selectedServices.reduce((total, serviceName) => {
      const service = services.find((s) => s.name === serviceName);
      return total + (service ? service.price : 0);
    }, 0);
    const totalCost = totalDishCost * totalTables + totalServiceCost;
    const defaultDeposit = Math.ceil(totalCost * 0.2);
    if (defaultDeposit !== formData.tiendatcoc) {
      setFormData((prev) => ({
        ...prev,
        tiendatcoc: defaultDeposit,
      }));
    }
  }, [
    selectedDishes,
    selectedServices,
    formData.soluongban,
    formData.soluongbandutru,
    dishes,
    services,
  ]);
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trang danh sách đặt tiệc */}
        {!showWizard ? (
          <>
            {/* Tiêu đề và tìm kiếm */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                Quản Lý Đặt Tiệc Cưới
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên chú rể, cô dâu hoặc số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={openAddModal}
                  className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Thêm Đặt Tiệc
                </button>
              </div>
            </div>

            {/* Danh sách đặt tiệc */}
            <div>
              {/* Bảng trên desktop */}
              <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên Chú Rể
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên Cô Dâu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Điện Thoại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày Đặt Tiệc
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tiền Đặt Cọc (VNĐ)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số Lượng Bàn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bàn Dự Trữ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành Động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.tenchure}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.tencodau}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.dienthoai}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.ngaydactiec).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.tiendatcoc.toLocaleString("vi-VN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.soluongban}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.soluongbandutru}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditModal(booking)}
                            className="text-blue-600 hover:text-blue-800 mr-4"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
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

              {/* Card trên mobile */}
              <div className="block sm:hidden space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white shadow-md rounded-lg p-4"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {booking.tenchure} & {booking.tencodau}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(booking)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Điện thoại: {booking.dienthoai}
                      </p>
                      <p className="text-sm text-gray-500">
                        Ngày đặt tiệc:{" "}
                        {new Date(booking.ngaydactiec).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        Tiền đặt cọc:{" "}
                        {booking.tiendatcoc.toLocaleString("vi-VN")} VNĐ
                      </p>
                      <p className="text-sm text-gray-500">
                        Số lượng bàn: {booking.soluongban} (Dự trữ:{" "}
                        {booking.soluongbandutru})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Trang wizard */
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {isEditMode ? "Sửa Đặt Tiệc" : "Thêm Đặt Tiệc"}
            </h2>

            {/* Thông tin cơ bản */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Thông Tin Cơ Bản
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên Chú Rể
                  </label>
                  <input
                    type="text"
                    name="tenchure"
                    value={formData.tenchure}
                    onChange={handleInputChange}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên Cô Dâu
                  </label>
                  <input
                    type="text"
                    name="tencodau"
                    value={formData.tencodau}
                    onChange={handleInputChange}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Điện Thoại
                  </label>
                  <input
                    type="text"
                    name="dienthoai"
                    value={formData.dienthoai}
                    onChange={handleInputChange}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày Đặt Tiệc
                  </label>
                  <input
                    type="date"
                    name="ngaydactiec"
                    value={formData.ngaydactiec}
                    onChange={handleInputChange}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Chọn thực đơn */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Chọn Thực Đơn
              </h4>

              {/* Thực đơn có sẵn */}
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-600 mb-3">
                  Thực Đơn Có Sẵn
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menus.map((menu) => {
                    const menuDishes = menu.dishIds
                      .map((dishId) =>
                        dishes.find((dish) => dish.id === dishId)
                      )
                      .filter(Boolean) as Dish[];

                    // Lấy imageUrl của món ăn đầu tiên (nếu có)
                    const firstDishImageUrl = menuDishes[0]?.imageUrl;

                    return (
                      <div
                        key={menu.id}
                        onClick={() => {
                          setSelectedMenu(menu.id);
                          setSelectedDishes([...menu.dishIds]); // Tự động tick các món trong dishIds
                        }}
                        className={`rounded-lg shadow-md cursor-pointer border transition-all duration-300 ${
                          selectedMenu === menu.id
                            ? "bg-blue-50 border-blue-500 shadow-lg"
                            : "bg-white border-gray-200 hover:shadow-lg hover:border-blue-300"
                        }`}
                      >
                        <div className="h-48 overflow-hidden rounded-t-lg">
                          {firstDishImageUrl ? (
                            <img
                              src={firstDishImageUrl}
                              alt={menu.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/300x200?text=Fallback+Image";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">
                                Không có ảnh
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h5 className="text-lg font-medium text-gray-800 mb-2">
                            {menu.name}
                          </h5>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            Món ăn:{" "}
                            {menuDishes.map((dish) => dish.name).join(", ")}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            Tổng đơn giá:{" "}
                            {menuDishes
                              .reduce((total, dish) => total + dish.dongia, 0)
                              .toLocaleString("vi-VN")}{" "}
                            VNĐ
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tùy chỉnh thực đơn */}
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-600 mb-3">
                  Tùy Chỉnh Thực Đơn
                </h5>
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  {categories.map((category) => (
                    <div key={category.id} className="mb-4">
                      <h6 className="text-sm font-semibold text-gray-700 mb-2">
                        {category.name}
                      </h6>
                      <div className="space-y-2">
                        {dishes
                          .filter((dish) => dish.categoryId === category.id)
                          .map((dish) => (
                            <div
                              key={dish.id}
                              className="flex items-center gap-3"
                            >
                              <input
                                type="checkbox"
                                checked={selectedDishes.includes(dish.id)}
                                onChange={(e) => {
                                  // Cập nhật danh sách món đã chọn
                                  const newSelectedDishes = e.target.checked
                                    ? [...selectedDishes, dish.id]
                                    : selectedDishes.filter(
                                        (id) => id !== dish.id
                                      );
                                  setSelectedDishes(newSelectedDishes);

                                  // Bỏ chọn thực đơn có sẵn nếu tùy chỉnh
                                  setSelectedMenu(null);
                                }}
                                className="h-4 w-4 text-blue-500 rounded"
                              />
                              <div className="flex-1">
                                <span className="text-sm text-gray-700">
                                  {dish.name}
                                </span>
                                <p className="text-xs text-gray-500">
                                  {dish.note}
                                </p>
                                <p className="text-xs text-green-600">
                                  {dish.dongia.toLocaleString("vi-VN")} VNĐ
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                  {/* Nút Thêm Menu Mới */}
                  {selectedDishes.length > 0 && (
                    <button
                      onClick={() => {
                        // Kiểm tra xem danh sách món đã chọn có thuộc thực đơn có sẵn nào không
                        const isCustomMenu = !menus.some(
                          (menu) =>
                            menu.dishIds.length === selectedDishes.length &&
                            menu.dishIds.every((dishId) =>
                              selectedDishes.includes(dishId)
                            )
                        );

                        if (isCustomMenu && selectedDishes.length > 0) {
                          const newMenuId =
                            menus.length > 0
                              ? Math.max(...menus.map((m) => m.id)) + 1
                              : 1;
                          const firstDish = dishes.find(
                            (dish) => dish.id === selectedDishes[0]
                          );
                          const newMenu: Menu = {
                            id: newMenuId,
                            name: `Thực Đơn Tùy Chỉnh ${newMenuId}`,
                            dishIds: [...selectedDishes],
                          };
                          setMenus((prev) => [...prev, newMenu]); // Thêm thực đơn mới vào danh sách
                          setSelectedMenu(newMenuId); // Tự động chọn thực đơn mới
                        }
                      }}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Thêm Menu Mới
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Chọn loại dịch vụ */}
            <div className="mb-8">
              {/* Chọn Loại Dịch Vụ */}
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Chọn Loại Dịch Vụ
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {serviceTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setSelectedServiceType(type.id)}
                    className={`rounded-lg shadow-md cursor-pointer border transition-all duration-300 ${
                      selectedServiceType === type.id
                        ? "bg-blue-50 border-blue-500 shadow-lg"
                        : "bg-white border-gray-200 hover:shadow-lg hover:border-blue-300"
                    }`}
                  >
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={type.imageUrl}
                        alt={type.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h5 className="text-lg font-medium text-gray-800 mb-2">
                        {type.name}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hiển thị danh sách dịch vụ tương ứng */}
              {selectedServiceType && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    Dịch Vụ Được Chọn:{" "}
                    {
                      serviceTypes.find(
                        (type) => type.id === selectedServiceType
                      )?.name
                    }
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services
                      .filter(
                        (service) => service.typeId === selectedServiceType
                      )
                      .map((service) => (
                        <div
                          key={service.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="p-4">
                            <div className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                checked={selectedServices.includes(
                                  service.name
                                )}
                                onChange={(e) =>
                                  handleServiceSelect(
                                    service.name,
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 text-blue-500 rounded mr-2"
                              />
                              <h5 className="text-lg font-semibold text-gray-800">
                                {service.name}
                              </h5>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {service.note}
                            </p>
                            <p className="text-lg font-medium text-green-600">
                              {service.price.toLocaleString("vi-VN")} VNĐ
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  **
                  {selectedServices.length > 0 && (
                    <div className="mt-6">
                      <h5 className="text-sm font-medium text-gray-600 mb-3">
                        Danh Sách Dịch Vụ Đã Chọn
                      </h5>
                      <div className="space-y-2">
                        {selectedServices.map((serviceName) => {
                          const service = services.find(
                            (s) => s.name === serviceName
                          );
                          return (
                            <div
                              key={serviceName}
                              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  {serviceName}
                                </p>
                                <p className="text-xs text-green-600">
                                  {service?.price.toLocaleString("vi-VN")} VNĐ
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  handleServiceSelect(serviceName, false)
                                }
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Xóa
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  **
                </div>
              )}
            </div>

            {/* Tổng kết và tiền đặt cọc (di chuyển xuống dưới cùng) */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Tổng Kết và Tiền Đặt Cọc
              </h4>

              {/* Hiển thị tổng tiền thực đơn và dịch vụ */}
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-600 mb-3">
                  Tổng Chi Phí
                </h5>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {/* Tổng tiền thực đơn */}
                  {(() => {
                    const soluongban =
                      (Number(formData.soluongban) || 0) +
                      (Number(formData.soluongbandutru) || 0);
                    const totalDishCost = selectedDishes.reduce(
                      (total, dishId) => {
                        const dish = dishes.find((d) => d.id === dishId);
                        return total + (dish ? dish.dongia : 0);
                      },
                      0
                    );
                    const totalMenuCost = totalDishCost * soluongban;
                    return (
                      <p className="text-sm text-gray-700 mb-2">
                        Tổng tiền thực đơn (x {soluongban} bàn):{" "}
                        {totalMenuCost.toLocaleString("vi-VN")} VNĐ
                      </p>
                    );
                  })()}
                  {/* Tổng tiền dịch vụ */}
                  {(() => {
                    const totalServiceCost = selectedServices.reduce(
                      (total, serviceName) => {
                        const service = services.find(
                          (s) => s.name === serviceName
                        );
                        return total + (service ? service.price : 0);
                      },
                      0
                    );
                    return (
                      <p className="text-sm text-gray-700 mb-2">
                        Tổng tiền dịch vụ:{" "}
                        {totalServiceCost.toLocaleString("vi-VN")} VNĐ
                      </p>
                    );
                  })()}
                  {/* Tổng cộng */}
                  {(() => {
                    const soluongban =
                      (Number(formData.soluongban) || 0) +
                      (Number(formData.soluongbandutru) || 0);
                    const totalDishCost = selectedDishes.reduce(
                      (total, dishId) => {
                        const dish = dishes.find((d) => d.id === dishId);
                        return total + (dish ? dish.dongia : 0);
                      },
                      0
                    );
                    const totalServiceCost = selectedServices.reduce(
                      (total, serviceName) => {
                        const service = services.find(
                          (s) => s.name === serviceName
                        );
                        return total + (service ? service.price : 0);
                      },
                      0
                    );
                    const totalCost =
                      totalDishCost * soluongban + totalServiceCost;
                    return (
                      <p className="text-lg font-semibold text-green-600">
                        Tổng cộng: {totalCost.toLocaleString("vi-VN")} VNĐ
                      </p>
                    );
                  })()}
                </div>
              </div>

              {/* Số bàn và tiền đặt cọc */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số Lượng Bàn
                  </label>
                  <input
                    type="number"
                    name="soluongban"
                    value={formData.soluongban}
                    onChange={handleInputChange}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số Lượng Bàn Dự Trữ
                  </label>
                  <input
                    type="number"
                    name="soluongbandutru"
                    value={formData.soluongbandutru}
                    onChange={handleInputChange}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tiền Đặt Cọc (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="tiendatcoc"
                    value={formData.tiendatcoc}
                    onChange={handleInputChange}
                    min={(() => {
                      const soluongban =
                        (Number(formData.soluongban) || 0) +
                        (Number(formData.soluongbandutru) || 0);
                      const totalDishCost = selectedDishes.reduce(
                        (total, dishId) => {
                          const dish = dishes.find((d) => d.id === dishId);
                          return total + (dish ? dish.dongia : 0);
                        },
                        0
                      );
                      const totalServiceCost = selectedServices.reduce(
                        (total, serviceName) => {
                          const service = services.find(
                            (s) => s.name === serviceName
                          );
                          return total + (service ? service.price : 0);
                        },
                        0
                      );
                      return Math.ceil(
                        (totalDishCost * soluongban + totalServiceCost) * 0.2
                      );
                    })()}
                    title="Tiền đặt cọc phải ít nhất 20% tổng tiền"
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Nút điều hướng */}
            <div className="flex justify-between space-x-3">
              <button
                type="button"
                onClick={closeWizard}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                disabled={!selectedHall || selectedDishes.length === 0}
              >
                {isEditMode ? "Cập Nhật" : "Thêm"}
              </button>
            </div>
          </div>
        )}
        {confirmationModal.isOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm bg-white rounded-lg p-6 shadow-lg border border-gray-300 transform -translate-x-1/2 -translate-y-1/2">
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

export default Admin_Wedding;
