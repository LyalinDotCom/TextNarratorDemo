"use client";

import { useState, useRef, useEffect } from 'react';
import { generateGeminiNarration } from '@/ai/flows/generate-narration-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play, Pause, StopCircle, Download, BookAudio } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const voices = [
  { name: 'Zephyr', description: 'Bright' },
  { name: 'Puck', description: 'Upbeat' },
  { name: 'Charon', description: 'Informative' },
  { name: 'Kore', description: 'Firm' },
  { name: 'Fenrir', description: 'Excitable' },
  { name: 'Leda', description: 'Youthful' },
  { name: 'Orus', description: 'Firm' },
  { name: 'Aoede', description: 'Breezy' },
  { name: 'Callirrhoe', description: 'Easy-going' },
  { name: 'Autonoe', description: 'Bright' },
  { name: 'Enceladus', description: 'Breathy' },
  { name: 'Iapetus', description: 'Clear' },
  { name: 'Umbriel', description: 'Easy-going' },
  { name: 'Algieba', description: 'Smooth' },
  { name: 'Despina', description: 'Smooth' },
  { name: 'Erinome', description: 'Clear' },
  { name: 'Algenib', description: 'Gravelly' },
  { name: 'Rasalgethi', description: 'Informative' },
  { name: 'Laomedeia', description: 'Upbeat' },
  { name: 'Achernar', description: 'Soft' },
  { name: 'Alnilam', description: 'Firm' },
  { name: 'Schedar', description: 'Even' },
  { name: 'Gacrux', description: 'Mature' },
  { name: 'Pulcherrima', description: 'Forward' },
  { name: 'Achird', description: 'Friendly' },
  { name: 'Zubenelgenubi', description: 'Casual' },
  { name: 'Vindemiatrix', description: 'Gentle' },
  { name: 'Sadachbia', description: 'Lively' },
  { name: 'Sadaltager', description: 'Knowledgeable' },
  { name: 'Sulafat', description: 'Warm' }
];

const languages = [
  { name: 'Arabic (Egyptian)', code: 'ar-EG' },
  { name: 'German (Germany)', code: 'de-DE' },
  { name: 'English (US)', code: 'en-US' },
  { name: 'Spanish (US)', code: 'es-US' },
  { name: 'French (France)', code: 'fr-FR' },
  { name: 'Hindi (India)', code: 'hi-IN' },
  { name: 'Indonesian (Indonesia)', code: 'id-ID' },
  { name: 'Italian (Italy)', code: 'it-IT' },
  { name: 'Japanese (Japan)', code: 'ja-JP' },
  { name: 'Korean (Korea)', code: 'ko-KR' },
  { name: 'Portuguese (Brazil)', code: 'pt-BR' },
  { name: 'Russian (Russia)', code: 'ru-RU' },
  { name: 'Dutch (Netherlands)', code: 'nl-NL' },
  { name: 'Polish (Poland)', code: 'pl-PL' },
  { name: 'Thai (Thailand)', code: 'th-TH' },
  { name: 'Turkish (Turkey)', code: 'tr-TR' },
  { name: 'Vietnamese (Vietnam)', code: 'vi-VN' },
  { name: 'Romanian (Romania)', code: 'ro-RO' },
  { name: 'Ukrainian (Ukraine)', code: 'uk-UA' },
  { name: 'Bengali (Bangladesh)', code: 'bn-BD' },
  { name: 'English (India)', code: 'en-IN' },
  { name: 'Marathi (India)', code: 'mr-IN' },
  { name: 'Tamil (India)', code: 'ta-IN' },
  { name: 'Telugu (India)', code: 'te-IN' },
];

export default function Home() {
  const [text, setText] = useState('');
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingInitialText, setIsLoadingInitialText] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('Algenib');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup audio object on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioData) {
      // If an old audio object exists, pause it before replacing
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioData);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioData]);

  useEffect(() => {
    const fetchInitialText = async () => {
      try {
        const { generateInitialText } = await import('@/ai/flows/generate-initial-text-flow');
        const result = await generateInitialText({ topic: 'a futuristic city at night' });
        setText(result.text);
      } catch (e) {
        console.error("Failed to generate initial text:", e);
        setText("Welcome to Text Narrator. Paste your text here and click 'Narrate' to begin.");
      } finally {
        setIsLoadingInitialText(false);
      }
    };

    fetchInitialText();
  }, []);

  const handleGenerateNarration = async () => {
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter some text to narrate.",
      });
      return;
    }

    setIsGenerating(true);
    setAudioData(null);
    setIsPlaying(false);

    try {
      const result = await generateGeminiNarration({ text, voice: selectedVoice, language: selectedLanguage });
      if (result.media) {
        setAudioData(result.media);
      } else {
        throw new Error("No audio data received from the AI.");
      }
    } catch (error) {
      console.error("Error generating narration:", error);
      toast({
        variant: "destructive",
        title: "Narration Failed",
        description: "Could not generate audio. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(e => {
          console.error("Error playing audio:", e);
          toast({ variant: "destructive", title: "Playback Error", description: "Could not play audio." });
        });
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleDownload = () => {
    if (audioData) {
      const link = document.createElement('a');
      link.href = audioData;
      link.download = 'narration.wav';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <main className="flex min-h-full w-full flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
                <BookAudio className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-3xl font-headline">Text Narrator</CardTitle>
          <CardDescription>
            Paste your text below, and let our AI read it aloud for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingInitialText ? (
            <div className="space-y-2">
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : (
            <Textarea
              placeholder="Type or paste your text here..."
              className="min-h-[200px] resize-none text-base"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isGenerating}
            />
          )}
          <div className="space-y-2">
            <Label htmlFor="voice-select">Voice</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={isGenerating || isLoadingInitialText}>
                <SelectTrigger id="voice-select" className="w-full">
                    <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                    {voices.map(voice => (
                        <SelectItem key={voice.name} value={voice.name}>
                            {voice.name} - <span className="text-muted-foreground">{voice.description}</span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language-select">Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage} disabled={isGenerating || isLoadingInitialText}>
                <SelectTrigger id="language-select" className="w-full">
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                    {languages.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleGenerateNarration}
            disabled={isGenerating || isLoadingInitialText || !text.trim()}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Narrate'
            )}
          </Button>
        </CardContent>
        {audioData && (
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-2 rounded-b-lg bg-muted/50 p-4">
            <Button onClick={handlePlayPause} variant="outline" className="w-full sm:w-auto">
              {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={handleStop} variant="outline" className="w-full sm:w-auto">
              <StopCircle className="mr-2 h-4 w-4" />
              Stop
            </Button>
            <Button onClick={handleDownload} variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Download (.wav)
            </Button>
          </CardFooter>
        )}
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Powered by Gemini. Built with Firebase and Next.js.</p>
      </footer>
    </main>
  );
}
