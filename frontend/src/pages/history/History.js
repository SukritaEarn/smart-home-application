import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Col,
  Row,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Badge,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import s from "./History.module.scss";

const Tables = function () {
  const [firstTableCurrentPage, setFirstTableCurrentPage] = useState(0);
  const setFirstTablePage = (e, index) => {
    e.preventDefault();
    setFirstTableCurrentPage(index);
  }

  const [historyList, setHistoryList] = useState([]);
  const pageSize = 7;
  const firstTablePagesCount = Math.ceil(historyList.length / pageSize);

  useEffect(() => {
    fetch('http://localhost:3000/api/history')
        .then(response => response.json())
        .then(data => setHistoryList(data.results));
  }, []);

  const renderHistoryList = historyList
    .sort(function(a,b){ 
      var x = a.datetime > b.datetime? -1:1; 
      return x; 
    })
    .slice(firstTableCurrentPage * pageSize, (firstTableCurrentPage + 1) * pageSize)
    .map((item) => {
      var datetime = new Date(item.datetime);
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var dateString = datetime.toLocaleDateString(undefined, options);
      var timeString = datetime.toLocaleTimeString('en-US');
      if (item.status === "on") {
        return (
          <tr key={uuidv4()}>
            <td className="d-flex align-items-center"><span className="ml-4 text-capitalize">{item.device_name}</span></td>
            <td>{item.room}</td>
            <td>{dateString}</td>
            <td>{timeString}</td>
            <td><Badge color="secondary-green">{item.status}</Badge></td>
          </tr>
        )}
      else {
        return (
          <tr key={uuidv4()}>
            <td className="d-flex align-items-center"><span className="ml-4 text-capitalize">{item.device_name}</span></td>
            <td>{item.room}</td>
            <td>{dateString}</td>
            <td>{timeString}</td>
            <td><Badge color="secondary-red">{item.status}</Badge></td>
          </tr>
        )
      }
    });

  return (
    <div>
      <Col>
        <Row className="mb-4">
          <Col>
            <Widget>
              <div className={s.tableTitle}>
                <div className="headline-2">Recent history</div>
              </div>
              <div className="widget-table-overflow">
                <Table className={`table-striped table-borderless table-hover ${s.statesTable}`} responsive>
                  <thead>
                  <tr>
                    <th className="w-20"><span className="ml-4">DEVICE NAME</span></th>
                    <th className="w-20">ROOM</th>
                    <th className="w-25">DATE</th>
                    <th className="w-20">TIME</th>
                    <th className="w-15">STATUS</th>
                  </tr>
                  </thead>
                  <tbody>
                   {renderHistoryList}
                  </tbody>
                </Table>
                <Pagination className="pagination-borderless" aria-label="Page navigation example">
                  <PaginationItem disabled={firstTableCurrentPage <= 0}>
                    <PaginationLink
                      onClick={e => setFirstTablePage(e, firstTableCurrentPage - 1)}
                      previous
                      href="#top"
                    />
                  </PaginationItem>
                  {[...Array(firstTablePagesCount)].map((page, i) =>
                    <PaginationItem active={i === firstTableCurrentPage} key={i}>
                      <PaginationLink onClick={e => setFirstTablePage(e, i)} href="#top">
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem disabled={firstTableCurrentPage >= firstTablePagesCount - 1}>
                    <PaginationLink
                      onClick={e => setFirstTablePage(e, firstTableCurrentPage + 1)}
                      next
                      href="#top"
                    />
                  </PaginationItem>
                </Pagination>
              </div>
            </Widget>
          </Col>
        </Row>
      </Col>
    </div>
  )
}

export default Tables;
