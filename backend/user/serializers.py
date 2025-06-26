from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
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
