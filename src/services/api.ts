const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ChatResponse {
  message: string;
  translatedMessage: string;
  detectedLanguage: string;
  audioUrl?: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage: string;
  confidence: number;
}

export interface PronunciationScore {
  accuracy: number;
  fluency: number;
  completeness: number;
  overall: number;
  feedback: string;
}

class ApiService {
  async sendMessage(message: string, targetLanguage: string, userLanguage: string): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        targetLanguage,
        userLanguage
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<TranslationResponse> {
    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to translate text');
    }

    return response.json();
  }

  async speechToText(audioBlob: Blob, language: string): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('language', language);

    const response = await fetch(`${API_BASE_URL}/speech/speech-to-text`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to convert speech to text');
    }

    const data = await response.json();
    return data.text;
  }

  async textToSpeech(text: string, language: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/speech/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        language
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to convert text to speech');
    }

    const data = await response.json();
    return data.audioUrl;
  }

  async scorePronunciation(audioBlob: Blob, expectedText: string, language: string): Promise<PronunciationScore> {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('expectedText', expectedText);
    formData.append('language', language);

    const response = await fetch(`${API_BASE_URL}/pronunciation`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to score pronunciation');
    }

    return response.json();
  }
}

export const apiService = new ApiService();