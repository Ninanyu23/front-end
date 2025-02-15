import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/editpage.css";

const EditPage = () => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null); // 사용자 정보
    const [editedInfo, setEditedInfo] = useState(null); // 수정된 사용자 정보
    const [loading, setLoading] = useState(true); // 로딩 상태

    const getCookie = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
            return match[2];
        }
        return null;
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = getCookie('token');
            if (!token) {
                alert('로그인 상태가 아닙니다.');
                navigate('/'); // 로그인 페이지로 리디렉션
                return;
            }

            try {
                const response = await fetch('/api/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                    setEditedInfo({ userName: data.userName, payUrl: data.payUrl });
                    setLoading(false);
                } else {
                    setLoading(false);
                    alert('사용자 정보를 가져오는 데 실패했습니다.');
                }
            } catch (err) {
                setLoading(false);
                alert('서버 오류가 발생했습니다.');
            }
        };

        fetchUserInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = async () => {
        const token = getCookie('token');
        if (!token) {
            alert('로그인 상태가 아닙니다.');
            navigate('/');
            return;
        }

        if (!editedInfo.userName || editedInfo.userName.trim() === '') {
            alert('사용자명을 입력하세요.');
            return;
        }

        try {
            const response = await fetch('/api/users', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editedInfo),
            });

            const data = await response.json();
            if (response.ok && data.code === 'SUCCESS_UPDATE_USERINFO') {
                alert(data.message);
                setUserInfo(data.data);
                navigate('/mypage');
            } else {
                alert(`정보 수정에 실패했습니다: ${data.message}`);
            }
        } catch (err) {
            alert('서버 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!userInfo) {
        return <div>사용자 정보를 불러오는 데 실패했습니다.</div>;
    }

    return (
        <div className="edit-page-wrapper">
            <div className="edit-page-container">
                <div className="profile-image">
                    {userInfo.profileImage ? (
                        <img className="profile-img" src={userInfo.profileImage} alt="Profile" />
                    ) : (
                        <div className="no-profile-image">프로필 사진 없음</div>
                    )}
                </div>

                <div className="user-name">
                    <label>사용자명</label>
                    <input
                        type="text"
                        name="userName"
                        value={editedInfo.userName}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="edit-info">
                    <label>이메일</label>
                    <input
                        type="email"
                        name="email"
                        value={userInfo.email}
                        readOnly
                    />
                    <label>은행</label>
                    <input
                        type="text"
                        name="bankName"
                        value={userInfo.bankName}
                        readOnly
                    />
                    <label>계좌번호</label>
                    <input
                        type="text"
                        name="accountNumber"
                        value={userInfo.accountNumber}
                        readOnly
                    />
                    <label>카카오페이 URL</label>
                    <input
                        type="url"
                        name="payUrl"
                        value={editedInfo.payUrl}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* 저장 버튼을 container 밖으로 꺼내서 위치 설정 */}
            <div className="save-btn-wrapper">
                <button onClick={handleSaveClick}>저장</button>
            </div>
        </div>
    );
};

export default EditPage;