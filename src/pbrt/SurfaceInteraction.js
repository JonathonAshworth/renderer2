import Interaction from './Interaction.js'

// Point3, Number, Point3, Vector3, Point2, Vector3, Vector3, Normal3, Normal3, Shape
function SurfaceInteraction (p, time, pError, wo, uv, dpdu, dpdv, dndu, dndv, shape) {
    // Calculate normal from surface derivatives
    const n = Normal3.fromVector3(dpdu.cross(dpdv).normalise())

    Interaction.call(this, p, time, n, pError, wo)

    this.uv = uv // Point2 - Co-ordinates on the surface of the shape

    // How the point changes with respect to the u,v co-ordinates on the shape
    // I guess this is the vector to the points if you increased u by 1 and v by 1
    // respectively?
    this.dpdu = dpdu // Vector3
    this.dpdv = dpdv // Vector3

    // Same but with the surface normal
    // I don't get why these are Normals and not Vectors? A change in normal (dn)
    // would be a vector parallel to the surface for a flat surface right? That's not
    // 'normal' to anything. Maybe it's so we don't have to implement normal.add(vector)
    // but then what's the point of differentiating between the abstractions if we're
    // just going to use it wrong. I'm missing something here, need to come back to it.
    this.dndu = dndu // Normal3f
    this.dndv = dndv // Normal3f

    this.shape = shape // Shape

    // Non-standard geometry for bump mapping, interpolation and shit
    // Some things need to use the standard geometry and some need to use this
    // if it's present. It usually gets set later on after the constructor runs
    // so it's just initialised to the standard geometry for now
    this.shadingGeometry = { n, dpdu, dpdv, dndu, dndv }

    // Fix normal direction if it's pointing inwards
    // TODO check this stuff after shape implementation, not sure if these
    // are properties or functions just yet
    if (this.shape && (this.shape.reverseOrientation != this.shape.transformSwapsHandedness)) {
        this.n = this.n.scale(-1)
        this.shadingGeometry.n = this.shadingGeometry.n.negate()
    }
}

SurfaceInteraction.prototype = Object.create(Interaction.prototype)

// Vector3, Vector3, Normal3, Normal3, Boolean => null
SurfaceInteraction.prototype.setShadingGeometry = function (dpdus, dpdvs, dndus, dndvs, orientationIsAuthoritative) {
    this.shadingGeometry.n = Normal3.fromVector3(dpdus.cross(dpdvs)).normalise()
    if (this.shape && (this.shape.reverseOrientation != this.shape.transformSwapsHandedness)) {
        this.shadingGeometry.n = this.shadingGeometry.n.negate()
    }
    if (orientationIsAuthoritative)
        this.n = this.n.faceForward(this.shadingGeometry.n)
    else
        this.shadingGeometry.n = this.shadingGeometry.n.faceForward(this.n)

    this.shadingGeometry.dpdu = dpdus
    this.shadingGeometry.dpdv = dpdvs
    this.shadingGeometry.dndu = dndus
    this.shadingGeometry.dndv = dndvs
}

export default SurfaceInteraction
