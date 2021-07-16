
import React from "react";
import ButtonLayout from "./ButtonLayout";
import "./Button.scss";

const Button = ({label = "", onClick, ...otherProps}) => (
    <ButtonLayout
        label={label}
        onClick={onClick}
        {...otherProps}
    />
);

export default Button;
