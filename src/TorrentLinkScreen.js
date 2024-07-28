import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TorrentLinkScreen = () => {
  const { torrent_link } = useParams();
  const navigate= useNavigate();

  useEffect(() => {
    axios.post('/api/torrent_url_to_magnet/', { url: torrent_link }).then((response) => {
      navigate(`/magnet/${encodeURIComponent(encodeURIComponent(response.data.magnet_link))}` , { replace: true });
    });
  }, [torrent_link, navigate]);

  return <div>Loading...</div>;
};

export default TorrentLinkScreen;
