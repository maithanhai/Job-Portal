#!/bin/bash

echo "=== 1. Cài đặt thư viện ==="
pip install -r requirements.txt

echo "=== 2. Migrate cơ sở dữ liệu ==="
python manage.py makemigrations
python manage.py migrate

echo "=== 3. Tạo Admin ==="
export DJANGO_SUPERUSER_USERNAME=admin
export DJANGO_SUPERUSER_EMAIL=admin@example.com
export DJANGO_SUPERUSER_PASSWORD=123456
python manage.py createsuperuser --no-input || echo "SuperUser đã tồn tại!"

echo "=== 4. Khởi chạy server ==="
python manage.py runserver 0.0.0.0:8000