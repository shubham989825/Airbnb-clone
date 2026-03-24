import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/MyBookings.css";

interface Booking {
  _id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  listing: {
    title: string;
    image: string;
    city: string;
  };
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get("/bookings/my");
        setBookings(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="my-bookings">
      <h2>My Trips</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div className="booking-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <img src={booking.listing.image} alt="listing" />

              <div className="booking-info">
                <h3>{booking.listing.title}</h3>
                <p>{booking.listing.city}</p>
                <p>
                  {booking.checkIn} → {booking.checkOut}
                </p>
                <p className="price">₹{booking.totalPrice}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;