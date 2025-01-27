import { useState, useEffect } from "react";
import Timer from "@/components/Timer";
import ChapterList from "@/components/ChapterList";
import { toast } from "sonner";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { supabase } from "@/integrations/supabase/client";
import { generateChapterSuggestions } from "@/utils/geminiUtils";

interface Chapter {
  id: string;
  time: number;
  title: string;
}

const Index = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      // Space to start/pause
      if (event.code === "Space") {
        event.preventDefault();
        isRunning ? handlePause() : handleStart();
      }
      // M to mark chapter
      if (event.code === "KeyM") {
        event.preventDefault();
        handleAddChapter();
      }
      // R to reset timer
      if (event.code === "KeyR") {
        event.preventDefault();
        handleStop();
      }
      // G to generate chapter suggestions
      if (event.code === "KeyG") {
        event.preventDefault();
        await handleGenerateChapters();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId, isRunning]);

  const handleStart = () => {
    if (!isRunning) {
      const id = window.setInterval(() => {
        setTime((prevTime) => prevTime + 1000);
      }, 1000);
      setIntervalId(id);
      setIsRunning(true);
      toast.success("Cronômetro iniciado");
    }
  };

  const handlePause = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
    toast.info("Cronômetro pausado");
  };

  const handleStop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
    setTime(0);
    toast.info("Cronômetro parado");
  };

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      time,
      title: `Capítulo ${chapters.length + 1}`,
    };
    setChapters((prev) => [...prev, newChapter]);
    toast.success("Capítulo adicionado");
  };

  const handleGenerateChapters = async () => {
    try {
      const suggestions = await generateChapterSuggestions(chapters);
      setChapters(suggestions);
      toast.success("Capítulos gerados automaticamente!");
    } catch (error) {
      toast.error("Erro ao gerar capítulos automaticamente");
    }
  };

  const handleEditChapter = (id: string, newTitle: string) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === id ? { ...chapter, title: newTitle } : chapter
      )
    );
    toast.success("Capítulo atualizado");
  };

  const handleEditChapterTime = (id: string, newTime: number) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === id ? { ...chapter, time: newTime } : chapter
      )
    );
    toast.success("Tempo atualizado");
  };

  const handleDeleteChapter = (id: string) => {
    setChapters((prev) => prev.filter((chapter) => chapter.id !== id));
    toast.success("Capítulo removido");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Cronômetro para YouTube
            </h1>
            <p className="text-muted-foreground">
              Marque capítulos enquanto grava seu vídeo
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-card-foreground">
            Atalhos de Teclado
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <kbd className="px-2 py-1 bg-muted rounded">Espaço</kbd> Iniciar/Pausar
            </div>
            <div>
              <kbd className="px-2 py-1 bg-muted rounded">M</kbd> Marcar Capítulo
            </div>
            <div>
              <kbd className="px-2 py-1 bg-muted rounded">R</kbd> Resetar Timer
            </div>
            <div>
              <kbd className="px-2 py-1 bg-muted rounded">G</kbd> Gerar Sugestões
            </div>
          </div>
        </div>

        <Timer
          time={time}
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
        />

        <ChapterList
          chapters={chapters}
          onAddChapter={handleAddChapter}
          onEditChapter={handleEditChapter}
          onEditChapterTime={handleEditChapterTime}
          onDeleteChapter={handleDeleteChapter}
        />
      </div>
    </div>
  );
};

export default Index;
