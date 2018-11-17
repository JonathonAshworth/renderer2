// Number, Number, Number => Vector3
function Vector3 (x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
}

// Normal3 => Vector3
Vector3.fromNormal3 = function (n) {
    return new Vector3(n.x, n.y, n.z)
}

// Vector3 => Vector3
Vector3.prototype.add = function (v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
}

// Vector3 => Vector3
Vector3.prototype.sub = function (v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
}

// Number => Vector3
Vector3.prototype.scale = function (s) {
    return new Vector3(this.x * s, this.y * s, this.z * s)
}

// () => Vector3
Vector3.prototype.negate = function () {
    return new Vector3(-this.x, -this.y, -this.z)
}

// () => Vector3
Vector3.prototype.abs = function () {
    return new Vector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z))
}

// Vector3 | Normal3 => Number
Vector3.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z
}

// Vector3 | Normal3 => Number
Vector3.prototype.absDot = function (v) {
    return Math.abs(this.dot(v))
}

// Vector3 => Vector3
Vector3.prototype.cross = function (v) {
    return new Vector3(
        this.y * v.z - this.z * v.y,
        this.z * v.x - this.x * v.z,
        this.x * v.y - this.y * v.x
    )
}

// () => Number
Vector3.prototype.length = function () {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
}

// () => Vector3
Vector3.prototype.normalise = function () {
    return this.scale(1 / this.length())
}

// () => Number
Vector3.prototype.minComponent = function () {
    return Math.min(this.x, this.y, this.z)
}

// () => Number
Vector3.prototype.maxComponent = function () {
    return Math.max(this.x, this.y, this.z)
}

// () => String
Vector3.prototype.maxDimension = function () {
    return this.x > this.y
        ? (this.x > this.z ? 'x' : 'z')
        : (this.y > this.z ? 'y' : 'z')
}

// Vector3 => Vector3
Vector3.prototype.min = function (v) {
    return new Vector3(Math.min(this.x, v.x), Math.min(this.y, v.y), Math.min(this.z, v.z))
}

// Vector3 => Vector3
Vector3.prototype.max = function (v) {
    return new Vector3(Math.max(this.x, v.x), Math.max(this.y, v.y), Math.max(this.z, v.z))
}

// Axis : 'x' | 'y' | 'z'
// Axis, Axis, Axis => Vector3
Vector3.prototype.permute = function (a, b, c) {
    return new Vector3(this[a], this[b], this[c])
}

// Vector3 => [Vector3, Vector3, Vector3]
Vector3.prototype.coordinateSystem = function () {
    const p = this.x > this.y
        ? new Vector3(-this.z, 0, this.x).scale(1 / Math.sqrt(this.x**2 + this.z**2))
        : new Vector3(0, this.z, -this.y).scale(1 / Math.sqrt(this.y**2 + this.z**2))
    return [v, p, v.cross(p)]
}

export default Vector3
