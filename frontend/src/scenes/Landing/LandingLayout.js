import React from "react";
import "./Landing.css";
import {logo} from "images/";

const LandingLayout = () => (
    <div className="landing">
        <img src={logo} className="app-logo" alt="logo" />
        <h1>Socket Physics</h1>
    </div>
);

export default LandingLayout;