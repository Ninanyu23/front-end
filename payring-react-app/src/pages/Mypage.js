import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/mypage.css";
import PageNavigationButton from '../components//PageNavigate';

const MyPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 쿠키에서 토큰을 불러오는 함수
  const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {});
    return cookies[name] || null;
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = getCookie('token'); // 쿠키에서 토큰을 가져오기
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || '사용자 정보를 불러오지 못했습니다.');
        }

        // 응답 데이터 구조 반영
        const userData = data.data;

        setUserInfo({
          name: userData.userName,
          email: userData.email,
          profileImage: userData.profileImage,
          kakaoPayUrl: userData.payUrl || '', // null 방지
          bankName: userData.bankName || '등록 안 됨', // 은행명 추가
          accountNumber: userData.accountNumber || '등록 안 됨', // 계좌번호 추가
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleModifyClick = () => {
    navigate('/edit');
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className='mypage-wrapper'>
      <div className="my-page-container">
        {/* public 폴더에 있는 edit 아이콘 이미지 */}
        <img 
          src="/edit-icon.png" 
          alt="Edit" 
          className="edit-icon" 
          onClick={handleModifyClick}
          style={{ cursor: 'pointer' }} // 클릭 가능한 커서 스타일 추가
        />

        <div className="profile-image">
          {userInfo.profileImage ? (
            <img className="profile-img" src={userInfo.profileImage} alt="Profile" />
          ) : (
            <div className="no-profile-image">프로필 사진 없음</div>
          )}
        </div>

        <div className="user-name">{userInfo.name}</div>

        <div className="info">
          <span className="info-label">이메일</span>
          <div className="info-item">
            <span className="info-value">{userInfo.email}</span>
          </div>

          <span className="info-label">은행명</span>
          <div className="info-item">
            <span className="info-value">{userInfo.bankName}</span>
          </div>

          <span className="info-label">계좌번호</span>
          <div className="info-item">
            <span className="info-value">{userInfo.accountNumber}</span>
          </div>

          <span className="info-label">카카오페이 URL</span>
          <div className="info-item">
            <span className="info-value">
              {userInfo.kakaoPayUrl ? userInfo.kakaoPayUrl : '등록된 URL 없음'}
            </span>
          </div>
        </div>
      </div>

      <div className="invite-btn">
        <PageNavigationButton label="방 초대 내역 보러 가기" to="/invite" />
      </div>
    </div>
  );
};

export default MyPage;