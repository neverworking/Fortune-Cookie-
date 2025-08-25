import React, { useEffect, useState } from 'react';

export default function Typewriter({ text = '', speed = 25, onDone }) {
  const [out, setOut] = useState('');

  useEffect(() => {
    let i = 0;
    setOut('');
    if (!text) {
      onDone && onDone();
      return;
    }
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone && onDone();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, onDone]);

  return <span aria-live="polite">{out}</span>;
}
