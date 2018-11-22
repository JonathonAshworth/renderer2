import Point3 from '../pbrt/Point3.js'
import Normal3 from '../pbrt/Normal3.js'
import Colour from './Colour.js'

// Point3, Number => Sphere
function Sphere (c, r) {
    this.c = c || new Point3()
    this.r = r || 1
}

// Ray => Number
Sphere.prototype.hit = function (ray) {
    const oc = ray.o.subP(this.c)
    const a = ray.d.dot(ray.d)
    const b = 2 * oc.dot(ray.d)
    const c = oc.dot(oc) - this.r * this.r
    const disc = b*b - 4*a*c
    if (disc < 0) {
        return null
    } else {
        const nearest = (-b - Math.sqrt(disc)) / (2 * a)
        const farthest = (-b + Math.sqrt(disc)) / (2 * a)
        if (nearest >= 0)
            return nearest
        else if (farthest >= 0)
            return farthest
        else
            return null
    }
}

// Point3 => Colour
Sphere.prototype.colour = function (point) {
    const normal = Normal3.fromVector3(point.subP(this.c)).normalise()
    return new Colour(normal.x, normal.y, normal.z)
}

export default Sphere
