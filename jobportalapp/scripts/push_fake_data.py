import random
from faker import Faker
from django.contrib.auth import get_user_model
from django.db import transaction, IntegrityError
from django.utils import timezone
from jobs.models import Category, Skill, Employer, Candidate, Job, Resume, Application

fake = Faker('vi_VN')
User = get_user_model()

NUM_EMPLOYERS = 30
NUM_CANDIDATES = 60
JOBS_PER_EMPLOYER = (5, 8)


def clean_old_data():
    """Xoa sach du lieu cu de tranh bi trung lap khi chay script nhieu lan."""
    print("Dang don dep du lieu cu trong Database...")
    Application.objects.all().delete()
    Resume.objects.all().delete()
    Job.objects.all().delete()
    Employer.objects.all().delete()
    Candidate.objects.all().delete()
    # Chi xoa user thuong, giu lai admin
    User.objects.filter(is_superuser=False).delete()


def seed_categories_and_skills():
    """Khoi tao danh muc nganh nghe va bo ky nang chi tiet."""
    data = {
        "Phát triển Phần mềm": [
            "Python", "Django", "Java", "Spring Boot", "ReactJS", "Angular", "VueJS",
            "NodeJS", "Flutter", "Swift", "Docker", "Kubernetes", "AWS", "MySQL", "PostgreSQL"
        ],
        "Dữ liệu & AI": [
            "Machine Learning", "Deep Learning", "Data Analysis", "SQL Server",
            "Power BI", "Tableau", "TensorFlow", "PyTorch", "Big Data", "Hadoop"
        ],
        "Marketing & Truyền thông": [
            "Digital Marketing", "SEO", "Content Creator", "Google Ads", "Facebook Ads",
            "Social Media Management", "Email Marketing", "Copywriting", "Market Research"
        ],
        "Kinh doanh & Bán hàng": [
            "Bán hàng B2B", "Telesales", "Quản lý khách hàng (CRM)", "Kỹ năng đàm phán",
            "Phân tích thị trường", "Quản lý chuỗi cung ứng", "Kế hoạch kinh doanh"
        ],
        "Thiết kế Đồ họa & UI/UX": [
            "Figma", "Adobe Photoshop", "Adobe Illustrator", "UX Research",
            "Prototyping", "Thiết kế giao diện", "After Effects", "Blender"
        ],
        "Tài chính & Kế toán": [
            "Kiểm toán", "Kế toán thuế", "Phân tích tài chính", "Quản trị rủi ro",
            "SAP", "Chứng khoán", "Ngân hàng", "Lập ngân sách"
        ],
        "Nhân sự & Hành chính": [
            "Tuyển dụng", "Tính lương (C&B)", "Đào tạo & Phát triển", "Quản trị văn phòng",
            "Luật lao động", "Văn hóa doanh nghiệp"
        ],
        "Ngôn ngữ & Dịch thuật": [
            "Tiếng Anh Giao tiếp", "Tiếng Nhật N3", "Tiếng Trung HSK5", "Biên dịch",
            "Phiên dịch cabin", "Tiếng Hàn TOPIK"
        ],
        "Kỹ thuật & Cơ khí": [
            "AutoCAD", "SolidWorks", "Vận hành máy CNC", "Bảo trì công nghiệp",
            "Kỹ thuật điện", "Điều khiển tự động"
        ],
        "Dịch vụ & Khách sạn": [
            "Quản trị nhà hàng", "Nghiệp vụ buồng phòng", "Pha chế (Bartender)",
            "Hướng dẫn viên du lịch", "Quản lý sự kiện"
        ]
    }

    all_categories = []
    all_skills = []

    for cat_name, skill_list in data.items():
        category, _ = Category.objects.get_or_create(
            name=cat_name,
            defaults={"description": f"Các công việc thuộc lĩnh vực {cat_name}"}
        )
        all_categories.append(category)
        for skill_name in skill_list:
            skill, _ = Skill.objects.get_or_create(name=skill_name, category=category)
            all_skills.append(skill)

    return all_categories, all_skills


def create_employers(count):
    """Tao tai khoan nha tuyen dung."""
    employers = []
    for _ in range(count):
        try:
            with transaction.atomic():
                username = fake.unique.user_name()

                # --- SỬA LOGIC TÊN TẠI ĐÂY ---
                # 1. Tạo tên người thật cho nhân sự HR
                hr_full_name = fake.name()
                # 2. Tạo tên doanh nghiệp riêng biệt
                fake_company_name = fake.company()

                user = User.objects.create_user(
                    username=username,
                    email=f"hr.{username}@company.vn",
                    password="Password123!",
                    full_name=hr_full_name,  # Gán tên người thật vào User
                    role=User.EMPLOYER,
                    avatar="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                )

                employer = Employer.objects.create(
                    user=user,
                    company_name=fake_company_name,  # Gán tên doanh nghiệp vào Employer
                    location=fake.city(),
                    is_verified=True
                )
                employers.append(employer)
        except IntegrityError:
            continue
    return employers


def create_jobs(employers, categories, skills):
    """Tao so luong lon Jobs de test phan trang."""
    for emp in employers:
        num_jobs = random.randint(*JOBS_PER_EMPLOYER)
        for _ in range(num_jobs):
            category = random.choice(categories)
            relevant_skills = [s for s in skills if s.category == category]

            # --- SỬA LOGIC LƯƠNG TẠI ĐÂY ---
            # 1. Random xem công việc này có phải "Lương thỏa thuận" hay không
            is_negotiable_value = random.choice([True, False])

            # 2. Nếu là Thỏa thuận -> Xóa trắng mức lương. Nếu không -> Random số tiền
            if is_negotiable_value:
                min_sal = None
                max_sal = None
            else:
                min_sal = random.randint(8, 15) * 1000000
                max_sal = random.randint(16, 45) * 1000000
            # -------------------------------

            job = Job.objects.create(
                name=f"Tuyển {fake.job()} - {category.name}",
                category=category,
                employer=emp,
                location=fake.address(),
                description=f"<h3>Yêu cầu công việc</h3><p>{fake.paragraph(nb_sentences=5)}</p>",

                # Truyền biến vừa tạo vào đây
                salary_min=min_sal,
                salary_max=max_sal,
                is_negotiable=is_negotiable_value,

                is_premium=random.choice([True, False, False]),
                deadline=timezone.make_aware(fake.future_datetime(end_date="+60d"))
            )

            if relevant_skills:
                num_skill = min(len(relevant_skills), random.randint(3, 5))
                job.skill.add(*random.sample(relevant_skills, k=num_skill))

def create_candidates(count, skills):
    """Tao ung vien va ho so ung tuyen."""
    all_jobs = list(Job.objects.all())
    for _ in range(count):
        try:
            with transaction.atomic():
                username = fake.unique.user_name()
                user = User.objects.create_user(
                    username=username,
                    email=f"{username}@gmail.com",
                    password="Password123!",
                    full_name=fake.name(),
                    role=User.CANDIDATE,
                    avatar="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                )
                candidate = Candidate.objects.create(user=user)
                candidate.skills.add(*random.sample(skills, k=random.randint(3, 6)))

                resume = Resume.objects.create(
                    name=f"CV_{user.full_name}_Professional",
                    candidate=candidate,
                    file_cv="https://res.cloudinary.com/demo/image/upload/sample.pdf"
                )
                resume.skills.set(candidate.skills.all())

                applied_jobs = random.sample(all_jobs, k=random.randint(1, 3))
                for job in applied_jobs:
                    Application.objects.create(
                        candidate=candidate,
                        job=job,
                        resume=resume,
                        status=random.choice(['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED']),
                        cover_letter=fake.text(max_nb_chars=300)
                    )
        except IntegrityError:
            continue


def run():
    print("--- Khoi dau qua trinh seeding du lieu he thong ---")

    clean_old_data()

    categories, skills = seed_categories_and_skills()
    print(f"1. Da khoi tao {len(categories)} danh muc (Category) va {len(skills)} ky nang (Skills).")

    employers = create_employers(NUM_EMPLOYERS)
    print(f"2. Da tao {len(employers)} nha tuyen dung (Employee).")

    create_jobs(employers, categories, skills)
    print(f"3. Da hoan tat dang tai danh sach cong viec (Jobs).")

    create_candidates(NUM_CANDIDATES, skills)
    print(f"4. Da khoi tao ung vien (Candidate) va cac don ung tuyen (Resume).")

    print("--- Seed du lieu hoan tat. He thong da san sang de test ---")