import { useState } from "react";
import { Pencil, Trash, Check, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatTime, parseTime } from "@/utils/timeUtils";

interface ChapterItemProps {
  time: number;
  title: string;
  onEdit: (newTitle: string) => void;
  onEditTime: (newTime: number) => void;
  onDelete: () => void;
}

const ChapterItem = ({ time, title, onEdit, onEditTime, onDelete }: ChapterItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedTime, setEditedTime] = useState(formatTime(time));

  const handleSave = () => {
    onEdit(editedTitle);
    const newTime = parseTime(editedTime);
    if (!isNaN(newTime)) {
      onEditTime(newTime);
    }
    setIsEditing(false);
  };

  const adjustTime = (adjustment: number) => {
    const newTime = Math.max(0, time + adjustment);
    onEditTime(newTime);
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
      {isEditing ? (
        <Input
          value={editedTime}
          onChange={(e) => setEditedTime(e.target.value)}
          className="w-32 font-mono"
          placeholder="00:00:00"
        />
      ) : (
        <div className="flex items-center space-x-2">
          <div className="font-mono text-youtube-foreground">{formatTime(time)}</div>
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => adjustTime(1000)}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => adjustTime(-1000)}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      {isEditing ? (
        <div className="flex-1 mx-4">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full"
            autoFocus
          />
        </div>
      ) : (
        <div className="flex-1 mx-4 text-youtube-foreground">{title}</div>
      )}
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Pencil className="h-4 w-4 text-youtube-primary" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash className="h-4 w-4 text-youtube-accent" />
        </Button>
      </div>
    </div>
  );
};

export default ChapterItem;
