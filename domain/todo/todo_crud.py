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