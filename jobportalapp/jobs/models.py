from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField
from ckeditor.fields import RichTextField


class User(AbstractUser):
    CANDIDATE = 'CANDIDATE'
    EMPLOYER = 'EMPLOYER'
    ADMIN = 'ADMIN'

    ROLE_CHOICES = (
        (CANDIDATE, 'Candidate'),
        (EMPLOYER, 'Employer'),
        (ADMIN, 'Admin'),
    )
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default=CANDIDATE,
    )
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True, null=False, blank=False)
    avatar = CloudinaryField('avatar', null=False, blank=False)
    phone_number = models.CharField(max_length=10, blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if self.is_superuser and self.role != self.ADMIN:
            self.role = User.ADMIN
        super().save(*args, **kwargs)


class CandidateProxy(User):
    class Meta:
        proxy = True
        verbose_name = "Candidate"


class EmployerProxy(User):
    class Meta:
        proxy = True
        verbose_name = "Employer"


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Candidate(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    skills = models.ManyToManyField('Skill', blank=True)

    def __str__(self):
        return self.user.email


class Employer(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, null=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.company_name


class Category(BaseModel):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class Job(BaseModel):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    employer = models.ForeignKey(Employer, on_delete=models.PROTECT, related_name='jobs')
    location = models.CharField(max_length=255)
    description = RichTextField()
    salary_min = models.PositiveIntegerField(null=True, blank=True, help_text="Mức lương thấp nhất (VNĐ)")
    salary_max = models.PositiveIntegerField(null=True, blank=True, help_text="Mức lương cao nhất (VNĐ)")
    is_negotiable = models.BooleanField(default=False, help_text="Lương thoả thuận")
    skill = models.ManyToManyField('Skill', blank=True)
    is_premium = models.BooleanField(default=False)
    deadline = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name


class Application(BaseModel):
    STATUS_CHOICES = (
        ('PENDING', 'Chờ duyệt'),
        ('REVIEWING', 'Đang xem xét'),
        ('ACCEPTED', 'Chấp nhận'),
        ('REJECTED', 'Từ chối'),
    )
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    file_cv = CloudinaryField('raw', null=False, blank=False, help_text="File tài liệu CV ứng tuyển")
    cover_letter = models.TextField(max_length=500, blank=True)

    def __str__(self):
        return f"{self.candidate.user.email} nộp vào {self.job.name}"


class Payment(BaseModel):
    employer = models.ForeignKey(Employer, on_delete=models.PROTECT)
    job = models.ForeignKey(Job, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(max_length=100)
    status = models.BooleanField(default=False)

    def __str__(self):
        return f"Thanh toán {self.amount} của {self.employer.company_name}"


class SavedJob(BaseModel):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('candidate', 'job')

    def __str__(self):
        # ĐÃ SỬA: Thay full_name bằng email
        return f"{self.candidate.user.email} đã lưu {self.job.name}"


class Skill(BaseModel):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name