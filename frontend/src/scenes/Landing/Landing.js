import React from "react";
import history from "utils/history";
import LandingLayout from "./LandingLayout";

export default class Landing extends React.Component {
    onClick = () => {history.push("/game")};

    render() {
        return (
            <LandingLayout onClick={this.onClick} />
        )
    }
}
