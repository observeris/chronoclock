/* global THREE */
import {
    TweenFunc
} from './TweenFunc';

import AngleInterpolation from './AngleInterpolation';

const R2D = 180.0 / Math.PI;
const D2R = 1.0 / R2D;

export default class DialRing {
    constructor(iMesh, iIndex, iTweenFunc) {
        this.fMesh = iMesh;
        this.fAngleRadians = 0.0;
        this.fIndex = iIndex;
        if (iMesh.geometry.boundingBox === null) {
            iMesh.geometry.computeBoundingBox();
        }
        this.fBBOX = iMesh.geometry.boundingBox;
        // Default pivot point is the center of bounding box.

        this.fPivotPoint = new THREE.Vector3(0, 0, 0);
        this.fPivotPoint.add(this.fBBOX.min);
        this.fPivotPoint.add(this.fBBOX.max);
        this.fPivotPoint.multiplyScalar(0.5);

        this.fMesh.matrixAutoUpdate = false;
        this.fMesh.matrix.identity();
        this.fAngleInterpolation = null;

        if (TweenFunc.hasOwnProperty(iTweenFunc)) {
            console.log("Function " + iTweenFunc + " accepted");
        } else {
            console.log("ERROR : No Tween Function " + iTweenFunc + " !");
        }
        this.fTweenFunc = iTweenFunc;
        this.fForceAnimationDirection = 2;
        // -1, if the digit increase, it will always be one step.
        // -1, if the digit decreases, it will always be NINE steps.

        // 1 = Forces all angles to be bigger than current angles.
        // E.g. when asked to lerp from 20 degrees to 1, will lerp to 361
        // 0 = No Forcing;
        // -1 = Forces all angles to be smaller than current angles.
        // E.g. when asked to lerp from 20 degrees to 1, will lerp to -359
        // 2 = Forces minimal spin direction. (SHOULD BE DEFAULT I THINK)
        // Evaluates 1 and -1 option and picks one that results in minimal change.
        // 3 = Forces maximal spin direction.
        // Evaluates 1 and -1 option and picks one that results in maximal change.
    }

    UpdatePosition() {
        const pivot = this.fPivotPoint;
        var toCenter =
            new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z);
        var fromCenter =
            new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z);

        var rotMatrix = new THREE.Matrix4().makeRotationX(this.fAngleRadians);
        // 2 * Math.PI * ((nowMS % 5000) / 5000.0));
        var transMatrix = new THREE.Matrix4().makeTranslation(50 * this.fIndex, 200, 0);

        var newMatrix = new THREE.Matrix4();

        // newMatrix.multiply(toCenter);
        // newMatrix.multiply(rotMatrix);
        // newMatrix.multiply(fromCenter);
        // newMatrix.multiply(transMatrix);
        newMatrix.multiply(transMatrix);
        newMatrix.multiply(fromCenter);
        newMatrix.multiply(rotMatrix);
        newMatrix.multiply(toCenter);

        this.fMesh.matrix = newMatrix;
    }

    SetAngle(iAngle) {
        this.fAngleRadians = iAngle;
        this.UpdatePosition();
    }

    ScheduleAngleInterpolation(iNewAngleValue) {

        const PositiveAngleDirection = (iNewAngle) => {
            let newAngle = iNewAngle;
            while (newAngle < this.fAngleRadians) {
                newAngle += Math.PI * 2;
            }
            return newAngle;
        };

        const NegativeAngleDirection = (iNewAngle) => {
            let newAngle = iNewAngle;
            while (newAngle > this.fAngleRadians) {
                newAngle -= Math.PI * 2;
            }
            return newAngle;
        };

        let newAngleRadians = iNewAngleValue;
        if (this.fForceAnimationDirection === 1) {
            newAngleRadians = PositiveAngleDirection(iNewAngleValue);
        } else if (this.fForceAnimationDirection === -1) {
            newAngleRadians = NegativeAngleDirection(iNewAngleValue);
        } else if (this.fForceAnimationDirection === 2 || this.fForceAnimationDirection === 3) {
            const forceMINUSNewAngle = NegativeAngleDirection(iNewAngleValue);
            const forcePLUSNewAngle = PositiveAngleDirection(iNewAngleValue);

            // this.fForceAnimationDirection === 2 Pick one angle that results in *less* rotation
            // this.fForceAnimationDirection === 3 Pick one angle that results in *more* rotation

            if (Math.abs(forceMINUSNewAngle - this.fAngleRadians) <
                Math.abs(forcePLUSNewAngle - this.fAngleRadians)) {
                if (this.fForceAnimationDirection === 2) {
                    newAngleRadians = forceMINUSNewAngle;
                } else {
                    newAngleRadians = forcePLUSNewAngle;
                }
            } else if (this.fForceAnimationDirection === 3) {
                newAngleRadians = forcePLUSNewAngle;
            } else {
                newAngleRadians = forceMINUSNewAngle;
            }

        }
        const lerpStruct = new AngleInterpolation(Date.now(), Date.now() + 700, this.fAngleRadians,
            newAngleRadians, this.fTweenFunc);
        this.fAngleInterpolation = lerpStruct;
    }

    ScheduleDialAdvance() {
        this.ScheduleAngleInterpolation(this.fAngleRadians + D2R * 36.0);
    }

    ProcessAnimation(iCurrentTime) {
        if (this.fAngleInterpolation !== null) {

            const lerpedAngle = this.fAngleInterpolation.LerpAngleConst(iCurrentTime);

            if (this.fAngleInterpolation.IsAnimationDoneConst(iCurrentTime)) {
                this.fAngleInterpolation = null;
            }

            this.SetAngle(lerpedAngle);
        }
    }

}
