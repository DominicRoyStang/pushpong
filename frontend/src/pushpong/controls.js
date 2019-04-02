const KEY_ARROW_LEFT = 37;
const KEY_ARROW_UP = 38;
const KEY_ARROW_RIGHT = 39;
const KEY_ARROW_DOWN = 40;
const KEY_A = 65;
const KEY_W = 87;
const KEY_D = 68;
const KEY_S = 83;
const KEY_SPACEBAR = 32;

export const player1DefaultControls = {
    left_keys: [KEY_ARROW_LEFT, KEY_ARROW_UP, KEY_A, KEY_W],
    right_keys: [KEY_ARROW_RIGHT, KEY_ARROW_DOWN, KEY_D, KEY_S],
    boost_keys: [KEY_SPACEBAR]
};

export const player2DefaultControls = {
    left_keys: [KEY_ARROW_LEFT, KEY_ARROW_DOWN, KEY_A, KEY_S],
    right_keys: [KEY_ARROW_RIGHT, KEY_ARROW_UP, KEY_D, KEY_W],
    boost_keys: [KEY_SPACEBAR]
};

export const opponentControls = {
    left_keys: [],
    right_keys: [],
    boost_keys: []
};

export default class Controls {

    constructor(onChange, control_profile=player1DefaultControls) {
        this.controls = {
            LEFT: control_profile.left_keys,
            RIGHT: control_profile.right_keys,
            BOOST: control_profile.boost_keys
        }
        this.onChange = onChange;

        this.LEFT = false;
        this.RIGHT = false;
        this.BOOST = false;
    }

    handleKeyUp = (e) => {
        const control = this.controlFromKey(e.keyCode);
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
        const control = this.controlFromKey(e.keyCode);
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

    controlFromKey(keyCode) {
        for (const [control, codes] of Object.entries(this.controls)) {
            for (let code of codes) {
                if (keyCode === code) {
                    return control;
                }
            }
        }
        return null;
    }

    updateControls({left_keys, right_keys, boost_keys}) {
        this.controls = {
            LEFT: left_keys,
            RIGHT: right_keys,
            BOOST: boost_keys 
        };
    }
};
