import React, { useState, useEffect, useRef } from 'react';

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
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleToggle = () => {
      setIsPaused(!!(window as any).__typewriterPaused);
    };
    window.addEventListener('sylvan-typewriter-toggle', handleToggle);
    return () => {
      window.removeEventListener('sylvan-typewriter-toggle', handleToggle);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 't' || e.key === 'T')) {
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

  useEffect(() => {
    if (!triggerInView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, [triggerInView]);

  useEffect(() => {
    if (!inView || isPaused) return;
    if (words.length === 0) return;

    const activeWord = words[currentWordIndex] || '';
    let timer: NodeJS.Timeout;

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
              setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
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
  }, [currentText, isDeleting, isWaiting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration, loop, oneWay, inView, isPaused]);

  return (
    <span ref={elementRef} className="inline-block">
      {currentText}
      {showCursor && !isWaiting && (
        <span className={`inline-block ml-0.5 animate-pulse select-none ${cursorClassName}`}>
          {cursorChar}
        </span>
      )}
    </span>
  );
}
