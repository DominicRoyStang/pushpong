import React from "react";
import "./Landing.css";
import {logo} from "images/";

const LandingLayout = ({onClick}) => (
    <div className="landing" onClick={onClick}>
        <img src={logo} className="app-logo" alt="logo" />
        <h1>Socket Physics</h1>
    </div>
);

export default LandingLayout;