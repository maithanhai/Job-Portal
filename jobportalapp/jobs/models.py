from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField

class User(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    avatar = CloudinaryField('avatar')
    phone_number = models.CharField(max_length=10, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)
    class Meta:
        abstract = True

class Province(BaseModel):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
class Commune(BaseModel):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Candidate(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    skills = models.TextField(blank=True)

class Employer(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=100)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    commune = models.ForeignKey(Commune, on_delete=models.CASCADE)
    def __str__(self):
        return self.company_name

class Category(BaseModel):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Tag(BaseModel):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Job(BaseModel):
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    commune = models.ForeignKey(Commune, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag)
    title = models.CharField(max_length=100)
    description = models.TextField()
    salary = models.CharField(max_length=100)
    is_premium = models.BooleanField(default=False)
    def __str__(self):
        return self.title

class Application(BaseModel):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE,related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    cv_file = models.FileField(upload_to='cv_files/', blank=True)
    status = models.CharField(max_length=100,default='PENDING')
    def __str__(self):
        return f"{self.candidate.user.full_name} nộp vào {self.job.title}"

class Payment(BaseModel):
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(max_length=100)
    status = models.BooleanField(default=False)
    def __str__(self):
        return f"Thanh toán {self.amount} của {self.employer.company_name}"


