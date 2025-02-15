import home from "../img/nav-home.png";
import newchat from "../img/nav-newchat.png";
import search from "../img/nav-search.png";
import mypage from "../img/nav-mypage.png";

const BottonNav = () => {
  return (
    <nav>
      <button>
        <img src={home} alt="home icon"></img>
      </button>
      <button>
        <img src={newchat} alt="newchat icon"></img>
      </button>
      <button>
        <img src={search} alt="search icon"></img>
      </button>
      <button>
        <img src={mypage} alt="mypage icon"></img>
      </button>
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
