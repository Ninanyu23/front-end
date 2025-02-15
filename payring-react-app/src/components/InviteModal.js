import React, { useState } from "react";
import axios from "axios";

const InviteModal = ({ roomId, onClose }) => {
    const [email, setEmail] = useState("");

    // 초대 API 호출
    const handleInvite = async () => {
        if (!email.trim()) {
            alert("이메일을 입력해주세요.");
            return;
        }

        try {
            await axios.post(`/api/rooms/${roomId}/invite`, { roomId, email });
            alert("팀원 초대에 성공했습니다.");
            onClose(); // 모달 닫기
        } catch (error) {
            alert("초대 실패: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>팀원 초대</h2>
                <input
                    type="email"
                    placeholder="초대할 팀원의 이메일 입력"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <div>
                    <button style={styles.inviteButton} onClick={handleInvite}>초대하기</button>
                    <button style={styles.closeButton} onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

// ✅ CSS 스타일을 객체로 정의
const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        width: "320px",
        maxWidth: "90%",
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "30px",
        fontSize: "14px",
        marginBottom: "10px",
        boxSizing: "border-box",
    },
    inviteButton: {
        width: "100%",
        padding: "12px",
        marginTop: "5px",
        border: "none",
        borderRadius: "30px",
        cursor: "pointer",
        fontSize: "14px",
        backgroundColor: "#08313F",
        color: "white",
    },
    closeButton: {
        width: "100%",
        padding: "12px",
        marginTop: "5px",
        border: "none",
        borderRadius: "30px",
        cursor: "pointer",
        fontSize: "14px",
        backgroundColor: "#efefef",
        color: "black",
    },
};

// ✅ 초대 버튼 hover 스타일 적용 (JS 방식)
styles.inviteButton["&:hover"] = {
    backgroundColor: "#D5EDD2",
    color: "#08313F",
};
styles.closeButton["&:hover"] = {
    backgroundColor: "#aaa",
};

export default InviteModal;
