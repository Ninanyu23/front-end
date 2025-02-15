import React from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import logo from "../img/logo.png";
import "../styles/Header.css";

const Header = () => {
    return (
        <div className="header">
            <div className="header-logo">
                <img src={logo} alt="페이링 로고" width="38px" height="38px" />
            </div>
            <Link to="/invite" className="bell">
                <Bell size={30} />
            </Link>
        </div>
    );
};

export default Header;
