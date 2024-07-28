import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname.toLowerCase() === '/registerhandler') {
      navigator.registerProtocolHandler(
        'magnet',
        `${window.location.origin}/magnet/%s`,
        'RapidBay'
      );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.startsWith('magnet:')) {
      navigate(`/magnet/${encodeURIComponent(encodeURIComponent(searchTerm))}`);
    } else {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search or enter magnet link"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchScreen;
