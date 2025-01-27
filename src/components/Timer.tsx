import { Play, Pause, Square } from "lucide-react";
import { formatTime } from "@/utils/timeUtils";
import { Button } from "@/components/ui/button";

interface TimerProps {
  time: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

const Timer = ({ time, isRunning, onStart, onPause, onStop }: TimerProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-6xl font-bold font-mono tracking-wider text-black dark:text-white">
        {formatTime(time)}
      </div>
      <div className="flex space-x-4">
        <Button
          onClick={isRunning ? onPause : onStart}
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full"
        >
          {isRunning ? (
            <Pause className="h-8 w-8 text-youtube-primary" />
          ) : (
            <Play className="h-8 w-8 text-youtube-primary" />
          )}
        </Button>
        <Button
          onClick={onStop}
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full"
        >
          <Square className="h-8 w-8 text-youtube-accent" />
        </Button>
      </div>
    </div>
  );
};

export default Timer;
