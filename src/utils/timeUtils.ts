export const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const parseTime = (timeString: string): number => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
};
