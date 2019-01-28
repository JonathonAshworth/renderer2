// Number, Number, Number => Normal3
function Normal3 (x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
}

// Vector3 => Normal3
Normal3.fromVector3 = function (v) {
    return new Normal3(v.x, v.y, v.z)
}

// Normal3 => Boolean
Normal3.prototype.equals = function (v) {
    return this.x === v.x && this.y === v.y && this.z = v.z
}

// Normal3 => Normal3
Normal3.prototype.add = function (v) {
    return new Normal3(this.x + v.x, this.y + v.y, this.z + v.z)
}

// Normal3 => Normal3
Normal3.prototype.sub = function (v) {
    return new Normal3(this.x - v.x, this.y - v.y, this.z - v.z)
}

// Number => Normal3
Normal3.prototype.scale = function (s) {
    return new Normal3(this.x * s, this.y * s, this.z * s)
}

// () => Normal3
Normal3.prototype.negate = function () {
    return new Normal3(-this.x, -this.y, -this.z)
}

// Vector3 | Normal3 => Number
Normal3.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z
}

// () => Number
Normal3.prototype.length = function () {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
}

// () => Normal3
Normal3.prototype.normalise = function () {
    return this.scale(1 / this.length())
}

// Normal3 | Vector3 => Normal3
Normal3.prototype.faceForward = function (v) {
    return v.dot(this) < 0 ? this.negate() : this
}

export default Normal3
