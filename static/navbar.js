document.addEventListener("DOMContentLoaded", () => {
    const isLogin = localStorage.getItem("is_login") === "true";
    const username = localStorage.getItem("username");
    const navbar = document.getElementById("navbar");

    if (isLogin && username) {
        navbar.innerHTML = `
            <span>Hello, ${username}</span>
            <a href="#" id="logout-btn">Logout</a>
        `;

        document.getElementById("logout-btn").addEventListener("click", (e) => {
            e.preventDefault();
            // 로그인 상태 초기화
            localStorage.setItem("access_token", "");
            localStorage.setItem("username", "");
            localStorage.setItem("is_login", "false");

            // 페이지 리로드로 내비게이션 갱신
            window.location.href = "/";
        });

    } else {
        navbar.innerHTML = `
            <a href="/login">Login</a>
            <a href="/signup">Sign up</a>
        `;
    }
});
