import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import axiosInstance from "../api/axiosInstance";
import "../styles/PropertyDetails.css";

interface Property {
  _id: string;
  title: string;
  price: number;
  city: string;
  image: string;
  description?: string;
}

const PropertyDetails = () => {
  const { id } = useParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);  

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axiosInstance.get(`/listings/${id}`);
        setProperty(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBooking = async () => {
    try {
      if (!checkIn || !checkOut) {
        alert("Please select dates");
        return;
      }

      if (new Date(checkOut) <= new Date(checkIn)) {
        alert("Check-out must be after check-in");
        return;
      }

      setLoading(true);

      await axiosInstance.post(`/bookings/${property?._id}`, {
        checkIn,
        checkOut,
      });

      alert("Booking successful 🎉");

      setCheckIn("");
      setCheckOut("");

    } catch (error: any) {
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!property) return <h2 className="loading-text">Loading...</h2>;

  return (
    <div className="details-page">
      <div className="details-container">
        <img
          src={property.image}
          alt={property.title}
          className="details-image"
        />

        <div className="details-info">
          <h1 className="details-title">{property.title}</h1>
          <p className="details-city">{property.city}</p>
          <p className="details-price">₹{property.price} / night</p>

          <p className="details-description">
            {property.description || "Beautiful property with amazing comfort."}
          </p>

          <div className="booking-box">
            <label>Check In</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />

            <label>Check Out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />

            <button
              onClick={handleBooking}
              className="book-button"
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Now"}
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <ReviewForm listingId={property._id} />
        <ReviewList listingId={property._id} />
      </div>
    </div>
  );
};

export default PropertyDetails;