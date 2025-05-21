from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status

from database import get_db  # 데이터베이스 세션을 가져오는 함수
from domain.user import user_crud, user_schema  # user_crud와 user_schema를 import

router = APIRouter(
    prefix="/api/user",  # 경로의 기본 prefix 설정
)

# 회원가입 API
@router.post("/create", status_code=status.HTTP_204_NO_CONTENT)
def user_create(
    _user_create: user_schema.UserCreate,  # 클라이언트에서 받은 회원가입 정보
    db: Session = Depends(get_db)  # 데이터베이스 세션을 의존성 주입을 통해 가져옴
):
    # create_user 함수는 회원가입 로직을 처리하는 함수입니다.
    user_crud.create_user(db=db, user_create=_user_create)
    return {"message": "User created successfully"}  # 성공 메시지 반환
