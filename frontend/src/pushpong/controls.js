const KEY_ARROW_LEFT = 37;
const KEY_ARROW_UP = 38;
const KEY_ARROW_RIGHT = 39;
const KEY_ARROW_DOWN = 40; // eslint-disable-line
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83; // eslint-disable-line
const KEY_D = 68;
const KEY_SPACEBAR = 32;
const KEY_ENTER = 13;

export const onlineControls = {
    left_keys: [KEY_ARROW_LEFT, KEY_A],
    right_keys: [KEY_ARROW_RIGHT, KEY_D],
    boost_keys: [KEY_SPACEBAR, KEY_ARROW_UP, KEY_W]
};

export const player1LocalControls = {
    left_keys: [KEY_A],
    right_keys: [KEY_D],
    boost_keys: [KEY_SPACEBAR, KEY_W]
};

export const player2LocalControls = {
    left_keys: [KEY_ARROW_LEFT],
    right_keys: [KEY_ARROW_RIGHT],
    boost_keys: [KEY_ARROW_UP, KEY_ENTER]
};

export const opponentControls = {
    left_keys: [],
    right_keys: [],
    boost_keys: []
};

export default class Controls {
    constructor(onChange, control_profile = onlineControls) {
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
