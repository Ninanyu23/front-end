import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import edit from '../../img/edit-icon.png';
import "../../styles/mypage.css";
import "../../styles/styles.css";
import Header from "../../components/Header";
import PageNavigationButton from '../../components/PageNavigate';

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
        const token = getCookie('token');
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

            const userData = data.data;
            setUserInfo({
                name: userData.userName,
                email: userData.email,
                profileImage: userData.profileImage,
                kakaoPayUrl: userData.payUrl || '', 
                bankName: userData.bankName || '등록 안 됨', 
                accountNumber: userData.accountNumber || '등록 안 됨',
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchUserInfo();
}, []); // 상태가 변할 때마다 업데이트하도록 useEffect를 사용합니다.


  const handleModifyClick = () => {
    navigate('/edit');
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className='mobile-container'>
      <div className="header-wrapper">
        <Header />
      </div>
      <div className='content-wrapper'>
        <div className='my-pages-container'>
          <div className='user-info'>
            <img
              src={edit}
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
      </div>
    </div>
  );
};

export default MyPage;