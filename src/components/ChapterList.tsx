import { Plus, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChapterItem from "./ChapterItem";
import { toast } from "sonner";
import { formatTime } from "@/utils/timeUtils";

interface Chapter {
  id: string;
  time: number;
  title: string;
}

interface ChapterListProps {
  chapters: Chapter[];
  onAddChapter: () => void;
  onEditChapter: (id: string, newTitle: string) => void;
  onEditChapterTime: (id: string, newTime: number) => void;
  onDeleteChapter: (id: string) => void;
}

const ChapterList = ({
  chapters,
  onAddChapter,
  onEditChapter,
  onEditChapterTime,
  onDeleteChapter,
}: ChapterListProps) => {
  const exportToYouTube = () => {
    const sortedChapters = [...chapters].sort((a, b) => a.time - b.time);
    const youtubeFormat = sortedChapters
      .map((chapter) => `${formatTime(chapter.time)} ${chapter.title}`)
      .join("\n");

    navigator.clipboard.writeText(youtubeFormat).then(() => {
      toast.success("Capítulos copiados no formato do YouTube!");
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Capítulos
        </h2>
        <div className="flex space-x-2">
          <Button
            onClick={exportToYouTube}
            variant="outline"
            className="text-youtube-primary"
          >
            <Upload className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button
            onClick={onAddChapter}
            variant="outline"
            className="text-youtube-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Capítulo
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {chapters.map((chapter) => (
          <ChapterItem
            key={chapter.id}
            time={chapter.time}
            title={chapter.title}
            onEdit={(newTitle) => onEditChapter(chapter.id, newTitle)}
            onEditTime={(newTime) => onEditChapterTime(chapter.id, newTime)}
            onDelete={() => onDeleteChapter(chapter.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChapterList;
