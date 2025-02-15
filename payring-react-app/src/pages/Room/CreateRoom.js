import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search } from "lucide-react";
import Header from "../../components/Header";
import "../../styles/CreateRoom.css";
import "../../styles/styles.css";
import addimg from "../../img/addimg.png";

function CreateRoom() {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState("");
    const [teamEmails, setTeamEmails] = useState([]); // 팀원 이메일 리스트
    const [email, setEmail] = useState("");
    const [roomImage, setRoomImage] = useState(null); // 미리보기 이미지 URL
    const [imageFile, setImageFile] = useState(null); // API에 보낼 실제 파일
    const [roomId, setRoomId] = useState(null); // 생성된 방 ID
    const [teamMembers, setTeamMembers] = useState([]); // 팀원 목록

    // 이메일 정규식 패턴 (유효성 검사)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 🔹 파일 선택 시 미리보기 설정 및 파일 저장
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // 업로드할 파일 저장
            setRoomImage(URL.createObjectURL(file)); // 미리보기 이미지 설정
        }
    };

    // 🔹 이메일 리스트에 추가
    const addEmailToList = () => {
        if (!emailRegex.test(email)) {
            alert("올바른 이메일 형식을 입력하세요.");
            return;
        }

        if (!teamEmails.includes(email)) {
            setTeamEmails([...teamEmails, email]);
        } else {
            alert("이미 추가된 이메일입니다.");
        }

        setEmail("");
    };

    // 🔹 이메일 리스트에서 제거
    const removeEmail = (emailToRemove) => {
        setTeamEmails(teamEmails.filter((email) => email !== emailToRemove));
    };

    // 🔹 방 생성 API 호출
    const createRoom = async () => {
        if (!roomName.trim()) {
            alert("방 이름을 입력하세요.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        const requestBody = {
            roomName: roomName,
            roomImage: imageFile ? imageFile.name : "", // 파일명이 API에 전송됨
        };

        console.log("🔹 방 생성 요청 데이터:", requestBody);

        try {
            const response = await fetch("https://storyteller-backend.site/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // JWT 토큰 추가
                },
                body: JSON.stringify(requestBody),
            });

            console.log("🔹 응답 상태 코드:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ 방 생성 실패:", errorData);
                throw new Error(`방 생성 실패: ${errorData.message || "알 수 없는 오류"}`);
            }

            const data = await response.json();
            console.log("✅ 방 생성 성공:", data);

            setRoomId(data.data.roomId);
            alert("방이 성공적으로 생성되었습니다!");

            // 팀원 초대 실행
            inviteMembers(data.data.roomId);

            // 팀원 목록 조회
            fetchRoomMembers(data.data.roomId);

            navigate(`/room-detail/${data.data.roomId}`);
        } catch (error) {
            console.error("❌ Error:", error);
            alert("방 생성에 실패했습니다.");
        }
    };

    // 🔹 팀원 초대 API 호출
    const inviteMembers = async (roomId) => {
        if (!roomId || teamEmails.length === 0) return;

        try {
            for (const email of teamEmails) {
                const requestBody = { roomId, email };

                const response = await fetch(`https://storyteller-backend.site/api/rooms/${roomId}/invite`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    throw new Error(`팀원 초대 실패: ${email}`);
                }

                console.log(`✅ 팀원 초대 성공: ${email}`);
            }

            alert("팀원 초대가 완료되었습니다!");
        } catch (error) {
            console.error("❌ Error:", error);
            alert("팀원 초대에 실패했습니다.");
        }
    };

    // 🔹 방 멤버 조회 API 호출
    const fetchRoomMembers = async (roomId) => {
        if (!roomId) return;

        try {
            const response = await fetch(`https://storyteller-backend.site/api/rooms/${roomId}/members`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("팀원 목록 조회 실패");
            }

            const data = await response.json();
            console.log("✅ 팀원 목록:", data.data);
            setTeamMembers(data.data);
        } catch (error) {
            console.error("❌ Error:", error);
            setTeamMembers([]);
        }
    };

    return (
        <div className="mobile-container">
          <div className="header-wrapper">
            <Header />
          </div>
            <div className="content-wrapper">
                <div className="container">
                    <div className="title-container">
                        <h2 className="section-title">방 이름</h2>
                    </div>
                    <input
                        className="input-field"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="방 이름을 입력하세요"
                    />

                    {/* 🔹 이미지 등록 UI */}
                    <div className="title-container" style={{ marginTop: "20px" }}>
                        <h2 className="section-title">방 이미지 등록</h2>
                    </div>
                    <div className="file-upload" onClick={() => document.getElementById("fileInput").click()}>
                        {roomImage ? <img src={roomImage} alt="Room Preview" /> : <img src={addimg} alt="Default" />}
                        <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            hidden
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="team-invite">
                        <h2 className="section-title">팀원 추가</h2>
                        <p className="inline-text">팀원의 이메일을 입력하세요.</p>
                    </div>

                    <div className="email-container">
                        <input
                            className="input-field email-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                        />
                        <Search className="search-icon" size={20} onClick={addEmailToList} />
                    </div>

                    <div className="email-list">
                        {teamEmails.map((email, index) => (
                            <div key={index} className="email-item">
                                {email}
                                <X className="delete-icon" size={20} onClick={() => removeEmail(email)} />
                            </div>
                        ))}
                    </div>

                    <button className="primary-button" onClick={createRoom}>
                        방 생성하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateRoom;
