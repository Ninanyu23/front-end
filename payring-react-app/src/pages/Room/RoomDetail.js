

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Header from "../../components/Header";
import "../../styles/RoomDetail.css";
import "../../styles/Modal.css";
import defaultImage from "../../img/defaultImage.png";
import invite from "../../img/invite.png";

function RoomDetail() {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ 세션 스토리지에서 데이터 가져오기
    const storedData = JSON.parse(sessionStorage.getItem("roomData")) || {};
    const { roomName, teamEmails: initialTeamEmails = [], moneyRecords: initialRecords = [] } = 
        location.state || storedData || { roomName: "새로운 방", teamEmails: [], moneyRecords: [] };

    const [moneyRecords, setMoneyRecords] = useState(initialRecords);
    const [teamEmails, setTeamEmails] = useState(initialTeamEmails);


    useEffect(() => {
        sessionStorage.setItem("roomData", JSON.stringify({ roomName, teamEmails, moneyRecords }));
    }, [moneyRecords, teamEmails]);

    const handleDelete = (index) => {
        const updatedRecords = moneyRecords.filter((_, i) => i !== index);
        setMoneyRecords(updatedRecords);
        sessionStorage.setItem("roomData", JSON.stringify({ roomName, teamEmails, moneyRecords: updatedRecords }));
    };

    return (
        <div className="mobile-container">
            <div className="header-wrapper">
            <Header />
            </div>
            <div className="content-wrapper">
                <div className="container">
                
                    <div className="room-header">
                        <h1 className="room-title">{roomName}</h1>
                        {/* ✅ 정산하기 버튼 클릭 시 StartSettlement 페이지로 데이터 전달 */}
                        <button
                            className="settlement-button"
                            onClick={() => navigate("/start-settlement", { 
                                state: { roomName, teamEmails, moneyRecords } 
                            })}
                        >
                            정산하기
                        </button>
                    </div>

                    <h3 className="team-title">{roomName}’s 팀원</h3>
                    <div className="team-list">
                        {teamEmails.map((member, index) => (
                            <div key={index} className="team-member">
                                <img src={defaultImage} alt="팀원 이미지" />
                                <p>{member}</p>
                            </div>
                        ))}
                        <div className="team-member add-member">
                            <button className="add-member-button">
                                <img src={invite} alt="팀원 초대 버튼"></img>
                                <p>팀원 초대</p>
                            </button>
                        </div>
                    </div>

                    {/* ✅ 정산 요청 금액 리스트 */}
                    <h4 className="small-title">{roomName}’s 정산 요청 금액</h4>
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
                                    <button 
                                        className="detail-button" 
                                        onClick={() => navigate("/money-record-detail", { state: item })}
                                    >
                                        상세 보기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="add-settlement-button" onClick={() => navigate("/money-record", { 
                        state: { roomName, teamEmails, moneyRecords } 
                    })}>
                        정산 추가하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RoomDetail;

