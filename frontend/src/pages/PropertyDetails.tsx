import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import axiosInstance from "../api/axiosInstance";
import "../styles/PropertyDetails.css";

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  guests?: number;
  amenities?: string[];
  category?: string;
  host?: {
    name: string;
    isSuperhost: boolean;
    avatar?: string;
  };
  Phone: string;
  Email: string;
  createdAt?: string;
  updatedAt?: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);  
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axiosInstance.get(`/listings/${id}`);
        // Extract the actual listing data from the response
        if (res.data && res.data.listing) {
          setProperty(res.data.listing);
        } else {
          setProperty(res.data);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axiosInstance.get('/profile');
          if (res.data && res.data.user) {
            setCurrentUser(res.data.user);
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        // Don't fail the whole component if user fetch fails
      }
    };

    fetchProperty();
    fetchCurrentUser();
  }, [id]);

  const handleDeleteProperty = async () => {
    if (!property) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${property?.title || 'this property'}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);
      await axiosInstance.delete(`/listings/${property._id}`);
      
      alert('Property deleted successfully!');
      navigate('/'); // Redirect to home page
    } catch (error: any) {
      console.error('Error deleting property:', error);
      const errorMsg = error.response?.data?.message || 'Failed to delete property';
      alert(errorMsg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const isHost = () => {
    if (!currentUser || !property) return false;
    
    // Check if current user is the host of this property
    // This assumes the property has a host field with the host's user ID
    return property.host?.name === currentUser.name || 
           property.host?._id === currentUser._id;
  };

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

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first");
        return;
      }

      console.log("📅 Creating booking...");
      console.log("   Property:", property?._id);
      console.log("   Check-in:", checkIn);
      console.log("   Check-out:", checkOut);

      setLoading(true);

      const response = await axiosInstance.post(`/bookings/${property?._id}`, {
        checkIn,
        checkOut,
      });

      console.log("✅ Booking created successfully!");
      console.log("   Booking ID:", response.data._id);
      console.log("   Total Price:", response.data.totalPrice);

      alert("Booking successful 🎉\n\nRedirecting to your Profile...");

      // Clear form
      setCheckIn("");
      setCheckOut("");

      // Wait a moment then redirect to Profile
      setTimeout(() => {
        navigate("/profile");
      }, 1500);

    } catch (error: any) {
      console.error("❌ Booking error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Booking failed";
      alert(errorMsg);
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
          <div className="header-left">
            <h1 className="main-title">{property?.title || 'Property'}</h1>
            <div className="header-info">
              <p className="location-text">📍 {property?.location || 'Location'}</p>
              <p className="price-text">💰 ₹{
                (property?.price || property?.pricePerNight || property?.nightlyRate || 0)?.toLocaleString() || '0'
              }/night</p>
            </div>
          </div>
          
          {/* Delete Button - Only for Hosts */}
          {isHost() && (
            <div className="header-actions">
              <button
                className="delete-property-btn"
                onClick={handleDeleteProperty}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <span className="loading-spinner">⏳ Deleting...</span>
                ) : (
                  <>
                    <span className="delete-icon">🗑️</span>
                    <span>Delete Property</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="image-gallery">
        <div className="main-image">
          <img
            src={property?.images && property.images.length > 0 ? property.images[0] : 'https://picsum.photos/seed/property-detail/800/600.jpg'}
            alt={property?.title || 'Property'}
            className="details-image"
          />
          <button 
            className="show-photos-btn"
            onClick={() => setShowAllPhotos(!showAllPhotos)}
          >
            📷 {showAllPhotos ? 'Hide Photos' : 'Show All Photos'}
          </button>
        </div>
        
        {showAllPhotos && property?.images && (
          <div className="all-photos">
            {property.images.map((image, index) => (
              <div key={index} className="photo-item">
                <img src={image} alt={`${property?.title || 'Property'} ${index + 1}`} />
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
        <div className="contact-section">
          <h3>📞 Contact Host</h3>

          <p> Phone:{" "}
            {property?.Phone ? (
              <a href={`tel:${property.Phone}`} className="contact-link">
                {property.Phone}
              </a>
            ) : (
              "Not available"
            )}
          </p>

          <p>
            Email:{" "}
            {property?.Email ? (
              <a href={`mailto:${property.Email}?subject=Booking Inquiry&body=Hi, I am interested in your property`} className="contact-link">
                {property.Email}
              </a>
            ) : (
              "Not available"
            )}
          </p>
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
                <span className="price-label">₹{
                  (property?.price || property?.pricePerNight || property?.nightlyRate || 0)?.toLocaleString() || '0'
                }</span>
                <span className="price-unit">x nights</span>
              </div>
              <div className="price-item total">
                <span className="total-label">Total</span>
                <span className="total-price">₹{
                  (property?.price || property?.pricePerNight || property?.nightlyRate || 0)?.toLocaleString() || '0'
                }</span>
              </div>
              <div className="price-note">Cleaning fee and taxes included</div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h3>⭐ Guest Reviews</h3>
          <div className="reviews-container">
            <ReviewForm listingId={property._id} onReviewAdded={() => setReviewRefresh((prev) => prev + 1)} />
            <ReviewList listingId={property._id} refresh={reviewRefresh} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
