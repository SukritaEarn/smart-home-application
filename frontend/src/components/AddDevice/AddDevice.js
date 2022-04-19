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

const AddDeviceForm = ({ isShowAddDevice, handleAddDevice, updateDevice }) => {

  const initialDeviceData = Object.freeze({
    deviceName: "",
    roomName: "",
    status: "on",
    volt: 1,
    url: "",
  });

  const [newDevice, setNewDevice] = useState({});

  const addNewDevice = (item) => {
    fetch('http://localhost:3001/api/house/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomName: item.roomName,
        deviceName: item.deviceName, 
        status: "on",
        volt: 1,
        url: item.url,
      }),
    })
      .then((res) => {res.json();})
      .catch((err) => console.log(err))
  }

  const handleChange = (e) => {
    setNewDevice({ ...newDevice, [e.target.name]: e.target.value});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addNewDevice(newDevice);
    handleAddDevice();
    console.log(newDevice)
    updateDevice(newDevice)
  }

  return (
    <Modal size="lg" isOpen={isShowAddDevice} toggle={handleAddDevice} centered>
      <ModalHeader toggle={handleAddDevice}>Add Device</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3 ml-auto">
                <div className="mb-1">Device name</div>
                <Input name="deviceName" placeholder="Device name" onChange={handleChange}/>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3 ml-auto">
                <div className="mb-1">Room</div>
                <Input name="roomName" placeholder="Room" onChange={handleChange}/>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <div className="mb-1">Url</div>
            <Input name="url" placeholder="IP Address e.g., 192.xxx.x.x" type="url" onChange={handleChange}/>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>Add</Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddDeviceForm;