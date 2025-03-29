import React from 'react';

function Bans({ banList, toggleBan }) {
  return (
    <div className="ban-list">
      <h3>Banned Attributes:</h3>
      {banList.length > 0 ? (
        <ul>
          {banList.map((item, index) => (
            <li
              key={index}
              onClick={() => toggleBan(item)}
              style={{ cursor: 'pointer', color: 'red' }}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p>No attributes are currently banned. Click on an attribute to ban it.</p>
      )}
    </div>
  );
}

export default Bans;
