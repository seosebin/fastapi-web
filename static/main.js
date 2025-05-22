document.addEventListener("DOMContentLoaded", () => {
    const isLogin = localStorage.getItem("is_login") === "true";
    const username = localStorage.getItem("username");
    const navbar = document.getElementById("navbar");
    const todoFormBox = document.querySelector(".todo-form-box");
    const welcomeMsg = document.getElementById("welcome-msg");
    const todoList = document.getElementById("todo-list");

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
                    // 필요 시, 투두 리스트 갱신 함수 호출 가능
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
