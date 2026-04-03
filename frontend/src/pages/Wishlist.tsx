import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../styles/Wishlist.css";

interface Listing {
  _id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
}

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      console.log("Wishlist: Starting fetch...");
      try {
        const res = await axiosInstance.get("/wishlist");
        console.log("Wishlist: API response:", res.data);
        setWishlist(res.data);
      } catch (err: any) {
        console.error("Error fetching wishlist:", err);
        setError(err.response?.data?.message || "Failed to load wishlist. Please log in and save properties to keep them here.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (listingId: string) => {
    console.log("Wishlist: Removing item:", listingId);
    try {
      await axiosInstance.delete(`/api/wishlist/${listingId}`);
      console.log("Wishlist: Removed via API");
      setWishlist(wishlist.filter(item => item._id !== listingId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      // Fallback to localStorage
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const wishlistIds = JSON.parse(savedWishlist);
        const updatedWishlist = wishlistIds.filter((id: string) => id !== listingId);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        console.log("Wishlist: Removed via localStorage");
        setWishlist(wishlist.filter(item => item._id !== listingId));
      }
    }
  };

  if (loading) return <p className="wishlist-loading">Loading wishlist...</p>;

  if (error) {
    return (
      <div className="wishlist-error">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="wishlist-empty-icon">💔</div>
        <h2>Your wishlist is empty</h2>
        <p>Like properties to add them to your wishlist.</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="wishlist-title">❤️ Your Wishlist</h1>
      <div className="wishlist-grid">
        {wishlist.map((listing) => (
          <div key={listing._id} className="wishlist-card">
            <div className="wishlist-image-container">
              <img 
                src={listing.images?.[0] || "https://picsum.photos/seed/default/800/600.jpg"} 
                alt={listing.title}
                className="wishlist-image"
              />
              <button 
                className="wishlist-remove-btn"
                onClick={() => removeFromWishlist(listing._id)}
                title="Remove from wishlist"
              >
                ❌
              </button>
            </div>
            <div className="wishlist-info">
              <h3 className="wishlist-title">{listing.title}</h3>
              <p className="wishlist-location">📍 {listing.location}</p>
              <p className="wishlist-price">₹{listing.price.toLocaleString()} <span>/ night</span></p>
              <Link to={`/property/${listing._id}`} className="wishlist-view-btn">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
