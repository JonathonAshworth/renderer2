import Point2 from './Point2.js'
import Vector2 from './Vector2.js'

// () => Bounds2
// Point2 => Bounds2
// Point2, Point2 => Bounds2
function Bounds2 (p, q) {
    if (p === undefined) {
        this.pMin = new Point2(-Infinity, -Infinity)
        this.pMax = new Point2(Infinity, Infinity)
    } else if (q === undefined) {
        this.pMin = p
        this.pMax = p
    } else {
        this.pMin = new Point2(Math.min(p.x, q.x), Math.min(p.y, q.y))
        this.pMax = new Point2(Math.max(p.x, q.x), Math.max(p.y, q.y))
    }
}

// Number => Point2
Bounds2.prototype.corner = function (c) {
    return new Point2(
        c & 1 ? this.pMax.x : this.pMin.x,
        c & 2 ? this.pMax.y : this.pMin.y
    )
}

// Point2 => Bounds2
Bounds2.prototype.unionP = function (p) {
    return new Bounds2(
        new Point2(
            Math.min(this.pMin.x, p.x),
            Math.min(this.pMin.y, p.y)
        new Point2(
            Math.max(this.pMax.x, p.x),
            Math.max(this.pMax.y, p.y)
        )
    )
}

// Bounds2 => Bounds2
Bounds2.prototype.unionB = function (b) {
    return new Bounds2(
        new Point2(
            Math.min(this.pMin.x, b.pMin.x),
            Math.min(this.pMin.y, b.pMin.y)
        ),
        new Point2(
            Math.max(this.pMax.x, b.pMax.x),
            Math.max(this.pMax.y, b.pMax.y)
        )
    )
}

// Bounds2 => Bounds2
Bounds2.prototype.intersect = function (b) {
    return new Bounds2(
        new Point2(
            Math.max(this.pMin.x, b.pMin.x),
            Math.max(this.pMin.y, b.pMin.y)
        ),
        new Point2(
            Math.min(this.pMax.x, b.pMax.x),
            Math.min(this.pMax.y, b.pMax.y)
        )
    )
}

// Bounds2 => Boolean
Bounds2.prototype.overlaps = function (b) {
    const x = (this.pMax.x >= b.pMin.x) && (this.pMin.x <= b.pMax.x)
    const y = (this.pMax.y >= b.pMin.y) && (this.pMin.y <= b.pMax.y)
    return x && y
}

// Point2 => Boolean
Bounds2.prototype.inside = function (p) {
    return p.x >= this.pMin.x && p.x <= this.pMax.x &&
        p.y >= this.pMin.y && p.y <= this.pMax.y
}

// Point2 => Boolean
Bounds2.prototype.insideExclusive = function (p) {
    return p.x >= this.pMin.x && p.x < this.pMax.x &&
        p.y >= this.pMin.y && p.y < this.pMax.y
}

// Number => Bounds2
Bounds2.prototype.expand = function (n) {
    return new Bounds2(
        this.pMin.subV(new Vector2(n, n)),
        this.pMax.addV(new Vector2(n, n))
    )
}

// () => Vector2
Bounds2.prototype.diagonal = function () {
    return this.pMax.subP(this.pMin)
}

// () => Number
Bounds2.prototype.surfaceArea = function () {
    const d = this.diagonal()
    return 2 * (d.x + d.y)
}

// () => Number
Bounds2.prototype.volume = function () {
    const d = this.diagonal()
    return d.x * d.y
}

// () => 'x' | 'y'
Bounds2.prototype.maximumExtent = function () {
    const d = this.diagonal()
    if (d.x > d.y) return 'x'
    else return 'y'
}

// Point2 => Point2
Bounds2.prototype.lerp = function (p) {
    return new Point2(
        this.pMin.x + (this.pMax.x - this.pMin.x) * p.x,
        this.pMin.y + (this.pMax.y - this.pMin.y) * p.y
    )
}

// Point2 => Vector2
Bounds2.prototype.offset = function (p) {
    const o = p.subP(this.pMin)
    if (this.pMax.x > this.pMin.x)
        o.x = o.x / (this.pMax.x - this.pMin.x)
    if (this.pMax.y > this.pMin.y)
        o.y = o.y / (this.pMax.y - this.pMin.y)
    return o
}

// () => [Point2, Number]
Bounds2.prototype.boundingSphere = function () {
    const centre = this.pMin.addP(this.pMax).scale(0.5)
    const radius = centre.distance(this.pMax)
    return [centre, radius]
}

// Note: pbrt implementation has an iterator implementation for iterating
// over integer points within a bounding box. May need something similar

export default Bounds2
