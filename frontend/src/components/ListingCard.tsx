import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

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
    const [imageError, setImageError] = useState(false);
    
    useEffect(() => {
        // Check if property is in wishlist
        const checkWishlist = async () => {
            try {
                const res = await axiosInstance.get(`/wishlist/check/${listing._id}`);
                setIsLiked(res.data.isInWishlist);
            } catch (error) {
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
        
        try {
            if (isLiked) {
                // Remove from wishlist
                await axiosInstance.delete(`/wishlist/${listing._id}`);
                setIsLiked(false);
            } else {
                // Add to wishlist
                await axiosInstance.post(`/wishlist/${listing._id}`);
                setIsLiked(true);
            }
        } catch (error) {
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
        <div className="listing-card">
            <Link to={`/property/${listing._id}`}>
                <div className="listing-image-container">
                    <img 
                        src={imageUrl} 
                        alt={listing.title}
                        className="listing-image"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                        style={{ 
                            opacity: imageLoaded ? 1 : 0.7,
                            transition: 'opacity 0.3s ease-in-out'
                        }}
                    />
                    {!imageLoaded && !imageError && (
                        <div className="image-skeleton">
                            <div className="skeleton-shimmer"></div>
                        </div>
                    )}
                    {imageError && (
                        <div className="image-error">
                            <span>📷</span>
                        </div>
                    )}
                    <button 
                        className={`listing-heart ${isLiked ? 'liked' : ''}`}
                        onClick={toggleLike}
                        title={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <span className="heart-icon">
                            {isLiked ? '❤️' : '🤍'}
                        </span>
                        <span className="heart-pulse"></span>
                    </button>
                </div>

                <div className="listing-content">
                    <div className="listing-header">
                        <h3 className="listing-title">{listing.title}</h3>
                        <div className="listing-badges">
                            <span className="listing-badge superhost">🌟 Superhost</span>
                            <span className="listing-badge rating">
                                <span className="star">⭐</span>
                                <span className="rating-number">4.8</span>
                                <span className="rating-count">(25)</span>
                            </span>
                        </div>
                    </div>
                    
                    <p className="listing-location">
                        <span className="location-icon">📍</span>
                        {listing.location}
                    </p>
                    
                    <div className="listing-features">
                        <div className="feature">
                            <span className="feature-icon">🏠</span>
                            <span className="feature-text">Entire home</span>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">👥</span>
                            <span className="feature-text">4 guests</span>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">🛏</span>
                            <span className="feature-text">2 bedrooms</span>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">🚿</span>
                            <span className="feature-text">2 baths</span>
                        </div>
                    </div>
                    
                    <div className="listing-price-section">
                        <div className="price-container">
                            <span className="price-label">Price</span>
                            <div className="price-row">
                                <span className="listing-price">₹{listing.price.toLocaleString()}</span>
                                <span className="price-unit">/ night</span>
                            </div>
                        </div>
                        <div className="price-comparison">
                            <span className="comparison-label">Great value</span>
                            <div className="comparison-bar">
                                <div className="comparison-fill"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ListingCard;
