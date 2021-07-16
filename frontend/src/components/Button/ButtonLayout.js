
import React from "react";

const ButtonLayout = ({label = "", onClick, ...otherProps}) => (
    <button
        className="button"
        onClick={onClick}
        {...otherProps}
    >
        <span className="label">{label}</span>
    </button>
);

export default ButtonLayout;
