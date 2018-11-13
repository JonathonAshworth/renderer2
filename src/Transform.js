import Matrix4x4 from './Matrix4x4.js'
import Vector3 from './Vector3.js'
import Point3 from './Point3.js'
import Normal3 from './Normal3.js'
import Bounds3 from './Bounds3.js'

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

// Number (radians) => Transform
Transform.rotateX = function (theta) {
    const sinTheta = Math.sin(theta)
    const cosTheta = Math.cos(theta)
    const m = new Matrix4x4([
        [1, 0, 0, 0],
        [0, cosTheta, -sinTheta, 0],
        [0, sinTheta, cosTheta, 0],
        [0, 0, 0, 1],
    ])
    return new Transform(m, m.transpose())
}

// Number (radians) => Transform
Transform.rotateY = function (theta) {
    const sinTheta = Math.sin(theta)
    const cosTheta = Math.cos(theta)
    const m = new Matrix4x4([
        [cosTheta, 0, sinTheta, 0],
        [0, 1, 0, 0],
        [-sinTheta, 0, cosTheta, 0],
        [0, 0, 0, 1],
    ])
    return new Transform(m, m.transpose())
}

// Number (radians) => Transform
Transform.rotateZ = function (theta) {
    const sinTheta = Math.sin(theta)
    const cosTheta = Math.cos(theta)
    const m = new Matrix4x4([
        [cosTheta, -sinTheta, 0, 0],
        [sinTheta, cosTheta, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ])
    return new Transform(m, m.transpose())
}

// Number (radians), Vector3 => Transform
Transform.rotate = function (theta, axis) {
    const a = axis.normalise()
    const sinTheta = Math.sin(theta)
    const cosTheta = Math.cos(theta)
    const m = new Matrix4x4()

    m.m[0][0] = a.x * a.x + (1 - a.x * a.x) * cosTheta
    m.m[0][1] = a.x * a.y * (1 - cosTheta) - a.z * sinTheta
    m.m[0][2] = a.x * a.z * (1 - cosTheta) + a.y * sinTheta

    m.m[1][0] = a.x * a.y * (1 - cosTheta) + a.z * sinTheta
    m.m[1][1] = a.y * a.y + (1 - a.y * a.y) * cosTheta
    m.m[1][2] = a.y * a.z * (1 - cosTheta) - a.x * sinTheta

    m.m[2][0] = a.x * a.z * (1 - cosTheta) - a.y * sinTheta
    m.m[2][1] = a.y * a.z * (1 - cosTheta) + a.x * sinTheta
    m.m[2][2] = a.z * a.z + (1 - a.z * a.z) * cosTheta

    return new Transform(m, m.transpose())
}

// Point3, Point3, Vector3 => Transform
Transform.lookAt = function (pos, look, up) {
    const cameraToWorld = new Matrix4x4()

    cameraToWorld.m[0][3] = pos.x
    cameraToWorld.m[1][3] = pos.y
    cameraToWorld.m[2][3] = pos.z

    const dir = look.subP(pos).normalise()
    const left = up.normalise().cross(dir).normalise()
    const newUp = dir.cross(left)

    cameraToWorld.m[0][0] = left.x
    cameraToWorld.m[1][0] = left.y
    cameraToWorld.m[2][0] = left.z
    cameraToWorld.m[0][1] = newUp.x
    cameraToWorld.m[1][1] = newUp.y
    cameraToWorld.m[2][1] = newUp.z
    cameraToWorld.m[0][2] = dir.x
    cameraToWorld.m[1][2] = dir.y
    cameraToWorld.m[2][2] = dir.z

    return new Transform(cameraToWorld.inverse(), cameraToWorld)
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

// () => Boolean
Transform.prototype.hasScale = function () {
    const sx = this.applyV(new Vector3(1, 0, 0)).length() ** 2
    const sy = this.applyV(new Vector3(0, 1, 0)).length() ** 2
    const sz = this.applyV(new Vector3(0, 0, 1)).length() ** 2
    const notOne = n => n < 0.999 || n > 1.001
    return notOne(sx) || notOne(sy) || notOne(sz)
}

// Vector3 => Vector3
Transform.prototype.applyV = function (v) {
    const xv = this.m.m[0][0] * v.x + this.m.m[0][1] * v.y + this.m.m[0][2] * v.z
    const yv = this.m.m[1][0] * v.x + this.m.m[1][1] * v.y + this.m.m[1][2] * v.z
    const zv = this.m.m[2][0] * v.x + this.m.m[2][1] * v.y + this.m.m[2][2] * v.z
    return new Vector3(xv, yv, zv)
}

// Point3 => Point3
Transform.prototype.applyP = function (p) {
    const xp = this.m.m[0][0] * p.x + this.m.m[0][1] * p.y + this.m.m[0][2] * p.z + this.m.m[0][3]
    const yp = this.m.m[1][0] * p.x + this.m.m[1][1] * p.y + this.m.m[1][2] * p.z + this.m.m[1][3]
    const zp = this.m.m[2][0] * p.x + this.m.m[2][1] * p.y + this.m.m[2][2] * p.z + this.m.m[2][3]
    const wp = this.m.m[3][0] * p.x + this.m.m[3][1] * p.y + this.m.m[3][2] * p.z + this.m.m[3][3]
    return new Point3(xp, yp, zp).scale(1 / wp)
}

// Normal3 => Normal3
Transform.prototype.applyN = function (n) {
    // Note the access order of mInv.m, we're applying to it's transpose here
    const xn = this.mInv.m[0][0] * n.x + this.mInv.m[1][0] * n.y + this.mInv.m[2][0] * n.z
    const yn = this.mInv.m[0][1] * n.x + this.mInv.m[1][1] * n.y + this.mInv.m[2][1] * n.z
    const zn = this.mInv.m[0][2] * n.x + this.mInv.m[1][2] * n.y + this.mInv.m[2][2] * n.z
    return new Normal3(xn, yn, zn)
}

// Ray => Ray
Transform.prototype.applyR = function (r) {
    const o = this.applyP(r.o)
    const d = this.applyV(r.d)
    return new Ray(o, d, r.tMax, r.time, r.medium)
    // TODO: Double check this, may be incorrect
    // May need to apply performance improvements from page 233
}

// Bounds3 => Bounds3
Transform.prototype.applyB = function (b) {
    // Constructing a new bound out of the transformed points of the old one
    const oldBoundCorners = [
        b.pMin,
        new Point3(b.pMin.x, b.pMin.y, b.pMax.z),
        new Point3(b.pMin.x, b.pMax.y, b.pMin.z),
        new Point3(b.pMin.x, b.pMax.y, b.pMax.z),
        new Point3(b.pMax.x, b.pMin.y, b.pMin.z),
        new Point3(b.pMax.x, b.pMin.y, b.pMax.z),
        new Point3(b.pMax.x, b.pMax.y, b.pMin.z),
        b.pMax,
    ]
    return oldBoundCorners.reduce(
        (oldBoundCorner, newBound) => newBound.unionP(this.applyP(oldBoundCorner)),
        new Bounds3(),
    )
}

// Transform => Transform
Transform.prototype.compose = function (t) {
    return new Transform(
        this.m.mul(t.m),
        t.mInv.mul(this.mInv),
    )
}

// () => Boolean
Transform.prototype.swapsHandedness = function () {
    const m = this.m.m
    const det = (
        m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
        m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
        m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    )
    return det < 0
}

export default Transform
