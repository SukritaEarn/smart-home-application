import React, { useEffect, useState }  from "react";

import {
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Form, 
  FormGroup,
  Input,
  Col,
  Row
} from "reactstrap";

const SetTimerForm = ({ isShowSetTimer, handleSetTimer, updateTimer, deviceName, deviceRoom }) => {

  const [newTimer, setNewTimer] = useState({});
  const [timerList, setTimerList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/all/schedule')
      .then(response => response.json())
      .then(data => setTimerList(data.message));
      console.log(timerList)
  }, []);

  const createTimer = (item) => {
    fetch('http://localhost:3001/api/device/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceName: deviceName,
        roomName: deviceRoom, 
        hours: item.hours,
        minutes: item.minutes,
        status: item.status,
        date: item.date
      }),
    })
      .then((res) => {res.json();})
      .catch((err) => console.log(err))
  }

  const handleChange = (e) => {
    var timeList = e.target.value.split(':');
    var hours = parseInt(timeList[0])
    var minutes = parseInt(timeList[1])
    setNewTimer({ ...newTimer, ['hours']: hours, ['minutes']: minutes});
  };

  const handleChangeOpts = (e) => {
    let opts = [], opt;
    for (let i = 0, len = e.target.options.length; i < len; i++) {
      opt = e.target.options[i];
      if (opt.selected) {
          opts.push(opt.value);
      }
  }
    if (e.target.name === 'status') {
      var status = opts[0]
      setNewTimer({ ...newTimer, [e.target.name]: status});
    }
    else {
      var date = opts.join(' and ')
      setNewTimer({ ...newTimer, [e.target.name]: date});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createTimer(newTimer);
    handleSetTimer();
    updateTimer(newTimer);
  }

  return (
    <Modal isOpen={isShowSetTimer} toggle={handleSetTimer} centered>
      <ModalHeader toggle={handleSetTimer}>Set timer for {deviceRoom} {deviceName}</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3 ml-auto">
                <div className="mb-1">Select time</div>
                <Input name="time" placeholder="time placeholder" type="time" onChange={handleChange}/>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3 ml-auto">
                <div className="mb-1">Select status</div>
                <Input name="status" type="select" onChange={handleChangeOpts}>
                  <option value={"on"}>
                    ON
                  </option >
                  <option value={"off"}>
                    OFF
                  </option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <div className="mb-1">Select date</div>
            <Input multiple name="date" type="select" onChange={handleChangeOpts}>
              <option value={"everyday"}>
                Everyday
              </option>
              <option value={"sunday"}>
                Sunday
              </option>
              <option value={"monday"}>
                Monday
              </option>
              <option value={"tuesday"}>
                Tuesday
              </option>
              <option value={"wednesday"}>
                Wednesday
              </option>
              <option value={"thursday"}>
                Thursday
              </option>
              <option value={"friday"}>
                Friday
              </option>
              <option value={"saturday"}>
                Saturday
              </option>
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>Add timer</Button>
      </ModalFooter>
    </Modal>
  );
};

export default SetTimerForm;