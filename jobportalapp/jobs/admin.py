from django.template.response import TemplateResponse
from django.contrib import admin
from django.contrib.admin import AdminSite, StackedInline
from django.urls import path
from jobs.models import Candidate, Job, Employer, User, CandidateProxy, EmployerProxy, Category, Skill, Application, \
    SavedJob, Payment


# ==========================================
# 1. TÙY BIẾN ADMIN SITE & TRANG THỐNG KÊ (STATS)
# ==========================================
class MyAdminSite(AdminSite):
    site_title = "Job Portal Admin"
    site_header = "Quản lý hệ thống sàn việc làm trực tuyến"
    index_title = "Bảng điều khiển hệ thống"

    def get_urls(self):
        return [
            path('stats/', self.job_portal_stats)
        ] + super().get_urls()

    def job_portal_stats(self, request):
        context = self.each_context(request)
        application_total = Application.objects.filter(is_active=True).count()
        job_total = Job.objects.filter(is_active=True).count()
        employer_total = Employer.objects.filter(is_active=True, is_verified=True).count()
        candidate_total = Candidate.objects.filter(is_active=True).count()

        context.update({
            'stats': {
                'application_total': application_total,
                'job_total': job_total,
                'employer_total': employer_total,
                'candidate_total': candidate_total
            }
        })
        return TemplateResponse(request, 'admin/stats.html', context)


# ==========================================
# 2. CẤU HÌNH PHÂN QUYỀN VAI TRÒ (BASE ROLE ADMIN)
# ==========================================
class BaseRoleAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Thông tin tài khoản', {
            # ĐA SỬA: Thay thế 'full_name' thành 'first_name', 'last_name' chuẩn Django
            'fields': ('username', 'password', 'email', 'first_name', 'last_name', 'phone_number', 'avatar',
                       'is_active')
        }),
    )
    role_type = None

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(role=self.role_type)

    def save_model(self, request, obj, form, change):
        if not change:
            obj.role = self.role_type
            obj.set_password(obj.password)
        super().save_model(request, obj, form, change)


# ==========================================
# 3. ĐĂNG KÝ GIAO DIỆN INLINE CHO CANDIDATE & EMPLOYER
# ==========================================
class CandidateInlineAdmin(admin.StackedInline):
    model = Candidate
    fk_name = 'user'
    extra = 0


class MyCandidateAdmin(BaseRoleAdmin):
    role_type = User.CANDIDATE
    inlines = [CandidateInlineAdmin]


class EmployerInlineAdmin(admin.StackedInline):
    model = Employer
    fk_name = 'user'
    extra = 0


class MyEmployerAdmin(BaseRoleAdmin):
    role_type = User.EMPLOYER
    inlines = [EmployerInlineAdmin]


# ==========================================
# 4. KHỞI TẠO VÀ ĐĂNG KÝ HỆ THỐNG MODEL VÀO ADMIN SITE
# ==========================================
admin.site = MyAdminSite(name="Admin Site")

# Đăng ký Proxy Model phân tách vai trò quản lý tài khoản
admin.site.register(CandidateProxy, MyCandidateAdmin)
admin.site.register(EmployerProxy, MyEmployerAdmin)

# Đăng ký các Model chức năng cốt lõi hệ thống sàn việc làm
admin.site.register(Category)
admin.site.register(Skill)
admin.site.register(Job)
admin.site.register(Application)
admin.site.register(SavedJob)
admin.site.register(Payment)