import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
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

          <button className="book-button">Book Now</button>
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