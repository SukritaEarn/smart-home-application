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

const EditTimerForm = ({ isShowEditTimer, handleEditTimer, updateTimer, id, deviceName, deviceRoom, hours, minutes, date, status }) => {

  const [changeTimer, setChangeTimer] = useState({});
  const [timerList, setTimerList] = useState([]);
  

  useEffect(() => {
    fetch('http://localhost:3001/api/all/schedule')
      .then(response => response.json())
      .then(data => setTimerList(data.message));
      console.log(timerList)
  }, []);

  const editTimer = (item) => {
    fetch('http://localhost:3001/api/update/schedule', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        hours: item.hours,
        minutes: item.minutes
      }),
    })
      .then((res) => {res.json();})
      .catch((err) => console.log(err))
  }

  const handleChange = (e) => {
    var timeList = e.target.value.split(':');
    var hours = parseInt(timeList[0])
    var minutes = parseInt(timeList[1])
    setChangeTimer({ ...changeTimer, ['hours']: hours, ['minutes']: minutes});
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
      setChangeTimer({ ...changeTimer, [e.target.name]: status});
    }
    else {
      var date = opts.join(' and ')
      setChangeTimer({ ...changeTimer, [e.target.name]: date});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editTimer(changeTimer);
    handleEditTimer();
    updateTimer(changeTimer);
  }

  return (
    <Modal isOpen={isShowEditTimer} toggle={handleEditTimer} centered>
      <ModalHeader toggle={handleEditTimer}>Edit timer for {deviceRoom} {deviceName}</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3 ml-auto">
                <div className="mb-1">Change time - {hours}:{minutes}</div>
                <Input name="time" placeholder="time placeholder" type="time" onChange={handleChange}/>
              </FormGroup>
            </Col>
            {/* <Col md={6}>
              <FormGroup className="mb-3 ml-auto">
                <div className="mb-1">Change status - {status}</div>
                <Input name="status" type="select" onChange={handleChangeOpts}>
                  <option value={"on"}>
                    ON
                  </option >
                  <option value={"off"}>
                    OFF
                  </option>
                </Input>
              </FormGroup>
            </Col> */}
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>Edit timer</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditTimerForm;