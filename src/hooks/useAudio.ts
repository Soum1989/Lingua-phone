import { useState, useRef, useCallback } from 'react';
import { VoiceRecording } from '../types';

export const useAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support audio recording');
      }

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });

      // Check if MediaRecorder is supported
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        console.warn('audio/webm not supported, falling back to default');
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : undefined
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setIsRecording(false);
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Microphone access denied. Please allow microphone access and try again.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotSupportedError') {
          throw new Error('Your browser does not support audio recording.');
        } else {
          throw new Error('Error accessing microphone. Please check your microphone settings.');
        }
      }
      throw error;
    }
  }, []);

  const stopRecording = useCallback((): Promise<VoiceRecording | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        try {
          const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          resolve({
            blob: audioBlob,
            url: audioUrl,
            duration: 0 // Would need to calculate actual duration
          });
          
          setIsRecording(false);
          
          // Clean up the stream
          if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          }
        } catch (error) {
          console.error('Error processing recording:', error);
          resolve(null);
          setIsRecording(false);
        }
      };

      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error('Error stopping recording:', error);
        resolve(null);
        setIsRecording(false);
      }
    });
  }, []);

  const playAudio = useCallback((url: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setIsPlaying(false);
      };
      audio.onpause = () => setIsPlaying(false);
      
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    } catch (error) {
      console.error('Error setting up audio playback:', error);
      setIsPlaying(false);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  return {
    isRecording,
    isPlaying,
    startRecording,
    stopRecording,
    playAudio,
    stopAudio
  };
};