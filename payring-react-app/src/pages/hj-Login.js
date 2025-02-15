import React, { useState } from 'react';
import '../styles/login.css';
import PageNavigationButton from '../components/PageNavigate';
import guest from '../img/guest.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // 쿠키에서 토큰을 가져오는 함수
  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  // 로그인 요청 함수
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
        setError("이메일과 비밀번호를 모두 입력하세요.");
        return;
    }

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("✅ 로그인 응답 데이터:", data); // ✅ 응답 데이터 확인

        if (response.ok) {
            if (data.data && data.data.token) {
                // ✅ 토큰 저장
                localStorage.setItem("accessToken", data.data.token);
                console.log("✅ 토큰이 localStorage에 저장되었습니다.");

                // ✅ 사용자 이메일 저장
                localStorage.setItem("userEmail", email);
                console.log("✅ 사용자 이메일이 localStorage에 저장되었습니다:", email);

                // ✅ 로그인 후 페이지 이동
                window.location.href = "/main";  // ✅ 로그인 후 메인 페이지로 이동
            } else {
                console.error("응답에 토큰이 포함되지 않았습니다.");
            }
        } else {
            setError(data.message || "로그인에 실패했습니다.");
        }
    } catch (err) {
        setError("서버에 연결할 수 없습니다.");
        console.error(err);
    }
};



  return (
    <div className="login-container">
      <div className="guest">
        <img src={guest} alt="Guest Icon" />
      </div>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="이메일을 입력하세요"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="비밀번호를 입력하세요"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}

        <div className="button-container">
          <div className="login-btn">
            <button type="submit">로그인</button>
          </div>
          <PageNavigationButton label="회원가입" to="/signup" />
        </div>
      </form>
    </div>
  );
};

export default Login;
