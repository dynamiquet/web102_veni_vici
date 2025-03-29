import { useState, useEffect } from 'react';
import Bans from './Bans';

function Artwork() {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [banList, setBanList] = useState([]);

  const fetchTotalPages = async () => {
    try {
      const response = await fetch("https://api.artic.edu/api/v1/artworks");
      const data = await response.json();

      const totalArtworks = data.pagination.total; // Total artworks
      const limit = 1; // Artworks per page
      const pages = Math.ceil(totalArtworks / limit);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching total pages:", error);
    }
  };

  const fetchArtwork = async () => {
    setLoading(true); // Show loading indicator while fetching

    try {
      let artworkData;
      let attempts = 0;

      // Retry fetching artwork until one that doesn't match the ban list is found
      do {
        const randomPage = Math.floor(Math.random() * totalPages) + 1;

        const response = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${randomPage}&limit=1`
        );
        const data = await response.json();
        artworkData = data.data[0];
        attempts++;

        // Stop retrying after a reasonable number of attempts
        if (attempts > 10) {
          console.warn("Too many attempts to find a non-banned artwork.");
          artworkData = null;
          break;
        }
      } while (
        artworkData &&
        (banList.includes(artworkData.artist_display) ||
          banList.includes(artworkData.artwork_type_title))
      );

      if (!artworkData) {
        setArtwork(null);
        return;
      }

      // Image URL using the artwork's image ID
      const imageId = artworkData.image_id;
      const imageUrl = `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;

      // Store the artwork details in the `artwork` state
      setArtwork({
        title: artworkData.title,
        artist: artworkData.artist_display,
        date: artworkData.date_display,
        type: artworkData.artwork_type_title,
        image: imageUrl,
      });
    } catch (error) {
      console.error("Error fetching artwork:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = (attribute) => {
    setBanList((prevBanList) =>
      prevBanList.includes(attribute)
        ? prevBanList.filter((item) => item !== attribute) // Remove from ban list
        : [...prevBanList, attribute] // Add to ban list
    );
  };

  // Fetch the first artwork
  useEffect(() => {
    fetchTotalPages().then(() => {
      fetchArtwork();
    });
  }, []);

  return (
    <div>
      <button onClick={fetchArtwork} disabled={loading}>
        {loading ? "Loading..." : "Discover"}
      </button>

      {artwork && (
        <div className="artwork">
          <h2 onClick={() => toggleBan(artwork.title)} style={{ cursor: 'pointer' }}>
            {artwork.title}
          </h2>
          <p onClick={() => toggleBan(artwork.artist)} style={{ cursor: 'pointer' }}>
            By: {artwork.artist}
          </p>
          <p onClick={() => toggleBan(artwork.type)} style={{ cursor: 'pointer' }}>
            Type: {artwork.type}
          </p>
          <p>Date: {artwork.date}</p>
          <img src={artwork.image} alt={artwork.title} />
        </div>
      )}

      <Bans banList={banList} toggleBan={toggleBan} />
    </div>
  );
}

export default Artwork;
