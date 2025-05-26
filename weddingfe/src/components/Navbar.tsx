import { useState } from "react";
import { useUser } from "../contexts/userContext";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, toggleRole } = useUser();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  interface NavItem {
    type: "link" | "dropdown";
    path?: string; // Path chỉ áp dụng cho link, optional
    label: string;
    items?: { path: string; label: string }[]; // Items cho dropdown
  }

  const navItems: NavItem[] = isAdmin
    ? [
        { type: "link", path: "/admin", label: "Tổng quan" },
        {
          type: "dropdown",
          label: "Quản lý",
          items: [
            { path: "/admin/halls", label: "Quản lý sảnh" },
            { path: "/admin/menus", label: "Quản lý thực đơn" },
            { path: "/admin/services", label: "Quản lý dịch vụ" },
          ],
        },
        { type: "link", path: "/admin/invoices", label: "Quản lý hóa đơn" },
        { type: "link", path: "/admin/wedding", label: "Đặt tiệc cưới" },
        { type: "link", path: "/admin/reports", label: "Báo cáo doanh thu" },
        { type: "link", path: "/admin/permissions", label: "Phân quyền" },
      ]
    : [
        { type: "link", path: "/", label: "Tổng quan" },
        { type: "link", path: "/user/halls", label: "Danh sách sảnh" },
        { type: "link", path: "/user/menus", label: "Danh sách thực đơn" },
        { type: "link", path: "/user/services", label: "Danh sách dịch vụ" },
        { type: "link", path: "/user/booking", label: "Đặt tiệc cưới" },
        { type: "link", path: "/user/invoices", label: "Hóa đơn" },
      ];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white text-black px-4 sm:px-6 py-4 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo or Brand */}
        <div className="text-xl font-bold text-gray-800">Quản Lý Tiệc Cưới</div>

        {/* Desktop Menu */}
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
            } else if (item.type === "dropdown") {
              return (
                <div key={index} className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 hover:text-gray-600 transition-colors"
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
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-md rounded-lg z-10">
                      {item.items?.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`block px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors ${
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

        {/* Desktop Toggle */}
        <div className="hidden sm:block">
          <button
            onClick={toggleRole}
            className="bg-gradient-to-r from-black to-gray-700 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform"
          >
            {isAdmin ? "Chuyển sang User" : "Chuyển sang Admin"}
          </button>
        </div>

        {/* Mobile Button */}
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

      {/* Mobile Menu */}
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
              } else if (item.type === "dropdown") {
                return (
                  <div key={index} className="flex flex-col">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="py-2 px-4 text-sm font-medium text-left flex items-center gap-1 hover:bg-gray-100 rounded-md transition-colors"
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
                        {item.items?.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setIsDropdownOpen(false);
                            }}
                            className={`py-2 px-4 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors ${
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
            <button
              onClick={() => {
                toggleRole();
                setIsMobileMenuOpen(false);
              }}
              className="py-2 px-4 text-sm font-medium text-left text-black hover:bg-gray-100 rounded-md transition-colors"
            >
              {isAdmin ? "Chuyển sang User" : "Chuyển sang Admin"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
