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

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/listings/${id}`);
        const data = await res.json();
        setProperty(data);
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

      await axiosInstance.post(`/bookings/${property?._id}`, {
        checkIn,
        checkOut
      });

      alert("Booking successful!");

    } catch (error: any) {
      console.error(error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Booking failed");
      }
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
          <p className="details-price">${property.price} / night</p>

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

            <button onClick={handleBooking} className="book-button">
              Book Now
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