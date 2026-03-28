import { useState } from "react";

interface SearchFilters {
  location: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  guests: string;
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    guests: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-field">
          <label>📍 Location</label>
          <input
            type="text"
            name="location"
            placeholder="Where are you going?"
            value={filters.location}
            onChange={handleChange}
            className="search-input"
          />
        </div>

        <div className="search-field">
          <label>💰 Price Range</label>
          <div className="price-range">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice}
              onChange={handleChange}
              className="search-input small"
            />
            <span>-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handleChange}
              className="search-input small"
            />
          </div>
        </div>

        <div className="search-field">
          <label>🏠 Property Type</label>
          <select
            name="propertyType"
            value={filters.propertyType}
            onChange={handleChange}
            className="search-select"
          >
            <option value="">All Types</option>
            <option value="villa">Villa</option>
            <option value="apartment">Apartment</option>
            <option value="cabin">Cabin</option>
            <option value="house">House</option>
            <option value="beach">Beach</option>
            <option value="cottage">Cottage</option>
            <option value="farm">Farm</option>
            <option value="treehouse">Treehouse</option>
            <option value="hostel">Hostel</option>
            <option value="camp">Camp</option>
          </select>
        </div>

        <div className="search-field">
          <label>👥 Guests</label>
          <input
            type="number"
            name="guests"
            placeholder="Number of guests"
            value={filters.guests}
            onChange={handleChange}
            className="search-input"
            min="1"
          />
        </div>

        <button type="submit" className="search-button">
          🔍 Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
