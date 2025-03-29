import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1)
  
  const fetchTotalPages = async () => {
    try {
      const response = await fetch("https://api.artic.edu/api/v1/artworks");
      const data = await response.json();

      const totalArtworks = data.pagination.total;   // Total artworks
      const limit = 1;  // Artworks per page
      const pages = Math.ceil(totalArtworks / limit);
      setTotalPages(pages); 
    } catch (error) {
      console.error("Error fetching total pages:", error);
    }
  };
  
  const fetchArtwork = async () => {
    setLoading(true);  // Show loading indicator while fetching

    try {
      // API request to fetch one random page of artworks
      const response = await fetch(
        "https://api.artic.edu/api/v1/artworks?page=1&limit=1"
      );
      const data = await response.json();
      const artworkData = data.data[0];

      // Image URL using the artwork's image ID
      const imageId = artworkData.image_id;
      const imageUrl = `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;

      // Store the artwork details in the `artwork` state
      setArtwork({
        title: artworkData.title,        
        artist: artworkData.artist_display,
        date: artworkData.date_display,
        type: artworkData.artwork_type_title,   
        image: imageUrl                   
      });
      
    } catch (error) {
      console.error("Error fetching artwork:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtwork();  // Fetch the first artwork
  }, []);            // Empty array → run only once on initial load


  return (
    <>
      <div className="container">
        <h1>Art Discovery!</h1>

        <button onClick={fetchArtwork} disabled={loading}>
          {loading ? "Loading..." : "Discover"}
        </button>

        {/* Display the artwork details if available */}
        {artwork && (
          <div className="artwork">
            <h2>{artwork.title}</h2>       
            <p>By: {artwork.artist}</p>    
            <p>Date: {artwork.date}</p>    
            <img src={artwork.image} alt={artwork.title} />
          </div>
        )}
      </div>
    </>
  )
}

export default App
