# Job Portal System - API Documentation

Tài liệu hướng dẫn sử dụng các Endpoint API cho hệ thống Sàn việc làm trực tuyến.
Hệ thống sử dụng **OAuth2** để xác thực.

---

##  1. Xác thực (Authentication)
Tất cả các API yêu cầu xác thực phải đính kèm Header: 
`Authorization: Bearer <your_access_token>`

| Method | Endpoint | Access | Mô tả |
|:--- |:--- |:--- |:--- |
| `POST` | `/o/token/` | Public | Lấy Access Token (Login) |
| `POST` | `/o/revoke_token/` | Public | Đăng xuất (Hủy Token) |
| `POST` | `/api/users/register/` | Public | Đăng ký tài khoản (Candidate/Employer) |
| `GET` | `/api/users/profile/` | Token | Lấy thông tin tài khoản đang đăng nhập |

---

##  2. Dữ liệu công cộng (Public Data)
Các API này hỗ trợ hiển thị trang chủ và tìm kiếm, không bắt buộc Token.

| Method | Endpoint | Tham số (Query) | Mô tả |
|:--- |:--- |:--- |:--- |
| `GET` | `/api/categories/` | None | Danh sách ngành nghề |
| `GET` | `/api/jobs/` | `name`, `cat_id`, `city` | Danh sách công việc (active=True) |
| `GET` | `/api/jobs/{id}/` | id (int) | Chi tiết một công việc |
| `GET` | `/api/employers/` | `is_verified` | Danh sách các công ty tuyển dụng |
| `GET` | `/api/skills/` | None | Danh sách kỹ năng hệ thống |

---

##  3. Dành cho Ứng viên (Candidate Only)
Yêu cầu: `Token` + `Role: CANDIDATE`

| Method | Endpoint | Body (JSON) | Mô tả |
|:--- |:--- |:--- |:--- |
| `GET` | `/api/candidate/resumes/` | None | Danh sách CV cá nhân |
| `POST` | `/api/candidate/resumes/` | `file`, `skills_id` | Upload CV mới (Cloudinary) |
| `POST` | `/api/jobs/{id}/apply/` | `resume_id`, `cover_letter` | Nộp đơn ứng tuyển |
| `GET` | `/api/candidate/applications/` | None | Xem trạng thái các đơn đã nộp |
| `POST` | `/api/jobs/{id}/save/` | None | Lưu/Bỏ lưu công việc (Toggle) |

---

## 4. Dành cho Nhà tuyển dụng (Employer Only)
Yêu cầu: `Token` + `Role: EMPLOYER`

| Method | Endpoint | Body (JSON) | Mô tả |
|:--- |:--- |:--- |:--- |
| `POST` | `/api/employer/jobs/` | Job fields | Đăng tin tuyển dụng mới |
| `GET` | `/api/employer/my-jobs/` | None | Xem các tin công ty đã đăng |
| `GET` | `/api/employer/jobs/{id}/applicants/` | None | Danh sách ứng viên đã nộp vào Job |
| `PATCH` | `/api/applications/{id}/status/` | `status` | Duyệt/Từ chối hồ sơ (ACCEPTED/REJECTED) |
| `POST` | `/api/employer/payments/` | `job_id`, `amount` | Thanh toán nâng cấp Job VIP |

---

## 5. Quy trình Test qua Postman
1. **Đăng ký:** Gọi `POST /api/users/register/` để tạo User.
2. **Lấy Token:** Gọi `POST /o/token/` với:
   - `grant_type`: `password`
   - `username`: `<your_user>`
   - `password`: `<your_pass>`
   - `client_id`: `<your_client_id>`
   - `client_secret`: `<your_client_secret>`
3. **Gắn Token:** Copy `access_token` và dán vào phần **Auth -> Bearer Token** của Postman cho các request sau.

---
*Cập nhật lần cuối: 20/04/2026 bởi Mai Thanh Hải*