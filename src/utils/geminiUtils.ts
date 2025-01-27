import { supabase } from "@/integrations/supabase/client";

interface Chapter {
  id: string;
  time: number;
  title: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface SecretRow {
  name: string;
  value: string;
}

export async function generateChapterSuggestions(
  currentChapters: Chapter[]
): Promise<Chapter[]> {
  try {
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'GEMINI_API_KEY')
      .single();

    if (secretError || !secretData) {
      throw new Error('Failed to get Gemini API key');
    }

    const GEMINI_API_KEY = secretData.value;

    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not found');
    }

    const chaptersContext = currentChapters
      .map(chapter => `${formatTime(chapter.time)} - ${chapter.title}`)
      .join('\n');

    const prompt = `
      Analise estes marcadores de tempo de um vídeo e sugira títulos mais descritivos 
      para cada capítulo, mantendo os mesmos tempos. Se houver poucos capítulos, 
      sugira também novos capítulos intermediários com tempos estimados.
      
      Capítulos atuais:
      ${chaptersContext}
      
      Por favor, retorne apenas os capítulos no formato:
      MM:SS Título do Capítulo
    `;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate chapter suggestions');
    }

    const responseData: GeminiResponse = await response.json();
    const suggestions = responseData.candidates[0].content.parts[0].text
      .split('\n')
      .filter(Boolean)
      .map((line: string) => {
        const [timeStr, ...titleParts] = line.split(' ');
        const title = titleParts.join(' ');
        const [minutes, seconds] = timeStr.split(':').map(Number);
        const time = (minutes * 60 + seconds) * 1000;

        return {
          id: Date.now().toString() + Math.random(),
          time,
          title
        };
      });

    return suggestions;
  } catch (error) {
    console.error('Error generating chapter suggestions:', error);
    throw error;
  }
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
