import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SearchResultsScreen = () => {
  const { searchterm } = useParams();
  const [results, setResults] = useState(null);

  useEffect(() => {
    axios.get(`/api/search/${searchterm}`).then((response) => {
      setResults(response.data.results);
    });

    const keylistener = (e) => {
      // Handle key events
    };
    document.addEventListener('keydown', keylistener);
    return () => {
      document.removeEventListener('keydown', keylistener);
    };
  }, [searchterm]);

  return (
    <div>
      {results ? (
        <ul>
          {results.map((result) => (
            <li key={result.id}>{result.name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SearchResultsScreen;
