import * as DigitLib from './DigitLib';

let gLastSwitch = Number(0);
const gLastSwitchArray = [
    Number(0),
    Number(0),
    Number(0),
    Number(0),
    Number(0)
];

export default class NDigitDial {
    constructor() {
        this.fDialRings = [];
    }

    SetDialsFromExactString(iNumberString) {
        if (typeof iNumberString !== 'string') {
            throw new Error("Number must be a string");
        }

        if (iNumberString.length !== this.fDialRings.length) {
            throw new Error("Number must have exactly as many digits as dials");
        }

        for (let i = 0; i < iNumberString.length; i += 1) {
            const digit = Number.parseInt(iNumberString.charAt(i), 10);
            if (Number.isNaN(digit) === true) {
                throw new Error("Digit in number is not a number!");
            }
            this.fDialRings[i].ScheduleAngleInterpolation(
                DigitLib.NumberToAngle(digit));
        }

    }

    SetDialsFromInt(iInteger) {
        var integerString = iInteger.toString(10);

        if (integerString.length > this.fDialRings.length) {
            throw new Error("Cannot represent the number! Too Large");
        }

        while (integerString.length < this.fDialRings.length) {
            integerString = "0" + integerString;
        }

        this.SetDialsFromExactString(integerString);
    }

    AddNewDial(iDial) {
        this.fDialRings.push(iDial);
    }

    Animate(nowMS) {
        const sAnimationMode = 4; // All modes other than 4 are just for debugging.
        // Animations should be set externally,
        // and all this class has to do is call ProcessAnimation() on all the rings

        if (this.fDialRings.length <= 0) {
            return;
        }

        if (sAnimationMode === 0) {
            // Continuous animation of all
            let d = 0;

            for (d = 0; d < this.fDialRings.length; d += 1) {
                var dialRing = this.fDialRings[d];
                dialRing.SetAngle(2 * Math.PI * ((nowMS % 5000) / 5000.0));
            }
        } else if (sAnimationMode === 1) {
            // Variated animation of all

            this.fDialRings[0].SetAngle(2 * Math.PI * ((nowMS % 5000) / 5000.0));
            this.fDialRings[1].SetAngle(2 * Math.PI * ((nowMS % 4000) / 4000.0));
            this.fDialRings[2].SetAngle(2 * Math.PI * ((nowMS % 3000) / 3000.0));
            this.fDialRings[3].SetAngle(2 * Math.PI * ((nowMS % 2000) / 2000.0));
            this.fDialRings[4].SetAngle(2 * Math.PI * ((nowMS % 1000) / 1000.0));
            this.fDialRings[5].SetAngle(2 * Math.PI * ((nowMS % 100) / 100.0));
        } else if (sAnimationMode === 2) {
            // Variated animation of all
            if (nowMS - gLastSwitch > 1000) {
                this.fDialRings[0].ScheduleDialAdvance();
                gLastSwitch = nowMS;
            }
            this.fDialRings[0].ProcessAnimation(nowMS);
            this.fDialRings[1].SetAngle(0);
            this.fDialRings[2].SetAngle(0);
            this.fDialRings[3].SetAngle(0);
            this.fDialRings[4].SetAngle(0);
            this.fDialRings[5].SetAngle(0);
        } else if (sAnimationMode === 3) {
            // Variated animation of all
            if (nowMS - gLastSwitchArray[0] > 1000) {
                this.fDialRings[0].ScheduleDialAdvance();
                gLastSwitchArray[0] = nowMS;
            }

            if (nowMS - gLastSwitchArray[1] > 1000) {
                this.fDialRings[1].fTweenFunc = "easeInOutQuad";
                this.fDialRings[1].ScheduleDialAdvance();
                gLastSwitchArray[1] = nowMS;
            }

            if (nowMS - gLastSwitchArray[2] > 1000) {
                this.fDialRings[2].fTweenFunc = "easeInOutBounce";
                this.fDialRings[2].ScheduleDialAdvance();
                gLastSwitchArray[2] = nowMS;
            }
            this.fDialRings[0].ProcessAnimation(nowMS);
            this.fDialRings[1].ProcessAnimation(nowMS);
            this.fDialRings[2].ProcessAnimation(nowMS);
            this.fDialRings[3].SetAngle(0);
            this.fDialRings[4].SetAngle(0);
            this.fDialRings[5].SetAngle(0);
        } else if (sAnimationMode === 4) {
            for (let d = 0; d < this.fDialRings.length; d += 1) {
                this.fDialRings[d].ProcessAnimation(nowMS);
            }
        }
    }

}
