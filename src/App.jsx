import './App.css';
import Artwork from './Components/Artwork';
import Bans from './Components/Bans';
import { useState } from 'react';

function App() {
  const [banList, setBanList] = useState([]);

  const toggleBan = (attribute) => {
    setBanList((prevBanList) =>
      prevBanList.includes(attribute)
        ? prevBanList.filter((item) => item !== attribute) // Remove from ban list
        : [...prevBanList, attribute] // Add to ban list
    );
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <h1 id="heading">Art Discovery!</h1>
        <Artwork banList={banList} toggleBan={toggleBan} />
      </div>
      <div className="side-bar">
        <Bans banList={banList} toggleBan={toggleBan} />
      </div>
    </div>
  );
}

export default App;
