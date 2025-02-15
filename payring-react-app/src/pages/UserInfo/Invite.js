import React, { useState, useEffect } from 'react';
import '../../styles/invite.css';
import "../../styles/styles.css";
import Header from "../../components/Header";

const Invite = () => {
    const [invites, setInvites] = useState([]);
    const [error, setError] = useState(null);

    // 쿠키에서 token을 가져오는 함수
    const getCookie = (name) => {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});
        return cookies[name] || null;
    };

    // 초대 목록 불러오기
    useEffect(() => {
        const fetchInvites = async () => {
            try {
                const token = getCookie('token'); // 쿠키에서 토큰 가져오기
                if (!token) {
                    setError('로그인이 필요합니다.');
                    return;
                }

                const response = await fetch('https://storyteller-backend.site/api/rooms/invitations', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setInvites(data.data); // 서버 응답이 { "data": [...] } 형태라면 data.data로 설정
                } else {
                    setError(data.message || '초대 목록을 불러오는 데 실패했습니다.');
                }
            } catch (err) {
                setError('서버에 연결할 수 없습니다.');
            }
        };

        fetchInvites();
    }, []);

    // 초대 수락 API 호출
    const handleAccept = async (id) => {
        try {
            const token = getCookie('token'); // 쿠키에서 토큰 가져오기
            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }

            const response = await fetch(`https://storyteller-backend.site/api/rooms/invitations/${id}/accept`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setInvites(invites.filter(invite => invite.id !== id));
                alert('초대를 수락했습니다.');
            } else {
                alert(data.message || '초대 수락에 실패했습니다.');
            }
        } catch (err) {
            alert('서버에 연결할 수 없습니다.');
        }
    };

    // 초대 거절 API 호출
    const handleReject = async (id) => {
        try {
            const token = getCookie('token'); // 쿠키에서 토큰 가져오기
            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }

            const response = await fetch(`https://storyteller-backend.site/api/rooms/invitations/${id}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setInvites(invites.filter(invite => invite.id !== id));
                alert('초대를 거절했습니다.');
            } else {
                alert(data.message || '초대 거절에 실패했습니다.');
            }
        } catch (err) {
            alert('서버에 연결할 수 없습니다.');
        }
    };

    return (
        <div className='mobile-container'>
            <div className="header-wrapper">
                <Header />
            </div>
            <div className='content-wrapper'>
                <div className="invite-container">
                    <h2>방 초대 내역</h2>

                    {error && <p className="error-message">{error}</p>}

                    {invites.length === 0 ? (
                        <p className="no-invites">받은 초대가 없습니다.</p>
                    ) : (
                        invites.map(invite => (
                            <div key={invite.id} className="invite-card">
                                <div className="invite-info">
                                    <p className="room-name"><strong>{invite.roomName}</strong></p>
                                    <p className="member-count">참여 인원 {invite.members}명</p>
                                </div>
                                <div className="invite-buttons">
                                    <button className="accept-btn" onClick={() => handleAccept(invite.id)}>수락</button>
                                    <button className="reject-btn" onClick={() => handleReject(invite.id)}>거절</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Invite;