import React, { useEffect, useState } from "react";

import {
  Col,
  Row,
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import AddDeviceForm from "../../components/AddDevice/AddDevice.js";
import upgradeImage from "../../assets/dashboard/upgradeImage.svg";

import s from "./HomePage.module.scss";

const HomePage = () => {
  const [checkboxes, setCheckboxes] = useState([true, false])
  const [tableDropdownOpen, setTableMenuOpen] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [isShowAddDevice, setIsShowAddDevice] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/house')
      .then(response => response.json())
      .then(data => setDeviceList(data.results));
  }, []);

  const saveSwitchStatus = (item) => {
    fetch('http://localhost:3001/api/device/command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomName: item.room,
        deviceName: item.device_name, 
        status: item.status
      }),
    })
      .then((res) => {res.json();})
      .catch((err) => console.log(err))
  }

  const toggleSwitch = (name, room, status) => {
    let updateDeviceList = deviceList.map((item) => {
      if(item.device_name !== name || item.room !== room) {
        item.status=item.status
      }
      else if(item.device_name === name && item.room === room && status === "on") {
        item.status="off"
        saveSwitchStatus(item)
      }
      else {
        item.status="on"
        saveSwitchStatus(item)
      }
      return item
    });
    setDeviceList(updateDeviceList)
  }

  const toggleCheckbox = (id) => {
    setCheckboxes(checkboxes => checkboxes
      .map((checkbox, index) => index === id ? !checkbox : checkbox ))
  }

  const tableMenuOpen = () => {
    setTableMenuOpen(!tableDropdownOpen);
  }

  const handleAddDevice = () => {
    setIsShowAddDevice((isShowAddDevice) => !isShowAddDevice);
  };

  const updateDevice = (deviceInfo) => {
    setDeviceList([...deviceList, deviceInfo]);
  };

  return (
    <div>
      <div>
        <AddDeviceForm isShowAddDevice={isShowAddDevice} handleAddDevice={handleAddDevice} updateDevice={updateDevice}/>
      </div >
      <Row>
        <Col className="pr-grid-col" xs={12} lg={8}>
          <Row className="gutter mb-4">
            <Col xs={12}>
              <Widget className="widget-p-none">
                <div className="d-flex flex-wrap align-items-center justify-content-center">
                  <div className="d-flex flex-column align-items-center col-12 col-xl-6 p-sm-4">
                    <p className="headline-1">Upgrade your plan</p>
                    <p className="body-3">So how did the classical Latin become so </p>
                    <div className="d-flex justify-content-between my-4">
                      <Button className="rounded-pill mr-3" color="primary">Go Premium</Button>
                      <Button className="rounded-pill body-3" outline color="dark">Try for free</Button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center col-12 col-xl-6">
                    <img className="p-1 img-fluid" src={upgradeImage} alt="..." />
                  </div>
                </div>
              </Widget>
            </Col>
          </Row>
          <Row className="gutter">
            {deviceList.map(item => (
              <Col xs={6} sm={6} xl={3} className="mb-4">
                <Widget className="widget-p-sm">
                  <div className={s.smallWidget}>
                    <div className="d-flex">
                      {item.status === "off" ? (
                        <div>
                          <button className={s.buttonOff} onClick={() => {toggleSwitch(item.device_name, item.room, item.status);}}><i class="eva eva-power-outline" aria-hidden="true"></i></button>
                        </div>
                      ) : (
                      <div>
                        <button className={s.buttonOn} onClick={() => {toggleSwitch(item.device_name, item.room, item.status);}}><i class="eva eva-power-outline" aria-hidden="true"></i></button> 
                      </div>
                      )}
                      <div className="d-flex flex-column ml-2">
                        <p className="headline-3 text-capitalize">{item.device_name}</p>
                        <span className="body-3 muted">{item.room}</span>
                        <p className="label">STATUS: <span className="font-weight-bold text-uppercase">{item.status}</span></p>
                      </div>
                    </div>
                  </div>
                </Widget>
              </Col>
            ))}
            <Col xs={6} sm={6} xl={3} className="mb-4">
              <Widget className="widget-p-sm">
                <div className={s.smallWidget}>
                  <div className="d-flex">
                    <div className="d-flex flex-column ml-2">
                      <div>  
                        <Button color="primary" onClick={handleAddDevice}>Add device</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Widget>
            </Col>
          </Row>
        </Col>
        <Col className="mt-4 mt-lg-0 pl-grid-col" xs={12} lg={4}>
          <Widget className="widget-p-lg">
            <p className="headline-3">Timer</p>
            <div className={`mt-3 ${s.widgetBlock}`}>
              <div className={s.widgetBody}>
                <div className="checkbox checkbox-primary">
                  <input
                    id="checkbox0"
                    type="checkbox"
                    className="styled"
                    checked={checkboxes[0]}
                    onChange={() => toggleCheckbox(0)}
                  />
                  <label htmlFor="checkbox0" />
                </div>
                <div className="d-flex flex-column ml-3">
                  <p className="body-1 text-capitalize">Light /<span className="label"> bedroom</span></p>
                  <p className="label mb-0 muted">ON-OFF</p>
                  <p className="body-2">09.00 - 12.00</p>
                </div>
                <Dropdown 
                  className="d-flex ml-auto p-2 " 
                  nav
                  isOpen={tableDropdownOpen}
                  toggle={() => tableMenuOpen()}
                >
                  <DropdownToggle nav>
                    <i className={'eva eva-more-vertical-outline'}/>
                  </DropdownToggle>
                  <DropdownMenu >
                    <DropdownItem>
                      <div>Edit</div>
                    </DropdownItem>
                    <DropdownItem>
                      <div>Delete</div>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </Widget>
        </Col>
      </Row>
    </div>
  )
}

export default HomePage;
