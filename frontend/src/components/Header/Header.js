import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { SpeechProvider, useSpeechContext } from '@speechly/react-client';

import {
  Navbar,
  InputGroupAddon,
  InputGroup,
  Input,
  Form,
  FormGroup,
  Button,
  Spinner,
} from "reactstrap";

import s from "./Header.module.scss";
import "animate.css";

const Header = (props) => {

  const { speechState, segment, toggleRecording } = useSpeechContext();
  const [lastSegment, setLastSagment] = useState('');

  useEffect(() => {
    if (segment) {
      if (segment.isFinal) {
        if(segment.intent.intent === 'turn_on'){
          const devices_on = segment.entities.map(({value})=> value);
          console.log('on',devices_on)
        }
        else if(segment.intent.intent === 'turn_off'){
          console.log('off',segment)
        }
        else if(segment.intent.intent === 'set_timer'){
          console.log('set_timer',segment)
          const d = segment.entities.find(({ type }) => type === 'devices' )
          const t = segment.entities.find(({ type }) => type === 'time' )
          console.log(d,t)
        }
        // for (let [i, v] of segment.words.entries()) {
        //   if (v.value === 'TURN') {
        //     if(segment.words[i + 1].value === 'ON'){
        //       console.log('on', segment)
        //     }else{
        //       console.log('off')
        //     }
        //   }
        // }
      }
    }
  }, [segment]);

  let isMicReady;
  if (speechState != 'Recording') {
    isMicReady = false;
  } else {
    isMicReady = true;
  };

  return (
    <div className="d-flex flex-row">
      <div className={s.header}>
        <div>
          {isMicReady ? (
            <button className={s.button} onClick={toggleRecording}><i class="fa fa-microphone" aria-hidden="true"></i></button>
          ) : 
          <button className={s.buttonPrepare} onClick={toggleRecording}><i class="fa fa-microphone" aria-hidden="true"></i></button> }
        </div>
      <div>
      <div className={s.speechWrap} >
        {isMicReady ? (
          null
        ) : 
          <div className="status">Click to speak</div>}
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

