import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../src/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  interface NavItem {
    type: "link" | "dropdown";
    path?: string;
    label: string;
    items?: { path: string; label: string; permissions: string[] }[];
    permissions?: string[];
  }

  const allNavItems: NavItem[] = [
    {
      type: "link",
      path: "/admin",
      label: "Tổng quan",
      permissions: ["Quản lý tham số"],
    },
    {
      type: "dropdown",
      label: "Quản lý",
      permissions: [
        "Quản lý loại sảnh",
        "Quản lý sảnh",
        "Quản lý loại món ăn",
        "Quản lý món ăn",
        "Quản lý thực đơn",
        "Quản lý loại dịch vụ",
        "Quản lý dịch vụ",
        "Quản lý ca",
        "Quản lý hóa đơn", // Thêm quyền để dropdown có thể hiển thị
      ],
      items: [
        {
          path: "/admin/halls",
          label: "Quản lý sảnh",
          permissions: ["Quản lý loại sảnh", "Quản lý sảnh"],
        },
        {
          path: "/admin/menus",
          label: "Quản lý thực đơn",
          permissions: [
            "Quản lý loại món ăn",
            "Quản lý món ăn",
            "Quản lý thực đơn",
          ],
        },
        {
          path: "/admin/services",
          label: "Quản lý dịch vụ",
          permissions: [
            "Quản lý loại dịch vụ",
            "Quản lý dịch vụ",
            "Quản lý ca",
          ],
        },
        {
          path: "/admin/invoices",
          label: "Quản lý hóa đơn",
          permissions: ["Quản lý hóa đơn"],
        },
      ],
    },
    {
      type: "link",
      path: "/admin/wedding",
      label: "Đặt tiệc cưới",
      permissions: ["Quản lý đặt tiệc"],
    },
    {
      type: "link",
      path: "/admin/reports",
      label: "Báo cáo doanh thu",
      permissions: ["Quản lý báo cáo doanh thu"],
    },
    {
      type: "link",
      path: "/admin/permissions",
      label: "Phân quyền",
      permissions: [
        "Quản lý người dùng",
        "Quản lý nhóm người dùng",
        "Quản lý phân quyền",
      ],
    },
  ];

  console.log("User:", user);

  // Lọc navItems dựa trên permissions và maNhom
  const navItems: NavItem[] =
    user?.maNhom === 1
      ? allNavItems
      : allNavItems
          .filter((item) => {
            // Loại bỏ các mục không có quyền
            if (
              !item.permissions ||
              item.permissions.some((perm) => user?.permissions.includes(perm))
            ) {
              return true;
            }

            // Đặc biệt cho dropdown "Quản lý"
            if (item.type === "dropdown" && item.items) {
              return item.items.some((subItem) =>
                subItem.permissions.some((perm) =>
                  user?.permissions.includes(perm)
                )
              );
            }

            return false;
          })
          .map((item) => {
            if (item.type === "dropdown" && item.items) {
              // Lọc sub-items dựa trên permissions
              item.items = item.items.filter((subItem) => {
                // Loại bỏ "Quản lý hóa đơn" cho maNhom = 4
                if (
                  user?.maNhom === 4 &&
                  subItem.label.toLowerCase().trim() === "quản lý hóa đơn"
                ) {
                  return false;
                }
                return subItem.permissions.some((perm) =>
                  user?.permissions.includes(perm)
                );
              });
            }
            return item;
          })
          .filter((item) => {
            // Loại bỏ dropdown nếu không có sub-items
            if (item.type === "dropdown") {
              return item.items && item.items.length > 0;
            }
            return true;
          });

  console.log(
    "💥 NAV ITEMS cuối cùng:",
    navItems.map((i) => ({
      label: i.label,
      items: i.items ? i.items.map((sub) => sub.label) : undefined,
    }))
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white text-black px-4 sm:px-6 py-4 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-gray-800">Quản Lý Tiệc Cưới</div>
        <div className="hidden sm:flex flex-1 justify-center gap-6 font-medium">
          {navItems.map((item, index) => {
            if (item.type === "link" && item.path) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`hover:text-gray-600 transition-colors ${
                    location.pathname === item.path
                      ? "font-bold text-blue-600"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            } else if (
              item.type === "dropdown" &&
              item.items &&
              item.items.length > 0
            ) {
              return (
                <div key={index} className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center gap-1 hover:text-gray-600 transition-colors ${
                      location.pathname.startsWith("/admin/halls") ||
                      location.pathname.startsWith("/admin/menus") ||
                      location.pathname.startsWith("/admin/services") ||
                      location.pathname.startsWith("/admin/invoices")
                        ? "font-bold text-blue-600"
                        : ""
                    }`}
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-gray-100 shadow-md rounded-lg z-10">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`block px-4 py-2 text-sm font-medium hover:bg-gray-200 rounded-md transition-colors ${
                            location.pathname === subItem.path
                              ? "font-bold text-blue-600"
                              : ""
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="hidden sm:block">
          {user ? (
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setUser(null);
                navigate("/admin/login");
              }}
              className="bg-gradient-to-r from-black to-gray-700 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform"
            >
              Đăng xuất
            </button>
          ) : (
            <Link
              to="/admin/login"
              className="bg-gradient-to-r from-black to-gray-700 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform"
            >
              Đăng nhập
            </Link>
          )}
        </div>
        <div className="sm:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
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
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-md mt-2 rounded-lg">
          <div className="flex flex-col px-4 py-2">
            {navItems.map((item, index) => {
              if (item.type === "link" && item.path) {
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`py-2 px-4 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? "font-bold text-blue-600"
                        : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              } else if (
                item.type === "dropdown" &&
                item.items &&
                item.items.length > 0
              ) {
                return (
                  <div key={index} className="flex flex-col">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`py-2 px-4 text-sm font-medium text-left flex items-center gap-1 hover:bg-gray-100 rounded-md transition-colors ${
                        location.pathname.startsWith("/admin/halls") ||
                        location.pathname.startsWith("/admin/menus") ||
                        location.pathname.startsWith("/admin/services") ||
                        location.pathname.startsWith("/admin/invoices")
                          ? "font-bold text-blue-600"
                          : ""
                      }`}
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <div className="pl-4 flex flex-col">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setIsDropdownOpen(false);
                            }}
                            className={`py-2 px-4 text-sm font-medium hover:bg-gray-200 rounded-md transition-colors ${
                              location.pathname === subItem.path
                                ? "font-bold text-blue-600"
                                : ""
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
            {user ? (
              <button
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  setUser(null);
                  navigate("/admin/login");
                }}
                className="py-2 px-4 text-sm font-medium text-left text-black hover:bg-gray-100 rounded-md transition-colors"
              >
                Đăng xuất
              </button>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-4 text-sm font-medium text-left text-black hover:bg-gray-100 rounded-md transition-colors"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
