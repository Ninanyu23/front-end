import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/paymentstatus.css";
import "../styles/styles.css";
import Header from "../components/Header";

const PaymentStatus = () => {
  const { roomId } = useParams();
  const [period, setPeriod] = useState(1);
  const [payments, setPayments] = useState([]);
  const [totalSettledAmount, setTotalSettledAmount] = useState(0);
  const [unSettledAmount, setUnSettledAmount] = useState(0);

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  useEffect(() => {
    if (roomId) {
      fetchPayments();
    } else {
      console.error("roomId가 없습니다.");
    }
  }, [roomId, period]);

  const fetchPayments = async () => {
    const token = getCookie("token");
    try {
      const response = await fetch(`/api/rooms/${roomId}/status?period=${period}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      const data = await response.json();

      if (data && data.data) {
        setTotalSettledAmount(data.data.totalSettledAmount);
        setUnSettledAmount(data.data.unSettledAmount);
        setPayments(data.data.roomInfos);
      } else {
        console.error("응답 데이터가 예상과 다릅니다.", data);
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
    }
  };

  return (
    <div className='mobile-container'>
      <div className="header-wrapper">
        <Header />
      </div>
      <div className="payment-status-page">
        <div className="content-wrapper flex-row">
          <div>
            <p>
              정산 금액 <strong className="money">{totalSettledAmount.toLocaleString()} 원</strong>
            </p>
            <p>
              미정산 금액 <strong className="money">{unSettledAmount.toLocaleString()} 원</strong>
            </p>
          </div>
          <button className="settle-button">정산 하기</button>
        </div>
        <hr />
        <div className="content-wrapper">
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
      </div>
    </div>
  );
};

export default PaymentStatus;