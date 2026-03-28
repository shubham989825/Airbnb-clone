import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/Profile.css";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  isHost?: boolean;
  verificationStatus?: string;
}

interface Booking {
  _id: string;
  listing?: {
    title?: string;
    images?: string[];
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
}

interface UserListing {
  _id: string;
  title?: string;
  images?: string[];
  price?: number;
  location?: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<UserListing[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: ""
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      // Check if token exists first
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found in localStorage");
        setLoading(false);
        return;
      }

      console.log("Token found:", token);
      
      try {
        // Try to get user data from API first
        const userRes = await axiosInstance.get("/api/profile/profile");
        console.log("Profile response:", userRes.data);
        setUser(userRes.data.user);
        setFormData({
          name: userRes.data.user.name || "",
          email: userRes.data.user.email || "",
          bio: userRes.data.user.bio || ""
        });

        // Fetch user's bookings
        const bookingsRes = await axiosInstance.get("/api/profile/bookings");
        console.log("Bookings response:", bookingsRes.data);
        setBookings(bookingsRes.data);

        // Fetch user's listings (if host)
        try {
          const listingsRes = await axiosInstance.get("/api/profile/listings");
          console.log("Listings response:", listingsRes.data);
          setListings(listingsRes.data);
        } catch (error) {
          // User might not be a host
          console.log("No listings found:", error);
          setListings([]);
        }
      } catch (error) {
        console.error("Error fetching profile from API:", error);
        
        // If API fails, try to use localStorage user data
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log("Using localStorage user data:", userData);
          setUser(userData);
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            bio: userData.bio || ""
          });
        } else {
          // If no user data anywhere, show mock data for testing
          console.log("No user data found, showing mock profile");
          setUser({
            _id: "mock123",
            name: "Test User",
            email: "test@example.com",
            createdAt: new Date().toISOString(),
            isHost: false,
            verificationStatus: "pending"
          });
          setFormData({
            name: "Test User",
            email: "test@example.com",
            bio: "Test bio"
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/api/profile/profile", formData);
      setUser({ ...user!, ...formData });
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // If API fails, update local state and localStorage
      const updatedUser = { ...user!, ...formData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditing(false);
      alert("Profile updated locally! (API unavailable)");
    }
  };

  const handleBecomeHost = async () => {
    try {
      await axiosInstance.post("/api/profile/become-host");
      setUser({ ...user!, isHost: true });
      alert("You are now a host! 🎉");
    } catch (error) {
      console.error("Error becoming host:", error);
      
      // If API fails, update local state and localStorage
      const updatedUser = { ...user!, isHost: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("You are now a host locally! (API unavailable)");
    }
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;

  if (!user) return <div className="profile-not-logged-in">Please log in to view your profile</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={`https://picsum.photos/seed/${user?.email || "default"}/150/150.jpg`}
            alt={user?.name || "User"}
            className="avatar-image"
          />
          <div className="verification-badge">
            {user?.verificationStatus === "verified" ? "✅ Verified" : "⏳ Pending"}
          </div>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user?.name || "User"}</h1>
          <p className="profile-email">{user?.email || "user@example.com"}</p>
          <p className="profile-member-since">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
          <div className="profile-actions">
            <button 
              onClick={() => setEditing(!editing)}
              className="profile-btn edit-btn"
            >
              ✏️ Edit Profile
            </button>
            {!user.isHost && (
              <button 
                onClick={handleBecomeHost}
                className="profile-btn host-btn"
              >
                🏠 Become a Host
              </button>
            )}
            {user.isHost && (
              <span className="host-badge">🌟 Superhost</span>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {editing && (
        <div className="edit-profile-modal">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="edit-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">💾 Save Changes</button>
                <button 
                  type="button" 
                  onClick={() => setEditing(false)}
                  className="cancel-btn"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          📅 My Bookings
        </button>
        <button 
          className={`tab-btn ${activeTab === "listings" ? "active" : ""}`}
          onClick={() => setActiveTab("listings")}
        >
          🏠 My Listings
        </button>
        <button 
          className={`tab-btn ${activeTab === "wishlist" ? "active" : ""}`}
          onClick={() => setActiveTab("wishlist")}
        >
          ❤️ Wishlist
        </button>
        <button 
          className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          ⭐ Reviews
        </button>
        <button 
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Settings
        </button>
        <button 
          className={`tab-btn ${activeTab === "earnings" ? "active" : ""}`}
          onClick={() => setActiveTab("earnings")}
        >
          💰 Earnings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>📅 Total Bookings</h3>
                <p className="stat-number">{bookings.length}</p>
              </div>
              <div className="stat-card">
                <h3>🏠 Active Listings</h3>
                <p className="stat-number">{listings.length}</p>
              </div>
              <div className="stat-card">
                <h3>💰 Total Earnings</h3>
                <p className="stat-number">₹{(bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)).toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h3>⭐ Average Rating</h3>
                <p className="stat-number">4.8</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bookings-content">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
              <p className="no-bookings">No bookings yet</p>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking._id} className="booking-card">
                    <img 
                      src={booking?.listing?.images?.[0] || "https://picsum.photos/seed/default/120/120.jpg"} 
                      alt={booking?.listing?.title || "Property"}
                      className="booking-image"
                    />
                    <div className="booking-info">
                      <h3>{booking?.listing?.title || "Property Title"}</h3>
                      <p>📅 {booking?.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "TBD"} - {booking?.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "TBD"}</p>
                      <p>💰 ₹{booking?.totalPrice?.toLocaleString() || "0"}</p>
                      <span className={`status-badge ${booking?.status || "pending"}`}>{booking?.status || "Pending"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "listings" && (
          <div className="listings-content">
            <h2>My Listings</h2>
            {listings.length === 0 ? (
              <p className="no-listings">No listings yet. <a href="/add-property">Create your first listing!</a></p>
            ) : (
              <div className="listings-grid">
                {listings.map((listing) => (
                  <div key={listing._id} className="user-listing-card">
                    <img 
                      src={listing.images?.[0] || "https://picsum.photos/seed/default/150/150.jpg"} 
                      alt={listing.title || "Property"}
                      className="listing-thumb"
                    />
                    <div className="listing-info">
                      <h3>{listing.title || "Property Title"}</h3>
                      <p>💰 ₹{listing.price?.toLocaleString() || "0"}/night</p>
                      <p>📍 {listing.location || "Location"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="wishlist-content">
            <h2>My Wishlist</h2>
            <p>📱 Wishlist feature coming soon! Check back later.</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="reviews-content">
            <h2>My Reviews</h2>
            <p>📝 Reviews feature coming soon! Check back later.</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-content">
            <h2>Account Settings</h2>
            <div className="settings-grid">
              <div className="setting-item">
                <h3>🔔 Notifications</h3>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span>Email notifications</span>
                </label>
              </div>
              <div className="setting-item">
                <h3>🌍 Language</h3>
                <select className="setting-select">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                </select>
              </div>
              <div className="setting-item">
                <h3>🌙 Dark Mode</h3>
                <label className="switch">
                  <input type="checkbox" />
                  <span>Enable dark theme</span>
                </label>
              </div>
              <div className="setting-item">
                <h3>💳 Payment Methods</h3>
                <button className="setting-btn">Manage Payment Methods</button>
              </div>
              <div className="setting-item">
                <h3>🔒 Privacy</h3>
                <button className="setting-btn">Privacy Settings</button>
              </div>
              <div className="setting-item">
                <h3>🗑️ Delete Account</h3>
                <button className="setting-btn danger">Delete Account</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="earnings-content">
            <h2>My Earnings</h2>
            <div className="earnings-summary">
              <div className="earnings-card">
                <h3>💵 This Month</h3>
                <p className="earnings-amount">₹12,500</p>
              </div>
              <div className="earnings-card">
                <h3>💵 Total Earnings</h3>
                <p className="earnings-amount">₹{(bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)).toLocaleString()}</p>
              </div>
            </div>
            <div className="earnings-chart">
              <h3>📈 Earnings Overview</h3>
              <p>📊 Chart feature coming soon!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;