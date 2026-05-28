from django.template.response import TemplateResponse
from django.contrib import admin
from django.contrib.admin import AdminSite, StackedInline
from django.urls import path
from django.db.models import Count
from django.utils.safestring import mark_safe

from jobs.models import Candidate, Job, Employer, User, CandidateProxy, EmployerProxy, Category, Application, SavedJob


class MyAdminSite(AdminSite):
    site_title = "Job Portal Admin"
    site_header = "Quản lý hệ thống sàn việc làm trực tuyến"
    index_title = "Quản lý hệ thống"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('stats/', self.admin_view(self.job_portal_stats), name='job_portal_stats')
        ]
        return custom_urls + urls

    def job_portal_stats(self, request):
        context = self.each_context(request)

        stats = {
            'application_total': Application.objects.filter(is_active=True).count(),
            'job_total': Job.objects.filter(is_active=True).count(),
            'employer_total': Employer.objects.filter(is_active=True, is_verified=True).count(),
            'candidate_total': Candidate.objects.count(),
            'pending_employer_total': Employer.objects.filter(is_verified=False).count(),
        }

        categories = Category.objects.annotate(job_count=Count('job')).filter(job_count__gt=0)
        category_labels = [cat.name for cat in categories]
        category_counts = [cat.job_count for cat in categories]

        pending = Application.objects.filter(status='PENDING').count()
        reviewing = Application.objects.filter(status='REVIEWING').count()
        accepted = Application.objects.filter(status='ACCEPTED').count()
        rejected = Application.objects.filter(status='REJECTED').count()

        chart_data = {
            'category_labels': category_labels,
            'category_counts': category_counts,
            'status_counts': [pending, reviewing, accepted, rejected]
        }

        pending_employers = Employer.objects.filter(is_verified=False).select_related('user').order_by('-id')[:10]

        context.update({
            'title': 'Báo cáo thống kê',
            'stats': stats,
            'chart_data': chart_data,
            'pending_employers': pending_employers,
        })
        return TemplateResponse(request, 'admin/stats.html', context)


class BaseRoleAdmin(admin.ModelAdmin):
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone_number']
    list_filter = ['is_active', 'date_joined']

    fieldsets = (
        ('Thông tin tài khoản', {
            'fields': ('username', 'email', 'first_name', 'last_name', 'phone_number',
                       'avatar_preview', 'is_active')
        }),
    )
    role_type = None
    readonly_fields = ['avatar_preview', 'username', 'email', 'first_name', 'last_name', 'phone_number']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(role=self.role_type)

    def save_model(self, request, obj, form, change):
        if not change:
            obj.role = self.role_type
            obj.set_password(obj.password)
        super().save_model(request, obj, form, change)

    def avatar_preview(self, obj):
        if obj and obj.avatar:
            return mark_safe(
                f'<img src="{obj.avatar.url}" style="max-height: 150px; border-radius: 8px; border: 1px solid #ccc;" />')
        return "Chưa có ảnh đại diện"


class CandidateInlineAdmin(admin.StackedInline):
    model = Candidate
    fk_name = 'user'
    extra = 0


class MyCandidateAdmin(BaseRoleAdmin):
    role_type = User.CANDIDATE
    inlines = [CandidateInlineAdmin]


class EmployerInlineAdmin(admin.TabularInline):
    model = Employer
    fk_name = 'user'
    extra = 0
    list_display = ['username', 'company_name']
    fields = ('company_name', 'logo_preview', 'location', 'is_verified', 'tax_code',
              'card_preview')
    readonly_fields = ['logo_preview', 'card_preview', 'company_name', 'location', 'tax_code']

    def logo_preview(self, obj):
        if obj and obj.logo_company:
            return mark_safe(
                f'<img src="{obj.logo_company.url}" style="max-height: 120px; border-radius: 8px; border: 1px solid #ccc;" />')
        return "Chưa có Logo"

    def card_preview(self, obj):
        if obj and obj.employee_card:
            return mark_safe(
                f'<img src="{obj.employee_card.url}" style="max-height: 250px; border-radius: 8px; border: 1px solid #ccc;" />')
        return "Chưa có Ảnh thẻ"

class MyEmployerAdmin(BaseRoleAdmin):
    role_type = User.EMPLOYER
    inlines = [EmployerInlineAdmin]
    list_display = ['username', 'email', 'get_company_name', 'get_is_verified', 'is_active', 'date_joined']
    list_filter = ['is_active', 'employer__is_verified', 'date_joined']

    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone_number', 'employer__company_name',
                     'employer__tax_code']

    def get_company_name(self, obj):
        return obj.employer.company_name if hasattr(obj, 'employer') else "-"

    get_company_name.short_description = 'Tên công ty'
    def get_is_verified(self, obj):
        if hasattr(obj, 'employer'):
            return mark_safe(
                '<span style="color: green; font-weight: bold;">Đã duyệt</span>') if obj.employer.is_verified else mark_safe(
                '<span style="color: red; font-weight: bold;">Chờ duyệt</span>')
        return "-"

    get_is_verified.short_description = 'Trạng thái duyệt'

class MyApplicationAdmin(admin.ModelAdmin):
    list_display = ['candidate', 'job', 'status', 'created_at']
    fields = ['candidate', 'job', 'status', 'created_at', 'file_cv_preview', 'cover_letter', 'review_comment']
    readonly_fields = ['candidate', 'job', 'created_at', 'status', 'file_cv_preview', 'cover_letter', 'review_comment']
    list_filter = ['status', 'created_at', 'is_active']
    search_fields = ['candidate__user__username', 'candidate__user__email', 'job__name', 'job__employer__company_name']

    def file_cv_preview(self, obj):
        if not obj.file_cv:
            return "Chưa có CV đính kèm"
        cv_url = obj.file_cv.url
        if not cv_url or cv_url == 'None':
            return "Chưa có CV đính kèm"

        return mark_safe(
            f'<a href="{cv_url}" target="_blank" style="display: inline-block; background-color:'
            f' #417690; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px;'
            f' font-weight: bold;">Mở file CV</a>'
        )


class MyJobAdmin(admin.ModelAdmin):
    list_display = ['name', 'employer', 'category', 'is_active', 'created_at', 'deadline']
    fields = ['is_active', 'name', 'category', 'employer', 'created_at', 'location', 'description', 'requirements',
              'benefits', 'salary_min', 'salary_max', 'is_negotiable', 'deadline']
    readonly_fields = ['name', 'category', 'employer', 'created_at', 'location', 'description', 'requirements',
                       'benefits', 'salary_min', 'salary_max', 'is_negotiable', 'deadline']

    list_filter = ['is_active', 'category', 'is_negotiable', 'created_at']
    search_fields = ['name', 'employer__company_name', 'location']

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']

class SavedJobAdmin(admin.ModelAdmin):
    list_display = ['candidate', 'job', 'created_at']
    list_filter = ['created_at']
    search_fields = ['candidate__user__username', 'job__name']


admin.site = MyAdminSite(name="Admin Site")

admin.site.register(CandidateProxy, MyCandidateAdmin)
admin.site.register(EmployerProxy, MyEmployerAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Job, MyJobAdmin)
admin.site.register(Application, MyApplicationAdmin)
admin.site.register(SavedJob, SavedJobAdmin)