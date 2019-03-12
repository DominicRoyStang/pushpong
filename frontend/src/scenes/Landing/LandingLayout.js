import React from "react";
import {logo} from "images/";

const LandingLayout = ({onClick}) => (
    <div className="landing" onClick={onClick}>
        <img src={logo} className="app-logo" alt="logo" />
        <h1>Push Pong</h1>
    </div>
);

export default LandingLayout;