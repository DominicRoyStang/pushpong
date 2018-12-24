import React from "react";
import {logo} from "images/";
import "./Header.css";

const HeaderLayout = () => (
    <header className="header">
        <img src={logo} className="app-logo" alt="logo" />
        <h1><strong>Socket Physics</strong></h1>
    </header>
);

export default HeaderLayout;