import {
    TweenFunc
} from './TweenFunc';

export default class AngleInterpolation {
    constructor(iStartTime, iEndTime, iStartAngle, iEndAngle, iTweenFunc) {
        this.fStartTime = Number(iStartTime);
        this.fEndTime = Number(iEndTime);
        this.fStartAngle = iStartAngle;
        this.fEndAngle = iEndAngle;

        this.fTweenFunc = iTweenFunc;
    }

    LerpAngleConst(iCurrentTime) {
        const normalizedLerpTime = (iCurrentTime - this.fStartTime) /
            (this.fEndTime - this.fStartTime);

        const t = iCurrentTime - this.fStartTime;
        const b = this.fStartAngle;
        const c = this.fEndAngle - this.fStartAngle;
        const d = this.fEndTime - this.fStartTime;

        let lerpedAngle = this.fStartAngle;
        if (normalizedLerpTime >= 0.0 && normalizedLerpTime < 1.0) {
            const tweenFunc = TweenFunc[this.fTweenFunc];

            lerpedAngle = tweenFunc(t, b, c, d);

        } else if (normalizedLerpTime >= 1.0) {
            lerpedAngle = this.fEndAngle;
        }

        return lerpedAngle;
    }

    IsAnimationDoneConst(iCurrentTime) {
        if (iCurrentTime > this.fEndTime) {
            return true;
        }

        return false;
    }
}
