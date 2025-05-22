from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from domain.user import user_schema
from domain.todo.todo_schema import TodoCreate, TodoRead, TodoUpdate, TodoDelete
from domain.todo import todo_crud
from domain.user import user_crud  # 유저 인증을 위한 함수 또는 모델

from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = "4ab2fce7a6bd79e1c014396315ed322dd6edb1c5d975c6b74a2904135172c03c"
ALGORITHM = "HS256"

router = APIRouter(
    prefix="/api/todo",
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

# 토큰에서 사용자 정보 추출 및 검증 함수
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = user_crud.get_user(db, username=username)
    if user is None:
        raise credentials_exception
    return user

# TODO 생성 API
@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_todo(
    todo_create: TodoCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    todo = todo_crud.create_todo(db=db, todo_create=todo_create, user_id=current_user.id)
    return todo

# 투두 조회 API
@router.get("/list", response_model=List[TodoRead])
def get_todo_list(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    todo_list = todo_crud.get_todos_by_user(db, user_id=current_user.id)
    return todo_list

# 투두 상태 수정 API
@router.put("/update/{todo_id}", response_model=TodoRead)
def update_todo(
    todo_id: int,  # URL에서 todo_id를 받음
    todo_update: TodoUpdate,  # 요청 본문에서 is_completed를 받음
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # todo_id로 투두 항목 조회 후, 해당 항목 업데이트
    todo = todo_crud.update_todo(db=db, todo_id=todo_id, is_completed=todo_update.is_completed)
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    return todo

# 투두 삭제 API
@router.delete("/delete/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = todo_crud.delete_todo(db=db, todo_id=todo_id)
    if result.get("message") == "Todo not found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    return result