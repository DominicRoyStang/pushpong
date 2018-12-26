import React from "react";
import {logo} from "images/";
import "./Header.css";

const HeaderLayout = ({onLogoClick}) => (
    <header className="header">
        <img src={logo} className="app-logo" alt="logo" onClick={onLogoClick} />
        <h1 className="header-title" onClick={onLogoClick}>
            <strong>Socket Physics</strong>
        </h1>
    </header>
);

export default HeaderLayout;