import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import PropertyCard from "../components/PropertyCard";
import ListingCard from "../components/ListingCard";
import "../styles/Home.css";

interface Property {
  _id: string;
  title: string;
  price: number | string;
  city?: string;
  image: string;
}

const Home = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axiosInstance.get("/properties");
        setProperties(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return <p className="home-loading">Loading properties...</p>;

  return (
    <div className="home-grid">
      {properties.map((prop) => (
        <PropertyCard
          key={prop._id}
          id={prop._id || ""}
          title={prop.title || "Untitled"}
          price={prop.price || 0}
          city={prop.city || "Unknown"}
          image={prop.image || "https://via.placeholder.com/400"}
        />
      ))}
    </div>
  );
};

export default Home;