import { useState, useEffect, useCallback } from 'react';

interface PreloaderState {
  loaded: boolean;
  progress: number;
  images: HTMLImageElement[];
}

export function useImagePreloader(imagePaths: string[]): PreloaderState {
  const [state, setState] = useState<PreloaderState>({
    loaded: false,
    progress: 0,
    images: [],
  });

  const preload = useCallback(async () => {
    const total = imagePaths.length;
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = new Array(total);

    const promises = imagePaths.map((src, index) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          loadedImages[index] = img;
          setState(prev => ({
            ...prev,
            progress: loadedCount / total,
          }));
          resolve(img);
        };
        img.onerror = reject;
      });
    });

    try {
      await Promise.all(promises);
      setState({
        loaded: true,
        progress: 1,
        images: loadedImages,
      });
    } catch (err) {
      console.error('Image preload error:', err);
      // Still mark as loaded so the UI doesn't hang
      setState(prev => ({
        ...prev,
        loaded: true,
      }));
    }
  }, [imagePaths]);

  useEffect(() => {
    if (imagePaths.length > 0) {
      preload();
    }
  }, [preload]);

  return state;
}
