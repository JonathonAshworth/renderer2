import Ray from './Ray.js'

// () => RayDifferential
function RayDifferential (o, d, tMax, time, medium) {
    Ray.call(this, o, d, tMax, time, medium)
    this.hasDifferentials = false // Boolean
    this.rxOrigin = null // Point3
    this.ryOrigin = null // Point3
    this.rxDirection = null // Vector3
    this.ryDirection = null // Vector3
}

RayDifferential.prototype = Object.create(Ray.prototype)

// Ray => RayDifferential
RayDifferential.prototype.fromRay = function (r) {
    return new RayDifferential(r.o, r.d, r.tMax, r.time, r.medium)
}

// Number => ()
RayDifferential.prototype.scaleDifferentials = function (s) {
    this.rxOrigin = this.o.addP(this.rxOrigin.subP(this.o).scale(s))
    this.ryOrigin = this.o.addP(this.ryOrigin.subP(this.o).scale(s))
    this.rxDirection = this.d.add(this.rxDirection.sub(this.d).scale(s))
    this.ryDirection = this.d.add(this.ryDirection.sub(this.d).scale(s))
}

export default RayDifferential
