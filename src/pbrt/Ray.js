// Point3, Vector3, Number, Number, Medium => Ray
function Ray (
    o = new Point3(),
    d = new Vector3(),
    tMax = Infinity,
    time = 0,
    medium = null
) {
    this.o = o // Point3
    this.d = d // Vector3

    this.tMax = tMax // Number
    this.time = time // Number

    this.medium = medium // Medium
}

// Number => Point3
Ray.prototype.t = function (t) {
    return this.o.addV(this.d.scale(t))
}

export default Ray
