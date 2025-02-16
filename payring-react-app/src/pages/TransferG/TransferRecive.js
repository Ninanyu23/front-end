import React, { useEffect, useState } from "react";
import "../../styles/transfersend.css";
import "../../styles/styles.css";
import Header from "../../components/Header";

// 쿠키에서 'token' 값을 가져오는 함수
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Authorization 헤더가 자동으로 추가되는 fetch 함수
const fetchWithAuth = async (url, options = {}) => {
  const token = getCookie("token"); // 쿠키에서 'token' 가져오기
  const headers = {
    ...options.headers, // 기존에 있는 헤더 유지
    Authorization: `Bearer ${token}`, // Authorization 헤더 추가
  };

  // 새로운 헤더를 포함한 fetch 요청 반환
  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};

const TransferRecieve = ({ roomId }) => {
  const [transfers, setTransfers] = useState([]); // 모든 송금 내역을 하나의 상태로 관리
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      // '/api/rooms/{roomId}/transfers/send' API 호출
      const res = await fetchWithAuth(`/api/rooms/${roomId}/transfers/send`);

      if (!res.ok) {
        throw new Error('송금 내역을 불러오는 데 실패했습니다.');
      }

      const data = await res.json();
      setTransfers(data.data.transfers); // 모든 송금 내역을 상태로 설정
    } catch (error) {
      console.error("Error fetching transfer data", error);
      setErrorMessage("송금 내역을 불러오는 데 실패했습니다."); // 에러 메시지 상태 업데이트
    }
  };

  const sendReminder = async (transferId) => {
    try {
      const response = await fetchWithAuth(`/api/rooms/transfers/${transferId}/send-remind`, {
        method: "POST",
      });

      if (response.ok) {
        alert("송금 요청을 보냈습니다.");
      } else {
        alert("송금 요청을 보내는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error sending reminder", error);
      alert("송금 요청을 보내는 데 실패했습니다.");
    }
  };

  // 송금 받은 내역과 송금을 받지 않은 내역을 구분
  const receivedTransfers = transfers.filter(transfer => transfer.status === "received");
  const notReceivedTransfers = transfers.filter(transfer => transfer.status === "not-received");

  return (
    <div className="mobile-container">
      <div className="header-wrapper">
        <Header />
      </div>
      <div className="transfer-status-container">
        <h2>{`방 이름`}</h2>

        {/* 에러 메시지 표시 */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {/* 송금을 받지 않은 내역 */}
        <h3>아직 송금을 받지 않았어요!</h3>
        {notReceivedTransfers.length === 0 ? (
          <p>송금 받을 내역이 없습니다.</p>
        ) : (
          notReceivedTransfers.map((transfer) => (
            <div key={transfer.transferId} className="pending-transfer">
              <span>{transfer.sender}</span>
              <span>{transfer.amount.toLocaleString()}원</span>
              <button onClick={() => sendReminder(transfer.transferId)}>독촉하기</button>
            </div>
          ))
        )}

        {/* 송금 받은 내역 */}
        <h3>정산 받은 내역</h3>
        {receivedTransfers.length === 0 ? (
          <p>받은 송금 내역이 없습니다.</p>
        ) : (
          receivedTransfers.map((transfer) => (
            <div key={transfer.transferId} className="sent-transfer">
              <div className="profile-section">
                <img src={transfer.receiverImage} alt={transfer.receiverName} className="profile-image" />
                <span>{transfer.receiverName}</span>
              </div>
              <div className="transfer-message">
                <p>{transfer.receiverName}님에게</p>
                <p>{transfer.amount.toLocaleString()}원을 받았어요</p>
              </div>
              <img className="transfer-image" src={transfer.transferImage} alt="송금 이미지" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransferRecieve;