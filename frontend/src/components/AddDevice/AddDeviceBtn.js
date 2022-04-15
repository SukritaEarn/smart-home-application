import React from "react";

import s from "./AddDevice.module.scss";

function AddDeviceBtn({ handleAddDevice }) {
  const handleAddDeviceClick = () => {
    handleAddDevice();
  };
  return (
      <div>
        <button className={s.addicon} onClick={handleAddDeviceClick}><i class="eva eva-plus" aria-hidden="true"></i></button>
      </div>
  );
}

export default AddDeviceBtn;