import React, {useState,useEffect} from "react";
import axios from "axios";
import {
  Col,
  Row,
} from "reactstrap";
import Widget from "../../components/Widget/Widget";
import EnergyChart from "./components/EnergyChart";
import HourChart from "./components/HourChart";

const Charts = () => {
  const [hours,setHours] = useState("")
  const [watts,setWatts] = useState("")
  const [ready,setReady] = useState(false);

  useEffect( ()=>{
    async function fetchData() {
      const res = await axios.get('http://localhost:3001/api/device/usage')
      let x=[],y=[];
      res.data.result.forEach((ele)=>{
        x.push({
          data:ele.hoursInWeek,
          name:`${ele.name}:${ele.room}`
        })
        y.push({
          data:ele.wattsInWeek,
          name:`${ele.name}:${ele.room}`
        })
      })
      setHours(x)
      setWatts(y)
      setReady(true)
    }
    fetchData();
  },[])
  if(!ready ){
    return <div>Loading...</div>
  }
  return (
    <div>
      <Row>
        <Col className="pr-grid-col" xs={12} lg={6}>
          <Row>
            <Col>
              <Widget className="widget-p-md">
                <div className="headline-2 mb-3">Electricity consumption</div>
                <EnergyChart data={watts}/>
              </Widget>
            </Col>
          </Row>
        </Col>
        <Col className="pl-grid-col pr-grid-col" xs={12} lg={6}>
          <Row className="gutter mb-4">
            <Col>
              <Widget className="widget-p-md">
                <div className="headline-2 mb-3">Hours of use</div>
                <HourChart data={hours}/>
              </Widget>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Charts;
