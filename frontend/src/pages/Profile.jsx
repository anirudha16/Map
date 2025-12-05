// import React, { useState, useRef } from 'react';
// import { useAuth } from '../context/AuthContext';

// const Profile = () => {
//     const { user, signOut } = useAuth();
//     const [avatarPreview, setAvatarPreview] = useState(null);
//     const fileInputRef = useRef(null);

//     const userEmail = user?.email || 'user@example.com';
//     // Use avatarPreview if available, otherwise fallback to UI Avatars
//     const avatarUrl = avatarPreview ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail)}&background=4F46E5&color=fff&size=128&bold=true`;

//     const handleChangePhotoClick = () => {
//         if (fileInputRef.current) {
//             fileInputRef.current.click();
//         }
//     };

//     const handleFileChange = (event) => {
//         const file = event.target.files?.[0];
//         if (!file) return;
//         const previewUrl = URL.createObjectURL(file);
//         setAvatarPreview(previewUrl);
//     };

//     return (
//         <div className="profile-container">
//             <div className="profile-card">
//                 {/* Avatar */}
//                 <img
//                     src={avatarUrl}
//                     alt="User Avatar"
//                     className="profile-avatar"
//                 />

//                 {/* Change Photo Button */}
//                 <button
//                     type="button"
//                     onClick={handleChangePhotoClick}
//                     className="change-photo-btn"
//                 >
//                     Change Photo
//                 </button>

//                 <input
//                     type="file"
//                     accept="image/*"
//                     ref={fileInputRef}
//                     onChange={handleFileChange}
//                     className="hidden-input"
//                     style={{ display: 'none' }}
//                 />

//                 <h2 className="profile-title">Profile</h2>

//                 <div className="profile-info">
//                     <strong>Email:</strong> {userEmail}
//                 </div>

//                 <button className="logout-btn" onClick={signOut}>
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Profile;
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const Profile = () => {
    const { user, signOut } = useAuth();

    const [selectedTab, setSelectedTab] = useState("info"); // info | activity | favourites

    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState(null);
    const [reviewCount, setReviewCount] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const userEmail = user?.email || "user@example.com";
    const avatarUrl =
        avatarPreview ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            userEmail
        )}&background=4F46E5&color=fff&size=128&bold=true`;

    // ===================================================
    // Helper Functions
    // ===================================================
    const fetchReviewCount = async (email) => {
        const { count } = await supabase
            .from("reviews")
            .select("*", { count: "exact", head: true })
            .eq("user_email", email);

        setReviewCount(count || 0);
    };

    const loadProfileData = async () => {
        setLoading(true);

        // 1️⃣ Profile Data
        const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", user.id)
            .single();

        setProfile(profileData);

        // 2️⃣ Reviews Count
        await fetchReviewCount(user.email);

        // 3️⃣ Reviews List
        const { data: reviewsList } = await supabase
            .from("reviews")
            .select("*")
            .eq("user_email", user.email);

        setReviews(reviewsList || []);

        // 4️⃣ Favourites
        const { data: favoritesData } = await supabase
            .from("favorites")
            .select("place_id")
            .eq("user_email", user.email);

        if (favoritesData && favoritesData.length > 0) {
            const placeIds = favoritesData.map(fav => fav.place_id);
            const { data: placesData } = await supabase
                .from("places")
                .select("*")
                .in("id", placeIds);
            setFavorites(placesData || []);
        } else {
            setFavorites([]);
        }

        setLoading(false);
    };

    // ===================================================
    // Load Profile, Reviews, Favourites
    // ===================================================
    useEffect(() => {
        if (!user) return;
        loadProfileData();
    }, [user]);

    // ===================================================
    // Avatar Upload
    // ===================================================
    const handleChangePhotoClick = () => fileInputRef.current?.click();

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
    };

    if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

    // ===================================================
    // RIGHT PANEL CONTENT SWITCHER
    // ===================================================
    const renderRightContent = () => {
        if (selectedTab === "info") {
            return (
                <div style={styles.card}>
                    <h2>Personal Information</h2>
                    <p style={styles.subText}>
                        Update your personal details and account information.
                    </p>

                    <div style={styles.fieldGroup}>
                        <label>Name</label>
                        <input
                            type="text"
                            value={profile?.full_name || ""}
                            readOnly
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label>Email</label>
                        <input
                            type="text"
                            value={profile?.email}
                            readOnly
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.summaryBox}>
                        <p>
                            <strong>Ratings & Comments: </strong> {reviewCount}
                        </p>
                    </div>

                    <button style={styles.editBtn}>Edit Profile</button>
                </div>
            );
        }

        if (selectedTab === "activity") {
            return (
                <div style={styles.card}>
                    <h2>Your Activity</h2>
                    <p style={styles.subText}>See all your ratings and comments.</p>

                    {reviews.length === 0 ? (
                        <p>No activity yet.</p>
                    ) : (
                        reviews.map((rev) => (
                            <div key={rev.id} style={styles.activityCard}>
                                <p>
                                    ⭐ Rating: <strong>{rev.rating}/5</strong>
                                </p>
                                <p>{rev.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            );
        }

        if (selectedTab === "favourites") {
            return (
                <div style={styles.card}>
                    <h2>Your Favourite Places</h2>
                    <p style={styles.subText}>Places you have marked as favourite.</p>

                    {favorites.length === 0 ? (
                        <p>No favourite places yet.</p>
                    ) : (
                        <div style={styles.favGrid}>
                            {favorites.map((place) => (
                                <div key={place.id} style={styles.favCard}>
                                    <h4>{place.Name}</h4>
                                    <p style={{ color: "#555" }}>
                                        {place.Description || "No description"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
    };

    // ===================================================
    // MAIN LAYOUT
    // ===================================================
    return (
        <div className="profile-wrapper" style={styles.container}>
            {/* LEFT SIDEBAR */}
            <div style={styles.sidebar}>
                <img src={avatarUrl} alt="avatar" style={styles.avatar} />

                <button onClick={handleChangePhotoClick} style={styles.changePhotoBtn}>
                    Change Photo
                </button>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />

                <h3>{profile?.full_name || "User"}</h3>
                <p style={{ color: "#666", fontSize: "14px" }}>{profile?.email}</p>

                <hr style={{ width: "100%", margin: "20px 0" }} />

                {/* Sidebar Navigation */}
                <div style={styles.sidebarItem(selectedTab === "info")} onClick={() => setSelectedTab("info")}>
                    Personal Info
                </div>

                <div
                    style={styles.sidebarItem(selectedTab === "activity")}
                    onClick={() => setSelectedTab("activity")}
                >
                    Activity
                </div>

                <div
                    style={styles.sidebarItem(selectedTab === "favourites")}
                    onClick={() => setSelectedTab("favourites")}
                >
                    Favourites
                </div>

                <div style={styles.logoutBtn} onClick={signOut}>
                    Logout
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div style={{ ...styles.rightPanel, marginTop: "120px" }}>
                {renderRightContent()}
            </div>
        </div>
    );
};

// ===================================================
// STYLES
// ===================================================
const styles = {
    container: {
        display: "flex",
        padding: "0 30px 30px 30px",
        gap: "30px",
    },

    // Sidebar
    sidebar: {
        width: "260px",
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        textAlign: "center",
        marginTop: "120px",
    },

    avatar: {
        width: "110px",
        height: "110px",
        borderRadius: "50%",
        margin: "auto",
        marginBottom: "10px",
    },

    changePhotoBtn: {
        fontSize: "14px",
        padding: "6px 12px",
        background: "#e6e6ff",
        borderRadius: "6px",
        cursor: "pointer",
        border: "none",
        marginBottom: "15px",
    },

    sidebarItem: (active) => ({
        padding: "12px",
        borderRadius: "8px",
        margin: "8px 0",
        cursor: "pointer",
        background: active ? "#4F46E5" : "#f4f4ff",
        color: active ? "white" : "#333",
        fontWeight: active ? "600" : "500",
    }),

    logoutBtn: {
        marginTop: "20px",
        padding: "10px",
        background: "#ff4d4d",
        color: "white",
        borderRadius: "8px",
        cursor: "pointer",
    },

    // Right Panel
    rightPanel: {
        flexGrow: 1,
    },

    card: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },

    subText: {
        color: "#777",
        marginBottom: "20px",
    },

    fieldGroup: {
        marginBottom: "20px",
    },

    input: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "16px",
    },

    editBtn: {
        marginTop: "20px",
        padding: "10px 20px",
        background: "#4F46E5",
        color: "white",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
    },

    summaryBox: {
        background: "#f4f4ff",
        padding: "12px",
        borderRadius: "8px",
        marginTop: "10px",
    },

    // Activity Cards
    activityCard: {
        padding: "15px",
        borderRadius: "10px",
        background: "#f8f8f8",
        marginBottom: "12px",
    },

    // Favourites Grid
    favGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "16px",
    },

    favCard: {
        padding: "16px",
        borderRadius: "12px",
        background: "#ffffff",
        boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    },
};

export default Profile;

