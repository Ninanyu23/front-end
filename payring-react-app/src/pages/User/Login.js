import React, { useState } from "react";
import api from "../../components/axiosInstance";
import "../../styles/login.css";
import PageNavigationButton from "../../components/PageNavigate";
import guest from "../../img/guest.png";
import "../../styles/styles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // ✅ 로그인 요청 함수
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });

      console.log("🔍 로그인 API 전체 응답:", response.data);
      console.log("🔍 로그인 응답의 data:", response.data.data);

      // ✅ 정확한 위치에서 `token` 추출
      const token = response.data.data?.token;
      const refreshToken = response.data.data?.refreshToken;

      if (!token) {
        console.error("❌ 로그인 응답에 토큰이 없습니다.");
        setError("로그인 실패: 서버에서 토큰을 받지 못했습니다.");
        return;
      }

      // ✅ 토큰 저장
      localStorage.setItem("accessToken", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      console.log("✅ 저장할 토큰:", token);
      console.log("✅ 토큰이 localStorage에 저장되었습니다.");

      localStorage.setItem("userEmail", email);
      console.log("✅ 사용자 이메일이 localStorage에 저장되었습니다:", email);

      // ✅ 페이지 이동
      console.log("✅ 페이지 이동을 시도합니다.");
      setTimeout(() => {
        window.location.href = "/main";
      }, 500);
    } catch (error) {
      setError("서버 오류: 로그인 실패");
      console.error("❌ 로그인 요청 실패:", error);
    }
  };

  return (
    <div className='login-container'>
      <div className="mobile-container">
        <div className="content-wrapper">
          <div className="loginpage">
            <div className="guest">
              <img src={guest} alt="Guest Icon" />
            </div>
            <div className='form-container'>
              <div className='input-form'>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
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
                    <button type="submit" className="login-btn">로그인</button>
                    <PageNavigationButton label="회원가입" className="sign-btn" to="/signup" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
