# Wedding Planner - Tổng quan dự án

## Mục đích

Wedding Planner là hệ thống quản lý tiệc cưới, hỗ trợ các nghiệp vụ đặt tiệc, quản lý sảnh, thực đơn, dịch vụ, hóa đơn, báo cáo doanh số và phân quyền người dùng. Dự án hướng tới việc số hóa quy trình quản lý, giúp tiết kiệm thời gian, giảm sai sót và nâng cao hiệu quả vận hành cho các nhà hàng, trung tâm tổ chức tiệc cưới.

## Kiến trúc tổng thể

- **Backend:** Node.js (Express), sử dụng PostgreSQL làm hệ quản trị cơ sở dữ liệu, quản lý logic nghiệp vụ, xác thực, phân quyền, API RESTful.
- **Frontend:** React + Vite, giao diện hiện đại, dễ sử dụng, kết nối backend qua API.
- **Database:** PostgreSQL, thiết kế chuẩn hóa, hỗ trợ migration và seed dữ liệu tự động.

## Các chức năng chính

- Quản lý sảnh, loại sảnh, ca tổ chức
- Quản lý thực đơn, món ăn, loại món ăn
- Quản lý dịch vụ, loại dịch vụ
- Đặt tiệc, quản lý hóa đơn
- Báo cáo doanh số, thống kê
- Quản lý người dùng, nhóm người dùng, phân quyền truy cập
- Xác thực đăng nhập, JWT

## Đối tượng sử dụng

- Nhân viên, quản lý nhà hàng, trung tâm tiệc cưới
- Quản trị viên hệ thống

## Công nghệ sử dụng

- **Backend:** Node.js, Express, Knex, PostgreSQL, JWT, dotenv, helmet, morgan
- **Frontend:** React, Vite, Axios, React Router, TailwindCSS
- **Khác:** pgAdmin 4 (quản trị database), ESLint, Prettier

## Thư mục chính

- `backend/`: mã nguồn backend, API, migration, seed
- `weddingfe/`: mã nguồn frontend (React)

## Liên hệ

Mọi thắc mắc hoặc đóng góp vui lòng liên hệ nhóm phát triển.
