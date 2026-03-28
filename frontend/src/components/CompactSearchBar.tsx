import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CompactSearchBar.css";

interface SearchFilters {
  location: string;
  priceRange: string;
  guests: string;
}

const CompactSearchBar = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    priceRange: "",
    guests: ""
  });
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    
    if (filters.location) {
      queryParams.append("location", filters.location);
    }
    if (filters.priceRange) {
      queryParams.append("priceRange", filters.priceRange);
    }
    if (filters.guests) {
      queryParams.append("guests", filters.guests);
    }
    
    const queryString = queryParams.toString();
    navigate(`/?${queryString}`);
  };

  return (
    <form className="compact-search-bar" onSubmit={handleSearch}>
      <div className="search-inputs">
        <input
          type="text"
          placeholder="📍 Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="search-input location-input"
        />
        
        <select
          value={filters.priceRange}
          onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
          className="search-input price-select"
        >
          <option value="">💰 Price</option>
          <option value="0-1000">₹0-1k</option>
          <option value="1000-5000">₹1k-5k</option>
          <option value="5000-10000">₹5k-10k</option>
          <option value="10000+">₹10k+</option>
        </select>
        
        <select
          value={filters.guests}
          onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
          className="search-input guests-select"
        >
          <option value="">👥 Guests</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5+">5+</option>
        </select>
      </div>
      
      <button type="submit" className="search-button">
        🔍
      </button>
    </form>
  );
};

export default CompactSearchBar;
