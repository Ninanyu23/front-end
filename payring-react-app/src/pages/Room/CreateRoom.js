import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search } from "lucide-react";
import Header from "../../components/Header";
import "../../styles/CreateRoom.css";
import "../../styles/styles.css";
import addimg from "../../img/addimg.png";

// ✅ 본인 이메일 가져오기
const userEmail = localStorage.getItem("userEmail");

// 쿠키에서 token 가져오기
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

function CreateRoom() {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState("");
    const [teamEmails, setTeamEmails] = useState([]); // 팀원 이메일 리스트
    const [email, setEmail] = useState("");
    const [roomImage, setRoomImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [roomId, setRoomId] = useState(null);

    // 🔹 파일 선택 시 미리보기 설정 및 파일 저장
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setRoomImage(URL.createObjectURL(file));
        }
    };

    // 🔹 이메일 리스트에 추가 (조회 없이 바로 추가)
    const addEmailToList = () => {
        if (!email.trim()) return;
        if (teamEmails.includes(email)) {
            alert("이미 추가된 이메일입니다.");
            return;
        }
        setTeamEmails([...teamEmails, email]);
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

        const token = getCookie("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            window.location.href = "/l";
            return;
        }

        const requestBody = {
            roomName: roomName,
            roomImage: imageFile ? imageFile.name : "",
        };

        console.log("🔹 방 생성 요청 데이터:", requestBody);

        try {
            const response = await fetch("https://storyteller-backend.site/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("❌ 방 생성 실패:", errorData);
                throw new Error(`방 생성 실패: ${errorData || "알 수 없는 오류"}`);
            }

            const data = await response.json();
            console.log("✅ 방 생성 성공:", data);

            setRoomId(data.data.roomId);
            alert("방이 성공적으로 생성되었습니다!");

            // ✅ 방 생성 후 팀원 초대 실행
            inviteMembers(data.data.roomId);

            navigate(`/room-detail/${data.data.roomId}`);
        } catch (error) {
            console.error("❌ Error:", error);
            alert("방 생성에 실패했습니다.");
        }
    };

    // 🔹 팀원 초대 API 호출 (본인 제외)
    const inviteMembers = async (roomId) => {
        if (!roomId || teamEmails.length === 0) return;

        // ✅ 본인 이메일 제외
        const filteredEmails = teamEmails.filter(email => email !== userEmail);

        if (filteredEmails.length === 0) {
            console.log("✅ 초대할 팀원이 없습니다.");
            return;
        }

        try {
            const inviteRequests = filteredEmails.map((email) =>
                fetch(`https://storyteller-backend.site/api/rooms/${roomId}/invite`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getCookie("token")}`,
                    },
                    body: JSON.stringify({ roomId, email }),
                })
                    .then(async (response) => {
                        if (!response.ok) {
                            const errorData = await response.text();
                            console.error(`팀원 초대 실패: ${email}`, errorData);
                            throw new Error(`팀원 초대 실패: ${email} - ${errorData}`);
                        }

                        const textResponse = await response.text();
                        if (!textResponse) {
                            throw new Error(`팀원 초대 실패: ${email} - 빈 응답`);
                        }

                        const data = JSON.parse(textResponse);
                        if (data.status !== 200 || data.code !== "SUCCESS_INVITE_MEMBER") {
                            throw new Error(`팀원 초대 실패: ${email} - ${data.message || "알 수 없는 오류"}`);
                        }

                        return data;
                    })
            );

            await Promise.all(inviteRequests);
            console.log("✅ 모든 팀원 초대 성공!");
            alert("팀원 초대가 완료되었습니다!");
        } catch (error) {
            console.error("❌ 팀원 초대 오류:", error);
            alert(`일부 팀원 초대에 실패했습니다. 오류: ${error.message}`);
        }
    };

    return (
        <div className="mobile-container">
            <div className="header-wrapper">
                <Header />
            </div>
            <div className="content-wrapper">
                <div className="container">
                    <h2 className="section-title">방 이름</h2>
                    <input
                        className="input-field"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="방 이름을 입력하세요"
                    />

                    {/* 🔹 이미지 등록 UI */}
                    <h2 className="section-title">방 이미지 등록</h2>
                    <div className="file-upload" onClick={() => document.getElementById("fileInput").click()}>
                        {roomImage ? <img src={roomImage} alt="Room Preview" /> : <img src={addimg} alt="Default" />}
                        <input type="file" accept="image/*" id="fileInput" hidden onChange={handleFileChange} />
                    </div>

                    <h2 className="section-title">팀원 추가</h2>
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

                    <button className="primary-button" onClick={createRoom}>방 생성하기</button>
                </div>
            </div>
        </div>
    );
}

export default CreateRoom;
