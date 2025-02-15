import React from 'react';

const ProfileImage = ({ imageUrl, onImageChange }) => {
  return (
    <div className="profile-image-container">
      <img
        src={imageUrl}
        alt="Profile"
        className="profile-image"
      />
      {onImageChange && (
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="profile-image-input"
        />
      )}
    </div>
  );
};

export default ProfileImage;