import { useState } from "react";

// Định nghĩa interface
interface Dish {
  id: number | null;
  name: string;
  categoryId: number | null;
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

interface ServiceType {
  id: number;
  name: string;
  note: string;
  imageUrl: string;
}

interface Hall {
  id: number;
  name: string;
  capacity: number;
  imageUrl: string;
  note: string;
  minimumTablePrice: number; // Thêm thuộc tính mới
}

interface BookingFormData {
  tenchure: string;
  tencodau: string;
  dienthoai: string;
  ngaydactiec: string;
}

function User_Home() {
  // Dữ liệu mẫu
  const [menus] = useState<Menu[]>([
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
    {
      id: 3,
      name: "Menu 3",
      price: 1350000,
      dishIds: [1, 2, 4],
    },
    {
      id: 4,
      name: "Menu 4",
      price: 1300000,
      dishIds: [3, 5],
    },
    {
      id: 5,
      name: "Menu 5",
      price: 3000000,
      dishIds: [1, 3, 5],
    },
    {
      id: 6,
      name: "Menu 6",
      price: 5000000,
      dishIds: [2, 4],
    },
  ]);

  const [dishes] = useState<Dish[]>([
    {
      id: 1,
      name: "Soup bò củ quả xào",
      categoryId: 1,
      imageUrl:
        "https://img-global.cpcdn.com/recipes/c3eb610fb2d0025f/680x482cq70/sup-bo-h%E1%BA%A7m-rau-c%E1%BB%A7-recipe-main-photo.jpg",
    },
    {
      id: 2,
      name: "Gỏi cuốn tôm thịt",
      categoryId: 1,
      imageUrl:
        "https://khaihoanphuquoc.com.vn/wp-content/uploads/2023/11/nu%CC%9Bo%CC%9B%CC%81c-ma%CC%86%CC%81m-cha%CC%82%CC%81m-go%CC%89i-cuo%CC%82%CC%81n.png",
    },
    {
      id: 3,
      name: "Cà ri gà + Bánh mì",
      categoryId: 2,
      imageUrl:
        "https://i.ytimg.com/vi/xySE3CCA1Kk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDGNsGS54HOQGdWfPsagm9oTnCY6g",
    },
    {
      id: 4,
      name: "Soup củ nâu bắp",
      categoryId: 1,
      imageUrl:
        "https://vcdn1-giadinh.vnecdn.net/2014/01/09/soup-1-7494-1389251301.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=dWm4J4Joh_PckUXCilPBRw",
    },
    {
      id: 5,
      name: "Chả giò hongkong",
      categoryId: 3,
      imageUrl:
        "https://haithuycatering.com/image/5c23081151046d1069c6bda0/original.jpg",
    },
  ]);

  const [categories] = useState<Category[]>([
    { id: 1, name: "Khai vị" },
    { id: 2, name: "Chính" },
    { id: 3, name: "Tráng miệng" },
  ]);

  const [serviceTypes] = useState<ServiceType[]>([
    {
      id: 1,
      name: "Chụp Ảnh",
      note: "Gói chụp ảnh chuyên nghiệp, lưu giữ khoảnh khắc đẹp.",
      imageUrl:
        "https://khoistudio.vn/wp-content/uploads/2023/09/chup-anh-cuoi-27.jpg",
    },
    {
      id: 2,
      name: "Âm Thanh Ánh Sáng",
      note: "Thiết bị âm thanh và ánh sáng sân khấu hiện đại.",
      imageUrl:
        "https://amthanhanhsangsukien.com/wp-content/uploads/2019/10/IMG_8655.jpg",
    },
    {
      id: 3,
      name: "Thiệp Cưới",
      note: "Thiết kế thiệp cưới độc đáo, sang trọng.",
      imageUrl: "https://thiepcuoikk.com/upload/news/1-7-8216.jpg",
    },
    {
      id: 4,
      name: "Váy Cưới",
      note: "Váy cưới cao cấp, đa phong cách cho cô dâu.",
      imageUrl:
        "https://maxi.vn/wp-content/uploads/2024/06/z5544165856412_593d24ced318fd7645232a00f00dc759.jpg",
    },
    {
      id: 5,
      name: "Trang Trí",
      note: "Dịch vụ trang trí tiệc cưới theo yêu cầu.",
      imageUrl:
        "https://tiff.vn/wp-content/uploads/2024/05/2023-Hai-Anh-Vu-Kevin-5-scaled-1.jpg",
    },
    {
      id: 6,
      name: "Xe Cưới",
      note: "Cho thuê xe cưới sang trọng, lịch sự.",
      imageUrl:
        "https://xeducvinh.vn/wp-content/uploads/2023/08/cho-thue-xe-cuoi-sieu-sang-bmw-750i-1.jpg",
    },
    {
      id: 7,
      name: "MC & Ca Sĩ",
      note: "MC chuyên nghiệp và ca sĩ biểu diễn tại tiệc cưới.",
      imageUrl:
        "https://thanhnien.mediacdn.vn/Uploaded/thynhm/2022_05_04/mc-minh-tuan-1-6230.jpeg",
    },
    {
      id: 8,
      name: "Bánh Cưới",
      note: "Bánh cưới đa dạng mẫu mã, hương vị thơm ngon.",
      imageUrl:
        "https://luxchair.vn/wp-content/uploads/2024/06/banh-cuoi-ngoc-trai-jpg.webp",
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
      minimumTablePrice: 1200000, // Đơn giá bàn tối thiểu (VD: 1,200,000 VNĐ)
    },
    {
      id: 2,
      name: "Sảnh Phượng Hoàng",
      capacity: 80,
      imageUrl:
        "https://crystalpalacevn.com/wp-content/uploads/2023/03/T4_07087-scaled.jpg",
      note: "Không gian rộng rãi, phong cách hoàng gia, lý tưởng cho tiệc đông khách.",
      minimumTablePrice: 1500000, // Đơn giá bàn tối thiểu (VD: 1,500,000 VNĐ)
    },
    {
      id: 3,
      name: "Sảnh Hoa Sen",
      capacity: 30,
      imageUrl:
        "https://crystalpalacevn.com/wp-content/uploads/2020/06/Sanh-Royal-2.jpg",
      note: "Sảnh ấm cúng, thiết kế gần gũi thiên nhiên, phù hợp tiệc thân mật.",
      minimumTablePrice: 1000000, // Đơn giá bàn tối thiểu (VD: 1,000,000 VNĐ)
    },
  ]);

  // State cho form nhận báo giá và đặt tiệc
  const [formData, setFormData] = useState<BookingFormData>({
    tenchure: "",
    tencodau: "",
    dienthoai: "",
    ngaydactiec: "",
  });

  // Xử lý thay đổi form
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý submit form (chỉ hiển thị alert, chưa xử lý logic button)
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.tenchure ||
      !formData.tencodau ||
      !formData.dienthoai ||
      !formData.ngaydactiec
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    alert(
      `Yêu cầu báo giá và đặt tiệc đã được gửi!\nChú rể: ${formData.tenchure}\nCô dâu: ${formData.tencodau}\nSố điện thoại: ${formData.dienthoai}\nNgày đặt tiệc: ${formData.ngaydactiec}`
    );
    setFormData({ tenchure: "", tencodau: "", dienthoai: "", ngaydactiec: "" });
  };
  const [selectedHallId, setSelectedHallId] = useState<number>(1);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Phần 1: Giới thiệu về nhà hàng tiệc cưới */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
            Chào mừng đến với Nhà hàng Tiệc Cưới Hạnh Phúc
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Nhà hàng Tiệc Cưới Hạnh Phúc là nơi biến giấc mơ về một lễ cưới hoàn
            hảo của bạn thành hiện thực. Với không gian sang trọng, thực đơn đa
            dạng, và dịch vụ chuyên nghiệp, chúng tôi cam kết mang đến cho bạn
            một ngày trọng đại trọn vẹn và đáng nhớ.
          </p>
        </div>
      </div>
      {/* Phần 2: Giới thiệu sảnh */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Thanh navbar nhỏ */}
        <nav className="bg-white shadow-md mb-6 p-4 rounded-lg">
          <ul className="flex space-x-2 justify-center">
            {halls.map((hall, index) => (
              <li key={hall.id}>
                <button
                  onClick={() => setSelectedHallId(hall.id)}
                  className={`text-lg font-medium transition-colors ${
                    selectedHallId === hall.id
                      ? "text-blue-500 font-bold"
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  {hall.name}
                </button>
                {index < halls.length - 1 && (
                  <span className="text-gray-400"> | </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Hiển thị sảnh được chọn */}
        {halls.map(
          (hall) =>
            selectedHallId === hall.id && (
              <div
                key={hall.id}
                id={`hall-${hall.id}`} // ID để cuộn đến
                className="flex flex-col sm:flex-row items-center gap-8 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Hình ảnh sảnh (50% chiều rộng trên màn hình lớn, kích thước lớn hơn) */}
                <div className="w-full sm:w-1/2 h-72 sm:h-96">
                  <img
                    src={hall.imageUrl}
                    alt={hall.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Thông tin sảnh (50% chiều rộng trên màn hình lớn, thiết kế tinh tế hơn) */}
                <div className="w-full sm:w-1/2 p-10 pl-0 min-h-[400px] flex flex-col">
                  {" "}
                  {/* Thêm min-h và flex-col */}
                  <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
                    {" "}
                    {/* Tăng mb-6 thành mb-8 */}
                    {hall.name}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 mb-10 line-clamp-4 leading-relaxed">
                    {" "}
                    {/* Tăng mb-8 thành mb-10 */}
                    {hall.note}
                  </p>
                  <div className="border-t border-gray-200 pt-6 mt-auto">
                    {" "}
                    {/* Tăng pt-4 thành pt-6, thêm mt-auto */}
                    <div className="flex space-x-4">
                      {/* Box Sức chứa tối đa */}
                      <div className="flex-1 bg-gray-200 px-4 py-4 rounded-lg text-center">
                        <div className="flex justify-center mb-2">
                          <div className="bg-blue-500 rounded-full p-2 w-10 h-10 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2zm0 2v10h14V7H5zm2 2h2v2H7V9zm4 0h2v2h-2V9zm4 0h2v2h-2V9zm-8 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 font-normal mb-1">
                          Sức chứa tối đa
                        </p>
                        <p className="text-2xl sm:text-3xl text-gray-900 font-bold">
                          {hall.capacity} bàn
                        </p>
                      </div>

                      {/* Box Đơn giá bàn tối thiểu */}
                      <div className="flex-1 bg-gray-200 px-4 py-4 rounded-lg text-center">
                        <div className="flex justify-center mb-2">
                          <div className="bg-green-500 rounded-full p-2 w-10 h-10 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M21 7H3a2 2 0 00-2 2v8a2 2 0 002 2h18a2 2 0 002-2V9a2 2 0 00-2-2zm0 10H3V9h18v8zm-9-2a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 font-normal mb-1">
                          Đơn giá bàn tối thiểu
                        </p>
                        <p className="text-2xl sm:text-3xl text-gray-900 font-bold">
                          {hall.minimumTablePrice.toLocaleString("vi-VN")} VNĐ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
        )}
      </div>
      {/* Phần 3: Danh sách các thực đơn */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* State để theo dõi menu hiện tại của mỗi loại */}
        {(() => {
          const [currentHarmoniousIndex, setCurrentHarmoniousIndex] =
            useState(0);
          const [currentImpressiveIndex, setCurrentImpressiveIndex] =
            useState(0);
          const [currentLuxuryIndex, setCurrentLuxuryIndex] = useState(0);

          // Lọc menu theo từng loại
          const harmoniousMenus = menus.filter(
            (menu) => menu.price >= 1000000 && menu.price <= 2000000
          );
          const impressiveMenus = menus.filter(
            (menu) => menu.price > 2000000 && menu.price <= 4000000
          );
          const luxuryMenus = menus.filter(
            (menu) => menu.price > 4000000 && menu.price <= 6000000
          );

          // Hàm điều hướng
          const handlePrev = (
            currentIndex: number,
            setIndex: React.Dispatch<React.SetStateAction<number>>,
            menuList: Menu[]
          ) => {
            setIndex(currentIndex > 0 ? currentIndex - 1 : menuList.length - 1);
          };
          const handleNext = (
            currentIndex: number,
            setIndex: React.Dispatch<React.SetStateAction<number>>,
            menuList: Menu[]
          ) => {
            setIndex((currentIndex + 1) % menuList.length);
          };

          return (
            <>
              {/* Menu Hài Hòa (1tr - 2tr) */}
              {harmoniousMenus.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8">
                    Menu Hài Hòa (1tr - 2tr)
                  </h2>
                  <div className="relative">
                    {/* Nút Back */}
                    <button
                      onClick={() =>
                        handlePrev(
                          currentHarmoniousIndex,
                          setCurrentHarmoniousIndex,
                          harmoniousMenus
                        )
                      }
                      className="absolute left-[-64px] top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors z-10"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    {/* Hiển thị menu hiện tại */}
                    {(() => {
                      const menu = harmoniousMenus[currentHarmoniousIndex];
                      const menuDishes = menu.dishIds
                        .map((dishId) =>
                          dishes.find((dish) => dish.id === dishId)
                        )
                        .filter(Boolean) as Dish[];
                      console.log("Harmonious Menu Dishes:", menuDishes);
                      console.log("Cover Image URL:", menuDishes[0]?.imageUrl);
                      return (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                          <div className="relative">
                            <div className="w-full h-[500px] flex items-center justify-center relative z-0">
                              {" "}
                              {menuDishes[0]?.imageUrl ? (
                                <img
                                  src={menuDishes[0].imageUrl}
                                  alt={menuDishes[0].name}
                                  className="w-full h-full min-w-full min-h-full object-cover"
                                  onError={(e) => {
                                    console.error(
                                      "Failed to load image:",
                                      menuDishes[0].imageUrl
                                    );
                                    e.currentTarget.src =
                                      "https://via.placeholder.com/600x400?text=Fallback+Image";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500">
                                    Không tải được ảnh bìa
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-end p-6 z-10">
                              <ul className="text-yellow-200 space-y-2 pr-16 z-20 rounded-lg py-4 px-6">
                                {" "}
                                {menuDishes.map((dish) => {
                                  const category = categories.find(
                                    (cat) => cat.id === dish?.categoryId
                                  );
                                  return (
                                    <li
                                      key={dish?.id}
                                      className="text-lg flex items-center gap-1 text-shadow-md"
                                    >
                                      <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                                      {dish?.name}{" "}
                                      <span className="text-yellow-300">
                                        (
                                        {category
                                          ? category.name
                                          : "Chưa phân loại"}
                                        )
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                          <div className="p-2">
                            <h3 className="text-base font-semibold text-gray-800 mb-1">
                              {menu.name}
                            </h3>
                            <p className="text-sm font-medium text-green-600">
                              {menu.price.toLocaleString("vi-VN")} VNĐ
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                    {/* Nút Next */}
                    <button
                      onClick={() =>
                        handleNext(
                          currentHarmoniousIndex,
                          setCurrentHarmoniousIndex,
                          harmoniousMenus
                        )
                      }
                      className="absolute right-[-64px] top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors z-10"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Menu Ấn Tượng (2tr - 4tr) */}
              {impressiveMenus.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8">
                    Menu Ấn Tượng (2tr - 4tr)
                  </h2>
                  <div className="relative">
                    <button
                      onClick={() =>
                        handlePrev(
                          currentImpressiveIndex,
                          setCurrentImpressiveIndex,
                          impressiveMenus
                        )
                      }
                      className="absolute left-[-54px] top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors z-10"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    {(() => {
                      const menu = impressiveMenus[currentImpressiveIndex];
                      const menuDishes = menu.dishIds
                        .map((dishId) =>
                          dishes.find((dish) => dish.id === dishId)
                        )
                        .filter(Boolean) as Dish[];
                      console.log("Impressive Menu Dishes:", menuDishes); // Debug
                      console.log("Cover Image URL:", menuDishes[0]?.imageUrl); // Debug
                      return (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                          <div className="relative">
                            <div className="w-full h-[500px] flex items-center justify-center">
                              {menuDishes[0]?.imageUrl ? (
                                <img
                                  src={menuDishes[0].imageUrl}
                                  alt={menuDishes[0].name}
                                  className="w-full h-full object-cover"
                                  onError={() =>
                                    console.error(
                                      "Failed to load image:",
                                      menuDishes[0].imageUrl
                                    )
                                  }
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500">
                                    Ảnh bìa thực đơn
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-end p-6 z-10">
                              <ul className="text-yellow-200 space-y-2 pr-16 z-20 rounded-lg py-4 px-6">
                                {menuDishes.map((dish) => {
                                  const category = categories.find(
                                    (cat) => cat.id === dish?.categoryId
                                  );
                                  return (
                                    <li
                                      key={dish?.id}
                                      className="text-lg flex items-center gap-1 text-shadow-md"
                                    >
                                      <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                                      {dish?.name}{" "}
                                      <span className="text-yellow-300">
                                        (
                                        {category
                                          ? category.name
                                          : "Chưa phân loại"}
                                        )
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                          <div className="p-2">
                            <h3 className="text-base font-semibold text-gray-800 mb-1">
                              {menu.name}
                            </h3>
                            <p className="text-sm font-medium text-green-600">
                              {menu.price.toLocaleString("vi-VN")} VNĐ
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                    <button
                      onClick={() =>
                        handleNext(
                          currentImpressiveIndex,
                          setCurrentImpressiveIndex,
                          impressiveMenus
                        )
                      }
                      className="absolute right-[-54px] top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors z-10"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Menu Sang (4tr - 6tr) */}
              {luxuryMenus.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8">
                    Menu Sang (4tr - 6tr)
                  </h2>
                  <div className="relative">
                    <button
                      onClick={() =>
                        handlePrev(
                          currentLuxuryIndex,
                          setCurrentLuxuryIndex,
                          luxuryMenus
                        )
                      }
                      className="absolute left-[-54px] top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors z-10"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    {(() => {
                      const menu = luxuryMenus[currentLuxuryIndex];
                      const menuDishes = menu.dishIds
                        .map((dishId) =>
                          dishes.find((dish) => dish.id === dishId)
                        )
                        .filter(Boolean) as Dish[];
                      console.log("Luxury Menu Dishes:", menuDishes); // Debug
                      console.log("Cover Image URL:", menuDishes[0]?.imageUrl); // Debug
                      return (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                          <div className="relative">
                            <div className="w-full h-[500px] flex items-center justify-center">
                              {menuDishes[0]?.imageUrl ? (
                                <img
                                  src={menuDishes[0].imageUrl}
                                  alt={menuDishes[0].name}
                                  className="w-full h-full min-w-full min-h-full object-cover"
                                  onError={() =>
                                    console.error(
                                      "Failed to load image:",
                                      menuDishes[0].imageUrl
                                    )
                                  }
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500">
                                    Ảnh bìa thực đơn
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-end p-6 z-10">
                              <ul className="text-yellow-200 space-y-2 pr-12 z-20 rounded-lg py-4 px-6">
                                {menuDishes.map((dish) => {
                                  const category = categories.find(
                                    (cat) => cat.id === dish?.categoryId
                                  );
                                  return (
                                    <li
                                      key={dish?.id}
                                      className="text-lg flex items-center gap-1 text-shadow-md"
                                    >
                                      <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                                      {dish?.name}{" "}
                                      <span className="text-yellow-300">
                                        (
                                        {category
                                          ? category.name
                                          : "Chưa phân loại"}
                                        )
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                          <div className="p-2">
                            <h3 className="text- font-semibold text-gray-800 mb-1">
                              {menu.name}
                            </h3>
                            <p className="text-sm font-medium text-green-600">
                              {menu.price.toLocaleString("vi-VN")} VNĐ
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                    <button
                      onClick={() =>
                        handleNext(
                          currentLuxuryIndex,
                          setCurrentLuxuryIndex,
                          luxuryMenus
                        )
                      }
                      className="absolute right-[-54px] top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors z-10"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Phần 4: Danh sách các dịch vụ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8">
          Dịch Vụ Tiệc Cưới
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden rounded-t-lg">
                <img
                  src={type.imageUrl}
                  alt={type.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {type.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {type.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Phần 5: Nhận báo giá và đặt tiệc */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8">
          Nhận Báo Giá và Đặt Tiệc
        </h2>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <form onSubmit={handleBookingSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên Chú Rể
                </label>
                <input
                  type="text"
                  name="tenchure"
                  value={formData.tenchure}
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
                  className="py-2 px-3 mt-1 w-full rounded border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số Điện Thoại
                </label>
                <input
                  type="text"
                  name="dienthoai"
                  value={formData.dienthoai}
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
                  className="py-2 px-3 mt-1 w-full rounded border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors"
              >
                Gửi Yêu Cầu
              </button>
              <button
                type="button"
                className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition-colors"
              >
                Đi Đến Đặt Tiệc
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default User_Home;
