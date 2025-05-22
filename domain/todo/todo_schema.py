from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime

# Todo 생성 요청용 스키마
class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    is_completed: Optional[bool] = False

    @field_validator('title')
    def not_empty_title(cls, v):
        if not v.strip():
            raise ValueError('제목은 빈 값일 수 없습니다.')
        return v

# Todo 상태 수정 요청용 스키마 (is_completed만 수정)
class TodoUpdate(BaseModel):
    is_completed: bool

# Todo 응답용 스키마
class TodoRead(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    is_completed: bool
    created_at: datetime

    class Config:
        orm_mode = True

# Todo 삭제 응답용 스키마 (삭제 후 상태 반환 등)
class TodoDelete(BaseModel):
    id: int
    message: str