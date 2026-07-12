import React, { useState, useEffect, useRef, useCallback } from 'react';

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;       // ms per character typed
  deletingSpeed?: number;     // ms per character deleted
  pauseDuration?: number;     // ms to pause when complete before deleting
  loop?: boolean;
  showCursor?: boolean;
  cursorChar?: string;
  cursorClassName?: string;
  oneWay?: boolean;           // if true, type once and stop (never delete)
  triggerInView?: boolean;    // if true, only start typing when visible in viewport
}

export default function Typewriter({
  words,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 1800,
  loop = true,
  showCursor = true,
  cursorChar = '|',
  cursorClassName = 'text-blue-500',
  oneWay = false,
  triggerInView = false,
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [inView, setInView] = useState(!triggerInView);
  const [isPaused, setIsPaused] = useState(() => {
    return !!(window as any).__typewriterPaused;
  });
  
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setElementRef = useCallback((node: HTMLSpanElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (node && triggerInView && !inView) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(node);
      observerRef.current = observer;
    }
  }, [triggerInView, inView]);

  useEffect(() => {
    const handleToggle = () => {
      setIsPaused(!!(window as any).__typewriterPaused);
    };
    window.addEventListener('sylvan-typewriter-toggle', handleToggle);
    return () => {
      window.removeEventListener('sylvan-typewriter-toggle', handleToggle);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 't' || e.key === 'T' || e.key === '†' || e.code === 'KeyT')) {
        e.preventDefault();
        if ((e as any).__sylvanHandled) return;
        (e as any).__sylvanHandled = true;

        (window as any).__typewriterPaused = !(window as any).__typewriterPaused;
        window.dispatchEvent(new CustomEvent('sylvan-typewriter-toggle'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const wordsString = JSON.stringify(words);

  useEffect(() => {
    if (!inView) return;
    const parsedWords = JSON.parse(wordsString) as string[];
    if (parsedWords.length === 0) return;

    const activeWord = parsedWords[currentWordIndex] || '';
    let timer: NodeJS.Timeout;

    if (isPaused) {
      if (currentText === activeWord) {
        if (!isWaiting) {
          setIsWaiting(true);
        }
        return;
      }

      if (isDeleting) {
        setIsDeleting(false);
      }
      if (isWaiting) {
        setIsWaiting(false);
      }

      timer = setTimeout(() => {
        setCurrentText((prev) => {
          const nextText = activeWord.slice(0, prev.length + 1);
          if (nextText === activeWord) {
            setIsWaiting(true);
          }
          return nextText;
        });
      }, typingSpeed);

      return () => clearTimeout(timer);
    }

    if (isWaiting) {
      if (oneWay) {
        // Stop typing and do not delete
        return;
      }
      // Pause at the end of the fully typed word
      timer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timer);
    }

    if (isDeleting) {
      // Deleting character by character
      timer = setTimeout(() => {
        setCurrentText((prev) => {
          const nextText = prev.slice(0, -1);
          if (nextText === '') {
            setIsDeleting(false);
            if (loop) {
              setCurrentWordIndex((prevIndex) => (prevIndex + 1) % parsedWords.length);
            }
          }
          return nextText;
        });
      }, deletingSpeed);
    } else {
      // Typing character by character
      timer = setTimeout(() => {
        setCurrentText((prev) => {
          const nextText = activeWord.slice(0, prev.length + 1);
          if (nextText === activeWord) {
            setIsWaiting(true);
          }
          return nextText;
        });
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, isWaiting, currentWordIndex, wordsString, typingSpeed, deletingSpeed, pauseDuration, loop, oneWay, inView, isPaused]);

  return (
    <span ref={setElementRef} className="inline-block">
      {currentText}
      {showCursor && !isWaiting && (
        <span className={`inline-block ml-0.5 animate-pulse select-none ${cursorClassName}`}>
          {cursorChar}
        </span>
      )}
    </span>
  );
}
