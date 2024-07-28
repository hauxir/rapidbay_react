import React, { useEffect, useState } from 'react';

const Player = ({ url, subtitles, back }) => {
  const [isDesktop, setIsDesktop] = useState(false);
const [isChrome, setIsChrome] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    setIsDesktop(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent));
    setIsChrome(/Chrome/i.test(navigator.userAgent));
    const video = document.getElementsByTagName('video')[0];

    const getNextFile = () => {
      return new Promise((resolve) => {
        axios.get(`/api/next_file/${url.split('/')[2]}/${decodeURIComponent(location.pathname.split('/').pop())}`).then((response) => {
          resolve(response.data.next_filename);
        });
      });
    };

    const handlePlay = () => {
      getNextFile().then((nextFile) => {
        if (nextFile) {
          axios.post('/api/magnet_download/', {
            magnet_link: decodeURIComponent(decodeURIComponent(location.pathname.split('/')[2])),
            filename: nextFile,
          });
        }
      });
    };

    const handleEnded = () => {
      getNextFile().then((nextFile) => {
        if (nextFile) {
          const nextPath = `${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}/${nextFile}`;
          navigate('/', true);
          setTimeout(() => {
            navigate(nextPath, true);
          });
        }
      });
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleEnded);
    video.play();

    const captionLanguage = localStorage.getItem('captionLanguage');
    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      track.mode = 'disabled';
    }
    if (captionLanguage) {
      let currentTrack;
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        track.mode = 'hidden';
        if (!currentTrack && track.language === captionLanguage) {
          currentTrack = track;
        }
      }
      if (currentTrack) {
        currentTrack.mode = 'showing';
      }
    }

    const captionChangeListener = (e) => {
      const tracks = e.currentTarget;
      let captionLanguage;
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (track.mode === 'showing') {
          captionLanguage = track.language;
        }
      }
      if (captionLanguage) {
        window.localStorage.setItem('captionLanguage', captionLanguage);
      } else {
        window.localStorage.removeItem('captionLanguage');
      }
    };

    video.textTracks.addEventListener('change', captionChangeListener);

    const videokeylistener = (event) => {
      const videoSelected = ['video', 'body'].indexOf(document.activeElement && document.activeElement.tagName.toLowerCase()) !== -1;
      if (event.key.toLowerCase() === 'arrowright' && videoSelected) {
        event.preventDefault();
        event.stopPropagation();
        video.currentTime += 60;
      } else if (event.key.toLowerCase() === 'arrowleft' && videoSelected) {
        event.preventDefault();
        event.stopPropagation();
        video.currentTime -= 60;
      } else if (event.key.toLowerCase() === 'enter' && videoSelected) {
        event.preventDefault();
        event.stopPropagation();
        if (!video.paused) {
          video.pause();
        } else {
          video.play();
        }
      } else {
        handleMouseMove();
      }
    };

    document.addEventListener('keydown', videokeylistener, true);

    let timeout;
    const duration = 2800;
    const handleMouseMove = () => {
      setHovering(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setHovering(false);
      }, duration);
    };

    handleMouseMove();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchstart', handleMouseMove);
    document.addEventListener('click', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchstart', handleMouseMove);
      document.removeEventListener('click', handleMouseMove);
      document.removeEventListener('keydown', videokeylistener, true);
      video.textTracks.removeEventListener('change', captionChangeListener);
    };
  }, [url]);

  return (
    <div>
      <video src={url} controls>
        {subtitles.map((subtitle) => (
          <track key={subtitle.url} src={subtitle.url} kind="subtitles" srcLang={subtitle.language} />
        ))}
      </video>
      <button onClick={back}>Back</button>
    </div>
  );
};

export default Player;
