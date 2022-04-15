// -- React and related libs
import React from "react";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router";

// -- Third Party Libs
import PropTypes from "prop-types";

// -- Custom Components
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import HomePage from "../../pages/home/HomePage";
import Tables from "../../pages/history/History";
import Charts from "../../pages/power/Power";

// -- Component Styles
import s from "./Layout.module.scss";

const Layout = (props) => {
  return (
    <div className={s.root}>
      <div className={s.wrap}>
        <Header />
        <Sidebar />
        <main className={s.content}>
          <Breadcrumbs url={props.location.pathname} />
          <Switch>
            <Route path="/smart-home" exact render={() => <Redirect to="/smart-home/homepage"/>} />
            <Route path="/smart-home/homepage" exact component={HomePage}/>
            <Route path="/smart-home/history" exact component={Tables} />
            <Route path="/smart-home/power-consumption" exact component={Charts} />
            <Route path='*' exact render={() => <Redirect to="/error" />} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

Layout.propTypes = {
  sidebarOpened: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
  };
}

export default withRouter(connect(mapStateToProps)(Layout));