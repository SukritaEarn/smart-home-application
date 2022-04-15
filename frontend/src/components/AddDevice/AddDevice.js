import React from "react";

import s from "./AddDevice.module.scss";

const AddDeviceForm = ({ isShowAddDevice }) => {
  return (
    // <form onSubmit={onSubmit}>
      <div className={`${isShowAddDevice ? false : ""} show`}>
        <div className={s.addForm}>
          <div className={s.FormBox} solid>
            <form>
              <h1 className={s.addText}>Sign In</h1>
              <label>Username</label>
              <br></br>
              <input type="text" name="username" className={s.addBox} />
              <br></br>
              <label>Password</label>
              <br></br>
              <input type="password" name="password" className={s.addBox} />
              <br></br>
              <input type="submit" value="LOGIN" className={s.addBtn} />
            </form>
          </div>
        </div>
      </div>
    // </form>
  );
};

export default AddDeviceForm;