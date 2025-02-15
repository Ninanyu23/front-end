import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import icon from "../img/Hourglass.png";
import cover1 from "../img/cover1.png";
import cover2 from "../img/cover2.png";
import cover3 from "../img/cover3.png";
import cover4 from "../img/cover4.png";

const covers = [cover1, cover2, cover3, cover4]; // ✅ 기본 커버 이미지 배열

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeGroups, setActiveGroups] = useState({}); // ✅ 토글 상태 관리
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const userEmail = localStorage.getItem("userEmail"); // ✅ 로그인한 사용자 이메일

                if (!token || !userEmail) {
                    throw new Error("로그인이 필요합니다.");
                }

                const response = await axios.get("https://storyteller-backend.site/api/rooms", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.data.status === 200) {
                    const roomData = response.data.data;

                    // ✅ 각 방의 상세 정보를 가져와 팀원 리스트 포함
                    const detailedGroups = await Promise.all(
                        roomData.map(async (group) => {
                            try {
                                const roomResponse = await axios.get(
                                    `https://storyteller-backend.site/api/rooms/${group.roomId}`,
                                    {
                                        headers: { "Authorization": `Bearer ${token}` },
                                    }
                                );

                                const roomDetails = roomResponse.data.data;
                                const isUserInRoom = roomDetails.teamMembers.some(member => member.email === userEmail);

                                return isUserInRoom
                                    ? { ...group, roomImage: roomDetails.roomImage, teamMembers: roomDetails.teamMembers }
                                    : null;
                            } catch (err) {
                                console.error(`🚨 방 상세 조회 실패 (roomId: ${group.roomId}):`, err);
                                return null; // 오류 발생 시 제외
                            }
                        })
                    );

                    // ✅ 로그인한 사용자가 포함된 방만 필터링
                    const filteredGroups = detailedGroups.filter(group => group !== null);
                    setGroups(filteredGroups);

                    // ✅ 초기 토글 상태 설정 (모든 그룹 기본 ON)
                    const initialActiveState = filteredGroups.reduce((acc, group) => {
                        acc[group.roomId] = true; // ✅ 기본적으로 모든 토글 ON
                        return acc;
                    }, {});
                    setActiveGroups(initialActiveState);
                } else {
                    throw new Error("데이터를 불러오는 데 실패했습니다.");
                }
            } catch (err) {
                console.error("🚨 API 요청 실패:", err.response ? err.response.data : err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    // ✅ 방 삭제 API 호출 함수
    const deleteRoom = async (roomId) => {
        const token = localStorage.getItem("accessToken");

        try {
            console.log(`🚀 방 삭제 요청 시작: /api/rooms/${roomId}`);

            await axios.delete(`https://storyteller-backend.site/api/rooms/${roomId}`, {
                headers: { "Authorization": `Bearer ${token}` },
            });

            console.log(`✅ 방 삭제 성공: roomId ${roomId}`);

            // ✅ UI에서도 즉시 삭제
            setGroups((prevGroups) => prevGroups.filter(group => group.roomId !== roomId));

        } catch (error) {
            console.error(`❌ 방 삭제 실패: roomId ${roomId}`, error);

            if (error.response) {
                alert(`방 삭제에 실패했습니다: ${error.response.data?.message || "알 수 없는 오류"}`);
            } else {
                alert("방 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    // ✅ 토글 스위치 상태 변경 함수 (OFF 시 방 삭제)
    const toggleGroup = (roomId, event) => {
        event.stopPropagation(); // ✅ 토글 클릭 시 방 이동 방지

        setActiveGroups((prev) => {
            const newState = { ...prev, [roomId]: !prev[roomId] };

            // ✅ OFF로 변경 시 방 삭제 API 호출
            if (!newState[roomId]) {
                deleteRoom(roomId);
            }

            return newState;
        });
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>에러 발생: {error}</p>;

    return (
        <section className="grouplist">
            <h2>
                <img src={icon} alt="icon" /> 정산 할 모임 목록
            </h2>
            <div>
                {groups.length === 0 ? (
                    <p>참여 중인 방이 없습니다.</p>
                ) : (
                    groups.map((group, index) => (
                        <div 
                            key={group.roomId} 
                            className="group-item" 
                            onClick={() => navigate(`/start-settlement/${group.roomId}`)}
                            style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                        >
                            <div className="group-info" style={{ display: "flex", alignItems: "center" }}>
                                {/* ✅ 방 등록 시 설정한 이미지가 있으면 해당 이미지 사용, 없으면 기본 이미지 사용 */}
                                <img 
                                    src={group.roomImage ? `https://storyteller-backend.site/uploads/${group.roomImage}` : covers[index % covers.length]} 
                                    alt={`cover ${group.roomId}`} 
                                    style={{ 
                                        objectFit: "cover", 
                                        width: "60px",   
                                        height: "60px",  
                                        borderRadius: "8px",
                                        marginRight: "15px"  
                                    }} 
                                />
                                <div className="group-text">
                                    <p>{group.roomName} ({group.teamMembers.length}명)</p>
                                    <p>
                                        {group.teamMembers.length > 0 
                                            ? group.teamMembers.map(member => member.userName).join(", ")
                                            : "참여자 없음"}
                                    </p>
                                </div>
                            </div>

                            {/* ✅ 토글 스위치 (ON/OFF 변경 가능) */}
                            <label className="switch" onClick={(e) => toggleGroup(group.roomId, e)}>
                                <input type="checkbox" checked={activeGroups[group.roomId]} readOnly />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default GroupList;
