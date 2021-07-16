import React from "react";
import {ONLINE_MULTIPLAYER_ENABLED} from "utils/environment";
import {Button, Logo} from "components";

const LandingLayout = ({onLocalClick, onOnlineClick}) => (
    <div className="landing">
        <div className="logo-container">
            <Logo textVisible={true} />
        </div>
        <div className="buttons-container">
            {ONLINE_MULTIPLAYER_ENABLED && <Button onClick={onOnlineClick} label="Online Multiplayer" />}
            <Button onClick={onLocalClick} label="Local Multiplayer" />
        </div>
    </div>

);

export default LandingLayout;
