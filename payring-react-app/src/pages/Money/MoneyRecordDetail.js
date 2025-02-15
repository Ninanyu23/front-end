import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "../../styles/MoneyRecord.css";
import "../../styles/MoneyRecordDetail.css";

function MoneyRecordDetail() {
    const { state } = useLocation();
    const navigate = useNavigate();

    return (
        <div className="mobile-container">
            <div className="header-wrapper">
                <Header />
            </div>
            <div className="container">
                <h2 className="money-record-title">정산 상세보기</h2>
                
                {/* 제목 표시 */}
                <div className="money-record-title-input">
                    {state?.title || "제목 없음"}
                </div>
                
                {/* 정산 금액 */}
                <div className="amount-container">
                    <span className="currency-symbol">₩</span>
                    <span className="money-record-amount-input">{state?.amount?.toLocaleString() || 0}</span>
                </div>
                
                {/* 이미지 표시 */}
                {state?.image && (
                    <div className="image-preview">
                        <img src={state.image} alt="Uploaded" className="record-image" />
                    </div>
                )}
                
                {/* 메모 표시 */}
                <div className="memo-container">
                    <p className="memo-field">{state?.memo || "메모 없음"}</p>
                </div>
                
                {/* 뒤로 가기 버튼 */}
                <button className="back-button" onClick={() => navigate(-1)}>
                    뒤로 가기
                </button>
            </div>
        </div>
    );
}

export default MoneyRecordDetail;
