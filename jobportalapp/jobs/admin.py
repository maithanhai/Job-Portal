from multiprocessing.resource_tracker import register

from django.template.response import TemplateResponse

from django.contrib.auth.admin import UserAdmin

from django.contrib import admin
from django.contrib.admin import AdminSite, ModelAdmin, StackedInline
from django.urls import path
from jobs.models import Candidate, Job, Employer, User, CandidateProxy, EmployerProxy, Category, Skill, Resume


#Admin
class MyAdminSite(AdminSite):
    site_title = "Job Portal"
    site_header = "Quản lý hệ thống sàn việc làm trực tuyến"
    index_title = "Admin"
    def get_urls(self):
        return [
            path('job-potarl-stats/',self.job_portal_stats)
        ]
    def job_portal_stats(self, request):
        stats = {
            
        }
        return TemplateResponse(request,'admin/stats.html',{
            'stats': stats
        })


class BaseRoleAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Thông tin tài khoản', {
            'fields': ('username','password','email', 'full_name')
        }),
    )
    role_type=None
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(role=self.role_type)

    def save_model(self, request, obj, form, change):
        if not change:
            obj.role = self.role_type
            obj.set_password(obj.password)
        super().save_model(request, obj, form, change)

#Admin Candidate
class CandidateInlineAdmin(admin.StackedInline):
    model = Candidate
    fk_name = 'user'

class MyCandidateAdmin(BaseRoleAdmin):
    role_type=User.CANDIDATE
    inlines = [CandidateInlineAdmin]

#Admin Employer
class EmployerInlineAdmin(admin.StackedInline):
    model=Employer
    fk_name='user'

class MyEmployerAdmin(BaseRoleAdmin):
    role_type=User.EMPLOYER
    inlines = [EmployerInlineAdmin]

class MyCategoryAdmin(admin.ModelAdmin):
    pass

class SkillInLine(StackedInline):
    model = Skill
    fk_name='Resume'
class MyResumeAdmin(admin.ModelAdmin):
    model = Resume
    inlines = [SkillInLine]

# Register your models here.
admin.site = MyAdminSite(name="Admin Site")
admin.site.register(CandidateProxy,MyCandidateAdmin)
admin.site.register(EmployerProxy,MyEmployerAdmin)
admin.site.register(Category,MyCategoryAdmin)
admin.site.register(Job)
admin.site.register(Skill)
admin.site.register(Resume)
