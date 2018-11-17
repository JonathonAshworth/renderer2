import Vector3 from './Vector3.js'

// Number, Number, Number => Point3
function Point3 (x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
}

// Point3 => Point3
Point3.prototype.addP = function (p) {
    return new Point3(this.x + p.x, this.y + p.y, this.z + p.z)
}

// Vector3 => Point3
Point3.prototype.addV = function (v) {
    return new Point3(this.x + v.x, this.y + v.y, this.z + v.z)
}

// Point3 => Vector3
Point3.prototype.subP = function (p) {
    return new Vector3(this.x - p.x, this.y - p.y, this.z - p.z)
}

// Vector3 => Point3
Point3.prototype.subV = function (v) {
    return new Point3(this.x - v.x, this.y - v.y, this.z - v.z)
}

// Number => Point3
Point3.prototype.scale = function (s) {
    return new Point3(this.x * s, this.y * s, this.z * s)
}

// Point3 => Number
Point3.prototype.distance = function (p) {
    return this.subP(p).length()
}

// Point3, Number => Point3
Point3.prototype.lerp = function (p, t) {
    return this.scale(1 - t) + p.scale(t)
}

// Point3 => Point3
Point3.prototype.min = function (p) {
    return new Point3(Math.min(this.x, p.x), Math.min(this.y, p.y), Math.min(this.z, p.z))
}

// Point3 => Point3
Point3.prototype.max = function (p) {
    return new Point3(Math.max(this.x, p.x), Math.max(this.y, p.y), Math.max(this.z, p.z))
}

// () => Point3
Point3.prototype.floor = function () {
    return new Point3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z))
}

// () => Point3
Point3.prototype.ceil = function () {
    return new Point3(Math.ceil(this.x), Math.floor(this.y), Math.floor(this.z))
}

// () => Point3
Point3.prototype.abs = function () {
    return new Point3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z))
}

// Axis : 'x' | 'y' | 'z'
// Axis, Axis, Axis => Point3
Point3.prototype.permute = function (a, b, c) {
    return new Point3(this[a], this[b], this[c])
}

export default Point3
