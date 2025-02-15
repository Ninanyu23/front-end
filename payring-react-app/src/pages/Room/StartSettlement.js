import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { X } from "lucide-react";
import "../../styles/styles.css";
import "../../styles/StartSettlement.css";
import profile from "../../img/defaultImage.png";
import clear from "../../img/clear.png";

const API_BASE_URL = "https://storyteller-backend.site";

function StartSettlement() {
    const { roomId: paramRoomId } = useParams(); // ✅ URL에서 roomId 가져오기
    const navigate = useNavigate();
    const location = useLocation();
const { roomId: stateRoomId, roomName, userName = "user", teamEmails = [], moneyRecords = [] } = location.state || {}; // ✅ 중복 선언 제거
const roomId = paramRoomId || stateRoomId; // ✅ 최종 roomId 결정 // ✅ URL 또는 상태에서 roomId 가져오기
    

    const [notReceived, setNotReceived] = useState([]);
    const [notSent, setNotSent] = useState([]);
    
    useEffect(() => {
        const fetchSettlementStatus = async () => {
            const token = localStorage.getItem("accessToken");
            console.log("사용자 토큰:", token);
            console.log("방 ID 확인:", roomId);
if (!roomId) {
    console.error("🚨 roomId가 유효하지 않습니다. API 요청을 중단합니다.");
    return;
}

            if (!token) {
                console.error("🚨 액세스 토큰이 없습니다. 로그인 페이지로 이동합니다.");
                alert("로그인이 필요합니다.");
                navigate("/login");
                return;
            }

            if (!roomId || roomId === "undefined") {
                console.error("🚨 roomId가 유효하지 않습니다. API 요청을 중단합니다.");
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/api/rooms/${roomId}/payments/status`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("✅ 정산 현황 응답:", response.data);
                setNotReceived(response.data.data.notReceived || []);
                setNotSent(response.data.data.notSent || []);
            } catch (error) {
                console.error("🚨 정산 현황 조회 실패:", error);
                if (error.response) {
                    console.error("📌 응답 상태 코드:", error.response.status);
                    console.error("📌 응답 메시지:", error.response.data);
                }
            }
        };
        
        fetchSettlementStatus();
    }, [roomId, navigate]);

    return (
        <div className="mobile-container">
            <div className="header-wrapper">
                <Header />
            </div>
            <div className="content-wrapper">
                <div className="container">
                    <h2 className="page-title">{userName}<span className="subtitle"> 의 남은 정산 금액</span></h2>
                    <p className="total-amount">
                        총 <span className="highlight-amount">{notSent.reduce((sum, rec) => sum + rec.amount, 0).toLocaleString()}원</span>
                    </p>

                    <div className="start-settlement-list">
                        {notSent.length > 0 ? (
                            notSent.map((record, index) => (
                                <div key={index} className="start-settlement-item">
                                    <div className="start-settlement-content">
                                        <span className="user-name">{record.receiver}</span>
                                        <span className="list-amount">{record.amount.toLocaleString()}원</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="clear">
                                <p className="empty-message">모든 정산을 완료했어요!</p>
                                <img src={clear} alt="모든 정산 완료"></img>
                            </div>
                        )}
                    </div>

                    <h4 className="page-title">{userName}<span className="subtitle"> 에게 아직 송금하지 않았어요</span></h4>
                    <div className="start-settlement-list">
                        {notReceived.length > 0 ? (
                            notReceived.map((record, index) => (
                                <div key={index} className="start-settlement-item">
                                    <div className="start-settlement-content">
                                        <span className="user-name">{record.sender}</span>
                                        <span className="list-amount">{record.amount.toLocaleString()}원</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="clear">
                                <p className="empty-message">모든 팀원이 나에게 정산을 완료했어요!</p>
                                <img src={clear} alt="모든 정산 완료"></img>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StartSettlement;
