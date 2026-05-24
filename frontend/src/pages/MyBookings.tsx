import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../styles/MyBookings.css";

interface Booking {
  _id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  listing?: {
    _id?: string;
    title: string;
    images?: string[];
    location: string;
  };
}

const MyBookings = () => {
  const location = useLocation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      
      console.log("🔍 Fetching bookings...");
      console.log("   Token exists:", !!token);
      
      if (!token) {
        setError("You are not logged in. Please log in to view your bookings.");
        setLoading(false);
        return;
      }

      console.log("   Token (first 30 chars):", token.substring(0, 30) + "...");
      
      const res = await axiosInstance.get("/bookings/my");
      console.log("✅ Bookings fetched:", res.data.length, "bookings");
      
      if (res.data && res.data.length > 0) {
        res.data.forEach((b: Booking, i: number) => {
          console.log(`   ${i + 1}. ${b.listing?.title || "Unknown"} - ₹${b.totalPrice}`);
        });
      }
      
      setBookings(res.data);
      
    } catch (error: any) {
      console.error("❌ Booking fetch error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to load bookings";
      setError(errorMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔄 MyBookings component mounted");
    console.log("   Current path:", location.pathname);
    
    // Fetch bookings when component mounts
    setLoading(true);
    fetchBookings();
    
    // Also fetch after a short delay to ensure backend has processed the booking
    const delayTimer = setTimeout(() => {
      console.log("🔄 Refetching bookings after 2 seconds...");
      fetchBookings();
    }, 2000);
    
    return () => clearTimeout(delayTimer);
  }, [location.pathname]); // Re-fetch when route changes

  const handleRefresh = async () => {
    console.log("🔄 Manual refresh triggered");
    setRefreshing(true);
    await fetchBookings();
  };

  const deleteBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      console.log("🗑️ Deleting booking:", bookingId);
      await axiosInstance.delete(`/bookings/${bookingId}`);
      console.log("✅ Booking cancelled successfully");
      alert("Booking cancelled successfully!");
      await fetchBookings();
    } catch (error: any) {
      console.error("❌ Error deleting booking:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to cancel booking";
      alert(errorMsg);
    }
  };

  const getNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();

    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };


  if (loading) return <p className="loading">Loading your trips...</p>;

  return (
    <div className="my-bookings">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Trips ({bookings.length})</h2>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            padding: '8px 16px',
            background: '#1d3557',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            opacity: refreshing ? 0.6 : 1
          }}
        >
          {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p className="empty">No bookings yet</p>
          <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', marginTop: '10px' }}>
            Try refreshing the page or check your internet connection
          </p>
        </div>
      ) : (
        <div className="booking-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              
              <img
                src={booking.listing?.images?.[0] || "/placeholder.jpg"}
                alt="listing"
                onClick={() => booking.listing?._id && navigate(`/property/${booking.listing._id}`)}
                style={{ cursor: booking.listing?._id ? 'pointer' : 'default' }}
              />

              <div className="booking-info">
                <h3 style={{ cursor: booking.listing?._id ? 'pointer' : 'default' }} onClick={() => booking.listing?._id && navigate(`/property/${booking.listing._id}`)}>{booking.listing?.title || "Property"}</h3>
                <p>{booking.listing?.location || "Unknown"}</p>

                <p>
                  {booking.checkIn} → {booking.checkOut}
                </p>
                <p className="nights">
                  {getNights(booking.checkIn, booking.checkOut)} nights
                </p>

                <p className="price">₹{booking.totalPrice}</p>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {booking.listing?._id && (
                    <Link
                      to={`/property/${booking.listing._id}`}
                      className="view-btn"
                    >
                      View Property
                    </Link>
                  )}
                  <button
                    onClick={() => deleteBooking(booking._id)}
                    className="cancel-btn"
                    style={{
                      padding: '8px 12px',
                      background: '#e63946',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;