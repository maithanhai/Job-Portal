import ckeditor.fields
import cloudinary.models
import django.contrib.auth.models
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('role', models.CharField(choices=[('CANDIDATE', 'Candidate'), ('EMPLOYER', 'Employer'), ('ADMIN', 'Admin')], default='CANDIDATE', max_length=10)),
                ('username', models.CharField(max_length=50, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('avatar', cloudinary.models.CloudinaryField(max_length=255, verbose_name='avatar')),
                ('phone_number', models.CharField(blank=True, max_length=10)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='CandidateProxy',
            fields=[
            ],
            options={
                'verbose_name': 'Candidate',
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('jobs.user',),
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='EmployerProxy',
            fields=[
            ],
            options={
                'verbose_name': 'Employer',
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('jobs.user',),
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Candidate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Employer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('company_name', models.CharField(max_length=100)),
                ('logo_company', cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True, verbose_name='logo')),
                ('location', models.CharField(max_length=100, null=True)),
                ('is_verified', models.BooleanField(default=False)),
                ('tax_code', models.CharField(blank=True, max_length=50, null=True)),
                ('employee_card', cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True, verbose_name='employee_card')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('name', models.CharField(max_length=100)),
                ('location', models.CharField(max_length=255)),
                ('description', ckeditor.fields.RichTextField()),
                ('requirements', ckeditor.fields.RichTextField(blank=True, null=True)),
                ('benefits', ckeditor.fields.RichTextField(blank=True, null=True)),
                ('salary_min', models.PositiveIntegerField(blank=True, null=True)),
                ('salary_max', models.PositiveIntegerField(blank=True, null=True)),
                ('is_negotiable', models.BooleanField(default=False)),
                ('deadline', models.DateTimeField(blank=True, null=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='jobs.category')),
                ('employer', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='jobs', to='jobs.employer')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('status', models.CharField(choices=[('PENDING', 'Chờ duyệt'), ('REVIEWING', 'Đang xem xét'), ('ACCEPTED', 'Chấp nhận'), ('REJECTED', 'Từ chối')], default='PENDING', max_length=20)),
                ('review_comment', models.TextField(blank=True, null=True)),
                ('file_cv', cloudinary.models.CloudinaryField(max_length=255)),
                ('cover_letter', models.TextField(blank=True, max_length=500)),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='jobs.candidate')),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='jobs.job')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SavedJob',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_jobs', to='jobs.candidate')),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='jobs.job')),
            ],
            options={
                'unique_together': {('candidate', 'job')},
            },
        ),
    ]
