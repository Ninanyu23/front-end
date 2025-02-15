import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from "../../components/Header";
import '../../styles/styles.css';
import '../../styles/MoneyRecord.css';

function MoneyRecord() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 URL 저장

  useEffect(() => {
    console.log("MoneyRecord useEffect - State 확인:", state);
    if (!state || !state.roomName) {
      alert("잘못된 접근입니다. 메인 화면으로 이동합니다.");
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  // 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);

      // 파일을 읽어 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 정산 기록 제출 함수
  const submitRecord = () => {
    if (!state || !state.roomName) {
      alert("방 정보가 없습니다. 다시 시도해 주세요.");
      return;
    }
  
    const newRecord = { 
      title, 
      amount: parseInt(amount), 
      memo, 
      image, 
      user: '김은서' 
    };
  
    navigate('/room-detail', { 
      state: { 
        ...state, 
        moneyRecords: [...(state.moneyRecords || []), newRecord] // 기존 데이터 유지하면서 새로운 데이터 추가
      } 
    });
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
            <label className="image-upload-label">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="image-upload-input"
              />
              <span className="image-upload-button">🖼️</span>
            </label>
          </div>
          
          <div className="memo-container">
            {imagePreview && <img src={imagePreview} alt="미리보기" className="image-preview" />}
            <textarea 
              className="memo-field" 
              value={memo} 
              onChange={(e) => setMemo(e.target.value)} 
              placeholder="메모 입력" 
            />
          </div>
          
          <button className="register-button" onClick={submitRecord}>등록하기</button>
        </div>
      </div>
    </div>
  );
}


export default MoneyRecord;
