import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  metaKey: boolean = false
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (metaKey && !event.metaKey) return;
      if (!metaKey && event.metaKey) return;
      
      if (event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, metaKey]);
} 