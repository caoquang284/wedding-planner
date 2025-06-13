import { useState, useEffect, useMemo } from "react";
import {
  getAllThucDon,
  getThucDonById,
  createThucDon,
  updateThucDon,
} from "../../Api/thucDonApi";
import { getAllDichVu, getAllLoaiDichVu } from "../../Api/dichVuApi";
import { getAllMonAn, getAllLoaiMonAn } from "../../Api/monAnApi";
import { getAllSanh, getAllLoaiSanh } from "../../Api/sanhApi";
import { getAllCa } from "../../Api/caApi";
import {
  createDatTiec,
  getAllDatTiec,
  updateDatTiec,
  deleteDatTiec,
} from "../../Api/datTiecApi";
import { createHoaDon } from "../../Api/hoaDonApi";

// Interface cho món ăn
interface IMonAn {
  MaMonAn: number;
  TenMonAn: string;
  MaLoaiMonAn: number;
  TenLoaiMonAn: string;
  DonGia: number;
  GhiChu?: string;
  AnhURL?: string;
}

// Interface cho thực đơn
interface IThucDon {
  MaThucDon: number;
  TenThucDon: string;
  DonGiaHienTai: number;
  GhiChu?: string;
  Cover_Img?: string;
  MonAnList?: IMonAn[];
}

// Interface cho ca
interface ICa {
  MaCa: number;
  TenCa: string;
}

// Interface cho đặt tiệc
interface IDatTiec {
  MaDatTiec: number;
  TenChuRe: string;
  TenCoDau: string;
  DienThoai: string;
  NgayDaiTiec: Date;
  TienDatCoc: number;
  SoLuongBan: number;
  SoBanDuTru: number;
  MaSanh: number;
  MaCa: number;
  MaThucDon?: number;
  DichVus?: { MaDichVu: number; SoLuong: number; DonGiaThoiDiemDat: number }[];
  MonAns?: number[];
}

// Interface cho loại sảnh
interface ILoaiSanh {
  MaLoaiSanh: number;
  TenLoaiSanh: string;
  DonGiaBanToiThieu: number;
}

// Interface cho sảnh
interface ISanh {
  MaSanh: number;
  TenSanh: string;
  MaLoaiSanh: number;
  SoLuongBanToiDa: number;
  GhiChu?: string;
  AnhURL?: string;
}

// Interface cho loại dịch vụ
interface ILoaiDichVu {
  MaLoaiDichVu: number;
  TenLoaiDichVu: string;
}

// Interface cho dịch vụ
interface IDichVu {
  MaDichVu: number;
  TenDichVu: string;
  MaLoaiDichVu: number;
  DonGia: number;
  GhiChu?: string;
  AnhURL?: string;
}

// Interface cho form dữ liệu
interface IFormData {
  MaDatTiec: number | null;
  TenChuRe: string;
  TenCoDau: string;
  DienThoai: string;
  NgayDaiTiec: string;
  SoLuongBan: string;
  SoBanDuTru: string;
  TienDatCoc: string;
}

// Interface cho modal xác nhận
interface IModalXacNhan {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
}

function Admin_Wedding() {
  // API loading states
  const [isLoadingMenus, setIsLoadingMenus] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingDishes, setIsLoadingDishes] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isLoadingHalls, setIsLoadingHalls] = useState(true);
  const [isLoadingCa, setIsLoadingCa] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [apiMenus, setApiMenus] = useState<IThucDon[]>([]);
  const [apiServices, setApiServices] = useState<IDichVu[]>([]);
  const [apiServiceTypes, setApiServiceTypes] = useState<ILoaiDichVu[]>([]);
  const [apiDishes, setApiDishes] = useState<IMonAn[]>([]);
  const [apiDishTypes, setApiDishTypes] = useState<any[]>([]);
  const [bookings, setBookings] = useState<IDatTiec[]>([]);
  const [halls, setHalls] = useState<ISanh[]>([]);
  const [hallTypes, setHallTypes] = useState<ILoaiSanh[]>([]);
  const [caList, setCaList] = useState<ICa[]>([]);

  // Wizard state
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [selectedHallType, setSelectedHallType] = useState<number | null>(null);
  const [selectedHall, setSelectedHall] = useState<number | null>(null);
  const [selectedCa, setSelectedCa] = useState<number | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<number[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<
    { MaDichVu: number; SoLuong: number; DonGiaThoiDiemDat: number }[]
  >([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>({
    MaDatTiec: null,
    TenChuRe: "",
    TenCoDau: "",
    DienThoai: "",
    NgayDaiTiec: "",
    SoLuongBan: "",
    SoBanDuTru: "",
    TienDatCoc: "",
  });
  const [totalCost, setTotalCost] = useState(0);
  const [minDeposit, setMinDeposit] = useState(0);

  const formatVND = (value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numValue);
  };
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedServiceType, setSelectedServiceType] = useState<number | null>(
    null
  );
  const [confirmationModal, setConfirmationModal] = useState<IModalXacNhan>({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });
  const [isCustomMenu, setIsCustomMenu] = useState<boolean>(false);
  const [customMenuName, setCustomMenuName] = useState<string>("");
  const [showCustomMenuModal, setShowCustomMenuModal] =
    useState<boolean>(false);
  const [tempMenu, setTempMenu] = useState<{
    MaThucDon: number;
    TenThucDon: string;
    DonGiaHienTai: number;
    MonAnList: IMonAn[];
  } | null>(null);

  // Add new state for detail modal
  const [selectedBookingDetail, setSelectedBookingDetail] =
    useState<IDatTiec | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [menuDetails, setMenuDetails] = useState<IThucDon | null>(null);

  useEffect(() => {
    const calculateCosts = () => {
      const dishCost = selectedDishes.reduce((total, dishId) => {
        const dish = dishes.find((d) => d.id === dishId);
        return total + (dish ? Number(dish.dongia) || 0 : 0);
      }, 0);
      const totalBan =
        (Number(formData.SoLuongBan) || 0) + (Number(formData.SoBanDuTru) || 0);
      const serviceCost = selectedServices.reduce(
        (total, service) =>
          total +
          (Number(service.DonGiaThoiDiemDat) || 0) *
            (Number(service.SoLuong) || 0),
        0
      );
      const total = dishCost * totalBan + serviceCost;
      const minDeposit = Math.ceil(total * 0.3);
      setTotalCost(total);
      setMinDeposit(minDeposit);
    };

    if (dishes) {
      calculateCosts();
    }
  }, [
    selectedDishes,
    formData.SoLuongBan,
    formData.SoBanDuTru,
    selectedServices,
  ]);

  // Load data from APIs
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load menus
        setIsLoadingMenus(true);
        const menusData = await getAllThucDon();
        const limitedMenusData = menusData.slice(0, 6); // Lấy 6 bản ghi đầu tiên
        const menusWithDetails = await Promise.all(
          limitedMenusData.map(async (menu: IThucDon) => {
            const menuDetail = await getThucDonById(menu.MaThucDon);
            return {
              ...menu,
              MonAnList: menuDetail.MonAnList || [],
            };
          })
        );
        setApiMenus(menusWithDetails);
        setIsLoadingMenus(false);
        setApiMenus(menusWithDetails);
        setIsLoadingMenus(false);

        // Load services and service types
        setIsLoadingServices(true);
        const [servicesData, serviceTypesData] = await Promise.all([
          getAllDichVu(),
          getAllLoaiDichVu(),
        ]);
        setApiServices(servicesData);
        setApiServiceTypes(serviceTypesData);
        setIsLoadingServices(false);

        // Load dishes and dish types
        setIsLoadingDishes(true);
        const [dishesData, dishTypesData] = await Promise.all([
          getAllMonAn(),
          getAllLoaiMonAn(),
        ]);
        setApiDishes(dishesData);
        setApiDishTypes(dishTypesData);
        setIsLoadingDishes(false);

        // Load bookings
        setIsLoadingBookings(true);
        const bookingsData = await getAllDatTiec();
        setBookings(bookingsData);
        setIsLoadingBookings(false);

        // Load halls and hall types
        setIsLoadingHalls(true);
        const [hallsData, hallTypesData] = await Promise.all([
          getAllSanh(),
          getAllLoaiSanh(),
        ]);
        setHalls(hallsData);
        setHallTypes(hallTypesData);
        setIsLoadingHalls(false);

        // Load ca list
        setIsLoadingCa(true);
        const caData = await getAllCa();
        setCaList(caData);
        setIsLoadingCa(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi khi tải dữ liệu");
        setIsLoadingMenus(false);
        setIsLoadingServices(false);
        setIsLoadingDishes(false);
        setIsLoadingBookings(false);
        setIsLoadingHalls(false);
        setIsLoadingCa(false);
      }
    };

    loadData();
  }, []);

  // Convert API dishes data
  const dishes = apiDishes.map((dish) => ({
    id: dish.MaMonAn,
    name: dish.TenMonAn,
    categoryId: dish.MaLoaiMonAn,
    note: dish.GhiChu || "",
    dongia: dish.DonGia,
    imageUrl: dish.AnhURL,
  }));

  // Convert API service types and services
  const serviceTypes = apiServiceTypes.map((type) => ({
    MaLoaiDichVu: type.MaLoaiDichVu,
    TenLoaiDichVu: type.TenLoaiDichVu,
  }));

  const services = apiServices.map((service) => ({
    MaDichVu: service.MaDichVu,
    TenDichVu: service.TenDichVu,
    MaLoaiDichVu: service.MaLoaiDichVu,
    DonGia: service.DonGia,
    GhiChu: service.GhiChu || "",
    AnhURL: service.AnhURL,
  }));

  // Handlers
  const openAddModal = () => {
    setFormData({
      MaDatTiec: null,
      TenChuRe: "",
      TenCoDau: "",
      DienThoai: "",
      NgayDaiTiec: "",
      SoLuongBan: "",
      SoBanDuTru: "",
      TienDatCoc: "",
    });
    setIsEditMode(false);
    setSelectedHallType(null);
    setSelectedHall(null);
    setSelectedCa(null);
    setSelectedDishes([]);
    setSelectedMenu(null);
    setSelectedServices([]);
    setSelectedServiceType(null);
    setShowWizard(true);
  };

  const openEditModal = async (booking: IDatTiec) => {
    // Tìm sảnh được chọn và loại sảnh tương ứng
    const hall = halls.find((h) => h.MaSanh === booking.MaSanh);

    try {
      // Lấy thông tin chi tiết thực đơn của đặt tiệc
      if (booking.MaThucDon) {
        const menuDetail = await getThucDonById(booking.MaThucDon);
        // Cập nhật selectedDishes với danh sách món ăn từ thực đơn
        const dishIds =
          menuDetail.MonAnList?.map((dish: IMonAn) => dish.MaMonAn) || [];
        setSelectedDishes(dishIds);
        setSelectedMenu(booking.MaThucDon);
        setTempMenu({
          MaThucDon: menuDetail.MaThucDon,
          TenThucDon: menuDetail.TenThucDon,
          DonGiaHienTai: menuDetail.DonGiaHienTai,
          MonAnList: menuDetail.MonAnList || [],
        });
      }

      setFormData({
        MaDatTiec: booking.MaDatTiec,
        TenChuRe: booking.TenChuRe,
        TenCoDau: booking.TenCoDau,
        DienThoai: booking.DienThoai,
        NgayDaiTiec: new Date(booking.NgayDaiTiec).toISOString().split("T")[0],
        SoLuongBan: booking.SoLuongBan.toString(),
        SoBanDuTru: booking.SoBanDuTru.toString(),
        TienDatCoc: booking.TienDatCoc.toString(),
      });
      setIsEditMode(true);
      setSelectedHallType(hall ? hall.MaLoaiSanh : null);
      setSelectedHall(booking.MaSanh);
      setSelectedCa(booking.MaCa);
      setSelectedServices(booking.DichVus || []);
      setSelectedServiceType(null);
      setShowWizard(true);
    } catch (error) {
      console.error("Lỗi khi tải thông tin thực đơn:", error);
      alert("Có lỗi xảy ra khi tải thông tin thực đơn!");
    }
  };

  const closeWizard = () => {
    setShowWizard(false);
    setSelectedHallType(null);
    setSelectedHall(null);
    setSelectedCa(null);
    setSelectedDishes([]);
    setSelectedMenu(null);
    setSelectedServices([]);
    setSelectedServiceType(null);
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, message: "", onConfirm: () => {} });
  };

  const handleConfirm = () => {
    confirmationModal.onConfirm();
    closeConfirmationModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Reset selectedCa when changing NgayDaiTiec
    if (name === "NgayDaiTiec") {
      setSelectedCa(null);
    }

    // Validate số lượng bàn và bàn dự trữ
    if (["SoLuongBan", "SoBanDuTru"].includes(name)) {
      if (value && isNaN(Number(value))) {
        alert("Vui lòng nhập số hợp lệ");
        return;
      }
      if (Number(value) < 0) {
        alert("Giá trị không được âm");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    // Cho phép nhập tự do cho Tiền Đặt Cọc, validate sau
    if (name === "TienDatCoc") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý khi rời khỏi ô input
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "TienDatCoc") {
      if (value === "") {
        alert("Tiền đặt cọc không được để trống");
        setFormData((prev) => ({ ...prev, TienDatCoc: minDeposit.toString() }));
        return;
      }
      const newValue = Number(value);
      if (isNaN(newValue) || newValue < 0) {
        alert("Tiền đặt cọc phải là số không âm");
        setFormData((prev) => ({ ...prev, TienDatCoc: minDeposit.toString() }));
        return;
      }
      if (newValue < minDeposit) {
        alert(
          `Tiền đặt cọc phải ít nhất ${minDeposit.toLocaleString(
            "vi-VN"
          )} VNĐ (30% tổng tiền).`
        );
        setFormData((prev) => ({ ...prev, TienDatCoc: minDeposit.toString() }));
        return;
      }
    }
  };

  const handleMenuSelect = (menu: IThucDon) => {
    setSelectedMenu(menu.MaThucDon);
    const dishIds = (menu.MonAnList || []).map((dish) => dish.MaMonAn);
    setSelectedDishes(dishIds);
    setIsCustomMenu(false);
  };

  const handleServiceSelect = (
    service: IDichVu,
    checked: boolean,
    soLuong: number = 1
  ) => {
    setSelectedServices((prev) => {
      if (checked) {
        return [
          ...prev,
          {
            MaDichVu: service.MaDichVu,
            SoLuong: soLuong,
            DonGiaThoiDiemDat: service.DonGia,
          },
        ];
      } else {
        return prev.filter((s) => s.MaDichVu !== service.MaDichVu);
      }
    });
  };

  const handleDishSelect = (dishId: number, checked: boolean) => {
    const newSelectedDishes = checked
      ? [...selectedDishes, dishId]
      : selectedDishes.filter((id) => id !== dishId);

    setSelectedDishes(newSelectedDishes);

    // Cập nhật menu hiện tại với danh sách món ăn mới
    if (selectedMenu) {
      const currentMenu = apiMenus.find((m) => m.MaThucDon === selectedMenu);
      if (currentMenu) {
        const updatedMenu: IThucDon = {
          ...currentMenu,
          MonAnList: newSelectedDishes
            .map((id) => {
              const dish = apiDishes.find((d) => d.MaMonAn === id);
              return dish || null;
            })
            .filter((dish): dish is IMonAn => dish !== null),
        };

        // Cập nhật lại danh sách menu
        setApiMenus((prevMenus) =>
          prevMenus.map((menu) =>
            menu.MaThucDon === selectedMenu ? updatedMenu : menu
          )
        );
      }
    }
  };

  const checkIfCustomMenu = (selectedDishIds: number[]) => {
    const matchingMenu = apiMenus.find((menu) => {
      const menuDishIds = (menu.MonAnList || []).map((dish) => dish.MaMonAn);
      return (
        menuDishIds.length === selectedDishIds.length &&
        menuDishIds.every((id) => selectedDishIds.includes(id)) &&
        selectedDishIds.every((id) => menuDishIds.includes(id))
      );
    });
    setIsCustomMenu(!matchingMenu);
  };

  // Modify handleCreateCustomMenu
  const handleCreateCustomMenu = async () => {
    if (!customMenuName || selectedDishes.length === 0) {
      alert("Vui lòng nhập tên thực đơn và chọn ít nhất một món ăn");
      return;
    }

    // Calculate total price of selected dishes
    const totalPrice = selectedDishes.reduce((total, dishId) => {
      const dish = apiDishes.find((d) => d.MaMonAn === dishId);
      return total + (dish ? Number(dish.DonGia) : 0);
    }, 0);

    // Create temporary menu
    const newTempMenu = {
      MaThucDon: Date.now(), // Temporary ID
      TenThucDon: customMenuName,
      DonGiaHienTai: totalPrice,
      MonAnList: selectedDishes.map((id) => {
        const dish = apiDishes.find((d) => d.MaMonAn === id);
        return {
          MaMonAn: id,
          TenMonAn: dish?.TenMonAn || "",
          MaLoaiMonAn: dish?.MaLoaiMonAn || 0,
          TenLoaiMonAn: dish?.TenLoaiMonAn || "",
          DonGia: dish?.DonGia || 0,
          GhiChu: dish?.GhiChu,
          AnhURL: dish?.AnhURL,
        };
      }),
    };

    setTempMenu(newTempMenu);
    setShowCustomMenuModal(false);
    setCustomMenuName("");
    setIsCustomMenu(false);
  };

  // Modify handleSubmit to create the actual menu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dữ liệu
    const tienDatCocNumber = Number(formData.TienDatCoc);
    const soLuongBan = Number(formData.SoLuongBan);
    const soBanDuTru = Number(formData.SoBanDuTru);
    const tienDatCoc = Number(formData.TienDatCoc);

    // Additional date validation
    if (!formData.NgayDaiTiec) {
      alert("Vui lòng chọn ngày đặt tiệc");
      return;
    }

    if (isNaN(tienDatCocNumber) || tienDatCocNumber < 0) {
      alert("Tiền đặt cọc phải là số không âm");
      return;
    }
    if (isNaN(soLuongBan) || soLuongBan <= 0) {
      alert("Số lượng bàn phải là số dương");
      return;
    }
    if (isNaN(soBanDuTru) || soBanDuTru < 0) {
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
    const selectedHallData = halls.find((hall) => hall.MaSanh === selectedHall);
    if (
      selectedHallData &&
      soLuongBan + soBanDuTru > selectedHallData.SoLuongBanToiDa
    ) {
      alert("Tổng số bàn vượt quá sức chứa của sảnh");
      return;
    }
    if (isNaN(tienDatCoc) || tienDatCoc < minDeposit) {
      alert(
        `Tiền đặt cọc phải ít nhất ${minDeposit.toLocaleString(
          "vi-VN"
        )} VNĐ (30% tổng tiền).`
      );
      setFormData((prev) => ({ ...prev, TienDatCoc: minDeposit.toString() }));
      return;
    }

    try {
      let menuId = selectedMenu;

      // Tính tổng giá trị menu mới
      const menuPrice = selectedDishes.reduce((total, dishId) => {
        const dish = apiDishes.find((d) => d.MaMonAn === dishId);
        return total + (dish ? Number(dish.DonGia) : 0);
      }, 0);

      // Nếu đang trong chế độ sửa và có menu
      if (isEditMode && menuId) {
        // Cập nhật menu hiện tại với danh sách món ăn mới
        await updateThucDon(menuId, {
          tenThucDon:
            tempMenu?.TenThucDon ||
            `Menu tiệc cưới - ${formData.TenChuRe} & ${formData.TenCoDau}`,
          donGiaThoiDiemDat: menuPrice,
          donGiaHienTai: menuPrice,
          monAnIds: selectedDishes,
        });
      } else {
        // Tạo menu mới cho đặt tiệc này
        const newMenu = await createThucDon({
          tenThucDon: `Menu tiệc cưới - ${formData.TenChuRe} & ${formData.TenCoDau}`,
          donGiaThoiDiemDat: menuPrice,
          donGiaHienTai: menuPrice,
          monAnIds: selectedDishes,
        });
        menuId = newMenu.MaThucDon;
      }

      // Ensure menuId is a number
      if (!menuId) {
        throw new Error("Không thể tạo hoặc cập nhật thực đơn");
      }

      // Prepare booking data
      const datTiecData = {
        tenChuRe: formData.TenChuRe,
        tenCoDau: formData.TenCoDau,
        dienThoai: formData.DienThoai,
        ngayDaiTiec: new Date(formData.NgayDaiTiec).toISOString(),
        maCa: selectedCa || 1,
        maSanh: selectedHall,
        soLuongBan: Number(formData.SoLuongBan),
        soBanDuTru: Number(formData.SoBanDuTru),
        tienDatCoc: Number(formData.TienDatCoc),
        maThucDon: menuId, // Now menuId is guaranteed to be a number
        dichVus: selectedServices.map((service) => ({
          maDichVu: service.MaDichVu,
          soLuong: service.SoLuong,
          donGiaThoiDiemDat: service.DonGiaThoiDiemDat,
        })),
      };

      setConfirmationModal({
        isOpen: true,
        message: isEditMode
          ? "Bạn có chắc chắn muốn cập nhật đặt tiệc này?"
          : "Bạn có chắc chắn muốn thêm đặt tiệc này?",
        onConfirm: async () => {
          try {
            let newBookingId;
            if (isEditMode && formData.MaDatTiec) {
              const updatedBooking = await updateDatTiec(
                formData.MaDatTiec,
                datTiecData
              );
              setBookings((prev) =>
                prev.map((booking) =>
                  booking.MaDatTiec === formData.MaDatTiec
                    ? {
                        ...booking,
                        ...updatedBooking,
                        MonAns: selectedDishes,
                        DichVus: selectedServices,
                      }
                    : booking
                )
              );
              newBookingId = formData.MaDatTiec;
            } else {
              const newBooking = await createDatTiec(datTiecData);
              setBookings((prev) => [
                ...prev,
                {
                  ...newBooking,
                  MonAns: selectedDishes,
                  DichVus: selectedServices,
                },
              ]);
              newBookingId = newBooking.MaDatTiec;
            }

            // Create invoice
            const tongTienBan =
              selectedDishes.reduce((total, dishId) => {
                const dish = dishes.find((d) => d.id === dishId);
                return total + (dish && dish.dongia ? Number(dish.dongia) : 0);
              }, 0) *
              ((Number(formData.SoLuongBan) || 0) +
                (Number(formData.SoBanDuTru) || 0));

            const tongTienDichVu = selectedServices.reduce(
              (total, service) =>
                total +
                (Number(service.SoLuong) || 1) *
                  (Number(service.DonGiaThoiDiemDat) || 0),
              0
            );

            const tongTienHoaDon = tongTienBan + tongTienDichVu;
            const tienDatCoc = Number(formData.TienDatCoc) || 0;
            const tongTienConLai = tongTienHoaDon - tienDatCoc;

            const hoaDonData = {
              MaDatTiec: newBookingId,
              NgayThanhToan: new Date().toISOString().split("T")[0],
              TongTienBan: tongTienBan,
              TongTienDichVu: tongTienDichVu,
              TongTienHoaDon: tongTienHoaDon,
              ApDungQuyDinhPhat: false,
              PhanTramPhatMotNgay: 0,
              TongTienPhat: 0,
              TongTienConLai: tongTienConLai,
              TrangThai: 0,
            };

            await createHoaDon(hoaDonData);
            closeWizard();
            alert(isEditMode ? "Cập nhật thành công!" : "Thêm mới thành công!");
          } catch (error: any) {
            alert("Lỗi: " + (error.message || "Không thể lưu đặt tiệc"));
          }
        },
      });
    } catch (error) {
      alert("Lỗi: " + (error as Error).message);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa đặt tiệc này?",
      onConfirm: async () => {
        try {
          await deleteDatTiec(id);
          setBookings((prev) =>
            prev.filter((booking) => booking.MaDatTiec !== id)
          );
        } catch (error: any) {
          alert("Lỗi: " + (error.message || "Không thể xóa đặt tiệc"));
        }
      },
    });
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.TenChuRe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.TenCoDau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.DienThoai.includes(searchTerm)
  );

  // Add function to get hall name
  const getHallName = (maSanh: number) => {
    const hall = halls.find((h) => h.MaSanh === maSanh);
    return hall?.TenSanh || "Không xác định";
  };

  // Add function to get ca name
  const getCaName = (maCa: number) => {
    const ca = caList.find((c) => c.MaCa === maCa);
    return ca?.TenCa || "Không xác định";
  };

  // Sửa lại hàm getMenuDetails
  const getMenuDetails = async (maThucDon: number) => {
    // Đầu tiên tìm trong danh sách thực đơn mẫu
    const menuFromList = apiMenus.find((m) => m.MaThucDon === maThucDon);
    if (menuFromList) {
      return menuFromList;
    }

    // Nếu không tìm thấy trong danh sách mẫu, gọi API để lấy thông tin
    try {
      const menuDetail = await getThucDonById(maThucDon);
      // Đảm bảo MonAnList được trả về
      if (menuDetail && !menuDetail.MonAnList) {
        // Nếu không có MonAnList, thử lấy lại thông tin chi tiết
        const fullMenuDetail = await getThucDonById(maThucDon);
        return fullMenuDetail;
      }
      return menuDetail;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin thực đơn:", error);
      return null;
    }
  };

  // Add function to handle print
  const handlePrint = () => {
    const printContent = document.getElementById("printSection");
    const originalContents = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      // Re-render the component after printing
      setShowDetailModal(true);
    }
  };

  // Thêm useEffect để lấy thông tin thực đơn khi mở modal chi tiết
  useEffect(() => {
    const loadMenuDetails = async () => {
      if (selectedBookingDetail?.MaThucDon) {
        const details = await getMenuDetails(selectedBookingDetail.MaThucDon);
        console.log("Menu Details:", details); // Thêm log để debug
        setMenuDetails(details);
      }
    };

    if (showDetailModal) {
      loadMenuDetails();
    }
  }, [showDetailModal, selectedBookingDetail]);

  // Thêm hàm mới để cập nhật món ăn trong menu
  const handleUpdateMenuDishes = async (
    menuId: number,
    newDishIds: number[]
  ) => {
    try {
      // Calculate total price
      const totalPrice = newDishIds.reduce((total, dishId) => {
        const dish = apiDishes.find((d) => d.MaMonAn === dishId);
        return total + (dish ? Number(dish.DonGia) : 0);
      }, 0);

      // Cập nhật menu với danh sách món ăn mới
      const updatedMenu = await updateThucDon(menuId, {
        tenThucDon:
          apiMenus.find((m) => m.MaThucDon === menuId)?.TenThucDon || "",
        donGiaThoiDiemDat: totalPrice,
        donGiaHienTai: totalPrice,
        monAnIds: newDishIds,
      });

      // Cập nhật state
      setSelectedDishes(newDishIds);

      // Cập nhật lại danh sách menu
      setApiMenus((prev) =>
        prev.map((menu) =>
          menu.MaThucDon === menuId
            ? {
                ...menu,
                DonGiaHienTai: totalPrice,
                MonAnList: newDishIds
                  .map((id) => apiDishes.find((dish) => dish.MaMonAn === id))
                  .filter((dish): dish is IMonAn => dish !== undefined),
              }
            : menu
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật menu:", error);
      alert("Có lỗi xảy ra khi cập nhật menu!");
    }
  };

  // Loading UI
  if (
    isLoadingMenus ||
    isLoadingServices ||
    isLoadingDishes ||
    isLoadingBookings ||
    isLoadingHalls ||
    isLoadingCa
  ) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001F3F] mx-auto mb-4"></div>
          <p className="text-[#001F3F]">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#D4B2B2]">Lỗi: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#001F3F] text-white rounded hover:bg-[#003366] transition-colors duration-300"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Sửa lại phần hiển thị menu trong chế độ sửa
  const renderEditModeMenu = () => {
    if (!selectedMenu) return null;

    const menu = tempMenu || apiMenus.find((m) => m.MaThucDon === selectedMenu);
    if (!menu) return null;

    const totalPrice = selectedDishes.reduce((total, dishId) => {
      const dish = apiDishes.find((d) => d.MaMonAn === dishId);
      return total + (dish ? Number(dish.DonGia) : 0);
    }, 0);

    return (
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-[#001F3F] mb-4">
          Thực Đơn Hiện Tại
        </h4>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h5 className="text-lg font-medium text-[#001F3F] mb-2">
              {menu.TenThucDon}
            </h5>
            <p className="text-sm text-[#001F3F] mb-2">
              Tổng đơn giá hiện tại: {formatVND(totalPrice)}
            </p>
            <div className="mt-6">
              <h5 className="text-sm font-medium text-[#001F3F] mb-3">
                Danh sách món ăn
              </h5>
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                {apiDishTypes.map((category) => (
                  <div key={category.MaLoaiMonAn} className="mb-4">
                    <h6 className="text-sm font-semibold text-[#001F3F] mb-2">
                      {category.TenLoaiMonAn}
                    </h6>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {apiDishes
                        .filter(
                          (dish) => dish.MaLoaiMonAn === category.MaLoaiMonAn
                        )
                        .map((dish) => (
                          <div
                            key={dish.MaMonAn}
                            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDishes.includes(dish.MaMonAn)}
                              onChange={(e) => {
                                const newSelectedDishes = e.target.checked
                                  ? [...selectedDishes, dish.MaMonAn]
                                  : selectedDishes.filter(
                                      (id) => id !== dish.MaMonAn
                                    );
                                setSelectedDishes(newSelectedDishes);

                                // Update temp menu
                                if (tempMenu) {
                                  const newTotalPrice =
                                    newSelectedDishes.reduce(
                                      (total, dishId) => {
                                        const dish = apiDishes.find(
                                          (d) => d.MaMonAn === dishId
                                        );
                                        return (
                                          total +
                                          (dish ? Number(dish.DonGia) : 0)
                                        );
                                      },
                                      0
                                    );

                                  setTempMenu({
                                    ...tempMenu,
                                    DonGiaHienTai: newTotalPrice,
                                    MonAnList: newSelectedDishes
                                      .map((id) => {
                                        const dish = apiDishes.find(
                                          (d) => d.MaMonAn === id
                                        );
                                        return dish || null;
                                      })
                                      .filter(
                                        (dish): dish is IMonAn => dish !== null
                                      ),
                                  });
                                }
                              }}
                              className="h-4 w-4 text-[#B8860B] rounded border-gray-300 focus:ring-[#E6C3C3]"
                            />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-[#001F3F]">
                                {dish.TenMonAn}
                              </span>
                              <p className="text-xs text-gray-600">
                                {dish.GhiChu || "Không có ghi chú"}
                              </p>
                              <p className="text-xs text-[#B8860B] mt-1">
                                {formatVND(dish.DonGia)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sửa lại renderMenuSection để thêm phần menu đã chọn
  const renderMenuSection = () => (
    <>
      {/* Menu Hài Hòa */}
      <div className="mb-6">
        <h5 className="text-sm font-medium text-[#001F3F] mb-3 flex items-center">
          <span className="text-2xl mr-2">💝</span>
          Menu Hài Hòa (1 - 2 triệu)
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiMenus
            .filter((menu) => {
              const totalPrice = (menu.MonAnList || []).reduce(
                (total, dish) => total + Number(dish.DonGia || 0),
                0
              );
              return totalPrice >= 1000000 && totalPrice <= 2000000;
            })
            .map((menu) => renderMenuCard(menu))}
        </div>
      </div>

      {/* Menu Ấn Tượng */}
      <div className="mb-6">
        <h5 className="text-sm font-medium text-[#001F3F] mb-3 flex items-center">
          <span className="text-2xl mr-2">✨</span>
          Menu Ấn Tượng (2 - 4 triệu)
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiMenus
            .filter((menu) => {
              const totalPrice = (menu.MonAnList || []).reduce(
                (total, dish) => total + Number(dish.DonGia || 0),
                0
              );
              return totalPrice > 2000000 && totalPrice <= 4000000;
            })
            .map((menu) => renderMenuCard(menu))}
        </div>
      </div>

      {/* Menu Sang Trọng */}
      <div className="mb-6">
        <h5 className="text-sm font-medium text-[#001F3F] mb-3 flex items-center">
          <span className="text-2xl mr-2">👑</span>
          Menu Sang Trọng (4 - 6 triệu)
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiMenus
            .filter((menu) => {
              const totalPrice = (menu.MonAnList || []).reduce(
                (total, dish) => total + Number(dish.DonGia || 0),
                0
              );
              return totalPrice > 4000000 && totalPrice <= 6000000;
            })
            .map((menu) => renderMenuCard(menu))}
        </div>
      </div>

      {/* Menu Đã Chọn */}
      {selectedMenu && (
        <div className="mb-6">
          <h5 className="text-sm font-medium text-[#001F3F] mb-3 flex items-center">
            <span className="text-2xl mr-2">🎯</span>
            Menu Đã Chọn
          </h5>
          <div className="grid grid-cols-1 gap-6">
            {renderSelectedMenuDetails()}
          </div>
        </div>
      )}
    </>
  );

  // Thêm hàm render menu card để tái sử dụng
  const renderMenuCard = (menu: IThucDon) => {
    const menuDishes = menu.MonAnList || [];
    const totalPrice = menuDishes.reduce(
      (total, dish) => total + Number(dish.DonGia || 0),
      0
    );
    const firstDish = menuDishes[0];

    return (
      <div
        key={menu.MaThucDon}
        onClick={() => handleMenuSelect(menu)}
        className={`rounded-lg shadow-md cursor-pointer border transition-all duration-300 hover:scale-105 ${
          selectedMenu === menu.MaThucDon
            ? "bg-[#F5E6E8] border-[#D4B2B2] shadow-lg"
            : "bg-white border-gray-200 hover:shadow-lg hover:border-[#B8860B]"
        }`}
      >
        <div className="h-48 overflow-hidden rounded-t-lg">
          {firstDish?.AnhURL ? (
            <img
              src={firstDish.AnhURL}
              alt={menu.TenThucDon}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/300x200?text=Không+có+ảnh";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Không có ảnh</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h5 className="text-lg font-medium text-[#001F3F] mb-2">
            {menu.TenThucDon}
          </h5>
          <p className="text-sm text-[#001F3F] mb-2 line-clamp-2">
            Món ăn: {menuDishes.map((dish) => dish.TenMonAn).join(", ")}
          </p>
          <p className="text-sm text-[#001F3F] mb-2">
            Tổng đơn giá: {formatVND(totalPrice)}
          </p>
          {menu.GhiChu && (
            <p className="text-sm text-[#001F3F] italic">
              Ghi chú: {menu.GhiChu}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Thêm hàm render chi tiết menu đã chọn
  const renderSelectedMenuDetails = () => {
    const menu = apiMenus.find((m) => m.MaThucDon === selectedMenu);
    if (!menu) return null;

    const menuDishes = menu.MonAnList || [];
    const totalPrice = menuDishes.reduce(
      (total, dish) => total + Number(dish.DonGia || 0),
      0
    );

    return (
      <>
        {renderMenuCard(menu)}
        <div className="mt-6">
          <h5 className="text-sm font-medium text-[#001F3F] mb-3">
            Tùy chỉnh món ăn trong thực đơn
          </h5>
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            {apiDishTypes.map((category) => (
              <div key={category.MaLoaiMonAn} className="mb-4">
                <h6 className="text-sm font-semibold text-[#001F3F] mb-2">
                  {category.TenLoaiMonAn}
                </h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {apiDishes
                    .filter((dish) => dish.MaLoaiMonAn === category.MaLoaiMonAn)
                    .map((dish) => (
                      <div
                        key={dish.MaMonAn}
                        className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDishes.includes(dish.MaMonAn)}
                          onChange={(e) =>
                            handleDishSelect(dish.MaMonAn, e.target.checked)
                          }
                          className="h-4 w-4 text-[#B8860B] rounded border-gray-300 focus:ring-[#E6C3C3]"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-[#001F3F]">
                            {dish.TenMonAn}
                          </span>
                          <p className="text-xs text-gray-600">
                            {dish.GhiChu || "Không có ghi chú"}
                          </p>
                          <p className="text-xs text-[#B8860B] mt-1">
                            {formatVND(dish.DonGia)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showWizard ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001F3F] mb-4">
                Quản Lý Đặt Tiệc Cưới
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên chú rể, cô dâu hoặc số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
                />
                <button
                  onClick={openAddModal}
                  className="w-full sm:w-auto bg-[#001F3F] text-white py-2 px-4 rounded hover:bg-[#003366] transition-colors duration-300"
                >
                  Thêm Đặt Tiệc
                </button>
              </div>
            </div>

            <div>
              <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#F8F9FA]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                        Tên Chú Rể
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                        Tên Cô Dâu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                        Điện Thoại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                        Ngày Đặt Tiệc
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                        Tiền Đặt Cọc (VNĐ)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                        Số Lượng Bàn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                        Bàn Dự Trữ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                        Hành Động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.MaDatTiec}
                        className="hover:bg-[#F8F9FA] transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#001F3F]">
                          {booking.TenChuRe}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#001F3F]">
                          {booking.TenCoDau}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#001F3F]">
                          {booking.DienThoai}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#001F3F]">
                          {new Date(booking.NgayDaiTiec).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#001F3F]">
                          {formatVND(booking.TienDatCoc)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#001F3F]">
                          {booking.SoLuongBan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#001F3F]">
                          {booking.SoBanDuTru}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditModal(booking)}
                            className="text-[#B8860B] hover:text-[#8B6914] mr-4"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(booking.MaDatTiec)}
                            className="text-[#D4B2B2] hover:text-[#C49898] mr-4"
                          >
                            Xóa
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBookingDetail(booking);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
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
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.MaDatTiec}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-100"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-[#001F3F]">
                          {booking.TenChuRe} & {booking.TenCoDau}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(booking)}
                            className="text-[#B8860B] hover:text-[#8B6914] text-sm"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(booking.MaDatTiec)}
                            className="text-[#D4B2B2] hover:text-[#C49898] text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-[#001F3F]">
                        Điện thoại: {booking.DienThoai}
                      </p>
                      <p className="text-sm text-[#001F3F]">
                        Ngày đặt tiệc:{" "}
                        {new Date(booking.NgayDaiTiec).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                      <p className="text-sm text-[#001F3F]">
                        Tiền đặt cọc: {formatVND(booking.TienDatCoc)}
                      </p>
                      <p className="text-sm text-[#001F3F]">
                        Số lượng bàn: {booking.SoLuongBan} (Dự trữ:{" "}
                        {booking.SoBanDuTru})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-[#001F3F] mb-6">
              {isEditMode ? "Sửa Đặt Tiệc" : "Thêm Đặt Tiệc"}
            </h2>

            {/* Thông tin cơ bản */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-[#001F3F] mb-4">
                Thông Tin Cơ Bản
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#001F3F]">
                    Tên Chú Rể
                  </label>
                  <input
                    type="text"
                    name="TenChuRe"
                    value={formData.TenChuRe}
                    onChange={handleInputChange}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#001F3F]">
                    Tên Cô Dâu
                  </label>
                  <input
                    type="text"
                    name="TenCoDau"
                    value={formData.TenCoDau}
                    onChange={handleInputChange}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#001F3F]">
                    Điện Thoại
                  </label>
                  <input
                    type="text"
                    name="DienThoai"
                    value={formData.DienThoai}
                    onChange={handleInputChange}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#001F3F]">
                    Ngày Đặt Tiệc
                  </label>
                  <input
                    type="date"
                    name="NgayDaiTiec"
                    value={formData.NgayDaiTiec}
                    onChange={handleInputChange}
                    className="py-2 px-3 mt-1 w-full rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Chọn sảnh */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-[#001F3F] mb-4">
                Chọn Sảnh
              </h4>

              {/* Chọn loại sảnh */}
              <div className="mb-6">
                <h5 className="text-sm font-medium text-[#001F3F] mb-3">
                  Chọn Loại Sảnh
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hallTypes.map((hallType) => (
                    <div
                      key={hallType.MaLoaiSanh}
                      onClick={() => {
                        setSelectedHallType(hallType.MaLoaiSanh);
                        setSelectedHall(null); // Reset selected hall when changing hall type
                      }}
                      className={`rounded-lg shadow-md cursor-pointer border transition-all duration-300 ${
                        selectedHallType === hallType.MaLoaiSanh
                          ? "bg-[#F5E6E8] border-[#D4B2B2] shadow-lg"
                          : "bg-white border-gray-200 hover:shadow-lg hover:border-[#B8860B]"
                      }`}
                    >
                      <div className="p-4">
                        <h5
                          className={`text-lg font-medium text-center ${
                            selectedHallType === hallType.MaLoaiSanh
                              ? "text-[#001F3F]"
                              : "text-[#2C3E50]"
                          }`}
                        >
                          {hallType.TenLoaiSanh}
                        </h5>
                        <p className="text-sm text-[#001F3F] text-center">
                          Đơn giá tối thiểu:{" "}
                          {formatVND(hallType.DonGiaBanToiThieu)}/bàn
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hiển thị sảnh theo loại sảnh đã chọn */}
              {selectedHallType && (
                <div className="mt-6">
                  <h5 className="text-sm font-medium text-[#001F3F] mb-3">
                    Chọn Sảnh thuộc{" "}
                    {
                      hallTypes.find(
                        (type) => type.MaLoaiSanh === selectedHallType
                      )?.TenLoaiSanh
                    }
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {halls
                      .filter((hall) => hall.MaLoaiSanh === selectedHallType)
                      .map((hall) => (
                        <div
                          key={hall.MaSanh}
                          onClick={() => setSelectedHall(hall.MaSanh)}
                          className={`rounded-lg shadow-md cursor-pointer border transition-all duration-300 ${
                            selectedHall === hall.MaSanh
                              ? "bg-[#F5E6E8] border-[#D4B2B2] shadow-lg"
                              : "bg-white border-gray-200 hover:shadow-lg hover:border-[#B8860B]"
                          }`}
                        >
                          <div className="h-48 overflow-hidden rounded-t-lg">
                            <img
                              src={
                                hall.AnhURL ||
                                "https://via.placeholder.com/300x200"
                              }
                              alt={hall.TenSanh}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h5 className="text-lg font-medium text-[#001F3F] mb-2">
                              {hall.TenSanh}
                            </h5>
                            <p className="text-sm text-[#001F3F] mb-2">
                              Sức chứa: {hall.SoLuongBanToiDa} bàn
                            </p>
                            <p className="text-sm text-[#001F3F]">
                              {hall.GhiChu}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sau phần chọn sảnh, thêm phần chọn ca */}
            {selectedHall && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-[#001F3F] mb-4">
                  Chọn Ca
                </h4>

                {formData.NgayDaiTiec ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {caList.map((ca) => {
                      // Kiểm tra xem ca này đã được đặt chưa
                      const isBooked = bookings.some(
                        (booking) =>
                          new Date(booking.NgayDaiTiec)
                            .toISOString()
                            .split("T")[0] === formData.NgayDaiTiec &&
                          booking.MaCa === ca.MaCa &&
                          booking.MaSanh === selectedHall &&
                          (!isEditMode ||
                            booking.MaDatTiec !== formData.MaDatTiec)
                      );

                      // Xác định màu sắc và icon dựa vào MaCa
                      let bgColor, icon, textColor;
                      switch (ca.MaCa) {
                        case 1: // Trưa
                          bgColor = "bg-amber-50";
                          icon = "🌞";
                          textColor = "text-amber-700";
                          break;
                        case 2: // Tối
                          bgColor = "bg-indigo-50";
                          icon = "🌆";
                          textColor = "text-indigo-700";
                          break;
                        case 3: // Sáng
                          bgColor = "bg-yellow-50";
                          icon = "☀️";
                          textColor = "text-yellow-700";
                          break;
                        case 4: // Chiều
                          bgColor = "bg-orange-50";
                          icon = "🌤️";
                          textColor = "text-orange-700";
                          break;
                        case 5: // Đêm
                          bgColor = "bg-blue-50";
                          icon = "🌙";
                          textColor = "text-blue-700";
                          break;
                        default:
                          bgColor = "bg-gray-50";
                          icon = "📅";
                          textColor = "text-gray-700";
                      }

                      return (
                        <div
                          key={ca.MaCa}
                          onClick={() => !isBooked && setSelectedCa(ca.MaCa)}
                          className={`
                            p-6 rounded-lg border transition-all duration-300 cursor-pointer relative
                            ${
                              isBooked
                                ? "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed"
                                : selectedCa === ca.MaCa
                                ? `${bgColor} border-2 border-[#B8860B] shadow-lg`
                                : `${bgColor} border-transparent hover:shadow-lg hover:scale-105`
                            }
                          `}
                        >
                          <div className="flex flex-col items-center space-y-3">
                            <span
                              className="text-3xl"
                              role="img"
                              aria-label={ca.TenCa}
                            >
                              {icon}
                            </span>
                            <h5
                              className={`text-lg font-medium text-center ${textColor}`}
                            >
                              {ca.TenCa}
                            </h5>
                            {isBooked && (
                              <p className="text-sm text-red-500 text-center mt-2 absolute bottom-2 left-0 right-0">
                                Đã đặt
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 p-4 border border-dashed rounded-lg">
                    Vui lòng chọn ngày đặt tiệc trước khi chọn ca
                  </div>
                )}
              </div>
            )}

            {/* Chọn thực đơn */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-[#001F3F] mb-4">
                {isEditMode ? "Thực Đơn Đã Chọn" : "Chọn Thực Đơn"}
              </h4>

              {isEditMode ? renderEditModeMenu() : renderMenuSection()}
            </div>

            <div className="mb-6">
              <h5 className="text-sm font-medium text-[#001F3F] mb-3">
                Tùy Chỉnh Thực Đơn
              </h5>
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                {apiDishTypes.map((category) => (
                  <div key={category.MaLoaiMonAn} className="mb-4">
                    <h6 className="text-sm font-semibold text-[#001F3F] mb-2">
                      {category.TenLoaiMonAn}
                    </h6>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {apiDishes
                        .filter(
                          (dish) => dish.MaLoaiMonAn === category.MaLoaiMonAn
                        )
                        .map((dish) => (
                          <div
                            key={dish.MaMonAn}
                            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDishes.includes(dish.MaMonAn)}
                              onChange={(e) => {
                                const newSelectedDishes = e.target.checked
                                  ? [...selectedDishes, dish.MaMonAn]
                                  : selectedDishes.filter(
                                      (id) => id !== dish.MaMonAn
                                    );
                                setSelectedDishes(newSelectedDishes);
                                checkIfCustomMenu(newSelectedDishes);

                                // Update temp menu if exists
                                if (tempMenu) {
                                  const totalPrice = newSelectedDishes.reduce(
                                    (total, dishId) => {
                                      const dish = apiDishes.find(
                                        (d) => d.MaMonAn === dishId
                                      );
                                      return (
                                        total + (dish ? Number(dish.DonGia) : 0)
                                      );
                                    },
                                    0
                                  );

                                  setTempMenu({
                                    ...tempMenu,
                                    DonGiaHienTai: totalPrice,
                                    MonAnList: newSelectedDishes.map((id) => {
                                      const dish = apiDishes.find(
                                        (d) => d.MaMonAn === id
                                      );
                                      return {
                                        MaMonAn: id,
                                        TenMonAn: dish?.TenMonAn || "",
                                        MaLoaiMonAn: dish?.MaLoaiMonAn || 0,
                                        TenLoaiMonAn: dish?.TenLoaiMonAn || "",
                                        DonGia: dish?.DonGia || 0,
                                        GhiChu: dish?.GhiChu,
                                        AnhURL: dish?.AnhURL,
                                      };
                                    }),
                                  });
                                }
                              }}
                              className="h-4 w-4 mt-1 text-[#B8860B] rounded"
                            />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-[#001F3F]">
                                {dish.TenMonAn}
                              </span>
                              <p className="text-xs text-[#001F3F] mt-1">
                                {dish.GhiChu || "Không có ghi chú"}
                              </p>
                              <p className="text-xs text-[#B8860B] mt-1">
                                {formatVND(dish.DonGia)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-[#001F3F] mb-4">
                Chọn Dịch Vụ
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {serviceTypes.map((type) => (
                  <div
                    key={type.MaLoaiDichVu}
                    onClick={() => setSelectedServiceType(type.MaLoaiDichVu)}
                    className={`rounded-lg shadow-md cursor-pointer border transition-all duration-300 ${
                      selectedServiceType === type.MaLoaiDichVu
                        ? "bg-[#F5E6E8] border-[#D4B2B2] shadow-lg"
                        : "bg-white border-gray-200 hover:shadow-lg hover:border-[#B8860B]"
                    }`}
                  >
                    <div className="p-6">
                      <h5
                        className={`text-lg font-medium text-center ${
                          selectedServiceType === type.MaLoaiDichVu
                            ? "text-[#001F3F]"
                            : "text-[#2C3E50]"
                        }`}
                      >
                        {type.TenLoaiDichVu}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>

              {selectedServiceType && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-[#001F3F] mb-3">
                    Dịch Vụ thuộc{" "}
                    <span className="text-[#B8860B]">
                      {
                        serviceTypes.find(
                          (type) => type.MaLoaiDichVu === selectedServiceType
                        )?.TenLoaiDichVu
                      }
                    </span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services
                      .filter(
                        (service) =>
                          service.MaLoaiDichVu === selectedServiceType
                      )
                      .map((service) => (
                        <div
                          key={service.MaDichVu}
                          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="h-48 overflow-hidden">
                            <img
                              src={
                                service.AnhURL ||
                                "https://via.placeholder.com/300x200?text=Không+có+ảnh"
                              }
                              alt={service.TenDichVu}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/300x200?text=Không+có+ảnh";
                              }}
                            />
                          </div>
                          <div className="p-4 bg-[#FAFAFA]">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-[#001F3F]">
                                {service.TenDichVu}
                              </span>
                              <input
                                type="checkbox"
                                checked={selectedServices.some(
                                  (s) => s.MaDichVu === service.MaDichVu
                                )}
                                onChange={(e) =>
                                  handleServiceSelect(service, e.target.checked)
                                }
                                className="h-4 w-4 text-[#B8860B] rounded border-gray-300 focus:ring-[#E6C3C3]"
                              />
                            </div>
                            <p className="text-xs text-gray-600">
                              {service.GhiChu || "Không có ghi chú"}
                            </p>
                            <p className="text-xs text-[#B8860B] mt-1 font-medium">
                              {formatVND(service.DonGia)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {selectedServices.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-[#001F3F] mb-3">
                    Dịch Vụ Đã Chọn
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedServices.map((service) => {
                      const serviceInfo = services.find(
                        (s) => s.MaDichVu === service.MaDichVu
                      );
                      return (
                        <div
                          key={service.MaDichVu}
                          className="bg-white rounded-lg shadow-sm p-4"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-[#001F3F]">
                              {serviceInfo?.TenDichVu}
                            </span>
                            <button
                              onClick={() =>
                                handleServiceSelect(serviceInfo!, false)
                              }
                              className="text-[#B8860B] hover:text-[#8B6914]"
                            >
                              Xóa
                            </button>
                          </div>
                          <p className="text-xs text-[#001F3F]">
                            Số lượng: {service.SoLuong}
                          </p>
                          <p className="text-xs text-[#B8860B]">
                            {service.DonGiaThoiDiemDat.toLocaleString("vi-VN")}{" "}
                            VNĐ
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-[#001F3F] mb-4">
                Tổng Kết
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-[#001F3F] mb-2">
                  Tổng tiền thực đơn:{" "}
                  {formatVND(
                    selectedDishes.reduce((total, dishId) => {
                      const dish = dishes.find((d) => d.id === dishId);
                      return total + (dish ? Number(dish.dongia) || 0 : 0);
                    }, 0) *
                      ((Number(formData.SoLuongBan) || 0) +
                        (Number(formData.SoBanDuTru) || 0))
                  )}
                </p>
                <p className="text-sm text-[#001F3F] mb-2">
                  Tổng tiền dịch vụ:{" "}
                  {formatVND(
                    selectedServices.reduce(
                      (total, service) =>
                        total +
                        (Number(service.DonGiaThoiDiemDat) || 0) *
                          (Number(service.SoLuong) || 0),
                      0
                    )
                  )}
                </p>
                <p className="text-lg font-semibold text-[#B8860B]">
                  Tổng cộng: {formatVND(totalCost)}
                </p>
                <p className="text-sm text-[#001F3F] mt-2">
                  Tiền đặt cọc tối thiểu (30%): {formatVND(minDeposit)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#001F3F]">
                    Số Lượng Bàn
                  </label>
                  <input
                    type="number"
                    name="SoLuongBan"
                    value={formData.SoLuongBan}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="py-2 px-3 mt-1 border border-gray-200 rounded-md w-full"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#001F3F]">
                    Số Bàn Dự Trữ
                  </label>
                  <input
                    type="number"
                    name="SoBanDuTru"
                    value={formData.SoBanDuTru}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="py-2 px-3 mt-1 border border-gray-200 rounded-md w-full"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#001F3F]">
                    Tiền Đặt Cọc
                  </label>
                  <input
                    type="number"
                    name="TienDatCoc"
                    value={formData.TienDatCoc}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="py-2 px-3 mt-1 border border-gray-200 rounded-md w-full"
                    required
                    min={minDeposit}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={closeWizard}
                className="bg-gray-100 text-[#001F3F] rounded-md py-2 px-4 hover:bg-gray-200 transition-colors duration-300"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#001F3F] text-white rounded-md py-2 px-4 hover:bg-[#003366] transition-colors duration-300"
                disabled={!selectedHall || selectedDishes.length === 0}
              >
                {isEditMode ? "Cập Nhật" : "Thêm"}
              </button>
            </div>
          </div>
        )}
        {confirmationModal.isOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
                Xác nhận
              </h3>
              <p className="text-gray-600 mb-6">{confirmationModal.message}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeConfirmationModal}
                  className="bg-gray-100 text-[#001F3F] rounded-md py-2 px-4 hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-[#D4B2B2] text-white rounded-md py-2 px-4 hover:bg-[#C49898]"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
        {showCustomMenuModal && (
          <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
                Tạo thực đơn tự chọn
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#001F3F] mb-2">
                  Tên thực đơn
                </label>
                <input
                  type="text"
                  value={customMenuName}
                  onChange={(e) => setCustomMenuName(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#E6C3C3]"
                  placeholder="Nhập tên thực đơn..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCustomMenuModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateCustomMenu}
                  className="px-4 py-2 bg-[#001F3F] text-white rounded hover:bg-[#003366]"
                >
                  Tạo thực đơn
                </button>
              </div>
            </div>
          </div>
        )}
        {showDetailModal && selectedBookingDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-6 overflow-auto">
            <div className="bg-white mx-auto my-6 w-[210mm] min-h-[297mm] shadow-lg relative print:shadow-none print:my-0">
              <div className="p-8" id="printSection">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#001F3F] mb-2">
                    CHI TIẾT TIỆC CƯỚI
                  </h2>
                  <p className="text-sm text-gray-500">
                    Mã đặt tiệc: {selectedBookingDetail.MaDatTiec}
                  </p>
                </div>

                {/* Main content */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
                      Thông tin cơ bản
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Chú rể:</span>{" "}
                        {selectedBookingDetail.TenChuRe}
                      </p>
                      <p>
                        <span className="font-medium">Cô dâu:</span>{" "}
                        {selectedBookingDetail.TenCoDau}
                      </p>
                      <p>
                        <span className="font-medium">Điện thoại:</span>{" "}
                        {selectedBookingDetail.DienThoai}
                      </p>
                      <p>
                        <span className="font-medium">Ngày đặt tiệc:</span>{" "}
                        {new Date(
                          selectedBookingDetail.NgayDaiTiec
                        ).toLocaleDateString("vi-VN")}
                      </p>
                      <p>
                        <span className="font-medium">Ca:</span>{" "}
                        {getCaName(selectedBookingDetail.MaCa)}
                      </p>
                      <p>
                        <span className="font-medium">Sảnh:</span>{" "}
                        {getHallName(selectedBookingDetail.MaSanh)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
                      Thông tin bàn tiệc
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Số lượng bàn:</span>{" "}
                        {selectedBookingDetail.SoLuongBan}
                      </p>
                      <p>
                        <span className="font-medium">Số bàn dự trữ:</span>{" "}
                        {selectedBookingDetail.SoBanDuTru}
                      </p>
                      <p>
                        <span className="font-medium">Tiền đặt cọc:</span>{" "}
                        {formatVND(selectedBookingDetail.TienDatCoc)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
                    Thực đơn
                  </h3>
                  {menuDetails ? (
                    <div className="border rounded-lg p-4">
                      <p className="font-medium mb-2">
                        {menuDetails.TenThucDon}
                      </p>
                      {menuDetails.MonAnList &&
                      menuDetails.MonAnList.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {menuDetails.MonAnList.map((monAn) => (
                            <div
                              key={monAn.MaMonAn}
                              className="flex items-center space-x-2"
                            >
                              <span>• {monAn.TenMonAn}</span>
                              <span className="text-sm text-gray-500">
                                ({formatVND(monAn.DonGia)})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          Không có món ăn trong thực đơn
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">Không có thông tin thực đơn</p>
                  )}
                </div>

                {/* Services section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
                    Dịch vụ đi kèm
                  </h3>
                  {selectedBookingDetail.DichVus &&
                  selectedBookingDetail.DichVus.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedBookingDetail.DichVus.map((dichVu) => {
                        const service = services.find(
                          (s) => s.MaDichVu === dichVu.MaDichVu
                        );
                        return (
                          <div
                            key={dichVu.MaDichVu}
                            className="flex items-center justify-between border rounded p-3"
                          >
                            <div>
                              <p className="font-medium">
                                {service?.TenDichVu}
                              </p>
                              <p className="text-sm text-gray-500">
                                Số lượng: {dichVu.SoLuong}
                              </p>
                            </div>
                            <p className="text-[#B8860B]">
                              {formatVND(dichVu.DonGiaThoiDiemDat)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">Không có dịch vụ đi kèm</p>
                  )}
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                  <p className="text-sm text-gray-500 mb-4">
                    Nhà hàng tiệc cưới
                  </p>
                </div>
              </div>

              {/* Action buttons - Fixed at bottom */}
              <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-4 print:hidden">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Đóng
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-[#001F3F] text-white rounded hover:bg-[#003366]"
                >
                  In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin_Wedding;