import { useState, useEffect } from "react";
import {
  createNguoiDung,
  getAllNguoiDung,
  updateNguoiDung,
  deleteNguoiDung,
  getAllChucNang,
} from "../../Api/nguoiDungApi";
import {
  createNhomNguoiDung,
  getAllNhomNguoiDung,
  getNhomNguoiDungById,
  updateNhomNguoiDung,
  deleteNhomNguoiDung,
} from "../../Api/nhomNguoiDungApi";
import {
  createPhanQuyen,
  getPhanQuyenByNhom,
  deletePhanQuyen,
} from "../../Api/phanQuyenApi";

// Định nghĩa interface
interface User {
  MaNguoiDung: number | undefined;
  TenDangNhap: string;
  TenNguoiDung: string;
  MaNhom: number | undefined;
  TenNhom?: string;
}

interface Group {
  MaNhom: number | undefined;
  TenNhom: string;
}

interface Permission {
  MaNhom: number | undefined;
  MaChucNang: number | undefined;
  TenChucNang: string;
  TenManHinh: string;
}

interface UserFormData {
  id: number | undefined;
  tenDangNhap: string;
  matKhau?: string;
  tenNguoiDung: string;
  maNhom: number | undefined;
}

interface GroupFormData {
  id: number | undefined;
  name: string;
}

interface PermissionFormData {
  maNhom: number | undefined;
  maChucNang: number | undefined;
}

interface ConfirmationModal {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
}

function AdminPermission() {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(
    undefined
  );
  const [availablePermissions, setAvailablePermissions] = useState<
    { MaChucNang: number; TenChucNang: string; TenManHinh: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getAllNguoiDung();
        const usersWithDetails = usersData.map((user: any) => ({
          MaNguoiDung: user.MaNguoiDung,
          TenDangNhap: user.TenDangNhap,
          TenNguoiDung: user.TenNguoiDung,
          MaNhom: user.MaNhom,
          TenNhom: user.TenNhom || "Chưa có nhóm",
        }));
        setUsers(usersWithDetails);

        const groupsData = await getAllNhomNguoiDung();
        setGroups(
          groupsData.map((group: any) => ({
            MaNhom: group.MaNhom,
            TenNhom: group.TenNhom,
          }))
        );

        const chucNangData = await getAllChucNang();
        setAvailablePermissions(
          chucNangData.map((chucNang: any) => ({
            MaChucNang: chucNang.MaChucNang,
            TenChucNang: chucNang.TenChucNang,
            TenManHinh: chucNang.TenManHinh,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Có lỗi xảy ra khi tải dữ liệu!");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (selectedGroupId) {
        try {
          const permissionsData = await getPhanQuyenByNhom(selectedGroupId);
          setPermissions(
            permissionsData.map((perm: any) => ({
              MaNhom: perm.MaNhom,
              MaChucNang: perm.MaChucNang,
              TenChucNang: perm.TenChucNang,
              TenManHinh: perm.TenManHinh,
            }))
          );
        } catch (error) {
          console.error("Error fetching permissions:", error);
          alert("Có lỗi xảy ra khi tải danh sách quyền!");
        }
      } else {
        setPermissions([]);
      }
    };
    fetchPermissions();
  }, [selectedGroupId]);

  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] =
    useState<boolean>(false);
  const [userFormData, setUserFormData] = useState<UserFormData>({
    id: undefined,
    tenDangNhap: "",
    matKhau: "",
    tenNguoiDung: "",
    maNhom: undefined,
  });
  const [groupFormData, setGroupFormData] = useState<GroupFormData>({
    id: undefined,
    name: "",
  });
  const [permissionFormData, setPermissionFormData] =
    useState<PermissionFormData>({
      maNhom: undefined,
      maChucNang: undefined,
    });
  const [isUserEditMode, setIsUserEditMode] = useState<boolean>(false);
  const [isGroupEditMode, setIsGroupEditMode] = useState<boolean>(false);

  const [userSearchTerm, setUserSearchTerm] = useState<string>("");
  const [groupSearchTerm, setGroupSearchTerm] = useState<string>("");

  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal>(
    {
      isOpen: false,
      message: "",
      onConfirm: () => {},
    }
  );

  const openAddUserModal = () => {
    if (groups.length === 0) {
      alert(
        "Vui lòng thêm ít nhất một nhóm người dùng trước khi thêm người dùng"
      );
      return;
    }
    setUserFormData({
      id: undefined,
      tenDangNhap: "",
      matKhau: "",
      tenNguoiDung: "",
      maNhom: groups[0]?.MaNhom,
    });
    setIsUserEditMode(false);
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user: User) => {
    setUserFormData({
      id: user.MaNguoiDung,
      tenDangNhap: user.TenDangNhap,
      matKhau: "",
      tenNguoiDung: user.TenNguoiDung,
      maNhom: user.MaNhom,
    });
    setIsUserEditMode(true);
    setIsUserModalOpen(true);
  };

  const openAddGroupModal = () => {
    setGroupFormData({ id: undefined, name: "" });
    setIsGroupEditMode(false);
    setIsGroupModalOpen(true);
  };

  const openEditGroupModal = (group: Group) => {
    setGroupFormData({
      id: group.MaNhom,
      name: group.TenNhom,
    });
    setIsGroupEditMode(true);
    setIsGroupModalOpen(true);
  };

  const openAddPermissionModal = () => {
    if (!selectedGroupId) {
      alert("Vui lòng chọn một nhóm để gán quyền");
      return;
    }
    setPermissionFormData({ maNhom: selectedGroupId, maChucNang: undefined });
    setIsPermissionModalOpen(true);
  };

  const closeUserModal = () => setIsUserModalOpen(false);
  const closeGroupModal = () => setIsGroupModalOpen(false);
  const closePermissionModal = () => setIsPermissionModalOpen(false);

  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, message: "", onConfirm: () => {} });
  };

  const handleConfirm = () => {
    confirmationModal.onConfirm();
    closeConfirmationModal();
  };

  const handleUserInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({
      ...prev,
      [name]: name === "maNhom" ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleGroupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGroupFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionInputChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPermissionFormData((prev) => ({
      ...prev,
      [name]: value ? Number(value) : undefined,
    }));
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.tenDangNhap || userFormData.tenDangNhap.length < 3) {
      alert("Tên đăng nhập không được để trống và phải có ít nhất 3 ký tự");
      return;
    }
    if (!userFormData.tenNguoiDung) {
      alert("Tên người dùng không được để trống");
      return;
    }
    if (!userFormData.maNhom || isNaN(userFormData.maNhom)) {
      alert("Vui lòng chọn nhóm người dùng hợp lệ");
      return;
    }
    if (
      !isUserEditMode &&
      (!userFormData.matKhau || userFormData.matKhau.length < 6)
    ) {
      alert(
        "Mật khẩu là bắt buộc khi tạo người dùng mới và phải có ít nhất 6 ký tự"
      );
      return;
    }

    const action = async () => {
      try {
        if (isUserEditMode && userFormData.id) {
          const updatedUser = await updateNguoiDung({
            tenNguoiDung: userFormData.tenNguoiDung,
            maNhom: userFormData.maNhom,
          });
          setUsers((prev) =>
            prev.map((user) =>
              user.MaNguoiDung === userFormData.id
                ? {
                    ...user,
                    TenNguoiDung: updatedUser.TenNguoiDung,
                    MaNhom: updatedUser.MaNhom,
                    TenNhom:
                      groups.find((g) => g.MaNhom === updatedUser.MaNhom)
                        ?.TenNhom || "Chưa có nhóm",
                  }
                : user
            )
          );
        } else {
          const dataToSend = {
            tenDangNhap: userFormData.tenDangNhap,
            matKhau: userFormData.matKhau!,
            tenNguoiDung: userFormData.tenNguoiDung,
            maNhom: Number(userFormData.maNhom),
          };
          console.log("Data sent to createNguoiDung:", dataToSend);
          const newUser = await createNguoiDung(dataToSend);
          console.log("New user created:", newUser);
          setUsers((prev) => [
            ...prev,
            {
              MaNguoiDung: newUser.MaNguoiDung,
              TenDangNhap: newUser.TenDangNhap,
              TenNguoiDung: newUser.TenNguoiDung,
              MaNhom: newUser.MaNhom,
              TenNhom:
                groups.find((g) => g.MaNhom === newUser.MaNhom)?.TenNhom ||
                "Chưa có nhóm",
            },
          ]);
        }
        closeUserModal();
      } catch (error: any) {
        console.error("Error saving user:", error.response?.data || error);
        alert(
          `Lỗi khi lưu người dùng: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: `Bạn có chắc chắn muốn ${
        isUserEditMode ? "sửa" : "thêm"
      } người dùng này không?`,
      onConfirm: action,
    });
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (groupFormData.name.length < 2) {
      alert("Tên nhóm phải dài ít nhất 2 ký tự");
      return;
    }

    const action = async () => {
      try {
        if (isGroupEditMode && groupFormData.id) {
          const updatedGroup = await updateNhomNguoiDung(groupFormData.id, {
            tenNhom: groupFormData.name,
          });
          setGroups((prev) =>
            prev.map((group) =>
              group.MaNhom === groupFormData.id
                ? {
                    MaNhom: updatedGroup.MaNhom,
                    TenNhom: updatedGroup.TenNhom,
                  }
                : group
            )
          );
        } else {
          const newGroup = await createNhomNguoiDung({
            tenNhom: groupFormData.name,
          });
          setGroups((prev) => [
            ...prev,
            {
              MaNhom: newGroup.MaNhom,
              TenNhom: newGroup.TenNhom,
            },
          ]);
        }
        closeGroupModal();
      } catch (error: any) {
        console.error("Error saving group:", error);
        alert(
          "Lỗi khi lưu nhóm người dùng: " +
            (error.response?.data?.error || error.message)
        );
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: `Bạn có chắc chắn muốn ${
        isGroupEditMode ? "sửa" : "thêm"
      } nhóm người dùng này không?`,
      onConfirm: action,
    });
  };

  const handlePermissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionFormData.maChucNang) {
      alert("Vui lòng chọn chức năng");
      return;
    }

    const action = async () => {
      try {
        const newPermission = await createPhanQuyen({
          maNhom: permissionFormData.maNhom!,
          maChucNang: permissionFormData.maChucNang!,
        });
        setPermissions((prev) => [
          ...prev,
          {
            MaNhom: newPermission.MaNhom,
            MaChucNang: newPermission.MaChucNang,
            TenChucNang: newPermission.TenChucNang,
            TenManHinh: newPermission.TenManHinh,
          },
        ]);
        closePermissionModal();
      } catch (error: any) {
        console.error("Error saving permission:", error);
        alert(
          "Lỗi khi gán quyền: " + (error.response?.data?.error || error.message)
        );
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn gán quyền này không?",
      onConfirm: action,
    });
  };

  const handleDeleteUser = (id: number | undefined) => {
    const action = async () => {
      try {
        if (id) {
          await deleteNguoiDung(id);
          setUsers((prev) => prev.filter((user) => user.MaNguoiDung !== id));
        }
      } catch (error: any) {
        console.error("Error deleting user:", error);
        alert("Có lỗi xảy ra khi xóa người dùng!");
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa người dùng này không?",
      onConfirm: action,
    });
  };

  const handleDeleteGroup = (id: number | undefined) => {
    const isGroupInUse = users.some((user) => user.MaNhom === id);
    if (isGroupInUse) {
      alert("Không thể xóa nhóm người dùng đang được sử dụng!");
      return;
    }

    const action = async () => {
      try {
        if (id) {
          await deleteNhomNguoiDung(id);
          setGroups((prev) => prev.filter((group) => group.MaNhom !== id));
          if (selectedGroupId === id) {
            setSelectedGroupId(undefined);
            setPermissions([]);
          }
        }
      } catch (error: any) {
        console.error("Error deleting group:", error);
        alert("Có lỗi xảy ra khi xóa nhóm người dùng!");
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa nhóm người dùng này không?",
      onConfirm: action,
    });
  };

  const handleDeletePermission = (
    maNhom: number | undefined,
    maChucNang: number | undefined
  ) => {
    const action = async () => {
      try {
        if (maNhom && maChucNang) {
          await deletePhanQuyen(maNhom, maChucNang);
          setPermissions((prev) =>
            prev.filter(
              (perm) => perm.MaNhom !== maNhom || perm.MaChucNang !== maChucNang
            )
          );
        }
      } catch (error: any) {
        console.error("Error deleting permission:", error);
        alert("Có lỗi xảy ra khi xóa quyền!");
      }
    };

    setConfirmationModal({
      isOpen: true,
      message: "Bạn có chắc chắn muốn xóa quyền này không?",
      onConfirm: action,
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.TenDangNhap.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.TenNguoiDung.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredGroups = groups.filter((group) =>
    group.TenNhom.toLowerCase().includes(groupSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hàng đầu tiên: Tìm kiếm và thêm người dùng */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#001F3F] mb-4">
            Danh sách người dùng
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4B2B2]"
            />
            <button
              onClick={openAddUserModal}
              className="w-full sm:w-auto bg-[#001F3F] text-white py-2 px-4 rounded hover:bg-[#00152A]"
            >
              Thêm người dùng
            </button>
          </div>
        </div>

        {/* Danh sách người dùng: Thay thế bảng bằng danh sách card trên mobile */}
        <div className="mb-8">
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Tên đăng nhập
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Tên người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Nhóm
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#001F3F] uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.MaNguoiDung}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.TenDangNhap}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.TenNguoiDung}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.TenNhom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditUserModal(user)}
                        className="text-[#B8860B] hover:text-[#8B6508] mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.MaNguoiDung)}
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

          {/* Hiển thị dạng card trên mobile */}
          <div className="block sm:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.MaNguoiDung}
                className="bg-white shadow-md rounded-lg p-4 border-l-4 border-[#D4B2B2]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {user.TenDangNhap}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Tên: {user.TenNguoiDung}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Nhóm: {user.TenNhom}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditUserModal(user)}
                      className="text-[#B8860B] hover:text-[#8B6508] text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.MaNguoiDung)}
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

        {/* Hàng thứ hai: Tìm kiếm và thêm nhóm người dùng, phân quyền */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#001F3F] mb-4">
            Quản lý nhóm người dùng & phân quyền
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Tìm kiếm nhóm..."
                value={groupSearchTerm}
                onChange={(e) => setGroupSearchTerm(e.target.value)}
                className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4B2B2]"
              />
              <select
                value={selectedGroupId || ""}
                onChange={(e) =>
                  setSelectedGroupId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full sm:w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4B2B2]"
              >
                <option value="">Chọn nhóm để xem quyền</option>
                {groups.map((group) => (
                  <option key={group.MaNhom} value={group.MaNhom || ""}>
                    {group.TenNhom}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={openAddGroupModal}
                className="w-full sm:w-auto bg-[#D4B2B2] text-white py-2 px-4 rounded hover:bg-[#B89999]"
              >
                Thêm nhóm
              </button>
              <button
                onClick={openAddPermissionModal}
                className="w-full sm:w-auto bg-[#B8860B] text-white py-2 px-4 rounded hover:bg-[#8B6508]"
              >
                Gán quyền
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách nhóm người dùng: Thay thế bảng bằng danh sách card trên mobile */}
        <div className="mb-8">
          <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên nhóm
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGroups.map((group) => (
                  <tr key={group.MaNhom}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {group.TenNhom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditGroupModal(group)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.MaNhom)}
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

          <div className="block sm:hidden space-y-4">
            {filteredGroups.map((group) => (
              <div
                key={group.MaNhom}
                className="bg-white shadow-md rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {group.TenNhom}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditGroupModal(group)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.MaNhom)}
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

        {/* Danh sách phân quyền */}
        {selectedGroupId && (
          <div>
            <h3 className="text-xl font-bold text-[#001F3F] mb-4">
              Quyền của nhóm:{" "}
              {groups.find((g) => g.MaNhom === selectedGroupId)?.TenNhom}
            </h3>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chức năng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Màn hình
                    </th>
                    {/* <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permissions.map((perm) => (
                    <tr key={`${perm.MaNhom}-${perm.MaChucNang}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {perm.TenChucNang}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {perm.TenManHinh}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() =>
                            handleDeletePermission(perm.MaNhom, perm.MaChucNang)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          Xóa
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal thêm/sửa người dùng */}
        {isUserModalOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-[#D4B2B2] transform -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
              {isUserEditMode ? "Sửa người dùng" : "Thêm người dùng"}
            </h3>
            <form onSubmit={handleUserSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  name="tenDangNhap"
                  value={userFormData.tenDangNhap}
                  onChange={handleUserInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                  disabled={isUserEditMode}
                />
              </div>
              {!isUserEditMode && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    name="matKhau"
                    value={userFormData.matKhau}
                    onChange={handleUserInputChange}
                    className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  name="tenNguoiDung"
                  value={userFormData.tenNguoiDung}
                  onChange={handleUserInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nhóm người dùng
                </label>
                <select
                  name="maNhom"
                  value={userFormData.maNhom || ""}
                  onChange={handleUserInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                >
                  <option value="">Chọn nhóm</option>
                  {groups.map((group) => (
                    <option key={group.MaNhom} value={group.MaNhom || ""}>
                      {group.TenNhom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeUserModal}
                  className="bg-[#FAFAFA] text-[#001F3F] py-2 px-4 rounded hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#001F3F] text-white py-2 px-4 rounded hover:bg-[#00152A]"
                >
                  {isUserEditMode ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal thêm/sửa nhóm người dùng */}
        {isGroupModalOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-[#B8860B] transform -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
              {isGroupEditMode ? "Sửa nhóm người dùng" : "Thêm nhóm người dùng"}
            </h3>
            <form onSubmit={handleGroupSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên nhóm
                </label>
                <input
                  type="text"
                  name="name"
                  value={groupFormData.name}
                  onChange={handleGroupInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                  minLength={2}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeGroupModal}
                  className="bg-[#FAFAFA] text-[#001F3F] py-2 px-4 rounded hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#B8860B] text-white py-2 px-4 rounded hover:bg-[#8B6508]"
                >
                  {isGroupEditMode ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal gán quyền */}
        {isPermissionModalOpen && (
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-lg border border-[#D4B2B2] transform -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">
              Gán quyền
            </h3>
            <form onSubmit={handlePermissionSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nhóm
                </label>
                <input
                  type="text"
                  value={
                    groups.find((g) => g.MaNhom === permissionFormData.maNhom)
                      ?.TenNhom || ""
                  }
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 text-gray-700"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Chức năng
                </label>
                <select
                  name="maChucNang"
                  value={permissionFormData.maChucNang || ""}
                  onChange={handlePermissionInputChange}
                  className="py-2 px-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                >
                  <option value="">Chọn chức năng</option>
                  {availablePermissions
                    .filter(
                      (perm) =>
                        !permissions.some(
                          (p) => p.MaChucNang === perm.MaChucNang
                        )
                    )
                    .map((perm) => (
                      <option key={perm.MaChucNang} value={perm.MaChucNang}>
                        {perm.TenChucNang} ({perm.TenManHinh})
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closePermissionModal}
                  className="bg-[#FAFAFA] text-[#001F3F] py-2 px-4 rounded hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#D4B2B2] text-white py-2 px-4 rounded hover:bg-[#B89999]"
                >
                  Gán
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

export default AdminPermission;
