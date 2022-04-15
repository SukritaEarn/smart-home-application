// -- React and related libs
import React, { useState } from "react";
import { Link } from "react-router-dom";

// -- Reactstrap Imports
import {
  Breadcrumb,
  BreadcrumbItem,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown
} from "reactstrap";

// -- Third Party Libs
import { v4 as uuidv4 } from "uuid";

// -- Component Styles
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import s from "./Breadcrumbs.module.scss";

const Breadcrumbs = (props) => {

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  }

  const renderBreadcrumbs = () => {
    let url = props.url;
    let route = props.url.split('/')
      .slice(1)
      .map(route => route
        .split('-')
        .map(word => word.length < 3
          ? word.toUpperCase()
          : word[0].toUpperCase() + word.slice(1))
        .join(' ')
      );
    const length = route.length

    return route.map((item, index) => {
      let middlewareUrl = "/" + url.split("/").slice(1, index + 2).join("/");

      return (
        <BreadcrumbItem key={uuidv4()}>
          {length === index + 1
            ? item
            : <Link to={middlewareUrl}>
              {item}
            </Link>
          }
        </BreadcrumbItem>
      )
    })
  }

  let routeArr = props.url.split('/');
  let title = routeArr[routeArr.length - 1];
  let breadcrumbTitle = title[0].toUpperCase() + title.slice(1)

  return (
    <div className="d-flex">
      <div className={s.breadcrumbs} >
        <div className="headline-2">{breadcrumbTitle}</div>
        {breadcrumbTitle !== "Dashboard" &&
        <Breadcrumb tag="nav" listTag="div">
          {renderBreadcrumbs()}
        </Breadcrumb>
        }
      </div>
      <div className="d-inline-flex ml-auto p-2">
          <div className={s.icon}><DashboardOutlinedIcon /></div>
          <UncontrolledDropdown>
            <DropdownToggle caret>
              &nbsp; All rooms &nbsp;
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>Bedroom</DropdownItem>
              <DropdownItem>Garden</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
      </div>
    </div>
  )
};

export default Breadcrumbs;
