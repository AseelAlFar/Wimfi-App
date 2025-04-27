import React, { useState } from 'react';
import { saveMemory, queryMemory } from '../firebase/firebase';

const VoiceListener = () => {
  const [output, setOutput] = useState('Tap to speak to Wimfi');

  const startListening = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setOutput(`Heard: "${transcript}"`);

      if (transcript.includes("hey wimfi")) {
        if (transcript.includes("where did i put")) {
          const item = transcript.split("where did i put")[1]?.trim().split(" ")[0];
          const location = await queryMemory(item);
          setOutput(location ? `Your ${item} is in the ${location}.` : `I don't remember where your ${item} is.`);
        } else if (transcript.includes("i put my")) {
          const parts = transcript.split("i put my")[1]?.split(" in ");
          const item = parts?.[0]?.trim();
          const location = parts?.[1]?.trim();
          if (item && location) {
            await saveMemory(item, location);
            setOutput(`Got it. Your ${item} is in the ${location}.`);
          }
        }
      }
    };

    recognition.start();
  };

  return (
    <div>
      <button onClick={startListening}>🎤 Talk to Wimfi</button>
      <p>{output}</p>
    </div>
  );
};

export default VoiceListener;
