# Danh sách API

| STT | Phân nhóm   | API Endpoint                     |  Method   | Mô tả chức năng                          | Tiến trình |
|:---:|:------------|:---------------------------------|:---------:|:-----------------------------------------|:----------:|
|  1  | **Auth**    | `/api/users/register/`           |   POST    | Đăng ký tài khoản (Tự động tạo Profile)  |   Đã làm   |
|  2  | **User**    | `/api/users/me/`                 |    GET    | Lấy thông tin tài khoản hiện tại         |   Đã làm   |
|  3  | **User**    | `/api/users/me/`                 |   PATCH   | Cập nhật thông tin cá nhân/Công ty       |   Đã làm   |
|  5  | **Master**  | `/api/categories/`               |    GET    | Lấy danh sách ngành nghề (Phân trang)    |   Đã làm   |
|  6  | **Master**  | `/api/categories/{id}/skills/`   |    GET    | Lấy Kỹ năng theo từng ngành cụ thể       |   Đã làm   |
|  7  | **Master**  | `/api/skills/`                   |    GET    | Lấy toàn bộ danh sách kỹ năng hệ thống   |   Đã làm   |
|  8  | **Job**     | `/api/jobs/`                     |    GET    | Tìm kiếm & Lọc việc làm (Search/Filter)  |   Đã làm   |
|  9  | **Job**     | `/api/jobs/{id}/`                |    GET    | Xem thông tin chi tiết một công việc     |   Đã làm   |
| 10  | **Job**     | `/api/jobs/`                     |   POST    | Nhà tuyển dụng đăng tin mới              |   Đã làm   |
| 11  | **Job**     | `/api/jobs/{id}/`                | PUT/PATCH | Chỉnh sửa nội dung tin tuyển dụng        |   Đã làm   |
| 12  | **Job**     | `/api/jobs/{id}/`                |  DELETE   | Xóa hoặc ẩn tin tuyển dụng               |   Đã làm   |
| 13  | **Resume**  | `/api/resumes/`                  |   POST    | Tải lên bản hồ sơ CV mới                 |   Đã làm   |
| 14  | **Resume**  | `/api/resumes/`                  |    GET    | Xem danh sách các CV đã tải lên          |   Đã làm   |
| 15  | **Resume**  | `/api/resumes/{id}/`             |  DELETE   | Xóa hồ sơ CV khỏi hệ thống               |   Đã làm   |
| 16  | **Action**  | `/api/applications/`             |   POST    | Nộp hồ sơ ứng tuyển vào vị trí công việc |   Đã làm   |
| 17  | **Action**  | `/api/saved-jobs/`               |   POST    | Lưu tin tuyển dụng vào mục yêu thích     |   Đã làm   |
| 18  | **Action**  | `/api/saved-jobs/`               |    GET    | Xem danh sách việc làm đã lưu            |   Đã làm   |
|19| **A**       | `/api/saved-jobs/`               |  DELETE   | Xóa việc làm đã lưu|   Đã làm   |
| 19  | **Manage**  | `/api/applications/`             |    GET    | Quản lý danh sách đơn ứng tuyển          |   Đã làm   |
| 20  | **Manage**  | `/api/applications/{id}/status/` |   PATCH   | Cập nhật trạng thái duyệt đơn            |            |
| 21  | **Payment** | `/api/payments/`                 |   POST    | Tạo yêu cầu thanh toán tin Premium       |            |
| 22  | **Payment** | `/api/payments/`                 |    GET    | Xem lịch sử giao dịch thanh toán         |            |
