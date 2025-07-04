from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import password_validation
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from .validators import SafeSpecialCharacterPasswordValidator

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password, SafeSpecialCharacterPasswordValidator()],
        style={"input_type": "password"}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"}
    )
    agree = serializers.BooleanField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "password2", "agree")

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password2"):
            raise serializers.ValidationError({"password2": "비밀번호가 일치하지 않습니다."})

        if not attrs.get("agree"):
            raise serializers.ValidationError({"agree": "약관에 동의해야 회원가입이 가능합니다."})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password2', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth import password_validation
from rest_framework import serializers
from .validators import SafeSpecialCharacterPasswordValidator
from django.contrib.auth.models import User

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_uid(self, value):
        try:
            uid = urlsafe_base64_decode(value).decode()
            user = User.objects.get(id=uid)
        except (TypeError, ValueError, User.DoesNotExist):
            raise serializers.ValidationError("유효하지 않은 사용자입니다.")
        self.context['user'] = user
        return value

    def validate_token(self, value):
        user = self.context.get('user')
        if not default_token_generator.check_token(user, value):
            raise serializers.ValidationError("유효하지 않은 토큰입니다.")
        return value

    def validate_new_password(self, value):
        user = self.context.get('user')
        try:
            password_validation.validate_password(value, user)
        except Exception as e:
            raise serializers.ValidationError(str(e))

        special_char_validator = SafeSpecialCharacterPasswordValidator()
        special_char_validator(value)

        return value

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')

        if new_password != confirm_password:
            raise serializers.ValidationError({
                'confirm_password': '비밀번호가 일치하지 않습니다.'
            })

        return attrs

    def save(self):
        user = self.context.get('user')
        new_password = self.validated_data.get('new_password')
        user.set_password(new_password)
        user.save()
