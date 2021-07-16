import React from "react";
import {LogoIcon} from "assets/";

const LogoLayout = ({textVisible}) => (
    <a href="/" className="app-logo" >
        <LogoIcon className="logo-image" alt="logo" />

        {
            textVisible && <h1 className="logo-text">
                <strong>Push Pong</strong>
            </h1>
        }
    </a>
);

export default LogoLayout;
