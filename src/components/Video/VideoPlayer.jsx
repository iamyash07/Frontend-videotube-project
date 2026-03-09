// components/Video/VideoPlayer.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import {
  HiPlay,
  HiPause,
  HiVolumeUp,
  HiVolumeOff,
  HiRewind,
  HiFastForward,
} from "react-icons/hi";
import {
  MdFullscreen,
  MdFullscreenExit,
  MdPictureInPictureAlt,
  MdSettings,
  MdReplay,
} from "react-icons/md";

const VideoPlayer = ({
  src,
  poster,
  title = "",
  autoPlay = false,
  onTimeUpdate,
  onEnded,
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [seekPreviewTime, setSeekPreviewTime] = useState(null);
  const [seekPreviewPos, setSeekPreviewPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [doubleTapSide, setDoubleTapSide] = useState(null);
  const [doubleTapTimeout, setDoubleTapTimeout] = useState(null);
  const [tapCount, setTapCount] = useState(0);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);

  const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const SKIP_SECONDS = 10;

  // Controls visibility
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    setShowControls(true);

    if (isPlaying && !showSpeedMenu) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying, showSpeedMenu]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, resetControlsTimeout]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      const video = videoRef.current;
      if (!video) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlayPause();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "arrowleft":
        case "j":
          e.preventDefault();
          skipTime(-SKIP_SECONDS);
          break;
        case "arrowright":
        case "l":
          e.preventDefault();
          skipTime(SKIP_SECONDS);
          break;
        case "arrowup":
          e.preventDefault();
          changeVolume(Math.min(1, volume + 0.1));
          break;
        case "arrowdown":
          e.preventDefault();
          changeVolume(Math.max(0, volume - 0.1));
          break;
        case "0":
        case "home":
          e.preventDefault();
          video.currentTime = 0;
          break;
        case "end":
          e.preventDefault();
          video.currentTime = duration;
          break;
        case ">":
          e.preventDefault();
          cyclePlaybackRate(1);
          break;
        case "<":
          e.preventDefault();
          cyclePlaybackRate(-1);
          break;
        default:
          if (/^[1-9]$/.test(e.key)) {
            e.preventDefault();
            video.currentTime = (parseInt(e.key) / 10) * duration;
          }
          break;
      }
      resetControlsTimeout();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [volume, duration, isPlaying, playbackRate]);

  // Fullscreen listener
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Video events
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      setCurrentTime(videoRef.current.currentTime);
      onTimeUpdate?.(videoRef.current.currentTime);
    }
  };

  const handleProgress = () => {
    const video = videoRef.current;
    if (video && video.buffered.length > 0) {
      const end = video.buffered.end(video.buffered.length - 1);
      setBuffered((end / video.duration) * 100);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setIsEnded(true);
    setShowControls(true);
    onEnded?.();
  };

  // Controls
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isEnded) {
      video.currentTime = 0;
      setIsEnded(false);
    }

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
      setIsEnded(false);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      video.volume = previousVolume || 0.5;
      setVolume(previousVolume || 0.5);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      video.muted = true;
      setIsMuted(true);
    }
  };

  const changeVolume = (val) => {
    const video = videoRef.current;
    if (!video) return;

    const clamped = Math.max(0, Math.min(1, val));
    video.volume = clamped;
    video.muted = clamped === 0;
    setVolume(clamped);
    setIsMuted(clamped === 0);
    if (clamped > 0) setPreviousVolume(clamped);
  };

  const skipTime = (sec) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + sec));
    setIsEnded(false);
    resetControlsTimeout();
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await containerRef.current?.requestFullscreen();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current?.requestPictureInPicture();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const changePlaybackRate = (rate) => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const cyclePlaybackRate = (dir) => {
    const idx = PLAYBACK_RATES.indexOf(playbackRate);
    const next = Math.max(0, Math.min(PLAYBACK_RATES.length - 1, idx + dir));
    changePlaybackRate(PLAYBACK_RATES[next]);
  };

  // Progress bar
  const getSeekTime = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    return pos * duration;
  };

  const handleProgressClick = (e) => {
    const time = getSeekTime(e);
    if (videoRef.current) videoRef.current.currentTime = time;
    setCurrentTime(time);
    setIsEnded(false);
  };

  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    handleProgressClick(e);

    const onMove = (e) => setCurrentTime(getSeekTime(e));
    const onUp = (e) => {
      setIsDragging(false);
      if (videoRef.current) videoRef.current.currentTime = getSeekTime(e);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleProgressHover = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setSeekPreviewTime(pos * duration);
    setSeekPreviewPos(pos * 100);
  };

  // Double tap
  const handleVideoAreaClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const w = rect.width;

    setTapCount((prev) => {
      const count = prev + 1;
      if (doubleTapTimeout) clearTimeout(doubleTapTimeout);

      const timeout = setTimeout(() => {
        if (count === 1) togglePlayPause();
        setTapCount(0);
        setDoubleTapSide(null);
      }, 300);

      setDoubleTapTimeout(timeout);

      if (count === 2) {
        clearTimeout(timeout);
        setTapCount(0);

        if (clickX < w / 3) {
          skipTime(-SKIP_SECONDS);
          setDoubleTapSide("left");
          setTimeout(() => setDoubleTapSide(null), 600);
        } else if (clickX > (w * 2) / 3) {
          skipTime(SKIP_SECONDS);
          setDoubleTapSide("right");
          setTimeout(() => setDoubleTapSide(null), 600);
        } else {
          toggleFullscreen();
        }
      }
      return count;
    });

    resetControlsTimeout();
  };

  // Format time
  const formatTime = (s) => {
    if (isNaN(s) || !isFinite(s)) return "0:00";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0)
      return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const VolumeIcon = isMuted || volume === 0 ? HiVolumeOff : HiVolumeUp;

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video bg-black select-none group ${
        isFullscreen ? "rounded-none" : "rounded-xl"
      } overflow-hidden`}
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
        setShowVolumeSlider(false);
      }}
      style={{ cursor: showControls ? "default" : "none" }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        preload="metadata"
        className="w-full h-full object-contain block"
        onClick={(e) => e.preventDefault()}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onEnded={handleVideoEnded}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />

      {/* Click overlay */}
      <div
        className="absolute top-0 left-0 right-0 bottom-[60px] z-[1]"
        onClick={handleVideoAreaClick}
      />

      {/* Double tap left */}
      {doubleTapSide === "left" && (
        <div className="absolute top-1/2 left-[15%] -translate-y-1/2 flex flex-col items-center gap-1 text-white text-sm font-semibold z-[4] pointer-events-none animate-pulse">
          <HiRewind size={40} />
          <span>{SKIP_SECONDS}s</span>
        </div>
      )}

      {/* Double tap right */}
      {doubleTapSide === "right" && (
        <div className="absolute top-1/2 right-[15%] -translate-y-1/2 flex flex-col items-center gap-1 text-white text-sm font-semibold z-[4] pointer-events-none animate-pulse">
          <HiFastForward size={40} />
          <span>{SKIP_SECONDS}s</span>
        </div>
      )}

      {/* Loading spinner */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-[2]">
          <div className="text-center text-white">
            <p className="text-lg mb-3">⚠️ Failed to load video</p>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                videoRef.current?.load();
              }}
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Ended replay */}
      {isEnded && !isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center z-[2] cursor-pointer"
          onClick={togglePlayPause}
        >
          <div className="w-[72px] h-[72px] rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:scale-110 hover:bg-black/80 transition-all">
            <MdReplay size={48} />
          </div>
        </div>
      )}

      {/* Big play button */}
      {!isPlaying && !isLoading && !isEnded && !hasError && currentTime === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center z-[2] cursor-pointer"
          onClick={togglePlayPause}
        >
          <div className="w-[72px] h-[72px] rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:scale-110 hover:bg-black/80 transition-all">
            <HiPlay size={48} className="ml-1" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute inset-0 z-[3] flex flex-col justify-between transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top gradient + title */}
        {title && (
          <div className="bg-gradient-to-b from-black/70 to-transparent px-4 pt-4 pb-8">
            <p className="text-white text-sm font-semibold truncate drop-shadow-md">
              {title}
            </p>
          </div>
        )}

        {/* Spacer */}
        {!title && <div />}

        {/* Bottom */}
        <div className="bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-8 px-3 pb-2">
          {/* Progress bar */}
          <div
            ref={progressRef}
            className={`relative w-full cursor-pointer mb-2 rounded-sm transition-all ${
              isHoveringProgress ? "h-1.5" : "h-1"
            } bg-white/25`}
            onClick={handleProgressClick}
            onMouseDown={handleProgressMouseDown}
            onMouseMove={handleProgressHover}
            onMouseEnter={() => setIsHoveringProgress(true)}
            onMouseLeave={() => {
              setIsHoveringProgress(false);
              setSeekPreviewTime(null);
            }}
          >
            {/* Buffered */}
            <div
              className="absolute top-0 left-0 h-full bg-white/35 rounded-sm pointer-events-none"
              style={{ width: `${buffered}%` }}
            />

            {/* Played */}
            <div
              className="absolute top-0 left-0 h-full bg-indigo-500 rounded-sm pointer-events-none"
              style={{ width: `${progress}%` }}
            />

            {/* Thumb */}
            <div
              className={`absolute top-1/2 w-3.5 h-3.5 bg-indigo-500 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-md transition-all ${
                isHoveringProgress
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-0"
              }`}
              style={{ left: `${progress}%` }}
            />

            {/* Seek preview */}
            {seekPreviewTime !== null && (
              <div
                className="absolute bottom-5 -translate-x-1/2 bg-black/85 text-white px-2 py-0.5 rounded text-xs font-semibold pointer-events-none whitespace-nowrap tabular-nums"
                style={{
                  left: `clamp(30px, ${seekPreviewPos}%, calc(100% - 30px))`,
                }}
              >
                {formatTime(seekPreviewTime)}
              </div>
            )}
          </div>

          {/* Buttons row */}
          <div className="flex items-center justify-between gap-1">
            {/* Left group */}
            <div className="flex items-center gap-0.5">
              {/* Play/Pause */}
              <button
                className="p-1.5 rounded-md text-white hover:bg-white/15 transition-colors flex items-center justify-center"
                onClick={togglePlayPause}
                title={isPlaying ? "Pause (K)" : "Play (K)"}
              >
                {isEnded ? (
                  <MdReplay size={24} />
                ) : isPlaying ? (
                  <HiPause size={24} />
                ) : (
                  <HiPlay size={24} />
                )}
              </button>

              {/* Rewind */}
              <button
                className="p-1.5 rounded-md text-white hover:bg-white/15 transition-colors flex items-center justify-center"
                onClick={() => skipTime(-SKIP_SECONDS)}
                title={`Rewind ${SKIP_SECONDS}s (J)`}
              >
                <HiRewind size={20} />
              </button>

              {/* Forward */}
              <button
                className="p-1.5 rounded-md text-white hover:bg-white/15 transition-colors flex items-center justify-center"
                onClick={() => skipTime(SKIP_SECONDS)}
                title={`Forward ${SKIP_SECONDS}s (L)`}
              >
                <HiFastForward size={20} />
              </button>

              {/* Volume */}
              <div
                className="flex items-center"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <button
                  className="p-1.5 rounded-md text-white hover:bg-white/15 transition-colors flex items-center justify-center"
                  onClick={toggleMute}
                  title={isMuted ? "Unmute (M)" : "Mute (M)"}
                >
                  <VolumeIcon size={22} />
                </button>

                <div
                  className="overflow-hidden transition-all duration-200"
                  style={{
                    width: showVolumeSlider ? "80px" : "0px",
                    opacity: showVolumeSlider ? 1 : 0,
                  }}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/30 rounded-sm appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-3
                      [&::-webkit-slider-thumb]:h-3
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-white
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:w-3
                      [&::-moz-range-thumb]:h-3
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-white
                      [&::-moz-range-thumb]:border-none
                      [&::-moz-range-thumb]:cursor-pointer"
                    title="Volume"
                  />
                </div>
              </div>

              {/* Time */}
              <span className="text-white text-xs sm:text-[13px] font-medium ml-1 whitespace-nowrap tabular-nums">
                {formatTime(currentTime)}
                <span className="opacity-60"> / {formatTime(duration)}</span>
              </span>
            </div>

            {/* Right group */}
            <div className="flex items-center gap-0.5">
              {/* Speed */}
              <div className="relative">
                <button
                  className="p-1.5 rounded-md text-white hover:bg-white/15 transition-colors flex items-center justify-center min-w-[32px] text-[13px] font-semibold"
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  title="Playback Speed"
                >
                  {playbackRate !== 1 ? (
                    `${playbackRate}x`
                  ) : (
                    <MdSettings size={22} />
                  )}
                </button>

                {showSpeedMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSpeedMenu(false)}
                    />
                    <div className="absolute bottom-10 right-0 bg-neutral-900/95 backdrop-blur-xl rounded-xl py-1.5 min-w-[140px] z-[11] shadow-2xl">
                      <div className="px-4 py-1.5 text-white/50 text-xs font-semibold uppercase tracking-wider border-b border-white/10 mb-1">
                        Speed
                      </div>
                      {PLAYBACK_RATES.map((rate) => (
                        <button
                          key={rate}
                          className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left transition-colors hover:bg-white/10 ${
                            playbackRate === rate
                              ? "text-indigo-400 font-semibold"
                              : "text-white"
                          }`}
                          onClick={() => changePlaybackRate(rate)}
                        >
                          {rate === 1 ? "Normal" : `${rate}x`}
                          {playbackRate === rate && (
                            <span className="ml-2 text-sm">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* PiP */}
              {document.pictureInPictureEnabled && (
                <button
                  className="p-1.5 rounded-md text-white hover:bg-white/15 transition-colors flex items-center justify-center"
                  onClick={togglePiP}
                  title="Picture in Picture"
                >
                  <MdPictureInPictureAlt size={20} />
                </button>
              )}

              {/* Fullscreen */}
              <button
                className="p-1.5 rounded-md text-white hover:bg-white/15 transition-colors flex items-center justify-center"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
              >
                {isFullscreen ? (
                  <MdFullscreenExit size={26} />
                ) : (
                  <MdFullscreen size={26} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;