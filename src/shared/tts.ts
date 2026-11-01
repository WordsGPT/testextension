import type { LangCode, VerbaSettings } from './types';
import { LANG_MAP } from './languages';

const audioBlobCache = new Map<string, string>();
let activeAudio: HTMLAudioElement | null = null;

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
}

export async function speakText(
  text: string,
  lang: LangCode,
  settings: VerbaSettings,
  onEnd?: () => void
): Promise<void> {
  const clean = text.trim();
  if (!clean) {
    onEnd?.();
    return;
  }
  stopSpeaking();

  const cacheKey = `${settings.voiceBackend}:${lang}:${clean}`;
  const cachedUrl = audioBlobCache.get(cacheKey);
  if (cachedUrl) {
    return playAudioUrl(cachedUrl, settings.voiceSpeed, settings.voiceVolume, onEnd);
  }

  // 1. Local speech server (Kokoro-FastAPI / AllTalk OpenAI-compatible TTS endpoint)
  if (settings.voiceBackend === 'local_server' && settings.localVoiceServerUrl) {
    try {
      const base = settings.localVoiceServerUrl.replace(/\/+$/, '');
      const res = await fetch(`${base}/v1/audio/speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'kokoro',
          input: clean,
          voice: 'af_heart',
          speed: settings.voiceSpeed,
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        audioBlobCache.set(cacheKey, url);
        return playAudioUrl(url, 1.0, settings.voiceVolume, onEnd);
      }
    } catch {
      // Fallback to device Web Speech API
    }
  }

  // 2. Cloud Voice (OpenAI / ElevenLabs / Google Cloud TTS)
  if (settings.voiceBackend === 'cloud' && settings.cloudVoiceApiKey) {
    try {
      if (settings.cloudVoiceProvider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${settings.cloudVoiceApiKey}`,
          },
          body: JSON.stringify({
            model: 'tts-1',
            voice: 'alloy',
            input: clean,
            speed: settings.voiceSpeed,
          }),
        });
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          audioBlobCache.set(cacheKey, url);
          return playAudioUrl(url, 1.0, settings.voiceVolume, onEnd);
        }
      } else if (settings.cloudVoiceProvider === 'elevenlabs') {
        const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': settings.cloudVoiceApiKey,
          },
          body: JSON.stringify({
            text: clean,
            model_id: 'eleven_multilingual_v2',
          }),
        });
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          audioBlobCache.set(cacheKey, url);
          return playAudioUrl(url, settings.voiceSpeed, settings.voiceVolume, onEnd);
        }
      } else if (settings.cloudVoiceProvider === 'google') {
        const locale = LANG_MAP[lang]?.speechLocale || lang;
        const res = await fetch(
          `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(settings.cloudVoiceApiKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              input: { text: clean },
              voice: { languageCode: locale },
              audioConfig: { audioEncoding: 'MP3', speakingRate: settings.voiceSpeed },
            }),
          }
        );
        if (res.ok) {
          const data = (await res.json()) as { audioContent?: string };
          if (data?.audioContent) {
            const url = `data:audio/mp3;base64,${data.audioContent}`;
            audioBlobCache.set(cacheKey, url);
            return playAudioUrl(url, 1.0, settings.voiceVolume, onEnd);
          }
        }
      }
    } catch {
      // Fallback to device Web Speech API
    }
  }

  // 3. Built-in Device Web Speech API
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return new Promise((resolve) => {
      const utter = new SpeechSynthesisUtterance(clean);
      const locale = LANG_MAP[lang]?.speechLocale || lang;
      utter.lang = locale;
      utter.rate = Math.max(0.5, Math.min(2.0, settings.voiceSpeed));
      utter.volume = Math.max(0, Math.min(1, settings.voiceVolume));
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.lang.toLowerCase().startsWith(locale.toLowerCase().split('-')[0]));
      if (match) utter.voice = match;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        onEnd?.();
        resolve();
      };
      utter.onend = finish;
      utter.onerror = finish;
      // Safety fallback in headless browsers with no OS audio sink
      setTimeout(finish, Math.max(900, clean.length * 110));
      window.speechSynthesis.speak(utter);
    });
  }

  onEnd?.();
}

function playAudioUrl(url: string, speed: number, volume: number, onEnd?: () => void): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    activeAudio = audio;
    audio.playbackRate = speed;
    audio.volume = volume;
    const finish = () => {
      if (activeAudio === audio) activeAudio = null;
      onEnd?.();
      resolve();
    };
    audio.onended = finish;
    audio.onerror = finish;
    audio.play().catch(finish);
  });
}
