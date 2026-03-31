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
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-3xl transition-all duration-500 cursor-pointer border border-gray-200 relative overflow-hidden transform hover:-translate-y-2 hover:scale-105">
            <Link to={`/property/${listing._id}`} className="no-underline">
                <div className="relative h-64 overflow-hidden">
                    <img 
                        src={imageUrl} 
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                        style={{ 
                            opacity: imageLoaded ? 1 : 0.7,
                            transition: 'opacity 0.3s ease'
                        }}
                    />
                    <button 
                        className={`absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-md ${
                            isLiked 
                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg hover:shadow-xl hover:scale-110' 
                                : 'bg-white/90 text-gray-600 shadow-md hover:shadow-lg hover:bg-white hover:scale-110'
                        }`}
                        onClick={toggleLike}
                    >
                        <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
                    </button>
                </div>

                <div className="p-6 bg-gradient-to-b from-white to-gray-50/80">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-black flex-1 leading-tight no-underline">{listing.title}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full border border-gray-200">
                        <span className="text-lg">📍</span>
                        <span className="text-sm font-medium text-black">{listing.location}</span>
                    </div>
                    
                    <div className="flex items-baseline gap-2 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
                        <span className="text-2xl font-bold text-black">₹{listing.price.toLocaleString()}</span>
                        <span className="text-sm font-medium text-black">/ night</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ListingCard;
