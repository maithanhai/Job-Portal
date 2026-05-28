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
        return self.username

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

    def __str__(self):
        return self.user.username


class Employer(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=100)
    logo_company = CloudinaryField('logo', null=True, blank=True)
    location = models.CharField(max_length=100, null=True)
    is_verified = models.BooleanField(default=False)
    tax_code = models.CharField(max_length=50, null=True, blank=True)
    employee_card = CloudinaryField('employee_card', null=True, blank=True)
    read_only_fields = ['is_verified']

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
    requirements = RichTextField(null=True, blank=True)
    benefits = RichTextField(null=True, blank=True)

    salary_min = models.PositiveIntegerField(null=True, blank=True)
    salary_max = models.PositiveIntegerField(null=True, blank=True)
    is_negotiable = models.BooleanField(default=False)
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
    review_comment = models.TextField(null=True, blank=True)
    file_cv = CloudinaryField(null=False, blank=False)
    cover_letter = models.TextField(max_length=500, blank=True)

    def __str__(self):
        return f"Tài khoản '{self.candidate.user.username}' ứng tuyển vào {self.job.name}"

class SavedJob(BaseModel):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('candidate', 'job')

    def __str__(self):
        return f"Tài khoản '{self.candidate.user.username}' đã lưu {self.job.name}"
