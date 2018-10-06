import Point3 from './Point3.js'
import Vector2 from './Vector2.js'

// Number, Number => Point2
function Point2 (x = 0, y = 0) {
    this.x = x
    this.y = y
}

// Point3 => Point2
Point2.fromPoint3 = function (p) {
    return new Point2(p.x, p.y)
}

// Point2 => Point2
Point2.prototype.addP = function (p) {
    return new Point2(this.x + p.x, this.y + p.y)
}

// Vector2 => Point2
Point2.prototype.addV = function (v) {
    return new Point2(this.x + v.x, this.y + v.y)
}

// Point2 => Vector2
Point2.prototype.subP = function (p) {
    return new Vector2(this.x - p.x, this.y - p.y)
}

// Vector2 => Point2
Point2.prototype.subV = function (v) {
    return new Point2(this.x - v.x, this.y - v.y)
}

// Number => Point2
Point2.prototype.scale = function (s) {
    return new Point2(this.x * s, this.y * s)
}

// Point2 => Number
Point2.prototype.distance = function (p) {
    return this.subP(p).length()
}

// Point2 => Point2
Point2.prototype.min = function (p) {
    return new Point2(Math.min(this.x, p.x), Math.min(this.y, p.y))
}

// Point2 => Point2
Point2.prototype.max = function (p) {
    return new Point2(Math.max(this.x, p.x), Math.max(this.y, p.y))
}

// () => Point3
Point2.prototype.floor = function () {
    return new Point2(Math.floor(this.x), Math.floor(this.y))
}

// () => Point3
Point2.prototype.ceil = function () {
    return new Point2(Math.ceil(this.x), Math.floor(this.y))
}

// () => Point3
Point2.prototype.abs = function () {
    return new Point2(Math.abs(this.x), Math.abs(this.y))
}

export default Point2
