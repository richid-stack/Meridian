'use client';

import { useEffect, useState } from 'react';

export interface GreetingProps {
  morning: string; afternoon: string; evening: string; initial: string; dateText: string;
}

function pick(hour: number, g: GreetingProps): string {
  if (hour < 12) return g.morning;
  if (hour < 18) return g.afternoon;
  return g.evening;
}

/** Greets by the reader's own clock (the server doesn't know their time zone). */
export function Greeting(props: GreetingProps) {
  const [text, setText] = useState(props.initial);
  useEffect(() => setText(pick(new Date().getHours(), props)), [props]);
  return (
    <>
      <div style={{ padding: '26px 0 4px', fontSize: 14, color: 'var(--mute)' }}>{props.dateText}</div>
      <h1 style={{ font: '500 clamp(34px, 9vw, 48px)/1.05 var(--font-read)', letterSpacing: '-.02em', margin: '0 0 18px' }}>{text}</h1>
    </>
  );
}
