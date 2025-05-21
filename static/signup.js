document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("signup-form");
    const submitButton = form.querySelector("button[type='submit']"); // 제출 버튼

    form.addEventListener("submit", async (event) => {
        event.preventDefault();  // 기본 form 제출을 막음

        const password = form.querySelector("input[name='password']").value;
        const confirmPassword = form.querySelector("input[name='confirm_password']").value;

        // 비밀번호와 확인 비밀번호 일치 여부 확인
        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;  // 비밀번호 불일치 시 요청을 보내지 않음
        }

        // 제출 버튼 비활성화
        submitButton.disabled = true;

        const formData = new FormData(form);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // 서버가 요구하는 데이터 구조로 변경
        const requestData = {
            username: formObject.username,
            email: formObject.email,
            password1: formObject.password,  // 기존의 password -> password1
            password2: formObject.confirm_password,  // 기존의 confirm_password -> password2
        };

        try {
            // POST 요청 보내기
            const response = await fetch("/api/user/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),  // 수정된 데이터 구조로 전송
            });

            if (response.ok) {
                // 회원가입 성공
                alert("회원가입이 완료되었습니다.");
                window.location.href = "/login";  // 로그인 페이지로 리디렉션
            } else {
                // 회원가입 실패
                const errorData = await response.json();
                let errorMessage = "회원가입 실패"; // 기본 에러 메시지

                // 서버에서 반환한 에러 메시지가 있다면 해당 메시지 사용
                if (errorData && errorData.detail) {
                    // detail이 배열인 경우 (예: validation 에러들)
                    if (Array.isArray(errorData.detail)) {
                        errorMessage = errorData.detail.map(err => `${err.loc.join('.')} - ${err.msg}`).join('\n');
                    } else {
                        errorMessage = errorData.detail.toString();  // 문자열이거나 단일 객체일 경우
                    }
                } else {
                        errorMessage = JSON.stringify(errorData);  // fallback
                }

                alert(errorMessage);
            }
        } catch (error) {
            console.error("회원가입 요청 중 오류 발생:", error);
            alert("회원가입 요청에 실패했습니다.");
        } finally {
            // 버튼을 다시 활성화
            submitButton.disabled = false;
        }
    });
});
