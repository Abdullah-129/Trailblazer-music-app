import React, { useEffect, useState } from "react";
import "./PlayerControls.css";
import {
  BsFillSkipEndFill,
  BsFillSkipStartFill,
  BsFillVolumeUpFill,
  BsPauseCircleFill,
  BsPlayCircleFill,
} from "react-icons/bs";
import { current } from "@reduxjs/toolkit";

const PlayerControls = ({
  audioRef,
  progress,
  audioDuration,
  audioLoading,
  setAlertMessage,
  handleNext,
  handlePrev,
  isPlaying,
  setIsPlaying,
  autoPlay,
  setAutoPlay,
  mapVideoId,
  currentIndex,
}) => {
  const localVolume = localStorage.getItem("localVolume") || 1.0;
  const [volumeLevel, setVolumeLevel] = useState(localVolume);
  const [bufferedAmount, setBufferedAmount] = useState(0);
  const [Time, setTime] = useState("00:00")

  const handleSeek = (e) => {
    const time = e.target.value;
    audioRef.current.currentTime = time;
  };

  useEffect(() => {
    const roundedVolume = Math.round(volumeLevel * 100) / 100; 
    audioRef.current.volume = roundedVolume;
    console.log("Audio Ref Volume:", audioRef.current.volume);
    localStorage.setItem("localVolume", roundedVolume);
  }, [volumeLevel]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (audioRef.current) {
        const currentTime = audioRef.current.getCurrentTime();
        setTime(formatTime(currentTime));
        
        // console.log(currentTime);
      }
    }, 500); 
  
    return () => {
      clearInterval(intervalId); // Cleanup the interval on component unmount
    };
  }, [audioRef]);
  
  

  useEffect(() => {
    try {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    } catch (error) {
      setAlertMessage(error.message);
    }
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.autoplay = autoPlay;
  }, [autoPlay]);

  useEffect(() => {
    const calculateBufferedAmount = () => {
      if (audioRef.current && audioRef.current.getDuration()) {
        const currentTime = audioRef.current.getCurrentTime();
        const duration = audioRef.current.getDuration();
        const buffered = (currentTime / duration) * 100;
        setBufferedAmount(buffered);
      }
    };

    const interval = setInterval(calculateBufferedAmount, 500); // Update every half second

    return () => {
      clearInterval(interval); // Cleanup interval on component unmount
    };
  }, []);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  

  return (
    <div className="player-controls-container">
      <div className="player-progress-bar-wrapper cur-pointer">
        <input
          type="range"
          title="seekbar"
          step="any"
          className="seekbar"
          value={bufferedAmount}
          min={0}
          max={100}
          onChange={handleSeek}
          style={{ "--buffered-width": `${bufferedAmount}%` }}
        />
      </div>
      <div className="player-durations-wrapper">
      {audioRef.current ? Time : '00:00'}
        <p>{audioRef.current ? formatTime(audioRef.current.getDuration()): '00:00'}</p>
      </div>
      <div className="audio-controls-wrapper absolute-center">
        <div
          className="audio-prev-wrapper next-prev-icons cur-pointer"
          style={{ opacity: currentIndex <= 0 ? "0.5" : "1" }}
          onClick={handlePrev}
        >
          <BsFillSkipStartFill style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="audio-play-pause-wrapper">
          <div
            className="audio-play-pause cur-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {!isPlaying || progress === 100 ? (
              <BsPlayCircleFill
                style={{ width: "100%", height: "100%", opacity: audioLoading ? "0.8" : "1" }}
              />
            ) : (
              <BsPauseCircleFill style={{ width: "100%", height: "100%" }} />
            )}
          </div>
          {audioLoading && (
            <div className="loading-spin">
              <svg style={{ width: "100%", height: "100%" }}>
                <circle cx="35" cy="35" r="30" fill="transparent" className="svg-circle"></circle>
              </svg>
            </div>
          )}
        </div>
        <div
          className="audio-next-wrapper next-prev-icons cur-pointer"
          style={{ opacity: currentIndex >= mapVideoId.length - 1 ? "0.5" : "1" }}
          onClick={handleNext}
        >
          <BsFillSkipEndFill style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      <div className="audio-volume-wrapper">
        <div className="audio-volume-icon next-prev-icons">
          <BsFillVolumeUpFill style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="audio-volume">
          <input
            type="range"
            title="volume"
            className="volume-input cur-pointer"
            min={0.0}
            max={1.0}
            step={0.01}
            value={volumeLevel}
            onChange={(e) => setVolumeLevel(e.target.valueAsNumber)}
          />
        </div>
      </div>
      <div className="audio-autoplay-wrapper">
        <div className="audio-autoplay-title">AutoPlay</div>
        <label className="audio-autoplay">
          <input
            type="checkbox"
            title="autoplay"
            aria-label="autoplay"
            placeholder="autoplay"
            checked={autoPlay}
            onChange={() => setAutoPlay(!autoPlay)}
          />
          <span className="autoplay-slider" title="autoplay">
            <span className="autoplay-icons">
              {autoPlay ? (
                <BsPlayCircleFill style={{ width: "100%", height: "100%" }} />
              ) : (
                <BsPauseCircleFill style={{ width: "100%", height: "100%" }} />
              )}
            </span>
          </span>
        </label>
      </div>
    </div>
  );
};

export default PlayerControls;
