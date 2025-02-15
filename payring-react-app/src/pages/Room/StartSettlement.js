import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/Header";
import { X } from "lucide-react";
import "../../styles/styles.css";
import "../../styles/StartSettlement.css";
import profile from "../../img/defaultImage.png";
import clear from "../../img/clear.png";

function StartSettlement() {
    const location = useLocation();
    const navigate = useNavigate();
    //const { moneyRecords = [], userName, pendingPayments = [] } = location.state || {}; 

    // ✅ `RoomDetail.js`에서 전달받은 데이터
    const { roomName, userName="user", teamEmails = [], moneyRecords = [], pendingPayments = [] } = location.state || {};

    // ✅ 임시 데이터 추가 (테스트용)
    const samplePendingPayments = [
        { user: "김철수", amount: 30000 },
        { user: "이영희", amount: 45000 },
    ];

    // ✅ 정산 완료한 팀원 (테스트 데이터)
    const completedMembers = [
        { user: "김은서", profile: profile },
        { user: "김은서", profile: profile },
        { user: "김은서", profile: profile },
        { user: "김은서", profile: profile },
        { user: "김은서", profile: profile },
    ];

    // ✅ 정산 중인 팀원 (테스트 데이터)
    const pendingMembers = [
        { user: "김은서", amount: 25700, profile: profile },
        { user: "김은서", amount: 25700, profile: profile },
        { user: "김은서", amount: 25700, profile: profile, pending: true },
    ];

    const handleDelete = (index) => {
        // ✅ 삭제 기능 (세션 스토리지 반영)
        const updatedRecords = moneyRecords.filter((_, i) => i !== index);
        sessionStorage.setItem("roomData", JSON.stringify({ roomName, userName ,teamEmails, moneyRecords: updatedRecords }));
    };
    
    // ✅ 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ✅ 모달 열기
    const handleOpenModal = () => {
        setIsModalOpen(true);
        setTimeout(() => {
            setIsModalOpen(false); // 2초 후 자동 닫힘
        }, 2000);
    };

    console.log("📌 StartSettlement moneyRecords:", moneyRecords);
    console.log("📌 StartSettlement pendingPayments:", pendingPayments);

    return (
        <div className="mobile-container">
            <div className="header-wrapper">
                <Header />
            </div>
            <div className="content-wrapper">
                <div className="container">    
                    {/* 🔹 정산 제목 (유저 이름 포함) */}
                    <h2 className="page-title">{userName}<span className="subtitle"> 의 남은 정산 금액</span></h2>
                    <p className="total-amount">
                        총 <span className="highlight-amount">{moneyRecords.reduce((sum, rec) => sum + rec.amount, 0).toLocaleString()}원</span>
                    </p>

                    {/* 🔹 남은 정산 금액 리스트 */}
                    <div className="start-settlement-list">
                        {moneyRecords.length > 0 ? (
                            moneyRecords.map((record, index) => (
                                <div key={index} className="start-settlement-item">
                                    <div className="start-settlement-content">
                                        <span className="user-name">{record.user}</span>
                                        <span className="list-amount">{record.amount.toLocaleString()}원</span>
                                    </div>
                                    <button className="start-settlement-button">정산 보내기</button>
                                </div>
                            ))
                        ) : (
                            <div className="clear">
                                <p className="empty-message">모든 정산을 완료했어요!</p>
                                <img src={clear} alt="모든 정산 완료"></img>
                            </div>
                        )}
                    </div>

                    {/* ✅ 전체 송금 내역 확인하기 (텍스트 버튼) */}
                    <span className="text-button">전체 송금 내역 확인하기</span>

                    {/* 🔹 송금 받지 못한 금액 리스트 */}
                    <h4 className="page-title">{userName}<span className="subtitle"> 에게 아직 송금하지 않았어요</span></h4>
                    <div className="start-settlement-list">
                        {samplePendingPayments.length > 0 ? (
                            samplePendingPayments.map((record, index) => (
                                <div key={index} className="start-settlement-item">
                                    <div className="start-settlement-content">
                                        <span className="user-name">{record.user}</span>
                                        <span className="list-amount">{record.amount.toLocaleString()}원</span>
                                    </div>
                                    <button className="start-reminder-button" onClick={handleOpenModal}>독촉하기</button>
                                </div>
                            ))
                        ) : (
                            <div className="clear">
                            <p className="empty-message">모든 팀원이 나에게 정산을 완료했어요 !</p>
                            <img src={clear} alt="모든 정산 완료"></img>
                        </div>
                        )}
                    </div>
                    
                    {/* ✅ 전체 송금 현황 확인하기 (텍스트 버튼) */}
                    <span className="text-button">전체 송금 현황 확인하기</span>

                    {/* 🔹 정산 완료한 팀원 */}
                    <h4 className="team-list-title">정산 완료한 팀원</h4>
                    <div className="completed-members">
                        {completedMembers.map((member, index) => (
                            <div key={index} className="profile-container">
                                <img src={member.profile} alt="프로필" className="profile-image" />
                                <span className="user-name-in-list">{member.user}</span>
                            </div>
                        ))}
                    </div>

                    {/* 🔹 정산 중인 팀원 */}
                    <h2 className="team-list-title">정산 중인 팀원</h2>
                    <div className="pending-members">
                        {pendingMembers.map((member, index) => (
                            <div key={index} className="profile-container">
                                <img src={member.profile} alt="프로필" className="profile-image" />
                                <span className="user-name-in-list">{member.user}</span>
                                <span className="amount">{member.amount.toLocaleString()}원</span>
                                <button className="reminder-button" onClick={handleOpenModal}>독촉하기</button>
                            </div>
                        ))}
                    </div>
                    

                    {/* ✅ 추가된 정산 요청 리스트 (RoomDetail.js의 정산 요청 금액) */}
                    <h2 className="page-title-list">{roomName}의 정산 요청 금액</h2>
                    <p className="total-amount" style={{ marginTop: "5px" }}>
                        총 <strong>{moneyRecords.reduce((sum, rec) => sum + rec.amount, 0).toLocaleString()}원</strong>
                    </p>

                    <div className="settlement-list">
                        {moneyRecords.map((item, index) => (
                            <div key={index} className="settlement-item">
                                <p>
                                    <strong>{item.user}</strong> {item.amount.toLocaleString()}원 요청
                                </p>
                                <div className="settlement-actions">
                                    <X className="delete-icon" onClick={() => handleDelete(index)} />
                                    <button className="detail-button" onClick={() => navigate("/money-record-detail", { state: item })}>
                                        상세 보기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                </div>
            </div>

            {/* ✅ 모달 (독촉하기 성공 메시지) */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <p>📧 독촉하기 이메일을 성공적으로 보냈습니다.</p>
                        <button className="modal-close-button" onClick={() => setIsModalOpen(false)}>닫기</button>
                    </div>
                </div>
            )}



        </div>
    );
}

export default StartSettlement;
