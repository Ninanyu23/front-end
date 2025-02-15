import React, { useState } from 'react';
import '../../styles/login.css';
import PageNavigationButton from '../../components/PageNavigate';
import guest from '../../img/guest.png';
import "../../styles/styles.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // 쿠키에서 토큰을 가져오는 함수
  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      return match[2];
    }
    return null;
  };

  // 로그인 요청 함수
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력하세요.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 인증 포함
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log('로그인 응답:', data); // 응답 데이터 확인
      console.log('HTTP 상태 코드:', response.status); // 응답 상태 확인

      if (response.ok) {
        if (data.data && data.data.token) {
          // 토큰 저장
          document.cookie = `token=${data.data.token}; path=/; samesite=lax`;
          console.log('토큰이 쿠키에 저장되었습니다:', document.cookie);

          // 페이지 이동
          window.location.href = '/main';
        } else {
          console.error('응답에 토큰이 없습니다:', data);
          setError('로그인 성공했지만 토큰이 없습니다.');
        }
      } else {
        setError(data.message || '로그인에 실패했습니다.');
        console.error('로그인 실패:', data);
      }
    } catch (err) {
      setError('서버에 연결할 수 없습니다.');
      console.error('서버 연결 오류:', err);
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