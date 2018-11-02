import Matrix4x4 from './Matrix4x4.js'

// () => Transform
// Number[4][4] => Transform
// Matrix4x4 => Transform
// Matrix4x4, Matrix4x4 => Transform
function Transform (m, i) {
    if (m === undefined) {
        this.m = new Matrix4x4()
        this.mInv = new Matrix4x4()
    } else if (typeof m === 'Matrix4x4') {
        this.m = m
        this.mInv = i || m.inverse()
    } else {
        this.m = new Matrix4x4(m)
        this.mInv = this.m.inverse()
    }
}

// Vector3 => Transform
Transform.translate = function (delta) {
    return new Transform(
        new Matrix4x4([
            [1, 0, 0, delta.x],
            [0, 1, 0, delta.y],
            [0, 0, 1, delta.z],
            [0, 0, 0, 1],
        ]),
        new Matrix4x4([
            [1, 0, 0, -delta.x],
            [0, 1, 0, -delta.y],
            [0, 0, 1, -delta.z],
            [0, 0, 0, 1],
        ])
    )
}

// Number, Number, Number => Transform
Transform.scale = function (x, y, z) {
    return new Transform(
        new Matrix4x4([
            [x, 0, 0, 0],
            [0, y, 0, 0],
            [0, 0, z, 0],
            [0, 0, 0, 1],
        ]),
        new Matrix4x4([
            [1/x, 0, 0, 0],
            [0, 1/y, 0, 0],
            [0, 0, 1/z, 0],
            [0, 0, 0, 1],
        ])
    )
}

// Transform => Boolean
Transform.prototype.equals = function (t) => {
    return this.m.equals(t.m) && this.mInv.equals(t.mInv)
}

// () => Transform
Transform.prototype.inverse = function () {
    return new Transform(this.mInv, this.m)
}

// () => Transform
Transform.prototype.transpose = function () {
    return new Transform(this.m.transpose(), this.mInv.transpose())
}

// () => Boolean
Transform.prototype.isIdentity = function () {
    return this.m.equals(new Matrix4x4()) && this.mInv.equals(new Matrix4x4())
}

export default Transform
