import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class SafeSpecialCharacterPasswordValidator:
    SAFE_SPECIALS = r"!@#$%^&*()-_=+[]{}|;:,.<>?/"

    def __call__(self, password, user=None):
        # 검증 실패 시 바로 예외를 던지고 종료하도록 처리
        self.validate(password)  # validate 메서드 호출
        return password  # 검증 통과 시 비밀번호 반환

    def validate(self, password, user=None):
        # 허용된 특수문자만 포함되었는지 확인
        if not re.search(rf"[{re.escape(self.SAFE_SPECIALS)}]", password):
            raise ValidationError(
                _(f"비밀번호에 허용된 특수문자({self.SAFE_SPECIALS}) 중 하나를 포함해야 합니다."),
                code="password_no_safe_special"
            )
        
        # 비밀번호에 허용되지 않은 특수문자 검사
        unsafe = re.sub(rf"[A-Za-z0-9{re.escape(self.SAFE_SPECIALS)}]", "", password)
        if unsafe:
            raise ValidationError(
                _(f"비밀번호에는 허용되지 않은 특수문자({unsafe})가 포함되어 있습니다."),
                code="password_has_unsafe_special"
            )

    def get_help_text(self):
        return _(f"비밀번호에 허용된 특수문자({self.SAFE_SPECIALS}) 중 하나 이상을 포함해야 합니다.")
