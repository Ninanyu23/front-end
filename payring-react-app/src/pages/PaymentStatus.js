import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/paymentstatus.css";

const PaymentStatus = () => {
  const { roomId } = useParams();
  const [period, setPeriod] = useState(1); // 초기값을 1로 설정하여 "1주일"이 기본 선택 항목이 됩니다.
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, [period]);

  const fetchPayments = async () => {
    try {
      const response = await fetch(
        `${roomId}/status?period=${period}`
      );
      const data = await response.json();
      if (response.ok) {
        setPayments(data.data);
      } else {
        console.error("데이터를 불러오는 데 실패했습니다.", data.message);
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
    }
  };

  return (
    <div className="payment-status-page">
      <div className="summary">
        <p>정산 금액 <strong className="money">265,200 원</strong></p>
        <p>미정산 금액 <strong className="money">32,000 원</strong></p>
        <button className="settle-button">정산 하기</button>
      </div>
      <hr />
      <select name="dropdown" value={period} onChange={(e) => setPeriod(Number(e.target.value))}>
        <option value={1}>1주일</option>
        <option value={4}>1개월</option>
        <option value={12}>3개월</option>
        <option value={0}>전체</option>
      </select>
      <ul className="payment-list">
        {payments.map((payment) => (
          <li key={payment.id} className="payment-item">
            <img src={payment.imageUrl} alt={payment.roomName} className="room-image" />
            <div className="payment-info">
              <span className="room-name">{payment.roomName}</span>
              <span className="total-amount">총 {payment.amount.toLocaleString()} 원</span>
            </div>
            {payment.isSettled ? (
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