from datetime import timedelta, datetime

from fastapi import APIRouter, HTTPException
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt

from sqlalchemy.orm import Session
from starlette import status

from database import get_db  # 데이터베이스 세션을 가져오는 함수
from domain.user import user_crud, user_schema  # user_crud와 user_schema를 import
from domain.user.user_crud import pwd_context

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
SECRET_KEY = "4ab2fce7a6bd79e1c014396315ed322dd6edb1c5d975c6b74a2904135172c03c"
ALGORITHM = "HS256"

router = APIRouter(
    prefix="/api/user",  # 경로의 기본 prefix 설정
)

# 회원가입 API
@router.post("/create", status_code=status.HTTP_204_NO_CONTENT)
def user_create(
    user_create: user_schema.UserCreate,  # 클라이언트에서 받은 회원가입 정보
    db: Session = Depends(get_db)  # 데이터베이스 세션을 의존성 주입을 통해 가져옴
):
    # 이미 존재하는 사용자(이메일 또는 사용자 이름)가 있는지 확인
    user = user_crud.get_existing_user(db, user_create=user_create)
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 존재하는 사용자입니다."  # 이미 존재하는 사용자에 대한 에러 메시지
        )

    # 사용자 데이터베이스에 추가
    user_crud.create_user(db=db, user_create=user_create)

    return {"message": "User created successfully"}  # 성공 메시지 반환

@router.post("/login", response_model=user_schema.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(),
                           db: Session = Depends(get_db)):

    # check user and password
    user = user_crud.get_user(db, form_data.username)
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # make access token
    data = {
        "sub": user.username,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    access_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username
    }