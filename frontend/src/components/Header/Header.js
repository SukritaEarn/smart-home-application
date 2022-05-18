import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { useSpeechContext } from '@speechly/react-client';
import speechRecognition from "../../speechRecognition";

import s from "./Header.module.scss";
import "animate.css";


const Header = (props) => {

  const { speechState, segment, toggleRecording } = useSpeechContext();

  useEffect(() => {
    if (segment) {
      if (segment.isFinal) {
        speechRecognition(segment)
      }
    }
  }, [segment]);

  let isMicReady;
  if (speechState == 'Idle') {
    isMicReady = true;
  } else {
    isMicReady = false;
  };

  return (
    <div className="d-flex flex-row">
      <div className={s.header}>
        <div>
          {!isMicReady ? (
            <button className={s.button} onClick={toggleRecording}><i class="fa fa-microphone" aria-hidden="true"></i></button>
          ) : 
          <button className={s.buttonPrepare} onClick={toggleRecording}><i class="fa fa-microphone" aria-hidden="true"></i></button> }
        </div>
      <div>
      <div className={s.speechWrap} >
        {isMicReady ? (
          <div className="status">Click to speak</div>
        ) : 
         null}
        {segment ? (
          <div className="segment">
            {segment.words.map((w) => w.value).join(' ')}
          </div>
        ) : null} </div>
        </div>
      </div>
    </div>
  )
}

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  sidebarOpened: PropTypes.bool,
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
  };
}

export default withRouter(connect(mapStateToProps)(Header));

