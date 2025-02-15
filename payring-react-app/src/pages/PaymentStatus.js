import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/paymentstatus.css";

const PaymentStatus = () => {
  const { roomId } = useParams(); // URL에서 roomId 가져오기
  const [period, setPeriod] = useState(1); // 초기값을 1로 설정하여 "1주일"이 기본 선택 항목이 됩니다.
  const [payments, setPayments] = useState([]);
  const [totalSettledAmount, setTotalSettledAmount] = useState(0);
  const [unSettledAmount, setUnSettledAmount] = useState(0);

  // 쿠키에서 토큰을 가져오는 함수
  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      return match[2];
    }
    return null;
  };

  useEffect(() => {
    if (roomId) {  // roomId가 존재할 경우에만 fetch 실행
      fetchPayments();
    } else {
      console.error("roomId가 없습니다.");
    }
  }, [roomId, period]); // roomId가 변경되었을 때도 다시 fetch

  const fetchPayments = async () => {
    const token = getCookie("token"); // 쿠키에서 토큰 가져오기
    try {
      const response = await fetch(`/api/rooms/${roomId}/status?period=${period}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // 토큰을 헤더에 포함
        },
      });

      // 응답이 JSON 형식이 아닐 경우 처리
      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      const data = await response.json();

      if (data && data.data) {
        setTotalSettledAmount(data.data.totalSettledAmount); // 정산된 금액 설정
        setUnSettledAmount(data.data.unSettledAmount); // 미정산 금액 설정
        setPayments(data.data.roomInfos); // 방별 정산 데이터를 상태에 저장
      } else {
        console.error("응답 데이터가 예상과 다릅니다.", data);
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
    }
  };

  return (
    <div className="payment-status-page">
      <div className="summary">
        <p>
          정산 금액 <strong className="money">{totalSettledAmount.toLocaleString()} 원</strong>
        </p>
        <p>
          미정산 금액 <strong className="money">{unSettledAmount.toLocaleString()} 원</strong>
        </p>
        <button className="settle-button">정산 하기</button>
      </div>
      <hr />
      <select
        name="dropdown"
        value={period}
        onChange={(e) => setPeriod(Number(e.target.value))}
      >
        <option value={1}>1주일</option>
        <option value={4}>1개월</option>
        <option value={12}>3개월</option>
        <option value={0}>전체</option>
      </select>
      <ul className="payment-list">
        {payments.map((payment) => (
          <li key={payment.roomId} className="payment-item">
            <img
              src={payment.roomImage}
              alt={payment.roomName}
              className="room-image"
            />
            <div className="payment-info">
              <span className="room-name">{payment.roomName}</span>
              <span className="total-amount">
                총 {payment.totalAmount.toLocaleString()} 원
              </span>
            </div>
            {payment.roomStatus === "SETTLED" ? (
              <span className="status-check">✔</span>
            ) : (
              <span className="status-x">❌</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentStatus;