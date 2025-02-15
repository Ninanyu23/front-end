import React from "react";
import { useNavigate } from "react-router-dom";
import PageNavigationButton from "./PageNavigate";

import btn1 from "../img/btn-newchat.png";
import btn2 from "../img/btn-search.png";
import btn3 from "../img/btn-mypage.png";

const MenuButtons = () => {
  return (
    <div className="move-menu">
      <div className="title">다른 메뉴로 이동하기</div>
      <div className="menu-container">
        <PageNavigationButton label={
          <div>
            <img src={btn1} alt="새로운 정산방" width="100px" height="100px" />
            <br />
            새로운 정산방 만들기
          </div>
        } to="/create-room" />

        <PageNavigationButton label={
          <div>
            <img src={btn2} alt="기간별 정산" />
            <br />
            기간별 정산<br />현황 조회하기
          </div>
        } to="/payment-status" />

        <PageNavigationButton label={
          <div>
            <img src={btn3} alt="마이페이지" />
            <br />
            마이 페이지로 이동하기
          </div>
        } to="/mypage" />
      </div>
    </div>
  );
};

export default MenuButtons;
