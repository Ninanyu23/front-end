import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../img/Hourglass.png";
import cover1 from "../img/cover1.png";
import cover2 from "../img/cover2.png";
import cover3 from "../img/cover3.png";
import cover4 from "../img/cover4.png";

const covers = [cover1, cover2, cover3, cover4];

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeGroups, setActiveGroups] = useState({});
    const navigate = useNavigate();

    const getCookie = (name) => {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});
        return cookies[name] || null;
    };

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = getCookie("token");

                if (!token) {
                    throw new Error("로그인 정보가 필요합니다.");
                }

                console.log("Fetching groups...");

                const response = await fetch("https://storyteller-backend.site/api/rooms", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`API 요청 실패: ${response.statusText}`);
                }

                const data = await response.json();

                if (data.status === 200) {
                    const roomData = data.data;
                    console.log("Fetched room data:", roomData);

                    const detailedGroups = await Promise.all(
                        roomData.map(async (group) => {
                            try {
                                const roomResponse = await fetch(
                                    `https://storyteller-backend.site/api/rooms/${group.roomId}`,
                                    {
                                        headers: { "Authorization": `Bearer ${token}` },
                                    }
                                );
                                const roomDetails = await roomResponse.json();
                                return roomDetails.data ? { ...group, roomImage: roomDetails.data.roomImage, teamMembers: roomDetails.data.teamMembers } : null;
                            } catch (err) {
                                console.error(`Error fetching room details for ${group.roomId}:`, err);
                                return null;
                            }
                        })
                    );

                    const filteredGroups = detailedGroups.filter((group) => group !== null);
                    setGroups(filteredGroups);

                    const initialActiveState = filteredGroups.reduce((acc, group) => {
                        acc[group.roomId] = true;
                        return acc;
                    }, {});
                    setActiveGroups(initialActiveState);
                } else {
                    throw new Error("데이터를 불러오는 데 실패했습니다.");
                }
            } catch (err) {
                console.error("Error during fetch:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const deleteRoom = async (roomId) => {
        const token = getCookie("accessToken");

        try {
            console.log(`Deleting room with ID: ${roomId}`);
            await fetch(`https://storyteller-backend.site/api/rooms/${roomId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });

            setGroups((prevGroups) => prevGroups.filter((group) => group.roomId !== roomId));
            console.log(`Room with ID: ${roomId} deleted successfully`);
        } catch (error) {
            console.error(`Error deleting room with ID: ${roomId}:`, error);
        }
    };

    const toggleGroup = (roomId, event) => {
        event.stopPropagation();

        setActiveGroups((prev) => {
            const newState = { ...prev, [roomId]: !prev[roomId] };

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
                                <img
                                    src={group.roomImage ? `https://storyteller-backend.site/uploads/${group.roomImage}` : covers[index % covers.length]}
                                    alt={`cover ${group.roomId}`}
                                    style={{
                                        objectFit: "cover",
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "8px",
                                        marginRight: "15px",
                                    }}
                                />
                                <div className="group-text">
                                    <p>{group.roomName} ({group.teamMembers.length}명)</p>
                                    <p>
                                        {group.teamMembers.length > 0
                                            ? group.teamMembers.map((member) => member.userName).join(", ")
                                            : "참여자 없음"}
                                    </p>
                                </div>
                            </div>

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