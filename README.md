# 📝 FastAPI 기반 회원가입 및 To-Do List 웹 서비스
## 📌 프로젝트 개요
이 프로젝트는 FastAPI 프레임워크를 기반으로 한 웹 애플리케이션입니다. 사용자는 회원가입과 로그인을 통해 인증된 후, 개인의 To-Do 리스트를 관리할 수 있습니다. 할 일 목록을 조회, 추가, 삭제하는 기능이 제공됩니다.

## 📂 파일 구조
```
fastapi-web/
│
├── main.py                 # FastAPI 앱 실행 파일
├── models.py               # SQLAlchemy 모델 정의
├── database.py             # DB 연결 및 세션 관리
├── domain/            
│    ├── todo/
│    │    ├── todo_crud.py
│    │    ├── todo_router.py
│    │    └── todo_schema.py
│    ├── user/
│    │    ├── user_crud.py
│    │    ├── user_router.py
│    │    └── user_schema.py
├── templates/              # HTML 템플릿 폴더 
│    ├── index.html
│    ├── login.html
│    └── signup.html
├── static/                 # CSS, JS 등 정적 파일 폴더
│    ├── style.css
│    ├── main.css
│    ├── main.js
│    ├── login.js 
│    ├── signup.js 
│    └── store.js
└── requirements.txt
```
## 🔒 회원 가입 API 명세

| API명   | URL            | 요청 방법 | 설명          |
|---------|----------------|-----------|---------------|
| 회원 가입 | `/api/user/create` | POST      | 회원을 등록 |

### 요청 데이터

- username: 사용자명 (ID)
- password1: 비밀번호
- password2: 비밀번호 확인
- email: 이메일 주소

---

## 🔐 로그인 API 명세

| API명   | URL            | 요청 방법 | 설명                |
|---------|----------------|-----------|---------------------|
| 로그인  | `/api/user/login` | POST      | 사용자 인증 및 토큰 발급 |

### 요청 데이터

- username: 사용자명 (ID)
- password: 비밀번호

### 응답 데이터

- 로그인 성공 시
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

- 로그인 실패 시
```json
{
  "detail": "아이디 또는 비밀번호가 일치하지 않습니다."
}
```

---

## 📋 ToDo API 명세

| API명      | URL                          | 요청 방법  | 설명                  |
| --------- | ---------------------------- | ------ | ------------------- |
| 투두 리스트 조회 | `/api/todo/list`             | GET    | 로그인한 사용자의 투두 리스트 조회 |
| 투두 추가     | `/api/todo/create`           | POST   | 로그인한 사용자에 투두 항목 추가  |
| 투두 상태 수정  | `/api/todo/update/{todo_id}` | PUT    | 특정 투두 항목의 완료 상태 수정  |
| 투두 삭제     | `/api/todo/delete/{todo_id}` | DELETE | 특정 투두 항목 삭제         |

### 요청 데이터

- title: 할 일 제목
- description: 상세 설명 (선택사항)

### 응답 데이터

```json
{
  "id": 1,
  "user_id": 5,
  "title": "할 일 제목",
  "description": "상세 설명 (선택사항)",
  "is_completed": false,
  "created_at": "2025-05-22T15:00:00"
}
```

---