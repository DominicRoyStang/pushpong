const KEY_ARROW_UP = 38;
const KEY_ARROW_DOWN = 40;
const KEY_W = 87;
const KEY_S = 83;
const KEY_SPACEBAR = 32;

export default class Controls {

    constructor(
        up_keys=[KEY_ARROW_UP, KEY_W],
        down_keys=[KEY_ARROW_DOWN, KEY_S],
        boost_keys=[KEY_SPACEBAR]
    ) {

        this.UP = false;
        this.DOWN = false;
        this.BOOST = false;

        this.controls = {
            "UP": up_keys,
            "DOWN": down_keys,
            "BOOST": boost_keys
        }

    }

    handleKeyUp = (e) => {
        const control = this.control_from_key(e.keyCode);
        if (control) {
            this[control] = false;
        };
    }

    handleKeyDown = (e) => {
        const control = this.control_from_key(e.keyCode);
        if (control) {
            this[control] = true;
        };
    }

    control_from_key(keyCode) {
        for (const [control, codes] of Object.entries(this.controls)) {
            for (let code of codes) {
                if (keyCode === code) {
                    return control
                }
            }
        }
        return null;
    }

}
