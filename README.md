# wedding-planner

# Hướng dẫn cài đặt và chạy Wedding Planner

## 1. Cài đặt PostgreSQL và pgAdmin 4

- Tải và cài đặt PostgreSQL từ https://www.postgresql.org/download/
- Tải và cài đặt pgAdmin 4 từ https://www.pgadmin.org/download/

## 2. Tạo database và user, gán quyền

1. Mở pgAdmin 4, kết nối tới server PostgreSQL.
2. Nhấn dấu **+** để thêm database mới, đặt tên ví dụ: `TIECCUOI`.
3. Tạo user (role) mới, ví dụ: `tieccuoi_user`, đặt mật khẩu (ví dụ: `123`).
4. Gán quyền cho user này:
   - Chuột phải vào database vừa tạo → **Security** → **Privileges** → nhấn **+** để thêm user `tieccuoi_user`, chọn quyền **ALL**.
   - Vào mục **Schemas** > **public** > chuột phải chọn **Properties** > tab **Security** > **Privileges** > nhấn **+** để thêm user `tieccuoi_user`, chọn quyền **ALL** (bắt buộc để migration và seed thành công).
   - Lưu ý: Nếu không gán quyền ALL cho user ở cả database và schema `public`, các lệnh migration/seed sẽ bị lỗi.

## 3. Cấu hình kết nối database cho backend

- Copy file `backend/.env.example` thành `backend/.env` và chỉnh sửa thông tin kết nối cho phù hợp:
  ```env
  PORT=3000
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=TIECCUOI
  DB_USER=tieccuoi_user
  DB_PASSWORD=123
  JWT_SECRET=your_jwt_secret_here
  JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
  ```
- **Lưu ý:** Port backend mặc định là `3000` (có thể thay đổi trong file `.env`).

## 4. Cài đặt dependencies

Chỉ sử dụng **npm** cho cả backend và frontend.

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd weddingfe
npm install
```

## 5. Chạy migration và seed dữ liệu

Tại thư mục `backend`, sử dụng các script npm đã định nghĩa:

```bash
npm run migrate   # chạy migration
npm run seed      # chạy seed dữ liệu
```

## 6. Khởi động project

### Backend

```bash
npm start         # chạy production
npm run dev       # chạy chế độ dev (hot reload)
```

- Backend mặc định chạy ở `http://localhost:3000` (có thể thay đổi trong file `.env`).

### Frontend

```bash
npm run dev
```

- Frontend chạy ở `http://localhost:5173`.

## 7. Một số lưu ý

- Nếu gặp lỗi kết nối database, kiểm tra lại thông tin user, password, database, và quyền truy cập.
- Đảm bảo user có quyền **ALL** trên cả database và schema `public` (tab Security trong pgAdmin 4).
- Khi tạo database/user/schema, dùng dấu **+** trong giao diện pgAdmin để thêm mới.
- Chỉ sử dụng npm, không dùng yarn hoặc pnpm.

---

Mọi thắc mắc vui lòng liên hệ nhóm phát triển.
