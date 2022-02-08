import React, { useCallback, useEffect, useState } from "react";
import {
  SpeechSegment,
  SpeechProvider,
  useSpeechContext,
} from "@speechly/react-client";
import {
  BigTranscript,
  BigTranscriptContainer,
  PushToTalkButton,
  PushToTalkButtonContainer,
} from "@speechly/react-ui";

type DeviceStates = {
  [device: string]: boolean;
};

type Rooms<T> = {
  [room: string]: T;
};

type AppState = {
  rooms: Rooms<DeviceStates>;
};

const DefaultAppState = {
  rooms: {
    "living room": {
      radio: false,
      television: false,
      lights: false,
    },
    bedroom: {
      radio: false,
      lights: false,
    },
    kitchen: {
      radio: false,
      lights: false,
    },
  },
};

export default function App() {

  return (
    <div className="App">
      <SpeechProvider
        appId="302d22c1-b365-49d2-9fad-2fbaf7cd1951"
        language="en-TH"
      >
        <BigTranscriptContainer>
          <BigTranscript />
        </BigTranscriptContainer>
        <SpeechlyApp />
        <PushToTalkButtonContainer>
          <PushToTalkButton captureKey=" " />
        </PushToTalkButtonContainer>
      </SpeechProvider>
    </div>
  );
}

function SpeechlyApp() {
  const { segment } = useSpeechContext();
  const [tentativeAppState, setTentativeAppState] = useState<AppState>(DefaultAppState);
  const [appState, setAppState] = useState<AppState>(DefaultAppState);
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>();
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>();

  // This effect is fired whenever there's a new speech segment available
  useEffect(() => {
    // GET request using fetch inside useEffect React hook
    fetch('http://localhost:3001/api/house')
        .then(response => response.json())
        .then(data => console.log( data));

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);
  useEffect(() => {

    if (segment) {
      let alteredState = alterAppState(segment);
      // Set current app state
      setTentativeAppState(alteredState);
      if (segment.isFinal) {
        // Store the final app state as basis of next utterance
        setAppState(alteredState);
        setSelectedRoom(undefined);
        setSelectedDevice(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]);

  // Create a modified app state by applying the speech segment info to the base state
  const alterAppState = useCallback(
    (segment: SpeechSegment): AppState => {
      switch (segment.intent.intent) {
        case "turn_on":
        case "turn_off":
          // Get values for room and device entities. Note that values are UPPER CASE by default.
          const room = segment.entities
            .find((entity) => entity.type === "room")
            ?.value.toLowerCase();
          console.log(room);
          const device = segment.entities
            .find((entity) => entity.type === "device")
            ?.value.toLowerCase();
          setSelectedRoom(room);
          setSelectedDevice(device);
          // Set desired device powerOn based on the intent
          const isPowerOn = segment.intent.intent === "turn_on";
          if (
            room &&
            device &&
            appState.rooms[room] !== undefined &&
            appState.rooms[room][device] !== undefined
          ) {
            return {
              ...appState,
              rooms: {
                ...appState.rooms,
                [room]: { ...appState.rooms[room], [device]: isPowerOn },
              },
            };
          }
          break;
      }
      return appState;
    },
    [appState]
  );

  // Render the app state as outlined boxes representing rooms with devices in them
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        flexWrap: "wrap",
      }}
    >
      {Object.keys(appState.rooms).map((room) => (
        <div
          key={room}
          style={{
            width: "12rem",
            height: "12rem",
            padding: "0.5rem",
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: selectedRoom === room ? "cyan" : "black",
          }}
        >
          {room}
          <div
            style={{
              paddingTop: "1rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              alignItems: "start",
              flexWrap: "wrap",
            }}
          >
            {Object.keys(appState.rooms[room]).map((device) => (
              <div
                key={device}
                style={{
                  flexBasis: "5rem",
                  margin: "0.2rem",
                  padding: "0.2rem",
                  background:
                    selectedDevice === device &&
                    (!selectedRoom || selectedRoom === room)
                      ? "cyan"
                      : "lightgray",
                }}
              >
                {device}
                <br />
                {appState.rooms[room][device] ? (
                  tentativeAppState.rooms[room][device] ? (
                    <span style={{ color: "green" }}>On</span>
                  ) : (
                    <span style={{ color: "red" }}>Turning off...</span>
                  )
                ) : !tentativeAppState.rooms[room][device] ? (
                  <span style={{ color: "red" }}>Off</span>
                ) : (
                  <span style={{ color: "green" }}>Turning on...</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
