const KEY_ARROW_UP = 38;
const KEY_ARROW_DOWN = 40;
const KEY_W = 87;
const KEY_S = 83;
const KEY_SPACEBAR = 32;

export default class Controls {

    constructor(
        socket,
        up_keys = [KEY_ARROW_UP, KEY_W],
        down_keys = [KEY_ARROW_DOWN, KEY_S],
        boost_keys = [KEY_SPACEBAR]
    ) {
        this.socket = socket;
        
        this.controls = {
            "UP": up_keys,
            "DOWN": down_keys,
            "BOOST": boost_keys
        }

        this.UP = false;
        this.DOWN = false;
        this.BOOST = false;
    }

    handleKeyUp = (e) => {
        const control = this.control_from_key(e.keyCode);
        if (!control) {
            // unmapped key
            return;
        }

        if (!this[control]) {
            // control already set to false
            return;
        }
        
        this[control] = false;
        this.onChange(control);
    }

    handleKeyDown = (e) => {
        const control = this.control_from_key(e.keyCode);
        if (!control) {
            // unmapped key
            return;
        }

        if (this[control]) {
            // control already set to true
            return;
        }
        
        this[control] = true;
        this.onChange(control);
    }

    onChange = (value) => {
        this.socket.emit("control", value);
    }

    control_from_key(keyCode) {
        for (const [control, codes] of Object.entries(this.controls)) {
            for (let code of codes) {
                if (keyCode === code) {
                    return control;
                }
            }
        }
        return null;
    }

}
