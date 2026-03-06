import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ListingCard from "../components/ListingCard";
import "../styles/Home.css";

interface Listing {
  _id: string;
  title: string;
  price: number;
  city?: string;
  image: string;
}

const Home = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axiosInstance.get("/listings");
        setListings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <p className="home-loading">Loading properties...</p>;

  return (
    <div className="home-grid">
      {listings.map((listing) => (
        <ListingCard key={listing._id} listing={{
          _id: listing._id,
          title: listing.title,
          image: listing.image,
          price: listing.price,
          location: listing.city || "Unknown"
        }} />
      ))}
    </div>
  );
};

export default Home;