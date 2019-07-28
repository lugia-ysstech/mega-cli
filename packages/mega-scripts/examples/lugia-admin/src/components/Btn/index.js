import React from 'react';
import { Button } from '@lugia/lugia-web';
import i from '@/assets/dididi.jpg';

export default function Btn({ text, onClick }) {
  return (
    <div onClick={onClick}>
      {text}
      <Button />
    </div>
  );
}

console.log(i);
