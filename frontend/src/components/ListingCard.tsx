import {Link} from "react-router-dom";

interface ListingProps {
    listing: {
        _id: string;
        title: string;
        image: string;
        price: number;
        location: string;
    };
}

const ListingCard = ({ listing }: ListingProps) => {
    return (
       <div className="listing-card">
        <Link to={`/property/${listing._id}`}>
        <img src={listing.image} alt={listing.title} />

        <div className="listing-info">
            <h3>{listing.title}</h3>
            <p>{listing.location}</p>
            <p className="price">₹{listing.price} / night</p>
            </div> 

        </Link>
       </div>
    )
}
export default ListingCard;