from passlib.context import CryptContext
from sqlalchemy.orm import Session
from domain.user.user_schema import UserCreate
from models import User

# CryptContext를 사용하여 비밀번호 해싱 처리
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(db: Session, user_create: UserCreate):
    # 비밀번호를 안전하게 해싱하여 저장
    hashed_password = pwd_context.hash(user_create.password1)

    # User 모델에 사용자 데이터 저장
    db_user = User(username=user_create.username,
                   hashed_password=hashed_password,
                   email=user_create.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

def get_existing_user(db: Session, user_create: UserCreate):
    return db.query(User).filter(
        (User.username == user_create.username) |
        (User.email == user_create.email)
    ).first()

def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()