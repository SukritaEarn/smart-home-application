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
import SetTimerForm from "../../components/Timer/SetTimer.js";
import EditTimerForm from "../../components/Timer/EditTimer.js";
import upgradeImage from "../../assets/dashboard/upgradeImage.svg";
import sunIcon from "../../assets/sun.png";
import moonIcon from "../../assets/moon.png";

import s from "./HomePage.module.scss";

const HomePage = ()  => {
  const [tableDropdownOpen, setTableMenuOpen] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [timerList, setTimerList] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState(null);
  const [timerOptions, setTimerOptions] = useState(null);
  const [timerEditOptions, setTimerEditOptions] = useState(null);
  const [timerDelOptions, setTimerDelOptions] = useState(null);
  const [isShowAddDevice, setIsShowAddDevice] = useState(false);
  const [isShowSetTimer, setIsShowSetTimer] = useState(false);
  const [isShowEditTimer, setIsShowEditTimer] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/house')
      .then(response => response.json())
      .then(data => setDeviceList(data.results));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/all/schedule')
      .then(response => response.json())
      .then(data => setTimerList(data.message));
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

  const deleteTimer = (id) => {
    fetch('http://localhost:3001/api/delete/schedule', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id
      }),
    })
      .then((res) => {res.json();})
      .catch((err) => console.log(err))
  }

  const renderIcon = (hours) => {
    if ( hours > 3 && hours < 17 )
        return (<img className={s.icon} src={sunIcon} alt="morning" />);
    else
        return (<img className={s.icon} src={moonIcon} alt="moon" />);
  }

  const renderHourString = (hour) => {
    if (hour < 10) {
      return hour = `0${hour.toString()}`
    }
    return hour.toString()
  }

  const renderMinuteString = (min) => {
    if (min < 10) {
      return min = `0${min.toString()}`
    }
    return min.toString()
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

  const handleTimerSelect = (e, index) => {
    setTimerOptions(index)
    setTableMenuOpen(!tableDropdownOpen);
  }

  const handleAddDevice = () => {
    setIsShowAddDevice((isShowAddDevice) => !isShowAddDevice);
  };

  const handleDeviceSelect = (e, index) => {
    setDeviceOptions(index)
    setIsShowSetTimer((isShowSetTimer) => !isShowSetTimer);
  };

  const handleSetTimer = () => {
    setIsShowSetTimer((isShowSetTimer) => !isShowSetTimer);
  };

  const handleEditTimerSelect = (e, index) => {
    setTimerEditOptions(index)
    setIsShowEditTimer((isShowEditTimer) => !isShowEditTimer);
  };

  const handleEditTimer = () => {
    setIsShowEditTimer((isShowEditTimer) => !isShowEditTimer);
  };

  const handleDelTimer = (e, index) => {
    setTimerDelOptions(index)
  };

  // const useUpdateDeviceListEffect = () => useEffect(() => {
  //   fetch('http://localhost:3001/api/house')
  //     .then(response => response.json())
  //     .then(data => setDeviceList(data.results));
  // }, [deviceList]);

  // const useUpdateTimerListEffect = () => useEffect(() => {
  //   fetch('http://localhost:3001/api/all/schedule')
  //     .then(response => response.json())
  //     .then(data => setTimerList(data.message));
  // }, [timerList]);

  const updateDevice = (deviceInfo) => {
    setDeviceList([...deviceList, deviceInfo]);
  };

  const updateTimer = (timerInfo) => {
    setTimerList([...timerList, timerInfo]);
  };

  return (
    <div>
      <div>
        <AddDeviceForm isShowAddDevice={isShowAddDevice} handleAddDevice={handleAddDevice} updateDevice={updateDevice}/>
      </div >
      <Row>
        <Col className="pr-grid-col" xs={12} lg={8}>
          {/* <Row className="gutter mb-4">
            <Col xs={12}>
              <Widget className="widget-p-none"> */}
                {/* <div className="d-flex flex-wrap align-items-center justify-content-center">
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
                </div> */}
              {/* </Widget>
            </Col>
          </Row> */}
          <Row className="gutter">
            {deviceList.map((item, index) => (
              <Col xs={7} sm={7} xl={4} className="mb-4">
                <Widget className="widget-p-sm">
                  <button className={`${s.buttonSetting} float-right`} onClick={(e) => handleDeviceSelect(e, index)}><i className={'eva eva-settings-2-outline'}/></button>
                  <SetTimerForm isShowSetTimer={deviceOptions === index ? isShowSetTimer : null} handleSetTimer={handleSetTimer} updateTimer={updateTimer} deviceName={item.device_name} deviceRoom={item.room}/>
                  <div className={s.smallWidget}>
                    <div className="d-flex ml-2">
                      {item.status === "off" ? (
                        <div>
                          <button className={s.buttonOff} onClick={() => {toggleSwitch(item.device_name, item.room, item.status);}}><i class="eva eva-power-outline" aria-hidden="true"></i></button>
                        </div>
                      ) : (
                      <div>
                        <button className={s.buttonOn} onClick={() => {toggleSwitch(item.device_name, item.room, item.status);}}><i class="eva eva-power-outline" aria-hidden="true"></i></button> 
                      </div>
                      )}
                      <div className="d-flex flex-column ml-3">
                        <p className="headline-3 text-capitalize">{item.device_name}</p>
                        <span className="body-3 muted">{item.room}</span>
                        <p className="label">STATUS: <span className="font-weight-bold text-uppercase">{item.status}</span></p>
                      </div>
                    </div>
                  </div>
                </Widget>
              </Col>
            ))}
            <Col xs={7} sm={7} xl={4} className="mb-4 d-flex justify-content-center">
              <div className={s.addWidget}>
                <div className={`${s.addIcon} d-flex justify-content-between`}>
                  <Button color="primary" onClick={handleAddDevice}><div className={s.addButton}>Add device<i className={'eva eva-plus-circle-outline'}/></div></Button>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col className="mt-4 mt-lg-0 pl-grid-col" xs={12} lg={4}>
          <Widget className="widget-p-lg">
            <p className="headline-3">Timer</p>
            {timerList.map((item, index) => (
              <div className={`mt-3 ${s.widgetBlock}`}>
                <div className={s.widgetBody}>
                  <div className="d-flex">
                    {renderIcon(item.hours)}
                  </div>
                  <div className="d-flex flex-column ml-3">
                    <p className="body-3 text-capitalize">{item.deviceName} -<span className="body-3"> {item.room}</span></p>
                    <p className="label mb-0 muted text-uppercase">{item.status} <span className="label muted text-lowercase"> {item.date}</span></p>
                    <p className="body-2">{renderHourString(item.hours)}:{renderMinuteString(item.minutes)}</p>
                    
                  </div>
                  <Dropdown
                    className="d-flex ml-auto p-2 " 
                    nav
                    isOpen={timerOptions === index ? tableDropdownOpen : null}
                    toggle={(e) => handleTimerSelect(e, index)}
                  >
                    <DropdownToggle nav>
                      <i className={'eva eva-more-vertical-outline'}/>
                    </DropdownToggle>
                    <DropdownMenu >
                      <DropdownItem>
                        <div onClick={(e) => handleEditTimerSelect(e, index)}>Edit</div>
                        <EditTimerForm isShowEditTimer={timerEditOptions === index ? isShowEditTimer : null} handleEditTimer={handleEditTimer} updateTimer={updateTimer} id={item.id} deviceName={item.deviceName} deviceRoom={item.deviceRoom} hours={item.hours} minutes={item.minutes} date={item.date} status={item.status}/>
                      </DropdownItem>
                      <DropdownItem>
                        <div onClick={(e)=> handleDelTimer(e, index)} onChange={timerDelOptions === index ? deleteTimer(item.id) : null}>Delete</div>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            ))}
          </Widget>
        </Col>
      </Row>
    </div>
  )
}

export default HomePage;
