import React, { useState } from 'react';

const EmailValidation = ({ onVerificationSuccess }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentVerificationCode, setSentVerificationCode] = useState(null);
  const [error, setError] = useState(null);

  const handleSendVerificationCode = async () => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('제대로 된 이메일 주소를 입력 해 주세요');
      return;
    }
    setError(null);
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 임시 인증 코드 생성
    setSentVerificationCode(code);
    alert('인증번호가 이메일로 발송되었습니다.');
    // 실제 인증번호 전송 로직 추가 (예: API 호출)
  };

  const handleVerifyCode = () => {
    if (verificationCode === sentVerificationCode) {
      onVerificationSuccess();
      setError(null);
      alert('인증번호가 확인되었습니다.');
    } else {
      setError('인증번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="email-validation-container">
      <label htmlFor="email">이메일</label>
      <div className="input-group">
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력하세요"
          required
        />
        <button type="button" className="send-code-btn" onClick={handleSendVerificationCode}>
          인증번호
        </button>
      </div>

      <div className="input-group">
        <input
          type="text"
          id="verificationCode"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="인증번호를 입력하세요"
          required
        />
        <button type="button" className="verify-code-btn" onClick={handleVerifyCode}>
          인증확인
        </button>
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default EmailValidation;