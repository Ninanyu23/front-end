import React from "react";
import GroupList from "../../components/GroupList";
import TotalPending from "../../components/TotalPending";
import MenuButtons from "../../components/MenuButtons";
import BottomNav from "../../components/BottonNav";
import Header from "../../components/Header";
import "../../styles/styles.css";
import "../../styles/mainpage.css";


const MainPage = () => {
    return (
        <div className="mobile-container">
            {/* 상단 헤더 */}
            <Header />
            
            <div className="content-wrapper">
                <div className="mainpage">
                    {/* 스크롤 가능 정산 목록 */}
                    <div className="scrollable-section">
                        <GroupList />
                    </div>
                    
                    {/* 미정산 금액 정보 */}
                    <TotalPending />
                    
                    {/* 다른 서비스 이동 버튼 */}
                    <MenuButtons />
                </div>
            </div>
            
            {/* 하단 네비게이션 바 */}
            <BottomNav />
        </div>
    );
};

export default MainPage;
