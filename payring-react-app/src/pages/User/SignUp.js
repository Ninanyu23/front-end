import React, { useState, useEffect } from 'react'; // 추가
import '../../styles/Signup.css';

const Signup = () => {
  const [userName, setUserName] = useState(''); // 이름 필드명 변경
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accounts, setAccounts] = useState([{ bankName: '', accountNo: '', receiver: '' }]); // bankName, accountNo, receiver 필드 맞추기
  const [payUrl, setPayUrl] = useState(''); // kakaoPayLink에서 payUrl로 변경
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const handleSendVerificationCode = async () => {
    if (isVerifying) return;
    setIsVerifying(true);
    if (!email) {
      setError('이메일을 입력해주세요.');
      setIsVerifying(false);
      return;
    }

    try {
      const response = await fetch(`https://storyteller-backend.site/api/auth/email/verify/send?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.code === 'SUCCESS_SEND_EMAIL') {
        alert('인증번호가 이메일로 발송되었습니다.');
        setIsVerified(false);
      } else {
        setError(data.message || '이메일 인증 요청 실패');
      }
    } catch (err) {
      setError('서버 연결 실패');
    }
    setIsVerifying(false);
  };

  const handleVerifyCode = async () => {
    if (isVerifying) return;
    setIsVerifying(true);
    try {
      const response = await fetch('https://storyteller-backend.site/api/auth/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verificationCode }),
      });

      const data = await response.json();
      if (data.code === 'SUCCESS_VERIFY_EMAIL') {
        setIsVerified(true);
        alert('이메일 인증 성공');
      } else {
        setError('인증번호가 일치하지 않습니다.');
      }
    } catch (err) {
      setError('서버 연결 실패');
    }
    setIsVerifying(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
  
    // 이메일 인증 확인
    if (!isVerified) {
      setError('이메일 인증을 완료해주세요.');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
  
    const payload = {
      userName,
      email,
      password,
      profileImage,
      payUrl,
      accounts,
    };
  
    try {
      const response = await fetch('https://storyteller-backend.site/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      // 403 Forbidden 응답 처리
      if (response.status === 403) {
        setError(data.message || '접근 권한이 없습니다.');
        return;
      }
  
      if (data.code === 'SUCCESS_SIGNUP') {
        alert('회원가입 성공!');
        window.location.href = '/';
      } else {
        setError(data.message || '회원가입 실패');
      }
    } catch (err) {
      setError('서버 연결 실패');
    }
  };

  const handleBankChange = (index, field, value) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index][field] = value;
    setAccounts(updatedAccounts);
  };

  const handleAddBankAccount = () => {
    setAccounts([...accounts, { bankName: '', accountNo: '', receiver: '' }]); // receiver 필드 추가
  };

  const profileImageUrl = profileImage ? URL.createObjectURL(profileImage) : null;

  useEffect(() => {
    return () => {
      if (profileImage) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, [profileImage, profileImageUrl]);

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
        <label htmlFor="userName">이름</label>
        <div className="input-group">
          <input
            type="text"
            id="userName"
            name="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="이름을 입력하세요"
            required
            autoComplete="name"
          />
        </div>

        <label htmlFor="email">이메일</label>
        <div className="input-group">
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            required
            disabled={isVerified}
            autoComplete="email"
          />
          <button type="button" className="send-code-btn" onClick={handleSendVerificationCode}>
            인증번호
          </button>
        </div>

        <div className="input-group">
          <input
            type="text"
            id="verificationCode"
            name="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="인증번호를 입력하세요"
            required
            autoComplete="off"
          />
          <button type="button" className="verify-code-btn" onClick={handleVerifyCode}>
            인증확인
          </button>
        </div>

        <label htmlFor="password">비밀번호</label>
        <div className="input-group">
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력 (8~16자리)"
            minLength={8}
            maxLength={16}
            required
            autoComplete="new-password"
          />
        </div>

        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <div className="input-group">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 재입력"
            minLength={8}
            maxLength={16}
            required
            autoComplete="off"
          />
        </div>

        <label>송금 받을 은행명 & 계좌번호</label>
        <div className="bank-accounts-container">
          {accounts.map((account, index) => (
            <div key={index} className="input-group bank-input-group">
              <input
                type="text"
                className='bank-name-input'
                name={`bankName-${index}`}
                value={account.bankName}
                onChange={(e) => handleBankChange(index, 'bankName', e.target.value)}
                placeholder="은행명"
                autoComplete="off"
              />
              <input
                type="text"
                className='account-number-input'
                name={`accountNo-${index}`}
                value={account.accountNo}
                onChange={(e) => handleBankChange(index, 'accountNo', e.target.value)}
                placeholder="계좌번호"
                autoComplete="off"
              />
            </div>
          ))}
          <button type="button" onClick={handleAddBankAccount} className="add-account-btn">
            + 계좌번호 추가하기
          </button>
        </div>

        <label htmlFor="payUrl">카카오페이 송금 링크(URL)</label>
        <input
          type="url"
          id="payUrl"
          name="payUrl"
          value={payUrl}
          onChange={(e) => setPayUrl(e.target.value)}
          placeholder="카카오페이 링크"
          autoComplete="off"
        />

        <label>프로필 사진</label>
        <div className="file-upload">
          <label htmlFor="profileImage" className="file-upload-label">
            <span className="material-symbols-outlined">image</span>
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            name="profileImage"
            onChange={handleProfileImageChange}
          />
        </div>
        {profileImage && (
          <img
            src={URL.createObjectURL(profileImage)}
            alt="Profile"
            className="profile-image-preview"
          />
        )}

        {error && <p className="error">{error}</p>}
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Signup;