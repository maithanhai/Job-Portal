USE jobportaldb;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `jobs_category`;
INSERT INTO `jobs_category` (`id`, `created_at`, `updated_at`, `is_active`, `name`, `description`) VALUES
(1, '2026-01-01 00:00:00', '2026-01-01 00:00:00', 1, 'Công nghệ thông tin', 'Lập trình viên, Kỹ sư hệ thống, Data, AI, Network...'),
(2, '2026-01-01 00:00:00', '2026-01-01 00:00:00', 1, 'Kỹ thuật / Cơ khí', 'Kỹ sư điện, điện tử, ô tô, tự động hóa, chế tạo máy...'),
(3, '2026-01-01 00:00:00', '2026-01-01 00:00:00', 1, 'Bán lẻ / Dịch vụ', 'Quản lý siêu thị, cửa hàng trưởng, thu ngân, kho...'),
(4, '2026-01-01 00:00:00', '2026-01-01 00:00:00', 1, 'Kinh doanh / Bán hàng', 'Sale, phát triển thị trường, chăm sóc khách hàng, B2B...');

DELETE FROM `jobs_user` WHERE id > 1;
INSERT INTO `jobs_user` (`id`, `password`, `last_login`, `is_superuser`, `first_name`, `last_name`, `is_staff`, `is_active`, `date_joined`, `role`, `username`, `email`, `avatar`, `phone_number`) VALUES
-- Employer (2-9)
(2, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Lê Hải', 'Đăng', 0, 1, '2026-05-01 10:00:00', 'EMPLOYER', 'haidang.employer', 'haidang@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/avatar5_mvusvg.jpg', '0912345678'),
(3, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Nguyễn Minh', 'Anh', 0, 1, '2026-05-01 10:00:00', 'EMPLOYER', 'minhanh.employer', 'minhanh@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/avatar4_hi1caw.jpg', '0923456789'),
(4, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Trần Quốc', 'Bảo', 0, 1, '2026-05-01 10:00:00', 'EMPLOYER', 'quocbao.employer', 'quocbao@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/avatar1_r5nvuk.jpg', '0934567890'),
(5, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Phạm Thu', 'Thủy', 0, 1, '2026-05-01 10:00:00', 'EMPLOYER', 'thuthuy.employer', 'thuthuy@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/avatar2_ixz3op.jpg', '0945678901'),
(6, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Vũ Hoàng', 'Long', 0, 1, '2026-05-01 10:00:00', 'EMPLOYER', 'hoanglong.employer', 'hoanglong@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/avatar3_lpwewz.jpg', '0956789012'),
(7, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Hoàng Thị', 'Mai', 0, 1, '2026-05-01 10:00:00', 'EMPLOYER', 'thimai.employer', 'thimai@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/avatar5_mvusvg.jpg', '0967890123'),
(8, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Đinh Trọng', 'Thái', 0, 1, '2026-05-01 10:00:00', 'EMPLOYER', 'trongthai.employer', 'trongthai@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/avatar4_hi1caw.jpg', '0978901234'),
(9, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Ngô Thanh', 'Trúc', 0, 1, '2026-05-01 10:00:00', 'EMPLOYER', 'thanhtruc.employer', 'thanhtruc@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/avatar1_r5nvuk.jpg', '0989012345'),

(10, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Bùi Xuân', 'Huấn', 0, 1, '2026-05-01 10:00:00', 'CANDIDATE', 'xuanhuan.candidate', 'xuanhuan.cand@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/avatar2_ixz3op.jpg', '0312345678'),
(11, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Trần Thị', 'Thảo', 0, 1, '2026-05-01 10:00:00', 'CANDIDATE', 'thithao.candidate', 'thithao.cand@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/avatar3_lpwewz.jpg', '0323456789'),
(12, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Phạm Tuấn', 'Kiệt', 0, 1, '2026-05-01 10:00:00', 'CANDIDATE', 'tuankiet.candidate', 'tuankiet.cand@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/avatar5_mvusvg.jpg', '0334567890'),
(13, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Lý Nhã', 'Kỳ', 0, 1, '2026-05-01 10:00:00', 'CANDIDATE', 'nhaky.candidate', 'nhaky.cand@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/avatar4_hi1caw.jpg', '0345678901'),
(14, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Đỗ Mạnh', 'Cường', 0, 1, '2026-05-01 10:00:00', 'CANDIDATE', 'manhcuong.candidate', 'manhcuong.cand@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/avatar1_r5nvuk.jpg', '0356789012'),
(15, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Trịnh Thăng', 'Bình', 0, 1, '2026-05-01 10:00:00', 'CANDIDATE', 'thangbinh.candidate', 'thangbinh.cand@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/avatar2_ixz3op.jpg', '0367890123'),
(16, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Lê Thị', 'Lệ', 0, 1, '2026-05-01 10:00:00', 'CANDIDATE', 'thile.candidate', 'thile.cand@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/avatar3_lpwewz.jpg', '0378901234'),
(17, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Nguyễn Văn', 'Tài', 0, 1, '2026-05-01 10:00:00', 'CANDIDATE', 'vantai.candidate', 'vantai.cand@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/avatar5_mvusvg.jpg', '0389012345'),
(18, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Phan Đình', 'Phùng', 0, 1, '2026-05-01 10:00:00', 'CANDIDATE', 'dinhphung.candidate', 'dinhphung.cand@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/avatar4_hi1caw.jpg', '0390123456'),
(19, 'pbkdf2_sha256$1200000$Af1MHbKf1rjCgNqJnW3Brr$Py+0dsDCydh17SZ/QvZSTlUbQyxkNjossAcrQKSoFE0=', NULL, 0, 'Vương Tú', 'Anh', 0, 1, '2026-05-01 10:00:00', 'CANDIDATE', 'tuanh.candidate', 'tuanh.cand@example.com', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/avatar1_r5nvuk.jpg', '0311223344');

TRUNCATE TABLE `jobs_employer`;
INSERT INTO `jobs_employer` (`id`, `created_at`, `updated_at`, `is_active`, `company_name`, `logo_company`, `location`, `is_verified`, `tax_code`, `employee_card`, `user_id`) VALUES
(1, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 'VNG Corporation', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947946/vng_uxz9te.png', 'TP.HCM', 1, '0314567890', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779948649/fake_employer_card1_qwznhu.png', 2),
(2, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 'FPT Software', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947946/fpt_wwsdm9.png', 'Hà Nội', 1, '0315678901', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779948649/fake_employer_card2_bgvjtt.png', 3),
(3, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 'Tập đoàn Điện lực (EVN)', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/dien-luc-env_awkpf6.png', 'Toàn quốc', 1, '0316789012', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779948649/fake_employer_card3_ixzxvu.png', 4),
(4, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 'Viettel Group', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/viettel_ez6pcn.png', 'Hà Nội', 1, '0317890123', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779948649/fake_employer_card4_j5o4aj.png', 5),
(5, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 'Petrolimex', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/petrolimex_wqekju.jpg', 'TP.HCM', 1, '0318901234', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779948649/fake_employer_card5_vafqwt.png', 6),
(6, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 'VinFast', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/vinfast_tj6fqm.png', 'Hải Phòng', 1, '0319012345', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779948649/fake_employer_card1_qwznhu.png', 7),
(7, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 'Điện Máy Xanh', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947945/dien-may-xanh_dzsvkk.webp', 'Đồng Nai', 0, '0310123456', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779948649/fake_employer_card2_bgvjtt.png', 8),
(8, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 'Bách Hóa Xanh', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/bach-hoa-xanh_ylqzcq.webp', 'TP.HCM', 0, '0311234567', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779948649/fake_employer_card3_ixzxvu.png', 9);

TRUNCATE TABLE `jobs_candidate`;
INSERT INTO `jobs_candidate` (`id`, `created_at`, `updated_at`, `is_active`, `user_id`) VALUES
(1, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 10), (2, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 11),
(3, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 12), (4, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 13),
(5, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 14), (6, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 15),
(7, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 16), (8, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 17),
(9, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 18), (10, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 19);

TRUNCATE TABLE `jobs_job`;
INSERT INTO `jobs_job` (`id`, `created_at`, `updated_at`, `is_active`, `name`, `location`, `description`, `requirements`, `benefits`, `salary_min`, `salary_max`, `is_negotiable`, `deadline`, `category_id`, `employer_id`) VALUES
-- IT / VNG (Active)
(1, '2026-05-05 08:00:00', '2026-05-05 08:00:00', 1, 'Senior React Native Developer', 'Q7, TP.HCM', '<p>Code app Zalo.</p>', '<p>3 năm kn.</p>', '<p>Lương T13.</p>', 25000000, 45000000, 0, '2026-07-15 23:59:59', 1, 1),
(2, '2026-05-10 08:00:00', '2026-05-10 08:00:00', 1, 'Golang Backend Engineer', 'Q7, TP.HCM', '<p>Microservices ZaloPay.</p>', '<p>Golang, Redis.</p>', '<p>BHXH full.</p>', 30000000, 50000000, 0, '2026-07-20 23:59:59', 1, 1),
(3, '2026-05-12 08:00:00', '2026-05-12 08:00:00', 1, 'Data Engineer', 'Q7, TP.HCM', '<p>Xử lý Big Data.</p>', '<p>Spark, Hadoop.</p>', '<p>Macbook Pro.</p>', 20000000, 40000000, 0, '2026-08-01 23:59:59', 1, 1),
(4, '2026-05-15 08:00:00', '2026-05-15 08:00:00', 1, 'DevOps Engineer', 'Q7, TP.HCM', '<p>CI/CD pipeline.</p>', '<p>K8s, Docker.</p>', '<p>Bảo hiểm PVI.</p>', 25000000, 45000000, 0, '2026-08-15 23:59:59', 1, 1),
(5, '2026-05-18 08:00:00', '2026-05-18 08:00:00', 1, 'AI Researcher', 'Q7, TP.HCM', '<p>Nghiên cứu NLP.</p>', '<p>Python, PyTorch.</p>', '<p>Thưởng bài báo.</p>', NULL, NULL, 1, '2026-09-01 23:59:59', 1, 1),

(6, '2026-05-02 09:30:00', '2026-05-02 09:30:00', 1, 'Kỹ Sư Cầu Nối (BrSE) Tiếng Nhật', 'Hòa Lạc, Hà Nội', '<p>Làm việc với KH Nhật.</p>', '<p>N2, Java.</p>', '<p>Onsite Nhật.</p>', 30000000, 60000000, 0, '2026-07-30 23:59:59', 1, 2),
(7, '2026-05-05 09:30:00', '2026-05-05 09:30:00', 1, 'Java Web Developer', 'Quận 9, TP.HCM', '<p>Làm dự án Outsource.</p>', '<p>Spring Boot.</p>', '<p>Khám sức khỏe.</p>', 15000000, 30000000, 0, '2026-08-10 23:59:59', 1, 2),
(8, '2026-05-08 09:30:00', '2026-05-08 09:30:00', 1, 'Mulesoft Developer', 'Đà Nẵng', '<p>API Integration.</p>', '<p>Mulesoft Anypoint.</p>', '<p>Bonus dự án.</p>', 20000000, 40000000, 0, '2026-08-20 23:59:59', 1, 2),
(9, '2025-10-10 09:30:00', '2025-10-10 09:30:00', 1, 'Frontend VueJS (Expired)', 'Hà Nội', '<p>Web app.</p>', '<p>Vue 3, Nuxt.</p>', '<p>Lương T13.</p>', 15000000, 25000000, 0, '2025-11-15 23:59:59', 1, 2),
(10, '2025-11-01 09:30:00', '2025-11-01 09:30:00', 1, 'Tester QC (Expired)', 'Hà Nội', '<p>Manual Test.</p>', '<p>Biết SQL.</p>', '<p>Teambuilding.</p>', 10000000, 18000000, 0, '2025-12-10 23:59:59', 1, 2),

(11, '2026-05-01 08:00:00', '2026-05-01 08:00:00', 1, 'Kỹ Sư Vận Hành Trạm Biến Áp', 'Toàn quốc', '<p>Giám sát trạm 110kV.</p>', '<p>Bằng điện lực.</p>', '<p>Phụ cấp trực.</p>', 12000000, 18000000, 0, '2026-07-01 23:59:59', 2, 3),
(12, '2026-05-03 08:00:00', '2026-05-03 08:00:00', 1, 'Chuyên Viên Điều Độ Điện', 'Hà Nội', '<p>Điều độ lưới điện.</p>', '<p>Kinh nghiệm 2 năm.</p>', '<p>Thưởng lễ.</p>', 15000000, 22000000, 0, '2026-07-15 23:59:59', 2, 3),
(13, '2026-05-06 08:00:00', '2026-05-06 08:00:00', 1, 'Kỹ Sư Thiết Kế Lưới Điện', 'TP.HCM', '<p>Thiết kế AutoCAD.</p>', '<p>Đọc bản vẽ.</p>', '<p>Nghỉ mát.</p>', 14000000, 20000000, 0, '2026-07-20 23:59:59', 2, 3),
(14, '2026-05-09 08:00:00', '2026-05-09 08:00:00', 1, 'Thợ Sửa Chữa Đường Dây', 'Đà Nẵng', '<p>Bảo trì dây 500kV.</p>', '<p>Sức khỏe tốt.</p>', '<p>BHXH cao.</p>', 10000000, 15000000, 0, '2026-08-01 23:59:59', 2, 3),
(15, '2026-05-11 08:00:00', '2026-05-11 08:00:00', 1, 'Chuyên Viên An Toàn Điện', 'Hà Nội', '<p>Kiểm tra an toàn.</p>', '<p>Nắm rõ quy chuẩn.</p>', '<p>Lương T13.</p>', 13000000, 19000000, 0, '2026-08-10 23:59:59', 2, 3),

(16, '2026-05-01 10:00:00', '2026-05-01 10:00:00', 1, 'Kỹ Sư Viễn Thông', 'Hà Nội', '<p>Tối ưu trạm BTS.</p>', '<p>Bằng viễn thông.</p>', '<p>Lương mềm.</p>', 15000000, 25000000, 0, '2026-06-30 23:59:59', 2, 4),
(17, '2026-05-05 10:00:00', '2026-05-05 10:00:00', 1, 'Kỹ Sư An Toàn Thông Tin', 'Hà Nội', '<p>Pentest hệ thống.</p>', '<p>CEH, OSCP.</p>', '<p>Thỏa thuận.</p>', NULL, NULL, 1, '2026-07-20 23:59:59', 1, 4),
(18, '2026-05-10 10:00:00', '2026-05-10 10:00:00', 1, 'Kỹ Sư Thiết Kế Khung Gầm Ô Tô', 'Hải Phòng', '<p>Thiết kế gầm VF8.</p>', '<p>Catia V5.</p>', '<p>Ưu đãi mua xe.</p>', 20000000, 35000000, 0, '2026-07-15 23:59:59', 2, 6),
(19, '2026-05-12 10:00:00', '2026-05-12 10:00:00', 1, 'Chuyên Viên Pin Ô Tô Điện', 'Hải Phòng', '<p>Nghiên cứu cell pin.</p>', '<p>Hóa học, Vật liệu.</p>', '<p>Lương thưởng cao.</p>', 25000000, 45000000, 0, '2026-08-01 23:59:59', 2, 6),
(20, '2026-05-15 10:00:00', '2026-05-15 10:00:00', 1, 'Thợ Sơn Ô Tô Cấp Cao', 'Hải Phòng', '<p>Sơn bề mặt xe.</p>', '<p>Kinh nghiệm 5 năm.</p>', '<p>Ăn ca miễn phí.</p>', 15000000, 20000000, 0, '2026-08-15 23:59:59', 2, 6),

(21, '2026-05-01 09:00:00', '2026-05-01 09:00:00', 1, 'Cửa Hàng Trưởng Trạm Xăng', 'TP.HCM', '<p>Quản lý trạm xăng.</p>', '<p>Kn quản lý.</p>', '<p>Khám sức khỏe.</p>', 12000000, 18000000, 0, '2026-06-25 23:59:59', 4, 5),
(22, '2026-05-05 09:00:00', '2026-05-05 09:00:00', 1, 'Chuyên Viên Phát Triển B2B', 'Hà Nội', '<p>Bán sỉ xăng dầu.</p>', '<p>Giao tiếp tốt.</p>', '<p>Hoa hồng.</p>', 15000000, 25000000, 0, '2026-07-10 23:59:59', 4, 5),
(23, '2026-05-10 09:00:00', '2026-05-10 09:00:00', 1, 'Nhân Viên Bơm Xăng', 'Đà Nẵng', '<p>Bơm xăng cho khách.</p>', '<p>Chăm chỉ.</p>', '<p>Bao ăn ca.</p>', 7000000, 10000000, 0, '2026-08-01 23:59:59', 3, 5),
(24, '2025-11-01 09:00:00', '2025-11-01 09:00:00', 1, 'Kế Toán Tổng Hợp (Expired)', 'Hà Nội', '<p>Làm sổ sách.</p>', '<p>Bằng kế toán.</p>', '<p>Thưởng Tết.</p>', 10000000, 15000000, 0, '2025-12-15 23:59:59', 4, 5),
(25, '2025-12-01 09:00:00', '2025-12-01 09:00:00', 1, 'Giám Sát Vùng (Expired)', 'TP.HCM', '<p>Giám sát 10 trạm.</p>', '<p>Chịu đi lại.</p>', '<p>Cấp xe.</p>', 18000000, 25000000, 0, '2026-01-10 23:59:59', 4, 5),

(26, '2026-05-01 10:30:00', '2026-05-01 10:30:00', 1, 'Quản Lý Cửa Hàng Điện Máy Xanh', 'Đồng Nai', '<p>Quản lý siêu thị.</p>', '<p>Kn 2 năm.</p>', '<p>Thưởng theo ds.</p>', 15000000, 30000000, 0, '2026-07-20 23:59:59', 3, 7),
(27, '2026-05-05 10:30:00', '2026-05-05 10:30:00', 1, 'Nhân Viên Tư Vấn Bán Hàng', 'TP.HCM', '<p>Tư vấn đồ điện.</p>', '<p>Ngoại hình sáng.</p>', '<p>Hoa hồng cao.</p>', 8000000, 15000000, 0, '2026-08-05 23:59:59', 4, 7),
(28, '2026-05-10 10:30:00', '2026-05-10 10:30:00', 1, 'Nhân Viên Lắp Đặt Máy Lạnh', 'Bình Dương', '<p>Giao máy lạnh.</p>', '<p>Sức khỏe tốt.</p>', '<p>Bao xăng xe.</p>', 10000000, 20000000, 0, '2026-08-15 23:59:59', 2, 7),
(29, '2026-05-12 10:30:00', '2026-05-12 10:30:00', 1, 'Quản Lý Siêu Thị Bách Hóa Xanh', 'TP.HCM', '<p>Quản lý hàng tươi sống.</p>', '<p>Chịu áp lực.</p>', '<p>Lộ trình thăng tiến.</p>', 12000000, 20000000, 0, '2026-07-25 23:59:59', 3, 8),
(30, '2026-05-15 10:30:00', '2026-05-15 10:30:00', 1, 'Thu Ngân Siêu Thị', 'TP.HCM', '<p>Tính tiền cho khách.</p>', '<p>Nhanh nhẹn.</p>', '<p>BHYT.</p>', 7000000, 10000000, 0, '2026-08-10 23:59:59', 3, 8),
(31, '2026-05-18 10:30:00', '2026-05-18 10:30:00', 1, 'Nhân Viên Kho (Ca Đêm)', 'Cần Thơ', '<p>Kiểm kê kho.</p>', '<p>Làm đêm.</p>', '<p>Phụ cấp đêm.</p>', 8000000, 12000000, 0, '2026-08-20 23:59:59', 3, 8),
(32, '2025-08-01 10:30:00', '2025-08-01 10:30:00', 1, 'Bảo Vệ Siêu Thị (Expired)', 'TP.HCM', '<p>Giữ xe khách.</p>', '<p>Giao tiếp lịch sự.</p>', '<p>Lương ổn định.</p>', 6000000, 8000000, 0, '2025-09-15 23:59:59', 3, 8),

(33, '2026-05-02 08:00:00', '2026-05-02 08:00:00', 1, 'Account Manager B2B', 'TP.HCM', '<p>Bán giải pháp Cloud.</p>', '<p>Tiếng Anh tốt.</p>', '<p>Hoa hồng.</p>', 20000000, 40000000, 0, '2026-07-20 23:59:59', 4, 1),
(34, '2026-05-07 08:00:00', '2026-05-07 08:00:00', 1, 'IT Sales Executive', 'Hà Nội', '<p>Tìm kiếm KH Nhật.</p>', '<p>N2, giao tiếp.</p>', '<p>KPI thưởng lớn.</p>', 15000000, 30000000, 0, '2026-08-10 23:59:59', 4, 2),

(35, '2026-05-10 08:00:00', '2026-05-10 08:00:00', 1, 'Chuyên Viên Marketing', 'TP.HCM', '<p>Chạy Ads DMX.</p>', '<p>Google Ads, FB Ads.</p>', '<p>Ngân sách lớn.</p>', 15000000, 25000000, 0, '2026-07-15 23:59:59', 4, 7),
(36, '2026-05-15 08:00:00', '2026-05-15 08:00:00', 1, 'Content Creator', 'Hà Nội', '<p>Viết bài Viettel.</p>', '<p>Sáng tạo.</p>', '<p>Du lịch.</p>', 10000000, 15000000, 0, '2026-08-01 23:59:59', 4, 4),
(37, '2026-05-20 08:00:00', '2026-05-20 08:00:00', 1, 'UI/UX Designer', 'TP.HCM', '<p>Thiết kế App VinFast.</p>', '<p>Figma.</p>', '<p>Môi trường tốt.</p>', 20000000, 35000000, 0, '2026-08-20 23:59:59', 1, 6),
(38, '2026-05-22 08:00:00', '2026-05-22 08:00:00', 1, 'Chuyên Viên Thu Mua', 'TP.HCM', '<p>Mua hàng tươi sống BHX.</p>', '<p>Thương lượng tốt.</p>', '<p>Thưởng KPIs.</p>', 12000000, 18000000, 0, '2026-07-25 23:59:59', 3, 8),
(39, '2026-05-25 08:00:00', '2026-05-25 08:00:00', 1, 'Nhân Viên Hành Chính Nhân Sự', 'Đà Nẵng', '<p>Chấm công, tính lương.</p>', '<p>Cẩn thận.</p>', '<p>Lương T13.</p>', 8000000, 12000000, 0, '2026-08-10 23:59:59', 4, 3),
(40, '2025-05-01 08:00:00', '2025-05-01 08:00:00', 1, 'Trưởng Phòng Nhân Sự (Expired)', 'TP.HCM', '<p>Quản lý nhân sự.</p>', '<p>5 năm kinh nghiệm.</p>', '<p>Cổ phần.</p>', 30000000, 50000000, 0, '2025-06-15 23:59:59', 4, 1);

TRUNCATE TABLE `jobs_application`;
INSERT INTO `jobs_application` (`id`, `created_at`, `updated_at`, `is_active`, `status`, `review_comment`, `file_cv`, `cover_letter`, `candidate_id`, `job_id`) VALUES

(1, '2026-05-15 09:00:00', '2026-05-15 09:00:00', 1, 'PENDING', '', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', 'Tôi xin ứng tuyển.', 1, 1),
(2, '2026-05-20 10:00:00', '2026-05-20 10:00:00', 1, 'REVIEWING', 'Chuyển trưởng bộ phận.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv2_eryglq.pdf', 'Có kinh nghiệm.', 1, 11),
(3, '2026-05-25 11:00:00', '2026-05-25 11:00:00', 1, 'ACCEPTED', 'Mời phỏng vấn.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv3_ixmfop.pdf', '', 1, 21),
(4, '2026-06-01 14:00:00', '2026-06-01 14:00:00', 1, 'PENDING', '', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779722917/uoq3s7xuaaj8tvjsc1hx.pdf', 'Tôi làm ca đêm được.', 1, 31),
(5, '2025-10-15 09:00:00', '2025-10-15 09:00:00', 1, 'REJECTED', 'Chưa phù hợp.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', 'Rất mong có cơ hội.', 1, 6),
(6, '2025-10-25 09:00:00', '2025-10-25 09:00:00', 1, 'ACCEPTED', 'Phỏng vấn lúc 14h.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv2_eryglq.pdf', '', 1, 9),

(7, '2026-05-16 09:00:00', '2026-05-16 09:00:00', 1, 'REVIEWING', 'Đợi sếp duyệt.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', 'Tôi rành Golang.', 2, 2),
(8, '2026-05-21 10:00:00', '2026-05-21 10:00:00', 1, 'ACCEPTED', 'Check email nhận link Test.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv2_eryglq.pdf', '', 2, 12),
(9, '2026-05-26 11:00:00', '2026-05-26 11:00:00', 1, 'REJECTED', 'Đã tuyển đủ.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv3_ixmfop.pdf', 'Kỹ năng sale tốt.', 2, 22),
(10, '2025-08-15 14:00:00', '2025-08-15 14:00:00', 1, 'ACCEPTED', 'Mời làm bảo vệ.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779722917/uoq3s7xuaaj8tvjsc1hx.pdf', 'Khỏe mạnh.', 2, 32),
(11, '2026-05-15 09:00:00', '2026-05-15 09:00:00', 1, 'PENDING', '', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', 'Java Spring Boot.', 2, 7),
(12, '2025-11-15 09:00:00', '2025-11-15 09:00:00', 1, 'REJECTED', 'Không pass.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv2_eryglq.pdf', 'Tôi làm Tester.', 2, 10),

(13, '2026-05-17 09:00:00', '2026-05-17 09:00:00', 1, 'PENDING', '', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', '', 3, 3),
(14, '2026-05-22 10:00:00', '2026-05-22 10:00:00', 1, 'PENDING', '', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv2_eryglq.pdf', 'Vẽ AutoCAD.', 3, 13),
(15, '2026-05-27 11:00:00', '2026-05-27 11:00:00', 1, 'ACCEPTED', 'Đến làm thủ tục.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv3_ixmfop.pdf', 'Xin ứng tuyển.', 3, 23),
(16, '2026-05-10 14:00:00', '2026-05-10 14:00:00', 1, 'REJECTED', 'Bạn thiếu kn.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779722917/uoq3s7xuaaj8tvjsc1hx.pdf', 'Bán hàng tốt.', 3, 33),

(17, '2026-05-18 09:00:00', '2026-05-18 09:00:00', 1, 'ACCEPTED', 'PV qua Zoom.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', 'Làm DevOps.', 4, 4),
(18, '2026-05-23 10:00:00', '2026-05-23 10:00:00', 1, 'REVIEWING', 'Chờ sếp gọi.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv2_eryglq.pdf', '', 4, 14),
(19, '2025-11-10 11:00:00', '2025-11-10 11:00:00', 1, 'ACCEPTED', 'Đã pass vòng CV.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv3_ixmfop.pdf', 'Làm sổ sách ok.', 4, 24),
(20, '2026-05-15 14:00:00', '2026-05-15 14:00:00', 1, 'PENDING', '', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779722917/uoq3s7xuaaj8tvjsc1hx.pdf', 'Tiếng Nhật N2.', 4, 34),

(21, '2026-05-20 09:00:00', '2026-05-20 09:00:00', 1, 'REJECTED', 'Thiếu bằng ĐH.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', 'Nghiên cứu AI.', 5, 5),
(22, '2026-05-25 10:00:00', '2026-05-25 10:00:00', 1, 'PENDING', '', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv2_eryglq.pdf', 'An toàn điện.', 5, 15),
(23, '2025-12-10 11:00:00', '2025-12-10 11:00:00', 1, 'ACCEPTED', 'PV trực tiếp.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv3_ixmfop.pdf', 'Có thể đi lại.', 5, 25),
(24, '2026-05-20 14:00:00', '2026-05-20 14:00:00', 1, 'REVIEWING', 'Chờ duyệt.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779722917/uoq3s7xuaaj8tvjsc1hx.pdf', 'Chạy FB Ads.', 5, 35),

(25, '2026-05-15 09:00:00', '2026-05-15 09:00:00', 1, 'ACCEPTED', 'Liên hệ Zalo.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', 'N2 BrSE.', 6, 6),
(26, '2026-05-10 10:00:00', '2026-05-10 10:00:00', 1, 'PENDING', '', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv2_eryglq.pdf', 'Viễn thông.', 6, 16),
(27, '2026-05-20 11:00:00', '2026-05-20 11:00:00', 1, 'REVIEWING', 'Duyệt CV.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv3_ixmfop.pdf', 'Cửa hàng trưởng.', 6, 26),
(28, '2026-05-25 14:00:00', '2026-05-25 14:00:00', 1, 'REJECTED', 'Thiếu kinh nghiệm.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779722917/uoq3s7xuaaj8tvjsc1hx.pdf', 'Viết content.', 6, 36),

(29, '2026-05-20 09:00:00', '2026-05-20 09:00:00', 1, 'PENDING', '', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', '', 7, 17),
(30, '2026-05-22 09:00:00', '2026-05-22 09:00:00', 1, 'ACCEPTED', 'Gặp HR lúc 9h.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', '', 8, 27),
(31, '2026-05-25 09:00:00', '2026-05-25 09:00:00', 1, 'REVIEWING', 'Sếp đang xem.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', '', 9, 37),
(32, '2025-05-15 09:00:00', '2025-05-15 09:00:00', 1, 'ACCEPTED', 'Nhận việc t6.', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', '', 10, 40),
(33, '2026-05-28 09:00:00', '2026-05-28 09:00:00', 1, 'PENDING', '', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', 'Ứng tuyển.', 7, 28),
(34, '2026-05-28 09:00:00', '2026-05-28 09:00:00', 1, 'PENDING', '', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', 'Đã lưu việc.', 8, 29),
(35, '2026-05-28 09:00:00', '2026-05-28 09:00:00', 1, 'PENDING', '', 'https://res.cloudinary.com/dlo2e1goo/image/upload/v1779947944/fake_cv1_cnqodt.pdf', 'Hành chính.', 9, 39);

TRUNCATE TABLE `jobs_savedjob`;
INSERT INTO `jobs_savedjob` (`created_at`, `updated_at`, `is_active`, `candidate_id`, `job_id`) VALUES
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 2), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 3), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 4), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 5),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 7), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 8), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 12), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 13),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 14), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 15), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 16), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 17),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 18), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 19), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 1, 20),

('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 1), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 3), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 4), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 5),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 8), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 9), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 11), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 13),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 14), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 15), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 16), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 17),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 18), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 19), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 2, 20),

('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 1), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 2), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 4), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 5),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 6), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 7), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 8), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 9),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 10), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 11), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 12), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 14),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 15), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 16), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 3, 17),

('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 1), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 2), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 3), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 5),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 6), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 7), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 8), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 9),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 10), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 11), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 12), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 13),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 15), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 16), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 4, 17),

('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 21), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 22), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 23), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 24),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 26), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 27), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 28), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 29),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 30), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 31), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 32), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 33),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 34), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 36), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 5, 37),

('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 21), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 22), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 23), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 24),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 25), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 27), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 28), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 29),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 30), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 31), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 32), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 33),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 34), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 35), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 6, 37),

('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 21), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 22), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 23), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 24),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 25), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 26), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 28), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 29),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 30), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 31), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 32), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 33),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 34), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 35), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 7, 36),

('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 21), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 22), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 23), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 24),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 25), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 26), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 27), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 29),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 30), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 31), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 32), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 33),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 34), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 35), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 8, 36),

('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 21), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 22), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 23), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 24),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 25), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 26), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 27), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 28),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 30), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 31), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 32), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 33),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 34), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 35), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 9, 36),

('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 21), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 22), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 23), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 24),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 25), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 26), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 27), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 28),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 29), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 31), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 32), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 33),
('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 34), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 35), ('2026-05-25 00:00:00', '2026-05-25 00:00:00', 1, 10, 36);

SET FOREIGN_KEY_CHECKS = 1;