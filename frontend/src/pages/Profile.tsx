import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import MyReviews from "../components/MyReviews";
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
    location?: string;
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  paymentStatus?: string;
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
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: ""
  });

  // Separate function to fetch bookings
  const fetchBookings = useCallback(async () => {
    console.log("📖 Fetching bookings...");
    setBookingsLoading(true);
    try {
      const bookingsRes = await axiosInstance.get("/profile/bookings");
      console.log("✅ Bookings fetched:", bookingsRes.data?.length || 0);
      if (bookingsRes.data) {
        setBookings(bookingsRes.data);
      }
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  // Delete booking function
  const deleteBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      console.log("🗑️ Deleting booking:", bookingId);
      await axiosInstance.delete(`/bookings/${bookingId}`);
      console.log("✅ Booking cancelled successfully");
      
      alert("Booking cancelled successfully!");
      setOpenMenu(null);
      
      // Refetch bookings after deletion
      await fetchBookings();
    } catch (error: any) {
      console.error("❌ Error deleting booking:", error);
      const errorMsg = error.response?.data?.message || "Failed to cancel booking";
      alert(errorMsg);
    }
  };

  useEffect(() => {
    console.log("🔄 Profile component mounted, loading user data...");
    
    const fetchProfileData = async () => {
      // First check if user data exists in localStorage
      const savedUser = localStorage.getItem("user");
      if (savedUser && savedUser !== "undefined") {
        try {
          const userData = JSON.parse(savedUser);
          console.log("Found user data in localStorage:", userData.name);
          setUser(userData);
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            bio: userData.bio || ""
          });
        } catch (parseError) {
          console.error("Error parsing localStorage user data:", parseError);
          localStorage.removeItem("user");
        }
      }

      // Check if token exists
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found in localStorage");
        setLoading(false);
        return;
      }

      console.log("Token found, fetching from API...");
      
      try {
        // Try to get user data from API
        const userRes = await axiosInstance.get("/api/profile/profile");
        console.log("Profile response:", userRes.data);
        
        if (userRes.data && userRes.data.user) {
          setUser(userRes.data.user);
          setFormData({
            name: userRes.data.user.name || "",
            email: userRes.data.user.email || "",
            bio: userRes.data.user.bio || ""
          });
        }

        // Fetch user's listings (if host)
        try {
          const listingsRes = await axiosInstance.get("/profile/listings");
          console.log("Listings response:", listingsRes.data);
          if (listingsRes.data) {
            setListings(listingsRes.data);
          }
        } catch (error) {
          console.log("No listings found:", error);
          setListings([]);
        }
      } catch (error) {
        console.error("Error fetching profile from API:", error);
        
        // If API fails but we have localStorage user data, that's ok
        if (!user) {
          const mockUser: User = {
            _id: "mock123",
            name: "Test User",
            email: "test@example.com",
            createdAt: new Date().toISOString(),
            isHost: false,
            verificationStatus: "pending"
          };
          setUser(mockUser);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
    
    // Also fetch bookings immediately
    fetchBookings();
  }, [fetchBookings]);

  // Refetch bookings when activeTab changes to "bookings"
  useEffect(() => {
    if (activeTab === "bookings") {
      console.log("🔄 My Bookings tab activated, fetching fresh data...");
      fetchBookings();
    }
  }, [activeTab, fetchBookings]);

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
      alert("Failed to become host");
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
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditing(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Overview */}
      {!editing && user && (
        <div className="profile-overview">
          <div className="overview-section">
            <h3>Account Overview</h3>
            <p>Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
            <p>Status: {user?.verificationStatus === "verified" ? "✅ Verified" : "⏳ Pending Verification"}</p>
            <p>Host Status: {user?.isHost ? "🌟 Superhost" : "👤 Guest"}</p>
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
          className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          ⭐ My Reviews
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>My Bookings ({bookings.length})</h2>
              <button 
                onClick={() => fetchBookings()}
                disabled={bookingsLoading}
                style={{
                  padding: '8px 16px',
                  background: '#1d3557',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: bookingsLoading ? 'not-allowed' : 'pointer',
                  opacity: bookingsLoading ? 0.6 : 1
                }}
              >
                {bookingsLoading ? '🔄 Loading...' : '🔄 Refresh'}
              </button>
            </div>
            
            {bookingsLoading && bookings.length === 0 ? (
              <p className="no-bookings">Loading your bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="no-bookings">No bookings yet. Start exploring and book your next adventure! 🏖️</p>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => {
                  const nights = booking.checkIn && booking.checkOut 
                    ? Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))
                    : 0;
                  
                  return (
                    <div key={booking._id} className="booking-card">
                      <img 
                        src={booking?.listing?.images?.[0] || "https://picsum.photos/seed/default/120/120.jpg"} 
                        alt={booking?.listing?.title || "Property"}
                        className="booking-image"
                      />
                      <div className="booking-info">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <h3>{booking?.listing?.title || "Property Title"}</h3>
                            <p className="booking-location">📍 {booking?.listing?.location || "Location"}</p>
                            <p className="booking-dates">
                              📅 {booking?.checkIn ? new Date(booking.checkIn).toLocaleDateString('en-IN') : "TBD"} 
                              {" → "} 
                              {booking?.checkOut ? new Date(booking.checkOut).toLocaleDateString('en-IN') : "TBD"}
                            </p>
                            <p className="booking-nights">🌙 {nights} nights</p>
                            <p className="booking-price">💰 ₹{booking?.totalPrice?.toLocaleString('en-IN') || "0"}</p>
                            <span className={`status-badge ${booking?.status || "pending"}`}>
                              {booking?.paymentStatus ? (booking.paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending") : "✅ Confirmed"}
                            </span>
                          </div>
                          
                          {/* 3-Dot Menu */}
                          <div style={{ position: 'relative' }}>
                            <button 
                              onClick={() => setOpenMenu(openMenu === booking._id ? null : booking._id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                padding: '5px 10px',
                                color: '#666'
                              }}
                              title="More options"
                            >
                              ⋮
                            </button>
                            
                            {/* Dropdown Menu */}
                            {openMenu === booking._id && (
                              <div style={{
                                position: 'absolute',
                                top: '30px',
                                right: '0',
                                background: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                zIndex: 100,
                                minWidth: '150px'
                              }}>
                                <button
                                  onClick={() => deleteBooking(booking._id)}
                                  style={{
                                    width: '100%',
                                    padding: '10px 15px',
                                    border: 'none',
                                    background: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    color: '#e63946',
                                    fontSize: '14px',
                                    borderRadius: '6px',
                                    transition: 'background-color 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffebee'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  🗑️ Cancel Booking
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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

        {activeTab === "reviews" && (
          <div className="reviews-content">
            <h2>My Reviews</h2>
            <MyReviews />
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
