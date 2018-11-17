import Point3 from './Point3.js'
import Vector3 from './Vector3.js'

// () => Bounds3
// Point3 => Bounds3
// Point3, Point3 => Bounds3
function Bounds3 (p, q) {
    if (p === undefined) {
        this.pMin = new Point3(-Infinity, -Infinity, -Infinity)
        this.pMax = new Point3(Infinity, Infinity, Infinity)
    } else if (q === undefined) {
        this.pMin = p
        this.pMax = p
    } else {
        this.pMin = new Point3(Math.min(p.x, q.x), Math.min(p.y, q.y), Math.min(p.z, q.z))
        this.pMax = new Point3(Math.max(p.x, q.x), Math.max(p.y, q.y), Math.max(p.z, q.z))
    }
}

// Number => Point3
Bounds3.prototype.corner = function (c) {
    return new Point3(
        c & 1 ? this.pMax.x : this.pMin.x,
        c & 2 ? this.pMax.y : this.pMin.y,
        c & 4 ? this.pMax.z : this.pMax.z
    )
}

// Point3 => Bounds3
Bounds3.prototype.unionP = function (p) {
    return new Bounds3(
        new Point3(
            Math.min(this.pMin.x, p.x),
            Math.min(this.pMin.y, p.y),
            Math.min(this.pMin.z, p.z)
        ),
        new Point3(
            Math.max(this.pMax.x, p.x),
            Math.max(this.pMax.y, p.y),
            Math.max(this.pMax.z, p.z)
        )
    )
}

// Bounds3 => Bounds3
Bounds3.prototype.unionB = function (b) {
    return new Bounds3(
        new Point3(
            Math.min(this.pMin.x, b.pMin.x),
            Math.min(this.pMin.y, b.pMin.y),
            Math.min(this.pMin.z, b.pMin.z)
        ),
        new Point3(
            Math.max(this.pMax.x, b.pMax.x),
            Math.max(this.pMax.y, b.pMax.y),
            Math.max(this.pMax.z, b.pMax.z)
        )
    )
}

// Bounds3 => Bounds3
Bounds3.prototype.intersect = function (b) {
    return new Bounds3(
        new Point3(
            Math.max(this.pMin.x, b.pMin.x),
            Math.max(this.pMin.y, b.pMin.y),
            Math.max(this.pMin.z, b.pMin.z)
        ),
        new Point3(
            Math.min(this.pMax.x, b.pMax.x),
            Math.min(this.pMax.y, b.pMax.y),
            Math.min(this.pMax.z, b.pMax.z)
        )
    )
}

// Bounds3 => Boolean
Bounds3.prototype.overlaps = function (b) {
    const x = (this.pMax.x >= b.pMin.x) && (this.pMin.x <= b.pMax.x)
    const y = (this.pMax.y >= b.pMin.y) && (this.pMin.y <= b.pMax.y)
    const z = (this.pMax.z >= b.pMin.z) && (this.pMin.z <= b.pMax.z)
    return x && y && z
}

// Point3 => Boolean
Bounds3.prototype.inside = function (p) {
    return p.x >= this.pMin.x && p.x <= this.pMax.x &&
        p.y >= this.pMin.y && p.y <= this.pMax.y &&
        p.z >= this.pMin.z && p.z <= this.pMax.z
}

// Point3 => Boolean
Bounds3.prototype.insideExclusive = function (p) {
    return p.x >= this.pMin.x && p.x < this.pMax.x &&
        p.y >= this.pMin.y && p.y < this.pMax.y &&
        p.z >= this.pMin.z && p.z < this.pMax.z
}

// Number => Bounds3
Bounds3.prototype.expand = function (n) {
    return new Bounds3(
        this.pMin.subV(new Vector3(n, n, n)),
        this.pMax.addV(new Vector3(n, n, n))
    )
}

// () => Vector3
Bounds3.prototype.diagonal = function () {
    return this.pMax.subP(this.pMin)
}

// () => Number
Bounds3.prototype.surfaceArea = function () {
    const d = this.diagonal()
    return 2 * (d.x * d.y + d.x * d.z + d.y * d.z)
}

// () => Number
Bounds3.prototype.volume = function () {
    const d = this.diagonal()
    return d.x * d.y * d.z
}

// () => 'x' | 'y' | 'z'
Bounds3.prototype.maximumExtent = function () {
    const d = this.diagonal()
    if (d.x > x.y && d.x > d.z) return 'x'
    else if (d.y > d.z) return 'y'
    else return 'z'
}

// Point3 => Point3
Bounds3.prototype.lerp = function (p) {
    return new Point3(
        this.pMin.x + (this.pMax.x - this.pMin.x) * p.x,
        this.pMin.y + (this.pMax.y - this.pMin.y) * p.y,
        this.pMin.z + (this.pMax.z - this.pMin.z) * p.z
    )
}

// Point3 => Vector3
Bounds3.prototype.offset = function (p) {
    const o = p.subP(this.pMin)
    if (this.pMax.x > this.pMin.x)
        o.x = o.x / (this.pMax.x - this.pMin.x)
    if (this.pMax.y > this.pMin.y)
        o.y = o.y / (this.pMax.y - this.pMin.y)
    if (this.pMax.z > this.pMin.z)
        o.z = o.z / (this.pMax.z - this.pMin.z)
    return o
}

// () => [Point3, Number]
Bounds3.prototype.boundingSphere = function () {
    const centre = this.pMin.addP(this.pMax).scale(0.5)
    const radius = centre.distance(this.pMax)
    return [centre, radius]
}

// Note: pbrt implementation has an iterator implementation for iterating
// over integer points within a bounding box. May need something similar

export default Bounds3
