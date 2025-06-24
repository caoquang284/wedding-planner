🎉 Wedding Planner - Hệ thống Quản lý Tiệc Cưới Online
Wedding Planner là một ứng dụng web hiện đại hỗ trợ quản lý toàn diện các hoạt động tổ chức tiệc cưới, từ đặt tiệc, quản lý sảnh, thực đơn, dịch vụ, hóa đơn đến báo cáo doanh số và phân quyền người dùng. Dự án được xây dựng với Node.js (Express) cho backend và React, TypeScript, Vite cho frontend, mang đến trải nghiệm mượt mà, giao diện thân thiện và hiệu quả vận hành cao cho các nhà hàng, trung tâm tiệc cưới.
✨ Tính năng chính
👤 Người dùng

Đăng ký/Đăng nhập: Hệ thống xác thực an toàn với JWT.
Quản lý hồ sơ: Cập nhật thông tin người dùng và nhóm người dùng.
Phân quyền: Quản lý quyền truy cập chi tiết theo nhóm người dùng (Super Admin, Nhân viên Thực Đơn, Nhân viên Dịch vụ, Nhân viên Lễ tân, Nhân viên Kế toán).
Refresh Token: Hỗ trợ làm mới token để duy trì phiên đăng nhập.

🏛 Quản lý sảnh và ca

Quản lý loại sảnh: CRUD các loại sảnh (Thường, VIP, Cao cấp).
Quản lý sảnh: Thêm, sửa, xóa sảnh với thông tin chi tiết (số lượng bàn tối đa, ảnh URL, ghi chú).
Quản lý ca: Quản lý các ca tổ chức tiệc (Sáng, Trưa, Chiều, Tối, Đêm).

🍽 Quản lý thực đơn và món ăn

Quản lý loại món ăn: CRUD các loại món ăn (Khai vị, Gỏi, Súp, Món chính, Tráng miệng, v.v.).
Quản lý món ăn: Thêm, sửa, xóa món ăn với thông tin giá, ghi chú, ảnh URL.
Quản lý thực đơn: Tạo, chỉnh sửa thực đơn, tự động cập nhật giá thực đơn khi giá món ăn thay đổi.

🎈 Quản lý dịch vụ

Quản lý loại dịch vụ: CRUD các loại dịch vụ (Trang trí, Âm thanh ánh sáng, Chụp ảnh quay phim, Nhân sự, Dịch vụ bổ sung).
Quản lý dịch vụ: Thêm, sửa, xóa dịch vụ với giá, ghi chú, ảnh minh họa.
Gắn dịch vụ vào tiệc: Chọn và quản lý dịch vụ cho từng tiệc cưới.

📋 Đặt tiệc và hóa đơn

Đặt tiệc: Tạo, chỉnh sửa, hủy tiệc cưới với thông tin chú rể, cô dâu, ngày tiệc, sảnh, ca, thực đơn, dịch vụ, tiền cọc.
Quản lý hóa đơn: Tạo, xem, cập nhật trạng thái hóa đơn (Chưa thanh toán, Đã thanh toán, Đã hủy) và tính toán phạt nếu áp dụng quy định phạt.
In hóa đơn: Hỗ trợ xuất hóa đơn chi tiết dưới dạng PDF.

📊 Báo cáo doanh số

Báo cáo doanh thu: Thống kê doanh thu theo tháng, năm.
Chi tiết báo cáo: Hiển thị số lượng tiệc, doanh thu, tỷ lệ đóng góp theo ngày.
Quản lý tham số: Cài đặt tỷ lệ phạt trễ thanh toán (mặc định 1%/ngày).

🛠 Quản trị viên

Quản lý người dùng: Xem, thêm, sửa, xóa người dùng và nhóm người dùng.
Quản lý phân quyền: Gán quyền chi tiết cho từng nhóm người dùng.
Dashboard: Tổng quan về tiệc cưới, doanh thu, và hoạt động hệ thống.

🚀 Công nghệ sử dụng
Backend Core

Node.js & Express: Framework backend mạnh mẽ.
Knex.js: Query builder cho PostgreSQL.
PostgreSQL: Hệ quản trị cơ sở dữ liệu quan hệ.
JWT: Xác thực và bảo mật.
Bcrypt: Mã hóa mật khẩu.

Frontend Core

React 19: Thư viện UI hiện đại.
TypeScript: Type safety và IntelliSense.
Vite: Build tool nhanh chóng.
React Router: Điều hướng SPA.

Styling & UI

Tailwind CSS v4: Framework CSS utility-first.
Lucide Icons: Thư viện icon chất lượng cao.
Custom Components: Giao diện tối ưu cho trải nghiệm người dùng.

State Management

React Context API: Quản lý trạng thái xác thực.
Axios: Gọi API từ frontend.
React Hook Form: Xử lý form hiệu quả.

Development Tools

ESLint & Prettier: Đảm bảo chất lượng code.
TypeScript: Kiểm tra kiểu tĩnh.
pgAdmin 4: Quản trị database PostgreSQL.
Knex Migrations & Seeds: Quản lý schema và dữ liệu mẫu.

Additional Features

Date-fns: Xử lý ngày giờ.
React Toastify: Hiển thị thông báo toast.
Helmet & Morgan: Bảo mật và logging cho backend.

📁 Cấu trúc dự án
wedding-planner/
├── backend/                    # Mã nguồn backend
│   ├── src/
│   │   ├── config/           # Cấu hình database
│   │   ├── controllers/      # Xử lý logic nghiệp vụ
│   │   ├── middleware/       # Middleware xác thực, phân quyền
│   │   ├── models/           # Mô hình dữ liệu
│   │   ├── routes/           # Định tuyến API
│   ├── migrations/           # Script migration database
│   ├── seeds/               # Script seed dữ liệu mẫu
│   └── server.js            # Entry point backend
├── weddingfe/                 # Mã nguồn frontend
│   ├── src/
│   │   ├── Api/             # Gọi API
│   │   ├── components/      # Shared components
│   │   ├── contexts/        # Context cho xác thực
│   │   ├── pages/           # Page components
│   │   ├── assets/          # Static assets
│   │   └── App.tsx          # Entry point frontend
└── package.json              # Dependencies toàn dự án

🛠 Cài đặt và chạy dự án
Yêu cầu hệ thống

Node.js >= 18.0.0
npm >= 9.0.0
PostgreSQL >= 12.0
pgAdmin 4 để quản lý database

Cài đặt PostgreSQL và pgAdmin 4

Tải và cài đặt PostgreSQL từ https://www.postgresql.org/download/.
Tải và cài đặt pgAdmin 4 từ https://www.pgadmin.org/download/.

Tạo database và user, gán quyền

Mở pgAdmin 4, kết nối tới server PostgreSQL.
Nhấn dấu + để tạo database mới, ví dụ: TIECCUOI.
Tạo user (role) mới, ví dụ: tieccuoi_user, đặt mật khẩu (ví dụ: 123).
Gán quyền cho user:
Chuột phải vào database vừa tạo → Security → Privileges → nhấn + để thêm user tieccuoi_user, chọn quyền ALL.
Vào Schemas > public > chuột phải chọn Properties > tab Security > Privileges > nhấn + để thêm user tieccuoi_user, chọn quyền ALL (bắt buộc để migration và seed thành công).
Lưu ý: Nếu không gán quyền ALL cho user ở cả database và schema public, các lệnh migration/seed sẽ bị lỗi.



Cấu hình kết nối database

Copy file backend/.env.example thành backend/.env và chỉnh sửa thông tin kết nối:PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=TIECCUOI
DB_USER=tieccuoi_user
DB_PASSWORD=123
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key


Lưu ý: Port backend mặc định là 3000 (có thể thay đổi trong file .env).

Cài đặt dependencies
Chỉ sử dụng npm cho cả backend và frontend.
Backend
cd backend
npm install

Frontend
cd weddingfe
npm install

Chạy migration và seed dữ liệu
Tại thư mục backend, sử dụng các script npm:
npm run migrate   # Chạy migration để tạo schema
npm run seed      # Chèn dữ liệu mẫu

Khởi động dự án
Backend
npm start         # Chạy production
npm run dev       # Chạy chế độ dev (hot reload)


Backend chạy tại http://localhost:3000 (có thể thay đổi trong file .env).

Frontend
npm run dev


Frontend chạy tại http://localhost:5173.

Scripts có sẵn
Backend

npm start: Chạy production server.
npm run dev: Chạy development server với hot reload.
npm run migrate: Chạy migration database.
npm run seed: Chèn dữ liệu mẫu.

Frontend

npm run dev: Chạy development server.
npm run build: Build production.
npm run preview: Preview production build.
npm run lint: Chạy ESLint.
npm run lint:fix: Tự động sửa lỗi ESLint.

🌐 Environment Variables
Tạo file backend/.env và weddingfe/.env.local (nếu cần):
Backend
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=TIECCUOI
DB_USER=tieccuoi_user
DB_PASSWORD=123
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

Frontend
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=Wedding Planner

🎨 Theme và Styling
Ứng dụng sử dụng Tailwind CSS v4 với các đặc điểm:

Dark/Light Mode: Tùy chỉnh giao diện sáng/tối.
Responsive Design: Tối ưu cho mobile, tablet và desktop.
Custom Components: Giao diện thân thiện, dễ sử dụng.
Lucide Icons: Icon hiện đại, nhẹ.

📱 Responsive Design

Mobile First: Tối ưu giao diện cho thiết bị di động.
Tablet: Hỗ trợ màn hình trung bình.
Desktop: Trải nghiệm đầy đủ trên PC.

🔐 Authentication Flow

Đăng nhập: Tên đăng nhập/mật khẩu → JWT token → Refresh token.
Phân quyền: Role-based access (Super Admin, Nhân viên Thực Đơn, Nhân viên Dịch vụ, v.v.).
Bảo mật: Protected routes, middleware kiểm tra quyền.

🤝 Đóng góp

Fork dự án.
Tạo feature branch (git checkout -b feature/AmazingFeature).
Commit changes (git commit -m 'Add some AmazingFeature').
Push to branch (git push origin feature/AmazingFeature).
Mở Pull Request.

📄 License
Dự án được phân phối dưới MIT License. Xem file LICENSE để biết thêm chi tiết.
👥 Team

Họ tên: Nguyễn Cao Quang - MSSV: 23521284
Họ tên: Trần Ngọc Bin - MSSV: 23520150
Họ tên: Nguyễn Quốc Bảo - MSSV: 23520126

⭐ Nếu dự án hữu ích, hãy cho chúng tôi một star trên GitHub!
📞 Liên hệ
Mọi thắc mắc hoặc đóng góp, vui lòng liên hệ nhóm phát triển qua email hoặc GitHub issue.
