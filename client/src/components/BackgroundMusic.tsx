import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Pause, Music, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isVisible, setIsVisible] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 엔틱하고 우아한 클래식 피아노 곡들 (테스트용 - 실제 서비스에서는 라이센스 확인 필요)
  const tracks = [
    {
      title: "Clair de Lune",
      artist: "Claude Debussy",
      url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Kevin_MacLeod/Impact_Lento/Kevin_MacLeod_-_01_-_Clair_de_Lune_Debussy.mp3",
      duration: "5:30"
    },
    {
      title: "Gymnopédie No.1", 
      artist: "Erik Satie",
      url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kevin_MacLeod/Classical_Sampler/Kevin_MacLeod_-_Gymnopedie_No_1.mp3",
      duration: "3:15"
    },
    {
      title: "River Waltz",
      artist: "Kevin MacLeod", 
      url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Music_for_Video/Kevin_MacLeod/Classical_Sampler/Kevin_MacLeod_-_River_Waltz.mp3",
      duration: "3:30"
    }
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // 사용자 제스처 이후에만 자동재생 가능
        audioRef.current.play().catch(console.log);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  if (!isVisible) {
    return (
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={() => setIsVisible(true)}
          size="icon"
          variant="outline"
          className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border-primary/20 hover-elevate"
          data-testid="button-show-music"
        >
          <Music className="w-5 h-5 text-primary" />
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="p-4 w-80 bg-background/95 backdrop-blur-sm border-primary/20 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">배경음악</span>
            </div>
            <Button
              onClick={() => setIsVisible(false)}
              size="icon"
              variant="ghost"
              className="w-6 h-6 h-6"
              data-testid="button-hide-music"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          <div className="mb-3">
            <p className="text-sm font-semibold text-foreground truncate">
              {tracks[currentTrack].title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {tracks[currentTrack].artist}
            </p>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <Button
              onClick={togglePlay}
              size="icon"
              variant="outline"
              className="w-8 h-8 flex-shrink-0"
              data-testid="button-play-pause"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            <Button
              onClick={toggleMute}
              size="icon"
              variant="ghost"
              className="w-8 h-8 flex-shrink-0"
              data-testid="button-mute"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>

            <div className="flex-1 flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer slider"
                data-testid="slider-volume"
              />
              <span className="text-xs text-muted-foreground w-8 text-center">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            클래식 피아노 • 엔틱 & 우아함
          </p>

          <audio
            ref={audioRef}
            src={tracks[currentTrack].url}
            loop
            onEnded={handleTrackEnd}
            preload="metadata"
            data-testid="audio-player"
          />
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}