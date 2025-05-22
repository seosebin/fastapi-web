from pydantic import BaseModel, EmailStr, field_validator
from pydantic_core.core_schema import FieldValidationInfo


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password1: str
    password2: str

    # 필드 값이 비어있는지 체크하는 필드 밸리데이터
    @field_validator('username', 'email', 'password1', 'password2')
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('빈 값은 허용되지 않습니다.')
        return v

    # 비밀번호가 일치하는지 체크하는 필드 밸리데이터
    @field_validator('password2', mode='after')
    def passwords_match(cls, v, info: FieldValidationInfo):
        if 'password1' in info.data and v != info.data['password1']:
            raise ValueError('비밀번호가 일치하지 않습니다.')
        return v

    class Config:
        orm_mode = True  # SQLAlchemy 모델과 Pydantic 모델 간 변환을 가능하게 함

# 로그인 API의 출력 항목인
# access_token, token_type, username을 속성으로 하는 Token 스키마
class Token(BaseModel):
    access_token: str
    token_type: str
    username: str

