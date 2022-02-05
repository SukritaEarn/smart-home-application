import React from "react";
import { SpeechProvider } from "@speechly/react-client";

ReactDOM.render(
  <React.StrictMode>
    <SpeechProvider appId="YOUR_APP_ID_FROM_SPEECHLY_DASHBOARD">
      <App />
    </SpeechProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
