#!/bin/bash

echo "=== 1. Cài đặt thư viện từ requirements.txt ==="
pip install -r requirements.txt

echo "=== 2. Tạo file migration ==="
python manage.py makemigrations

echo "=== 3. Thực thi migrate cơ sở dữ liệu ==="
python manage.py migrate

echo "=== 4. Tạo tài khoản Superuser (Admin) ==="
export DJANGO_SUPERUSER_USERNAME=admin
export DJANGO_SUPERUSER_EMAIL=admin@example.com
export DJANGO_SUPERUSER_PASSWORD=Admin@123

python manage.py createsuperuser --no-input || echo "SuperUser đã tồn tại!"

echo "=== 5. Chèn dữ liệu mẫu hệ thống Việc làm ==="
python manage.py shell -c "
from django.contrib.auth import get_user_model
from jobs.models import Category, Skill, Employer, Candidate, Job, Application, SavedJob, Payment
from django.utils import timezone
import datetime

User = get_user_model()

# Đường dẫn avatar theo yêu cầu của Hải
EMPOWER_AVATAR = 'https://res.cloudinary.com/thanhai/image/upload/v1772629826/cld-sample-2.jpg'
CANDIDATE_AVATAR = 'https://res.cloudinary.com/thanhai/image/upload/v1779160136/User_icon_2.svg_wxuh3f.png'

print('-> Đang tạo 10 Ngành nghề (Category)...')
categories = [Category.objects.get_or_create(name=f'Nganh nghe cong nghe {i}', description=f'Mo ta chi tiet cho nganh nghe so {i}')[0] for i in range(1, 11)]

print('-> Đang tạo 20 Kỹ năng (Skill)...')
skills = [Skill.objects.get_or_create(name=f'Ky nang chuyen mon {i}', category=categories[(i - 1) % 10])[0] for i in range(1, 21)]

print('-> Đang tạo 20 Nhà tuyển dụng (Employer)...')
employers = []
for i in range(1, 21):
    u_emp, created = User.objects.get_or_create(username=f'employer{i}', email=f'hr_company{i}@example.com')
    u_emp.first_name = 'Dai dien'
    u_emp.last_name = f'Cong ty {i}'
    u_emp.phone_number = f'09012345{i:02d}'
    u_emp.avatar = EMPOWER_AVATAR
    u_emp.role = User.EMPLOYER
    if created: u_emp.set_password('123456')
    u_emp.save()
    
    emp, _ = Employer.objects.get_or_create(user=u_emp, company_name=f'Tap doan Cong nghe Toan cau {i}', location=f'Ho Chi Minh, Quan {i if i <= 12 else 1}', is_verified=True)
    employers.append(emp)

print('-> Đang tạo 20 Ứng viên (Candidate)...')
candidates = []
for i in range(1, 21):
    u_cand, created = User.objects.get_or_create(username=f'candidate{i}', email=f'candidate_dev{i}@example.com')
    u_cand.first_name = 'Ung vien'
    u_cand.last_name = f'Nguyen Van {i}'
    u_cand.phone_number = f'09876543{i:02d}'
    u_cand.avatar = CANDIDATE_AVATAR
    u_cand.role = User.CANDIDATE
    if created: u_cand.set_password('123456')
    u_cand.save()
    
    cand, _ = Candidate.objects.get_or_create(user=u_cand)
    cand.skills.add(skills[(i - 1) % 20], skills[(i + 2) % 20]); cand.save()
    candidates.append(cand)

print('-> Đang tạo 20 Tin tuyển dụng (Job)...')
jobs = []
for i in range(1, 21):
    job = Job.objects.create(name=f'Ky su Phan mem Fullstack {i}', category=categories[(i - 1) % 10], employer=employers[(i - 1) % 20], location=employers[(i - 1) % 20].location, description=f'Yeu cau cong viec so {i}', salary_min=10000000 + (i * 1000000), salary_max=25000000 + (i * 1000000), is_negotiable=(i % 3 == 0), deadline=timezone.now() + datetime.timedelta(days=30))
    job.skill.add(skills[(i - 1) % 20]); job.save()
    jobs.append(job)

print('-> Đang tạo 20 Đơn ứng tuyển (Application)...')
for i in range(1, 21):
    Application.objects.create(candidate=candidates[(i - 1) % 20], job=jobs[(i - 1) % 20], status='PENDING' if i % 2 == 0 else 'REVIEWING', file_cv='raw/upload/v123456/sample_cv_file.pdf', cover_letter=f'Xin chao HR, toi muon ung tuyen vao vi tri so {i}')

print('-> Đang tạo 20 Lượt lưu bài tuyển dụng (SavedJob)...')
for i in range(1, 21):
    SavedJob.objects.get_or_create(candidate=candidates[(i - 1) % 20], job=jobs[(i + 3) % 20])

print('-> Đang tạo 20 Hóa đơn thanh toán (Payment)...')
for i in range(1, 21):
    Payment.objects.create(employer=employers[(i - 1) % 20], job=jobs[(i - 1) % 20], amount=500000.00, method='VNPAY', status=True)

print('=== CHÈN DỮ LIỆU MẪU THÀNH CÔNG VỚI ĐẦY ĐỦ CÁC QUAN HỆ ===')
"

echo "=== 6. Khởi chạy máy chủ Django nội bộ ==="
python manage.py runserver