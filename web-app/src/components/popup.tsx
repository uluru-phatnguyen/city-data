import React, { memo } from "react";
import PopupComponent from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const Popup: React.FC<Partial<React.ComponentProps<typeof PopupComponent>>> = (
  props
) => {
  return (
    <PopupComponent {...props}>
      <div>{props.children}</div>
    </PopupComponent>
  );
};

export default memo(Popup);
