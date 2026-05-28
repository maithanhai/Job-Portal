# TÀI LIỆU CẤU HÌNH VÀ DANH SÁCH ENDPOINT API
## HỆ THỐNG SÀN VIỆC LÀM TRỰC TUYẾN (JOB PORTAL SYSTEM)

Tài liệu này đặc tả toàn bộ hệ thống API công khai và nội bộ của sàn việc làm trực tuyến. Các endpoint đã được đồng bộ hóa hoàn toàn với cấu trúc định tuyến mới nhất của Django REST Framework và giao diện trực quan từ hệ thống Swagger UI.

---

### I. CẤU HÌNH CHUNG (BASE CONFIGURATION)

* **Môi trường Development:** `http://127.0.0.1:8000`
* **Tiền tố API (Prefix):** `/api`
* **Định dạng dữ liệu mặc định:** `application/json`
* **Phương thức xác thực:** `Oauth 2 Bearer Token` truyền qua Header của Request:
    ```http
    Authorization: Bearer <your_access_token>
    ```

---

### II. DANH SÁCH TỔNG HỢP ENDPOINT API

Dưới đây là bảng tổng hợp toàn bộ các API Endpoints đang vận hành trên hệ thống, phân chia chi tiết theo từng phân hệ chức năng:

| STT | Phân nhóm | API Endpoint | Method | Mô tả chức năng | Quyền truy cập |
|:---:|:---|:---|:---:|:---|:---|
| **1** | **Users** | `/api/users/register/` | `POST` | Đăng ký tài khoản mới (Tự động tạo hồ sơ Candidate/Employer ứng với Role) | Công khai (`AllowAny`) |
| **2** | **Users** | `/api/users/current-user/` | `GET` | Lấy thông tin chi tiết tài khoản hiện tại đang đăng nhập | Đã xác thực (`Authenticated`) |
| **3** | **Users** | `/api/users/current-user/` | `PATCH` | Cập nhật thông tin cá nhân cơ bản (Họ tên, SĐT, Avatar) | Đã xác thực (`Authenticated`) |
| **4** | **Users** | `/api/users/change-password/` | `POST` | Thay đổi mật khẩu tài khoản | Đã xác thực (`Authenticated`) |
| **5** | **Employers** | `/api/employers/current-employer/` | `GET` | Xem chi tiết hồ sơ doanh nghiệp của tài khoản hiện tại | Nhà tuyển dụng (`EMPLOYER`) |
| **6** | **Employers** | `/api/employers/current-employer/` | `PATCH` | Cập nhật thông tin công ty (Logo, địa điểm, mã số thuế, ảnh thẻ) | Nhà tuyển dụng (`EMPLOYER`) |
| **7** | **Employers** | `/api/employers/stats/` | `GET` | Báo cáo thống kê tuyển dụng (KPIs tổng quan, Pipeline đơn từ, Biểu đồ 12 tháng) | Nhà tuyển dụng (`EMPLOYER`) |
| **8** | **Categories**| `/api/categories/` | `GET` | Lấy danh sách toàn bộ danh mục ngành nghề hệ thống | Công khai (`AllowAny`) |
| **9** | **Categories**| `/api/categories/{id}/jobs/` | `GET` | Lấy danh sách tin tuyển dụng thuộc một ngành nghề cụ thể | Công khai (`AllowAny`) |
| **10** | **Jobs** | `/api/jobs/` | `GET` | Danh sách việc làm công khai (Hỗ trợ tìm kiếm, lọc theo mức lương, địa điểm) | Công khai (`AllowAny`) |
| **11** | **Jobs** | `/api/jobs/` | `POST` | Tạo mới tin tuyển dụng | Nhà tuyển dụng đã duyệt (`VerifiedEmployer`) |
| **12** | **Jobs** | `/api/jobs/my-jobs/` | `GET` | Xem danh sách tin tuyển dụng riêng của doanh nghiệp (Lọc Trạng thái/Hết hạn) | Nhà tuyển dụng đã duyệt (`VerifiedEmployer`) |
| **13** | **Jobs** | `/api/jobs/{id}/` | `GET` | Xem chi tiết thông tin một việc làm cụ thể (Kèm cờ trạng thái `is_saved`, `is_applied`) | Công khai (`AllowAny`) |
| **14** | **Jobs** | `/api/jobs/{id}/` | `PUT` | Cập nhật toàn bộ nội dung của tin tuyển dụng | Chủ sở hữu tin (`Owner Employer`) |
| **15** | **Jobs** | `/api/jobs/{id}/` | `PATCH` | Chỉnh sửa một phần nội dung của tin tuyển dụng | Chủ sở hữu tin (`Owner Employer`) |
| **16** | **Jobs** | `/api/jobs/{id}/` | `DELETE` | Xóa mềm tin tuyển dụng khỏi hệ thống (`is_active = False`) | Chủ sở hữu tin (`Owner Employer`) |
| **17** | **Applications**| `/api/applications/` | `GET` | Lấy danh sách đơn ứng tuyển (Candidate xem đơn đã nộp / Employer xem đơn ứng tuyển công ty) | Đã xác thực (`Authenticated`) |
| **18** | **Applications**| `/api/applications/` | `POST` | Nộp hồ sơ ứng tuyển việc làm (Kiểm tra điều kiện: trùng lặp, trạng thái, deadline) | Ứng viên (`CANDIDATE`) |
| **19** | **Applications**| `/api/applications/{id}/` | `GET` | Xem chi tiết nội dung một đơn ứng tuyển và tài liệu đính kèm | Đã xác thực (`Authenticated`) |
| **20** | **Applications**| `/api/applications/{id}/review/` | `PATCH` | Thao tác xét duyệt, ghi chú nhận xét và cập nhật trạng thái đơn ứng tuyển | Nhà tuyển dụng đã duyệt (`VerifiedEmployer`) |
| **21** | **Saved Jobs** | `/api/saved-jobs/` | `GET` | Danh sách việc làm đã lưu của ứng viên | Ứng viên (`CANDIDATE`) |
| **22** | **Saved Jobs** | `/api/saved-jobs/` | `POST` | Lưu một tin tuyển dụng vào danh mục yêu thích | Ứng viên (`CANDIDATE`) |
| **23** | **Saved Jobs** | `/api/saved-jobs/{id}/` | `DELETE` | Gỡ bỏ tin tuyển dụng khỏi danh mục yêu thích | Ứng viên (`CANDIDATE`) |

---

### III. CHI TIẾT CẤU TRÚC PHÂN HỆ DỮ LIỆU (DETAILED DATA STRUCTURE)

#### 1. Phân hệ Tài khoản (`/api/users/`)
* **Quy tắc Họ và Tên Tiếng Việt:** Hệ thống tuân thủ chặt chẽ cơ chế lưu trữ của Django. Trường `first_name` chịu trách nhiệm lưu trữ cả **Họ và tên đệm** (Ví dụ: "Nguyễn Văn"), trường `last_name` lưu trữ **Tên chính** (Ví dụ: "Tài"). Phương thức `get_full_name()` sẽ tự động nội suy ghép chuỗi theo định dạng chuẩn quốc gia: `[Họ và tên đệm] [Tên]`.
* **Cơ chế Tạo Profile:** Ngay khi một tài khoản đăng ký thành công qua `/api/users/register/`, hệ thống kiểm tra trường `role`. Nếu `role='CANDIDATE'`, một bản ghi trống bên bảng `Candidate` được tạo liên kết qua khóa ngoại. Nếu `role='EMPLOYER'`, dữ liệu bổ sung gồm tên công ty, vị trí, mã số thuế sẽ được xử lý lưu trữ vào bảng `Employer`.

#### 2. Phân hệ Thống kê & Dashboard (`/api/employers/dashboard/`)
* **Logic Dữ liệu Biểu đồ (Chart Data):** API truy vấn và gom nhóm (Group By) đơn ứng tuyển dựa vào hàm cắt chuỗi thời gian `TruncMonth`. Nhằm triệt tiêu hiện tượng sụp đổ layout biểu đồ phía Frontend (React Native) khi gặp tháng trống dữ liệu, Backend tự động khởi tạo ma trận mặc định gồm đầy đủ 12 tháng từ tháng 1 đến tháng 12 với giá trị mặc định bằng `0`, sau đó ánh xạ dữ liệu thực tế từ Database đè lên trước khi xuất chuỗi JSON.
* **Bộ lọc thời gian:** Thống kê biểu đồ mặc định quét theo năm hiện hành thông qua tham số truy vấn dữ liệu `?year=YYYY`.

#### 3. Phân hệ Quản lý Hồ sơ Ứng tuyển (`/api/applications/`)
* **Quy trình Kiểm tra Điều kiện (Validation Pipelines):** Khi ứng viên gửi lệnh nộp đơn (`POST`), Backend thực thi chuỗi kiểm tra an toàn nghiêm ngặt:
    1. Trạng thái tin tuyển dụng: `job.is_active == True`.
    2. Hạn nộp hồ sơ: `job.deadline >= timezone.now()`.
    3. Trùng lặp dữ liệu: Ngăn chặn tuyệt đối việc ứng viên nộp hồ sơ lần thứ 2 vào cùng một mã tin tuyển dụng.
* **Quản lý Tài liệu (CV File Management):** Tài liệu CV định dạng `.pdf` hoặc định dạng hình ảnh nộp từ Frontend ứng viên được lưu trữ trực tiếp trên máy chủ Cloudinary. URL thô định dạng chuỗi bảo mật dạng `https://` được lưu lại trong DB để tối ưu hóa hiệu năng kết xuất dữ liệu và tránh quá tải bộ nhớ hệ thống.