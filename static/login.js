document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const username = formData.get("username");
        const password = formData.get("password");

        try {
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    username: username,
                    password: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("is_login", "true");
                window.location.href = "/";
            } else {
                const err = await response.json();
                alert("로그인 실패: " + (err.detail || "알 수 없는 오류"));
            }
        } catch (error) {
            console.error("로그인 중 오류 발생:", error);
            alert("서버 오류로 인해 로그인할 수 없습니다.");
        }
    });
});
