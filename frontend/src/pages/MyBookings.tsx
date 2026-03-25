import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    image: string;
    city: string;
  };
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get("/bookings/my");
        setBookings(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();

    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  if (loading) return <p className="loading">Loading your trips...</p>;

  return (
    <div className="my-bookings">
      <h2>My Trips</h2>

      {bookings.length === 0 ? (
        <p className="empty">No bookings yet</p>
      ) : (
        <div className="booking-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              
              <img
                src={booking.listing?.image || "/placeholder.jpg"}
                alt="listing"
              />

              <div className="booking-info">
                <h3>{booking.listing?.title || "Property"}</h3>
                <p>{booking.listing?.city || "Unknown"}</p>

                <p>
                  {booking.checkIn} → {booking.checkOut}
                </p>
                <p className="nights">
                  {getNights(booking.checkIn, booking.checkOut)} nights
                </p>

                <p className="price">₹{booking.totalPrice}</p>

                 
                {booking.listing?._id && (
                  <Link
                    to={`/property/${booking.listing._id}`}
                    className="view-btn"
                  >
                    View Property
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;