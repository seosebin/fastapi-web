from sqlalchemy.orm import Session
from domain.todo.todo_schema import TodoCreate
from models import Todo

def create_todo(db: Session, todo_create: TodoCreate, user_id: int):
    db_todo = Todo(
        user_id=user_id,
        title=todo_create.title,
        description=todo_create.description,
        is_completed=todo_create.is_completed or False
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def get_todos_by_user(db: Session, user_id: int):
    return db.query(Todo).filter(Todo.user_id == user_id).order_by(Todo.created_at.desc()).all()

def update_todo(db: Session, todo_id: int, is_completed: bool):
    # 주어진 ID로 Todo 항목을 찾음
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    
    if db_todo:
        db_todo.is_completed = is_completed
        db.commit()  # 변경 사항을 DB에 커밋
        db.refresh(db_todo)  # 갱신된 항목 반환
        return db_todo
    return None  # Todo가 존재하지 않으면 None 반환

def delete_todo(db: Session, todo_id: int):
    # 주어진 ID로 Todo 항목을 찾음
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    
    if db_todo:
        db.delete(db_todo)  # Todo 삭제
        db.commit()  # DB에 커밋
        return {"message": "Todo successfully deleted"}  # 삭제 완료 메시지 반환
    return {"message": "Todo not found"}  # Todo가 존재하지 않으면 메시지 반환