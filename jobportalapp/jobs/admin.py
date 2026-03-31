from multiprocessing.resource_tracker import register

from django.contrib import admin
from django.contrib.admin import AdminSite

from jobs.models import Candidate, Job, Tag, Employer, User


class MyAdminSite(AdminSite):
    site_title = "Job Portal"
    site_header = "Quản lý hệ thống sàn việc làm trực tuyến"
    index_title = "Admin"

# Register your models here.
admin.site = MyAdminSite(name="Admin Site")
admin.site.register(User)
admin.site.register(Employer)
admin.site.register(Candidate)
admin.site.register(Job)
admin.site.register(Tag)