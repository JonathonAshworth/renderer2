// Number, Number => Vector2
function Vector2 (x = 0, y = 0) {
    this.x = x
    this.y = y
}

// Vector2 => Vector2
Vector2.prototype.add = function (v) {
    return new Vector2(this.x + v.x, this.y + v.y)
}

// Vector2 => Vector2
Vector2.prototype.sub = function (v) {
    return new Vector2(this.x - v.x, this.y - v.y)
}

// Number => Vector2
Vector2.prototype.scale = function (s) {
    return new Vector2(this.x * s, this.y * s)
}

// () => Vector2
Vector2.prototype.negate = function () {
    return new Vector2(-this.x, -this.y)
}

// () => Vector2
Vector2.prototype.abs = function () {
    return new Vector2(Math.abs(this.x), Math.abs(this.y))
}

// Vector2 => Number
Vector2.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y
}

// Vector2 => Number
Vector2.prototype.absDot = function (v) {
    return Math.abs(this.dot(v))
}

// () => Number
Vector2.prototype.length = function () {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
}

// () => Vector2
Vector2.prototype.normalise = function () {
    return this.scale(1 / this.length())
}

// () => Number
Vector2.prototype.minComponent = function () {
    return Math.min(this.x, this.y)
}

// () => Number
Vector2.prototype.maxComponent = function () {
    return Math.max(this.x, this.y)
}

export default Vector2
