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
  images: string[];
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  guests?: number;
  amenities?: string[];
  host?: {
    name: string;
    isSuperhost: boolean;
    avatar?: string;
  };
}

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);  
  const [showAllPhotos, setShowAllPhotos] = useState(false);

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

  if (!property) return <div className="loading-text">Loading...</div>;

  return (
    <div className="details-page">
      {/* Header Section */}
      <div className="details-header">
        <div className="header-content">
          <h1 className="main-title">{property.title}</h1>
          <div className="header-info">
            <p className="location-text">📍 {property.city}</p>
            <p className="price-text">💰 ₹{property.price.toLocaleString()}/night</p>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="image-gallery">
        <div className="main-image">
          <img
            src={property.images && property.images.length > 0 ? property.images[0] : 'https://picsum.photos/seed/property-detail/800/600.jpg'}
            alt={property.title}
            className="details-image"
          />
          <button 
            className="show-photos-btn"
            onClick={() => setShowAllPhotos(!showAllPhotos)}
          >
            📷 {showAllPhotos ? 'Hide Photos' : 'Show All Photos'}
          </button>
        </div>
        
        {showAllPhotos && property.images && (
          <div className="all-photos">
            {property.images.map((image, index) => (
              <div key={index} className="photo-item">
                <img src={image} alt={`${property.title} ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="details-container">
        <div className="details-main">
          {/* Property Features */}
          <div className="features-section">
            <h3>🏠 Property Features</h3>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🛏</span>
                <div className="feature-details">
                  <h4>Bedrooms</h4>
                  <p>{property.bedrooms || 3} bedrooms</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚿</span>
                <div className="feature-details">
                  <h4>Bathrooms</h4>
                  <p>{property.bathrooms || 2} bathrooms</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <div className="feature-details">
                  <h4>Guests</h4>
                  <p>{property.guests || 6} guests</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏠</span>
                <div className="feature-details">
                  <h4>Property Type</h4>
                  <p>Entire home</p>
                </div>
              </div>
            </div>
          </div>
         
        </div>

        {/* Booking Box */}
        <div className="booking-section">
          <div className="booking-card">
            <h3>📅 Book Your Stay</h3>
            <div className="booking-form">
              <div className="date-group">
                <label>Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="date-input"
                />
              </div>
              <div className="date-group">
                <label>Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="date-input"
                />
              </div>
              <div className="guests-group">
                <label>Guests</label>
                <select className="guests-select">
                  <option>1 guest</option>
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4 guests</option>
                  <option>5 guests</option>
                  <option>6 guests</option>
                </select>
              </div>
              <button 
                className="book-button" 
                onClick={handleBooking}
                disabled={loading}
              >
                {loading ? "Booking..." : "Book Now"}
              </button>
            </div>
            
            <div className="price-summary">
              <div className="price-item">
                <span className="price-label">₹{property.price.toLocaleString()}</span>
                <span className="price-unit">x nights</span>
              </div>
              <div className="price-item total">
                <span className="total-label">Total</span>
                <span className="total-price">₹{property.price.toLocaleString()}</span>
              </div>
              <div className="price-note">Cleaning fee and taxes included</div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h3>⭐ Guest Reviews</h3>
          <div className="reviews-container">
            <ReviewForm listingId={property._id} />
            <ReviewList listingId={property._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
