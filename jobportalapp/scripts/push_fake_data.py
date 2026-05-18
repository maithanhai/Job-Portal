import os
import sys
import django
import random

# --- THIẾT LẬP MÔI TRƯỜNG DJANGO ---
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'jobportalapp.settings')  # Thay bằng tên folder chứa settings.py nếu khác
django.setup()

from faker import Faker
from django.contrib.auth import get_user_model
from django.db import transaction, IntegrityError
from django.utils import timezone
from jobs.models import Category, Skill, Employer, Candidate, Job, Resume, Application

fake = Faker('vi_VN')
User = get_user_model()

NUM_EMPLOYERS = 50  # Tăng lên để Hải test cho sướng
NUM_CANDIDATES = 100
JOBS_PER_EMPLOYER = (5, 10)


def split_vietnamese_name(full_name):
    """Hàm bổ trợ tách tên tiếng Việt thành last_name và first_name."""
    parts = full_name.split()
    if len(parts) > 1:
        first_name = parts[-1]
        last_name = " ".join(parts[:-1])
    else:
        first_name = full_name
        last_name = ""
    return first_name, last_name


def clean_old_data():
    print("Dang don dep du lieu cu...")
    Application.objects.all().delete()
    Resume.objects.all().delete()
    Job.objects.all().delete()
    Employer.objects.all().delete()
    Candidate.objects.all().delete()
    User.objects.filter(is_superuser=False).delete()


def seed_categories_and_skills():
    # ... (Giữ nguyên phần khởi tạo data như code bạn đưa) ...
    data = {
        "Phát triển Phần mềm": ["Python", "Django", "Java", "Spring Boot", "ReactJS", "NodeJS"],
        "Dữ liệu & AI": ["Machine Learning", "Deep Learning", "Data Analysis", "SQL Server"],
        "Marketing": ["Digital Marketing", "SEO", "Google Ads"],
        # Bạn có thể thêm tiếp các danh mục khác vào đây
    }
    all_categories = []
    all_skills = []
    for cat_name, skill_list in data.items():
        category, _ = Category.objects.get_or_create(name=cat_name)
        all_categories.append(category)
        for skill_name in skill_list:
            skill, _ = Skill.objects.get_or_create(name=skill_name, category=category)
            all_skills.append(skill)
    return all_categories, all_skills


def create_employers(count):
    employers = []
    for _ in range(count):
        try:
            with transaction.atomic():
                full_name = fake.name()
                fn, ln = split_vietnamese_name(full_name)  # TÁCH TÊN Ở ĐÂY
                username = fake.unique.user_name()

                user = User.objects.create_user(
                    username=username,
                    email=fake.unique.email(),
                    password="Password123!",
                    first_name=fn,  # Dùng trường mới
                    last_name=ln,  # Dùng trường mới
                    role=User.EMPLOYER,
                    avatar="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                )
                employer = Employer.objects.create(
                    user=user,
                    company_name=fake.company(),
                    location=fake.city(),
                    is_verified=True
                )
                employers.append(employer)
        except IntegrityError:
            continue
    return employers


def create_jobs(employers, categories, skills):
    for emp in employers:
        num_jobs = random.randint(*JOBS_PER_EMPLOYER)
        for _ in range(num_jobs):
            category = random.choice(categories)
            relevant_skills = [s for s in skills if s.category == category]
            is_negotiable_value = random.choice([True, False])

            job = Job.objects.create(
                name=f"Tuyển {fake.job()}",
                category=category,
                employer=emp,
                location=fake.address(),
                description=f"<p>{fake.text()}</p>",
                salary_min=None if is_negotiable_value else random.randint(8, 15) * 1000000,
                salary_max=None if is_negotiable_value else random.randint(16, 45) * 1000000,
                is_negotiable=is_negotiable_value,
                deadline=timezone.make_aware(fake.future_datetime(end_date="+60d"))
            )
            if relevant_skills:
                job.skill.add(*random.sample(relevant_skills, k=min(len(relevant_skills), 3)))


def create_candidates(count, skills):
    all_jobs = list(Job.objects.all())
    for _ in range(count):
        try:
            with transaction.atomic():
                full_name = fake.name()
                fn, ln = split_vietnamese_name(full_name)  # TÁCH TÊN Ở ĐÂY
                username = fake.unique.user_name()

                user = User.objects.create_user(
                    username=username,
                    email=fake.unique.email(),
                    password="Password123!",
                    first_name=fn,
                    last_name=ln,
                    role=User.CANDIDATE
                )
                candidate = Candidate.objects.create(user=user)
                candidate.skills.add(*random.sample(skills, k=random.randint(2, 4)))

                # Tạo Resume & Application tương tự code cũ của Hải...
        except IntegrityError:
            continue


def run():
    print("--- START SEEDING ---")
    clean_old_data()
    categories, skills = seed_categories_and_skills()
    employers = create_employers(NUM_EMPLOYERS)
    create_jobs(employers, categories, skills)
    create_candidates(NUM_CANDIDATES, skills)
    print("--- SEEDING HOAN TAT ---")


if __name__ == "__main__":
    run()