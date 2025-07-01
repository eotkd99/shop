from pathlib import Path
from datetime import timedelta

# 기본 프로젝트 경로 및 보안
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-vr-2p-#pt-ybc-_gqqiajm%nvctjncg0-(g@b)mull*o=h)*e%'
DEBUG = True
ALLOWED_HOSTS = []

# 앱 등록
INSTALLED_APPS = [
    'main',
    'user',
    'products',
    'corsheaders',
    'django_extensions',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

# 미들웨어
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS 설정
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
CORS_ALLOW_CREDENTIALS = True

# URL, WSGI, Templating
ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# 데이터베이스
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'shop_db',
        'USER': 'postgres',
        'PASSWORD': '1670',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# 패스워드 검증
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
        "OPTIONS": {
            "user_attributes": ("username", "email")
        }
    },
    {
        "NAME": "user.validators.SafeSpecialCharacterPasswordValidator",
    },
]

# 언어, 시간대, 국제화
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# 정적파일
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST 프레임워크(JWT 쿠키 인증)
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        'user.authentication.CookieJWTAuthentication',
    )
}

# SimpleJWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
}

# 쿠키/세션 보안
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False

LANGUAGE_CODE = 'ko'  # 한글로 설정

LANGUAGES = [
    ('ko', 'Korean'),
    ('en', 'English'),
]