import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import '../../styles/styles.css';
import '../../styles/MoneyRecord.css';

function MoneyRecord() {
    const navigate = useNavigate();
    const { id: roomId } = useParams();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [memo, setMemo] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        checkRoomAccess();
    }, [roomId]);

    // ✅ 사용자가 방에 참여했는지 확인하는 함수
    const checkRoomAccess = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/");
            return;
        }

        try {
            const response = await axios.get(`https://storyteller-backend.site/api/rooms/${roomId}/members`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const members = response.data.data;
            if (!members || members.length === 0) {
                alert("이 방에 참여하고 있지 않습니다. 접근할 수 없습니다.");
                navigate("/main");
                return;
            }

            const userEmail = localStorage.getItem("userEmail");
            const isMember = members.some(member => member.email === userEmail);

            if (!isMember) {
                alert("이 방에 참여하고 있지 않습니다. 접근할 수 없습니다.");
                navigate("/main");
            } else {
                setIsAuthorized(true);
            }
        } catch (error) {
            console.error("🚨 방 접근 권한 확인 실패:", error);
            alert("방 접근 권한을 확인할 수 없습니다.");
            navigate("/main");
        }
    };

    // ✅ 이미지 업로드 핸들러
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // ✅ 정산 등록 API 호출 (req JSON + 이미지 모두 FormData로 전송)
    const submitRecord = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/");
            return;
        }

        const formData = new FormData();
        const reqData = {
            roomId: roomId,
            amount: parseInt(amount),
            title,
            memo,
        };

        // JSON 데이터를 Blob으로 변환 후 FormData에 추가
        formData.append("req", new Blob([JSON.stringify(reqData)], { type: "application/json" }));

        // 이미지 파일 추가 (이미지가 존재할 때만)
        if (image) {
            formData.append("image", image);
        }

        try {
            console.log("🚀 API 요청 시작:", `https://storyteller-backend.site/api/rooms/payments`);

            const response = await axios.post(
                `https://storyteller-backend.site/api/rooms/payments`,
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            alert("정산이 등록되었습니다!");
            console.log("✅ 정산 등록 성공:", response.data);
            navigate(`/room-detail/${roomId}`);

        } catch (error) {
            console.error("❌ 정산 등록 실패:", error);

            if (error.response) {
                alert(`정산 등록에 실패했습니다: ${error.response.data?.message || "알 수 없는 오류"}`);
            } else {
                alert("정산 등록 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="mobile-container">
            <div className="header-wrapper">
                <Header />
            </div>
            <div className="content-wrapper">
                <div className="container">
                    <h2 className="money-record-title">정산 등록하기</h2>

                    <input
                        className="money-record-title-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요."
                    />

                    <div className="amount-container">
                        <span className="currency-symbol">₩</span>
                        <input
                            className="money-record-amount-input"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="정산 금액을 입력해 주세요"
                        />
                    </div>

                    {/* ✅ 이미지 업로드 버튼 */}
                    <div className="image-upload-container">
                        <label className="image-upload-label">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="image-upload-input"
                            />
                            <span className="image-upload-button">🖼️ 이미지 추가</span>
                        </label>
                    </div>

                    {/* ✅ 이미지 미리보기 */}
                    {imagePreview && (
                        <div className="image-preview-container">
                            <img src={imagePreview} alt="미리보기" className="image-preview" />
                        </div>
                    )}

                    <div className="memo-container">
                        <textarea
                            className="memo-field"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="메모 입력"
                        />
                    </div>

                    {isAuthorized ? (
                        <button className="register-button" onClick={submitRecord}>등록하기</button>
                    ) : (
                        <button className="register-button" disabled>권한 없음</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MoneyRecord;
