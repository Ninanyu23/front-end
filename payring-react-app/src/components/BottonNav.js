import React from "react";
import PageNavigationButton from "./PageNavigate";

import home from "../img/nav-home.png";
import newchat from "../img/nav-newchat.png";
import search from "../img/nav-search.png";
import mypage from "../img/nav-mypage.png";

const BottonNav = () => {
  return (
    <nav className="bottom-nav">
      <PageNavigationButton 
        label={<img src={home} alt="home icon" />} 
        to="/main" 
      />
      <PageNavigationButton 
        label={<img src={newchat} alt="newchat icon" />} 
        to="/create-room" 
      />
      <PageNavigationButton 
        label={<img src={search} alt="search icon" />} 
        to="/payment-status" 
      />
      <PageNavigationButton 
        label={<img src={mypage} alt="mypage icon" />} 
        to="/mypage" 
      />
    </nav>
  );
};

export default BottonNav;


/* import { Home, List, CreditCard, User } from "lucide-react";

const NavigationMenu = () => {
  return (
    <nav className="fixed bottom-0 w-full bg-white shadow-md flex justify-around p-3">
      <button className="flex flex-col items-center">
        <Home size={24} />
        <span>홈</span>
      </button>
      <button className="flex flex-col items-center">
        <CreditCard size={24} />
        <span>새 정산</span>
      </button>
      <button className="flex flex-col items-center">
        <List size={24} />
        <span>정산 조회</span>
      </button>
      <button className="flex flex-col items-center">
        <User size={24} />
        <span>마이페이지</span>
      </button>
    </nav>
  );
};

export default NavigationMenu; */
