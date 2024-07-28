import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchScreen from './SearchScreen';
import SearchResultsScreen from './SearchResultsScreen';
import TorrentLinkScreen from './TorrentLinkScreen';
import FileListScreen from './FileListScreen';
import DownloadScreen from './DownloadScreen';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/search/:searchterm" element={SearchResultsScreen} />
          <Route path="/torrent/:torrent_link" element={TorrentLinkScreen} />
          <Route path="/magnet/:magnet_link/:filename" element={DownloadScreen} />
          <Route path="/magnet/:magnet_link" element={FileListScreen} />
          <Route path="/" element={SearchScreen} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
