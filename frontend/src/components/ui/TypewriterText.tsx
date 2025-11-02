"use client";

import Typewriter from "typewriter-effect";

interface TypewriterTextProps {
  words: string[];
  className?: string;
}

export function TypewriterText({ words, className }: TypewriterTextProps) {
  return (
    <span className={className}>
      <Typewriter
        options={{
          strings: words,
          autoStart: true,
          loop: true,
          deleteSpeed: 30,
          delay: 150,
          cursor: "|",
        }}
      />
    </span>
  );
}

