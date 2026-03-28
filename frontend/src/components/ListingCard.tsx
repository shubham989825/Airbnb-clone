import {Link} from "react-router-dom";
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
    
    useEffect(() => {
        // Check if property is in wishlist
        const checkWishlist = async () => {
            try {
                const res = await axiosInstance.get(`/api/wishlist/check/${listing._id}`);
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
        console.log("=== LIKE BUTTON CLICKED ===");
        console.log("Listing ID:", listing._id);
        console.log("Current isLiked state:", isLiked);
        
        try {
            if (isLiked) {
                console.log("Attempting to REMOVE from wishlist...");
                // Remove from wishlist
                await axiosInstance.delete(`/api/wishlist/${listing._id}`);
                console.log("Successfully removed via API");
                setIsLiked(false);
            } else {
                console.log("Attempting to ADD to wishlist...");
                // Add to wishlist
                await axiosInstance.post(`/api/wishlist/${listing._id}`);
                console.log("Successfully added via API");
                setIsLiked(true);
            }
        } catch (error) {
            console.error("API call failed, using localStorage fallback:", error);
            // Fallback to localStorage
            const savedWishlist = localStorage.getItem("wishlist");
            let wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];
            
            if (isLiked) {
                wishlistIds = wishlistIds.filter((id: string) => id !== listing._id);
                console.log("Removed via localStorage");
            } else {
                wishlistIds.push(listing._id);
                console.log("Added via localStorage");
            }
            
            localStorage.setItem("wishlist", JSON.stringify(wishlistIds));
            setIsLiked(!isLiked);
        }
    };

    // Get first image from array or use fallback
    const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : 'https://picsum.photos/seed/placeholder/800/600.jpg';

    return (
       <div className="listing-card">
        <Link to={`/property/${listing._id}`}>
            <div style={{ position: 'relative' }}>
                <img 
                    src={imageUrl} 
                    alt={listing.title}
                />
                <button 
                    className={`listing-heart ${isLiked ? 'liked' : ''}`}
                    onClick={toggleLike}
                    title={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    {isLiked ? '❤️' : '🤍'}
                </button>
            </div>

            <div className="listing-info">
                <div className="listing-header">
                    <h3 className="listing-title">{listing.title}</h3>
                    <div className="listing-rating">
                        <span className="star">⭐</span>
                        <span>4.8</span>
                        <span>(25)</span>
                    </div>
                </div>
                
                <p className="listing-location">{listing.location}</p>
                <p className="listing-dates">Mar 15-20</p>
                
                <div className="listing-price-row">
                    <span className="listing-price">₹{listing.price.toLocaleString()}</span>
                    <span className="listing-price-unit">night</span>
                </div>
            </div> 
        </Link>
       </div>
    )
}
export default ListingCard;