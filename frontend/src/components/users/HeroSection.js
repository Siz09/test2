import { useState } from "react";
import { venueService } from "../../services/api";
import "../../styles/HeroSection.css";

const HeroSection = () => {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const results = await venueService.searchVenues(category, location);
      setSearchResults(results);
      // Optionally, navigate to a results page or update the UI
      // Example: navigate("/venues", { state: { results } });
    } catch (error) {
      alert("Search failed");
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Your Venue, Your Way</h1>
        <div className="hero-search">
          <select className="hero-dropdown" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Wedding Venues">Wedding Venues</option>
            <option value="Corporate Events">Corporate Events</option>
            <option value="Birthday Parties">Birthday Parties</option>
            <option value="Conferences">Conferences</option>
          </select>
          <select className="hero-dropdown" value={location} onChange={e => setLocation(e.target.value)}>
            <option value="">Select Location</option>
            <option value="Kathmandu">Kathmandu</option>
            <option value="Pokhara">Pokhara</option>
            <option value="Chitwan">Chitwan</option>
            <option value="Lalitpur">Lalitpur</option>
          </select>
          <button className="hero-search-button" onClick={handleSearch}>Search</button>
        </div>
        {/* Optionally render searchResults here */}
      </div>
    </section>
  )
};

export default HeroSection;
