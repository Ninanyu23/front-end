import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Header from "../../components/Header";
import InviteModal from "../../components/InviteModal"; // ✅ 팀원 초대 모달 추가
import DeleteConfirmModal from "../../components/DeleteConfirmModal"; // ✅ 삭제 확인 모달 추가
import "../../styles/RoomDetail.css";
import "../../styles/Modal.css";
import defaultImage from "../../img/defaultImage.png";
import invite from "../../img/invite.png";

const API_BASE_URL = "https://storyteller-backend.site";

function RoomDetail() {
    const navigate = useNavigate();
    const { id: roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [teamMembers, setTeamMembers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    // 쿠키에서 token 가져오기
    const getTokenFromCookie = () => {
        const match = document.cookie.match(/(^| )token=([^;]+)/);
        return match ? match[2] : null;
    };

    useEffect(() => {
        const token = getTokenFromCookie();
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login");
        }
    }, [navigate]);

    // ✅ 팀원 목록 가져오기
    const fetchTeamMembers = async () => {
        if (!roomId) return;

        const token = getTokenFromCookie();
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}/members`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (response.ok) {
                console.log("✅ 팀원 목록 조회 성공:", data);
                setTeamMembers(data.data || []);
            } else {
                console.error("🚨 팀원 목록 조회 실패:", data);
            }
        } catch (error) {
            console.error("🚨 팀원 목록 조회 실패:", error);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
    }, [roomId]);

    // ✅ 방 이름 가져오기
    useEffect(() => {
        if (!roomId) return;

        const fetchRoomName = async () => {
            const token = getTokenFromCookie();
            if (!token) return;

            try {
                const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setRoomName(data.data.roomName || "정산방");
                } else {
                    console.error("🚨 방 정보 조회 실패:", data);
                }
            } catch (error) {
                console.error("🚨 방 정보 조회 실패:", error);
            }
        };

        fetchRoomName();
    }, [roomId]);

    // ✅ 정산 요청 금액 조회
    const fetchPayments = async () => {
        if (!roomId || isFetching) return;
        setIsFetching(true);

        const token = getTokenFromCookie();
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}/payments`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (response.ok) {
                console.log("✅ 정산 요청 내역 응답:", data);
                setTotalAmount(data.data.totalAmount || 0);
                setPayments(Array.isArray(data.data.payments) ? data.data.payments : []);
            } else {
                console.error("🚨 정산 요청 내역 조회 실패:", data);
            }
        } catch (error) {
            console.error("🚨 정산 요청 내역 조회 실패:", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (teamMembers.length > 0) {
            fetchPayments();
        }
    }, [teamMembers]);

    // ✅ userId 기반으로 userName 찾기
    const getUserName = (userId) => {
        if (!teamMembers.length) return "알 수 없음";
        const member = teamMembers.find(member => member.userId === userId || member.teamMemberId === userId);
        return member ? member.userName : "알 수 없음";
    };

    // ✅ 정산 요청 삭제 모달 열기
    const openDeleteModal = (paymentId) => {
        setDeleteTargetId(paymentId);
        setIsModalOpen(true);
    };

    // ✅ 정산 요청 삭제 기능
    const handleConfirmDelete = async () => {
        if (!deleteTargetId) return;

        const token = getTokenFromCookie();
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/rooms/payments/${deleteTargetId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("✅ 정산 요청 삭제 성공");
                fetchPayments();
            } else {
                const data = await response.json();
                console.error("❌ 정산 요청 삭제 실패:", data);
                alert("정산 요청 삭제에 실패했습니다. 다시 시도해 주세요.");
            }
        } catch (error) {
            console.error("❌ 정산 요청 삭제 실패:", error);
            alert("정산 요청 삭제에 실패했습니다. 다시 시도해 주세요.");
        } finally {
            setIsModalOpen(false);
            setDeleteTargetId(null);
        }
    };

    // ✅ 정산 시작 요청 API 호출
    const startSettlement = async () => {
        if (!roomId) {
            alert("정산방 정보가 없습니다. 다시 시도해 주세요.");
            return;
        }

        const token = getTokenFromCookie();
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}/payments/start`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (response.ok) {
                console.log("✅ 정산 시작 성공:", data);
                navigate(`/start-settlement/${roomId}`, { state: { roomId, roomName, teamMembers, payments } });
            } else {
                console.error("🚨 정산 시작 요청 실패:", data);
                alert("정산 시작 요청에 실패했습니다.");
            }
        } catch (error) {
            console.error("🚨 정산 시작 요청 실패:", error);
            alert("정산 시작 요청에 실패했습니다.");
        }
    };

    return (
        <div className="mobile-container">
            <div className="header-wrapper">
                <Header />
            </div>
            <div className="content-wrapper">
                <div className="container">
                    <div className="room-header">
                        <h1 className="room-title">{roomName}의 정산방</h1>
                        <button
                            className="settlement-button"
                            onClick={() =>
                                navigate(`/start-settlement/${roomId}`, { 
                                    state: { roomId, roomName, teamMembers, payments }
                                })
                            }
                        >
                            정산하기
                        </button>

                    </div>

                    <h3 className="team-title">{roomName}’s 팀원</h3>
                    <div className="team-list">
                        {teamMembers.map((member) => (
                            <div key={member.teamMemberId} className="team-member">
                                <img src={member.profileImage || defaultImage} alt="팀원 이미지" />
                                <p>{member.userName} ({member.email})</p>
                            </div>
                        ))}
                        <div className="team-member add-member">
                            <button className="add-member-button" onClick={() => setIsInviteModalOpen(true)}>
                                <img src={invite} alt="팀원 초대 버튼"></img>
                                <p>팀원 초대</p>
                            </button>
                        </div>
                    </div>

                    <h4 className="small-title">{roomName}’s 정산 요청 금액</h4>
                    <p className="total-amount">
                        총 <strong>{totalAmount.toLocaleString()}원</strong>
                    </p>

                    <div className="settlement-list">
                        {payments.map((item) => (
                            <div key={item.id} className="settlement-item">
                                <p className="settlement-user"><strong>{getUserName(item.userId)}</strong></p>
                                <div className="settlement-info">
                                    <p className="settlement-amount">{item.amount.toLocaleString()}원 요청</p>
                                    <p className="settlement-title">{item.title}</p>
                                </div>
                                <div className="settlement-actions">
                                    {item.isWriter && (
                                        <X className="delete-icon" onClick={() => openDeleteModal(item.id)} />
                                    )}
                                    <button className="detail-button" onClick={() => navigate(`/money-record-detail/${item.id}`)}>
                                        상세 보기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="add-settlement-button" onClick={() => navigate(`/money-record/${roomId}`)}>
                        정산 추가하기
                    </button>

                    <DeleteConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} />
                    {isInviteModalOpen && <InviteModal roomId={roomId} onClose={() => setIsInviteModalOpen(false)} />}
                </div>
            </div>
        </div>
    );
}

export default RoomDetail;