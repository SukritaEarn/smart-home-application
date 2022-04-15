import React from "react";

import {
  Col,
  Row,
} from "reactstrap";
import Widget from "../../components/Widget/Widget";
import EnergyChart from "./components/EnergyChart";
import HourChart from "./components/HourChart";

const Charts = () => {
  return (
    <div>
      <Row>
        <Col className="pr-grid-col" xs={12} lg={6}>
          <Row>
            <Col>
              <Widget className="widget-p-md">
                <div className="headline-2 mb-3">Electricity consumption</div>
                <EnergyChart/>
              </Widget>
            </Col>
          </Row>
        </Col>
        <Col className="pl-grid-col pr-grid-col" xs={12} lg={6}>
          <Row className="gutter mb-4">
            <Col>
              <Widget className="widget-p-md">
                <div className="headline-2 mb-3">Hours of use</div>
                <HourChart/>
              </Widget>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Charts;
