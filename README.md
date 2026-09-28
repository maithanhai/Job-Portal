# HỆ THỐNG SÀN VIỆC LÀM TRỰC TUYẾN

##  THÀNH VIÊN THỰC HIỆN

| STT | Họ và tên | Mã số sinh viên |
| :---: | :--- | :---: |
| 1 | Mai Thanh Hải | 2351010054 |

---

##  CÔNG NGHỆ SỬ DỤNG

### Backend
* **Ngôn ngữ:** Python 3.x
* **Framework:** Django
* **API:** Django REST Framework

### Frontend
* **Mobile/Web:** React Native / HTML5, CSS3, Bootstrap 5
* **Giao tiếp API:** Fetch API / Axios

### Database & Tools
* **Cơ sở dữ liệu:** Mysql (tùy chỉnh trong settings)
* **Quản lý mã nguồn:** Git/GitHub
* **Tích hợp thanh toán:** PayPal, Stripe, MoMo, ZaloPay (Mở rộng)

---

##  CHỨC NĂNG CHÍNH

### 1. Phân hệ Admin (Quản trị viên)
* **Quản lý người dùng:** Phân quyền và quản lý tài khoản Ứng viên, Nhà tuyển dụng.
* **Kiểm duyệt:** Duyệt và xác minh tài khoản Nhà tuyển dụng trước khi cấp quyền đăng tin.
* **Báo cáo thống kê:** Xem báo cáo tổng quan (lượng tin đăng, số ứng viên, doanh thu dịch vụ) và tùy biến chiến lược.

### 2. Phân hệ Nhà tuyển dụng (Employer)
* **Quản lý tin đăng:** Thêm, sửa, xóa tin tuyển dụng (vị trí, mô tả, lương, đãi ngộ).
* **Quản lý ứng viên:** Xem danh sách hồ sơ nộp vào, đánh giá và lựa chọn ứng viên phù hợp.
* **Dịch vụ nâng cao:** Thanh toán phí dịch vụ cho các gói tin tuyển dụng nổi bật.
* **Thống kê hiệu quả:** Xem thống kê hồ sơ, chất lượng ứng viên theo tháng/quý/năm.

### 3. Phân hệ Ứng viên (Candidate)
* **Tìm kiếm linh hoạt:** Tìm việc theo tên, ngành nghề, mức lương, địa điểm. Tự động phân trang (20 jobs/trang).
* **Quản lý hồ sơ:** Cập nhật thông tin cá nhân, avatar định danh.
* **Ứng tuyển & So sánh:** Nộp hồ sơ vào các vị trí mong muốn; sử dụng công cụ so sánh nhiều công việc cùng lĩnh vực.

---

##  HƯỚNG DẪN CÀI ĐẶT

**Bước 1: Clone dự án về máy**
```bash
git clone https://github.com/maiithanhai/job-board-django.git
cd job-board-django
```
**Bước 2: Cài đặt môi trường ảo**
```
python -m venv venv

# Kích hoạt trên Windows:
venv\Scripts\activate

# Kích hoạt trên MacOS/Linux:
source venv/bin/activate
```
**Bước 3: Cài dặt các thư viện phụ thuộc**
```
pip install -r requirements.txt
```
**Bước 4: Cấu hình cơ sở dữ liệu**
```
python manage.py makemigrations
python manage.py migrate
```
**Bước 5: Tạo tài khoản Admin**
```
python manage.py createsuperuser
```
**Bước 6: Khởi chạy Server**
```
python manage.py runserver
```

