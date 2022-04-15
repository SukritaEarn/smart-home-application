import React, { useState, useEffect } from 'react';
import { SpeechProvider, useSpeechContext } from '@speechly/react-client';
import speechRecognition from './speechRecognition';

export default function App() {
  return (
    <div className="App">
      <SpeechProvider
        appId="2695c95a-d005-4da8-814a-18e79390a4d8"
        language="en-TH"
      >
        <SpeechlyApp />
      </SpeechProvider>
    </div>
  );
}

function SpeechlyApp() {
  const { speechState, segment, toggleRecording } = useSpeechContext();

  useEffect(() => {
    if (segment) {
      
      if (segment.isFinal) {
        speechRecognition(segment)
      }
    }
  }, [segment]);

  return (
    <div>
      <div className="status">{speechState}</div>
      {segment ? (
        <div className="segment">
          {segment.words.map((w) => w.value).join(' ')}
        </div>
      ) : null}
      <div className="mic-button">
        <button onClick={toggleRecording}>Record</button>
      </div>
    
    </div>
  );
}
