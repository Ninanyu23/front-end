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

      console.log('로그인 응답 데이터:', data); // 응답 데이터 확인

      if (response.ok) {
        // 로그인 성공 시
        if (data.data && data.data.token) {
          // 쿠키에 토큰 저장
          document.cookie = `token=${data.data.token}; path=/; samesite=lax`;
          console.log('토큰이 쿠키에 저장되었습니다.');

          // 마이페이지로 이동
          window.location.href = '/main';
        } else {
          console.error('응답에 토큰이 포함되지 않았습니다.');
        }
      } else {
        setError(data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('서버에 연결할 수 없습니다.');
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