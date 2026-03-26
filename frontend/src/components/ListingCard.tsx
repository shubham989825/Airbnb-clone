import {Link} from "react-router-dom";
import { useState } from "react";

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
    
    const toggleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLiked(!isLiked);
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