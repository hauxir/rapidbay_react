import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FileListScreen = () => {
  const { magnet_link } = useParams();
  const [files, setFiles] = useState(null);

  useEffect(() => {
    const decodedMagnetLink = decodeURIComponent(decodeURIComponent(magnet_link));
    axios.post('/api/magnet_files/', { magnet_link: decodedMagnetLink });

    const fetchFiles = () => {
      axios.get(`/api/magnet/${getHash(decodedMagnetLink)}/`).then((response) => {
        if (response.data.files == null) {
          setTimeout(fetchFiles, 1000);
        } else {
          setFiles(response.data.files);
        }
      });
    };

    fetchFiles();

    const keylistener = (e) => {
      // Handle key events
    };
    document.addEventListener('keydown', keylistener);
    return () => {
      document.removeEventListener('keydown', keylistener);
    };
  }, [magnet_link]);

  const getHash = (magnetLink) => {
    const hashStart = magnetLink.indexOf('btih:') + 5;
    const hashEnd = magnetLink.indexOf('&');
    return hashEnd === -1 ? magnetLink.substr(hashStart).toLowerCase() : magnetLink.substr(hashStart, hashEnd - hashStart).toLowerCase();
  };

  return (
    <div>
      {files ? (
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FileListScreen;
