import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, signOut } = useAuth();
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    const userEmail = user?.email || 'user@example.com';
    // Use avatarPreview if available, otherwise fallback to UI Avatars
    const avatarUrl = avatarPreview ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail)}&background=4F46E5&color=fff&size=128&bold=true`;

    const handleChangePhotoClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                {/* Avatar */}
                <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="profile-avatar"
                />

                {/* Change Photo Button */}
                <button
                    type="button"
                    onClick={handleChangePhotoClick}
                    className="change-photo-btn"
                >
                    Change Photo
                </button>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden-input"
                    style={{ display: 'none' }}
                />

                <h2 className="profile-title">Profile</h2>

                <div className="profile-info">
                    <strong>Email:</strong> {userEmail}
                </div>

                <button className="logout-btn" onClick={signOut}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
