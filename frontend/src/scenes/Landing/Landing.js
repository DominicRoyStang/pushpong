import React from "react";
import history from "utils/history";
import LandingLayout from "./LandingLayout";
import "./Landing.scss";

const onLocalClick = () => history.push("/local");
const onOnlineClick = () => history.push("/online");

const Landing = () => (
    <LandingLayout onLocalClick={onLocalClick} onOnlineClick={onOnlineClick} />
);

export default Landing;
