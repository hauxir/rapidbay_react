import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DownloadScreen = () => {
  const { magnet_link, filename } = useParams();
  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState(null);
  const [peers, setPeers] = useState(null);
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState(null);
  const [playLink, setPlayLink] = useState(null);
  const [subtitles, setSubtitles] = useState([]);
  const [supported, setSupported] = useState(null);

  useEffect(() => {
    const decodedMagnetLink = decodeURIComponent(decodeURIComponent(magnet_link));
    axios.post('/api/magnet_download/', { magnet_link: decodedMagnetLink, filename });

    const fetchFileInfo = () => {
      axios.get(`/api/magnet/${getHash(decodedMagnetLink)}/${encodeURIComponent(filename)}`).then((response) => {
        const data = response.data;
        setStatus(data.status);
        setProgress(data.progress);
        setPeers(data.peers);
        setHeading(`${data.status.replace(/_/g, ' ')} (${Math.round(data.progress * 100)}%)`);
        setSubheading(`${data.peers} Peers`);
        setPlayLink(data.filename ? `/play/${getHash(decodedMagnetLink)}/${encodeURIComponent(data.filename)}` : null);
        setSupported(!!data.supported);
        if (!window.isSafari) {
          setSubtitles(data.subtitles ? data.subtitles.map((sub) => ({
            language: sub.substring(sub.lastIndexOf('_') + 1).replace('.vtt', ''),
            url: `/play/${getHash(decodedMagnetLink)}/${sub}`,
          })) : []);
        }
        if (data.status !== 'ready') {
          setTimeout(fetchFileInfo, 1000);
        }
      });
    };

    fetchFileInfo();

    const keylistener = (e) => {
      // Handle key events
    };
    document.addEventListener('keydown', keylistener);
    return () => {
      document.removeEventListener('keydown', keylistener);
    };
  }, [magnet_link, filename]);

  const getHash = (magnetLink) => {
    const hashStart = magnetLink.indexOf('btih:') + 5;
    const hashEnd = magnetLink.indexOf('&');
    return hashEnd === -1 ? magnetLink.substr(hashStart).toLowerCase() : magnetLink.substr(hashStart, hashEnd - hashStart).toLowerCase();
  };

  return (
    <div>
      <h1>{heading}</h1>
      <h2>{subheading}</h2>
      {progress !== null && <progress value={progress} max="1"></progress>}
      {playLink && <a href={playLink}>Play</a>}
      {subtitles.length > 0 && (
        <ul>
          {subtitles.map((subtitle, index) => (
            <li key={index}><a href={subtitle.url}>{subtitle.language}</a></li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DownloadScreen;
