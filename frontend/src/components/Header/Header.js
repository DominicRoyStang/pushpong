import React from "react";
import history from "utils/history";
import HeaderLayout from "./HeaderLayout";

export default class Header extends React.Component {

    onLogoClick = () => {history.push("/")};

    render() {
        return (
            <React.Fragment>
                <HeaderLayout 
                    onLogoClick={this.onLogoClick}
                />
            </React.Fragment>
        )
    }
}
