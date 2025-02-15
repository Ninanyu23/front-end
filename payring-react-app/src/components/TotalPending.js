import React from "react";
import icon from "../img/Magnifying.png";

const TotalPending= () => {
  return (
    <section className="unsettlement">
      <h2>
        <img src={icon} alt="icon"></img> 미정산 금액 한눈에 보기
      </h2>
        <div className="unsettled-box">
          <p>정산 완료까지  <strong>3만 8천원</strong> 남음</p>
        </div>
    </section>
  );
};

export default TotalPending;
