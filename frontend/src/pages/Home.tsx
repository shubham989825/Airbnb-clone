import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ListingCard from "../components/ListingCard";
import CompactSearchBar from "../components/CompactSearchBar";
import "../styles/Home.css";
import "../styles/SearchBar.css";

interface Listing {
  _id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  city: string;
  category: string;
  guests: number;
}

interface SearchFilters {
  location: string;
  priceRange: string;
  guests: string;
}

const Home = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log("Fetching listings from:", "/listings");
        const res = await axiosInstance.get("/listings");
        console.log("API response:", res.data);
        setListings(res.data.listings);
        setFilteredListings(res.data.listings);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleSearch = (filters: SearchFilters) => {
    let filtered = [...listings];
    
    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(listing => 
        listing.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        listing.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Filter by price range
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange.split('-').map(p => parseInt(p));
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        filtered = filtered.filter(listing => listing.price >= minPrice && listing.price <= maxPrice);
      }
    }
    
    // Filter by guests
    if (filters.guests) {
      const guestCount = parseInt(filters.guests);
      if (!isNaN(guestCount)) {
        filtered = filtered.filter(listing => listing.guests >= guestCount);
      }
    }
    
    setFilteredListings(filtered);
  };

  if (loading) return <p className="home-loading">Loading properties... {new Date().toISOString()} - Final deployment</p>;

  return (
    <div>
      <CompactSearchBar onSearch={handleSearch} />
      <div className="home-grid">
        {filteredListings.map((listing) => (
          <ListingCard key={listing._id} listing={{
            _id: listing._id,
            title: listing.title,
            images: listing.images,
            price: listing.price,
            location: listing.location
          }} />
        ))}
      </div>
    </div>
  );
};

export default Home;