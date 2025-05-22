document.addEventListener("DOMContentLoaded", () => {
    const isLogin = localStorage.getItem("is_login") === "true";
    const username = localStorage.getItem("username");
    const navbar = document.getElementById("navbar");
    const todoFormBox = document.querySelector(".todo-form-box");
    const welcomeMsg = document.getElementById("welcome-msg");
    const todoList = document.getElementById("todo-list");

    // 투두 리스트 렌더링 함수
    async function loadTodoList() {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) return;

        try {
            const response = await fetch("/api/todo/list", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                console.error("투두 리스트 불러오기 실패:", response.statusText);
                return;
            }

            const todos = await response.json();

            // todoList 초기화
            todoList.innerHTML = "";

            if (todos.length === 0) {
                todoList.innerHTML = "<p>등록된 투두가 없습니다.</p>";
                return;
            }

            todos.forEach(todo => {
                const todoItem = document.createElement("div");
                todoItem.classList.add("todo-item");

                const toggleBtnText = todo.is_completed ? "미완료" : "완료";

                todoItem.innerHTML = `
                    <h3>${todo.title}</h3>
                    <p>${todo.description || ""}</p>
                    <p>완료 여부: ${todo.is_completed ? "완료" : "미완료"}</p>
                    <small>생성일: ${new Date(todo.created_at).toLocaleString()}</small>
                    <button class="toggle-completion-btn" data-id="${todo.id}">${toggleBtnText}</button>
                    <button class="delete-btn" data-id="${todo.id}">삭제</button>
                `;

                // 완료/미완료 버튼 클릭 이벤트
                const toggleBtn = todoItem.querySelector(".toggle-completion-btn");
                toggleBtn.addEventListener("click", async (e) => {
                    const todoId = e.target.getAttribute("data-id");
                    const newStatus = !(todo.is_completed); // 현재 상태 반대로 설정

                    const accessToken = localStorage.getItem("access_token");
                    if (!accessToken) {
                        alert("로그인이 필요합니다.");
                        return;
                    }

                    try {
                        const response = await fetch(`/api/todo/update/${todoId}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${accessToken}`
                            },
                            body: JSON.stringify({
                                is_completed: newStatus
                            })
                        });

                        if (response.ok) {
                            loadTodoList();  // 상태 수정 후 리스트 새로고침
                        } else {
                            const errorData = await response.json();
                            alert(`오류가 발생했습니다: ${errorData.detail || response.statusText}`);
                        }
                    } catch (error) {
                        alert("서버와 통신 중 오류가 발생했습니다.");
                        console.error(error);
                    }
                });

                // 삭제 버튼 클릭 이벤트
                const deleteBtn = todoItem.querySelector(".delete-btn");
                deleteBtn.addEventListener("click", async (e) => {
                    const todoId = e.target.getAttribute("data-id");

                    const accessToken = localStorage.getItem("access_token");
                    if (!accessToken) {
                        alert("로그인이 필요합니다.");
                        return;
                    }

                    try {
                        const response = await fetch(`/api/todo/delete/${todoId}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${accessToken}`
                            }
                        });

                        if (response.ok) {
                            alert("투두가 삭제되었습니다.");
                            loadTodoList();  // 삭제 후 리스트 새로고침
                        } else {
                            const errorData = await response.json();
                            alert(`오류가 발생했습니다: ${errorData.detail || response.statusText}`);
                        }
                    } catch (error) {
                        alert("서버와 통신 중 오류가 발생했습니다.");
                        console.error(error);
                    }
                });

                todoList.appendChild(todoItem);
            });

        } catch (error) {
            console.error("투두 리스트 로드 중 오류 발생:", error);
        }
    }

    if (isLogin && username) {
        navbar.innerHTML = `
            <span>안녕하세요, ${username}님</span>
            <a href="#" id="logout-btn">Logout</a>
        `;

        if (todoFormBox) {
            todoFormBox.style.display = "block";
        }
        if (welcomeMsg) {
            welcomeMsg.style.display = "none"; 
        }

        if (todoList) todoList.style.display = "block";  // 보여주기
        loadTodoList();

        document.getElementById("logout-btn").addEventListener("click", (e) => {
            e.preventDefault();
            // 로그인 상태 초기화
            localStorage.setItem("access_token", "");
            localStorage.setItem("username", "");
            localStorage.setItem("is_login", "false");

            // 페이지 리로드로 내비게이션 갱신
            window.location.href = "/";
        });

        // 투두 등록 폼 제출 이벤트 추가
        const todoForm = document.getElementById("todo-form");
        todoForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const title = todoForm.title.value.trim();
            const content = todoForm.content.value.trim();

            if (!title || !content) {
                alert("제목과 내용을 모두 입력해주세요.");
                return;
            }

            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                alert("로그인이 필요합니다.");
                return;
            }

            try {
                const response = await fetch("/api/todo/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        title: title,
                        description: content,
                        is_completed: false
                    })
                });

                if (response.ok) {
                    alert("To-Do가 성공적으로 등록되었습니다.");
                    todoForm.reset();
                    loadTodoList();
                } else if (response.status === 401) {
                    alert("인증 오류입니다. 다시 로그인해주세요.");
                    window.location.href = "/login";
                } else {
                    const errorData = await response.json();
                    alert(`오류가 발생했습니다: ${errorData.detail || response.statusText}`);
                }
            } catch (error) {
                alert("서버와 통신 중 오류가 발생했습니다.");
                console.error(error);
            }
        });

    } else {
        navbar.innerHTML = `
            <a href="/login">Login</a>
            <a href="/signup">Sign up</a>
        `;

        if (todoFormBox) {
            todoFormBox.style.display = "none";
        }

        if (welcomeMsg) {
            welcomeMsg.style.display = "block"; 
        }

        if (todoList) todoList.style.display = "none";
    }
});
