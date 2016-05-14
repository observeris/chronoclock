const R2D = 180.0 / Math.PI;
const D2R = 1.0 / R2D;

export const NumberToAngle = (iNumber) => {

    // Converting number to dial angle to display that number.
    // 0 degrees rotation - number 5
    // 5*36 degrees rotation - number 0

    const angle = (5 - iNumber) * 36 * D2R;

    return angle;
};

export const DegreesToRadians = (iDegrees) => {

    return D2R * iDegrees;
};

export const RadiansToDegrees = (iRadians) => {

    return R2D * iRadians;
};
