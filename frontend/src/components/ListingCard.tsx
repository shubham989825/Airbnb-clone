import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/ListingCard.css";

interface ListingProps {
    listing: {
        _id: string;
        title: string;
        images: string[];
        price: number;
        location: string;
    };
}

const ListingCard = ({ listing }: ListingProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    useEffect(() => {
        // Check if property is in wishlist
        const checkWishlist = async () => {
            try {
                const res = await axiosInstance.get(`/wishlist/check/${listing._id}`);
                setIsLiked(res.data.isInWishlist);
            } catch (_error) {
                // Fallback to localStorage
                const savedWishlist = localStorage.getItem("wishlist");
                if (savedWishlist) {
                    const wishlistIds = JSON.parse(savedWishlist);
                    setIsLiked(wishlistIds.includes(listing._id));
                }
            }
        };
        checkWishlist();
    }, [listing._id]);

    const toggleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            if (isLiked) {
                await axiosInstance.delete(`/wishlist/${listing._id}`);
                setIsLiked(false);
            } else {
                // Add to wishlist
                await axiosInstance.post(`/wishlist/${listing._id}`);
                setIsLiked(true);
            }
        } catch (_error) {
            // Fallback to localStorage
            const savedWishlist = localStorage.getItem("wishlist");
            let wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];
            
            if (isLiked) {
                wishlistIds = wishlistIds.filter((id: string) => id !== listing._id);
            } else {
                wishlistIds.push(listing._id);
            }
            
            localStorage.setItem("wishlist", JSON.stringify(wishlistIds));
            setIsLiked(!isLiked);
        }
    };

    const imageUrl = listing.images && listing.images.length > 0 
        ? listing.images[0] 
        : 'https://picsum.photos/seed/placeholder/800/600.jpg';

    return (
        <div className="listing-card-container">
            <Link to={`/property/${listing._id}`} className="listing-card-link">
                {/* IMAGE */}
                <div className="listing-image-container">
                    <img
                        src={imageUrl}
                        alt={listing.title}
                        className="listing-image"
                        onLoad={() => setImageLoaded(true)}
                        style={{
                            opacity: imageLoaded ? 1 : 0.7,
                            transition: "opacity 0.3s ease",
                        }}
                    />
                    
                    {/* NEW MODERN LIKE BUTTON */}
                    <button 
                        className={`wishlist-btn ${isLiked ? 'liked' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();    
                            toggleLike(e);
                        }}
                        aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <div className="heart-icon">
                            <svg 
                                viewBox="0 0 24 24" 
                                className="heart-svg"
                                fill={isLiked ? "#ff385c" : "none"}
                                stroke={isLiked ? "#ff385c" : "#000000"}
                                strokeWidth="2"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </div>
                        <span className="wishlist-text">
                            {isLiked ? 'Saved' : 'Save'}
                        </span>
                    </button>
                </div>

                {/* CONTENT */}
                <div className="listing-content">
                    {/* TITLE */}
                    <h3 className="listing-title">
                        {listing.title}
                    </h3>

                    {/* LOCATION */}
                    <div className="listing-location">
                        <span className="location-icon">📍</span>
                        <span className="location-text">{listing.location}</span>
                    </div>

                    {/* PRICE */}
                    <div className="listing-price">
                        <span className="price-amount">₹{listing.price.toLocaleString()}</span>
                        <span className="price-unit">/ night</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ListingCard;
