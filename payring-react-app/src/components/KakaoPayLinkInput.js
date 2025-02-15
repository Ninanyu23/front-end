import React from 'react';

const KakaoPayLinkInput = ({ link, onLinkChange, isEditable, className }) => {
  return (
    <div className={className ? `kakao-pay-link-container ${className}` : 'kakao-pay-link-container'}>
      <label htmlFor="kakaoPayLink">카카오페이 URL</label>
      {isEditable ? (
        <input
          type="url"
          id="kakaoPayLink"
          value={link}
          onChange={(e) => onLinkChange(e.target.value)}
          placeholder="카카오페이 URL을 입력하세요"
          required
        />
      ) : (
        <span className="info-value">
          <a href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        </span>
      )}
    </div>
  );
};

export default KakaoPayLinkInput;