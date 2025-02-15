import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageNavigationButton = ({ label, to }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(to);
  };

  return (
    <button className="PageNavigationButton" type="button" onClick={handleNavigation}>
      {label}
    </button>
  );
};

export default PageNavigationButton;