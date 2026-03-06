import React from "react";
import { Link } from "react-router-dom";
import "../styles/PropertyCard.css";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number | string;
  city?: string;
  image: string;
}

const PropertyCard = ({ id, title, price, city, image }: PropertyCardProps) => {
  return (
    <Link to={`/property/${id}`} className="property-card">
      <img src={image} alt={title} className="property-image" />
      <div className="property-info">
        <h2 className="property-title">{title}</h2>
        <p className="property-city">{city || "Unknown"}</p>
        <p className="property-price">${price} Per night</p>
      </div>
    </Link>
  );
};

export default PropertyCard;