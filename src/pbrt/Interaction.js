import Point3 from './Point3.js'
import Vector3 from './Vector3.js'
import Normal3 from './Normal3.js'

// Point3, Number, Normal3, Point3, Vector3
function Interaction (
    p = new Point3(),
    time = 0,
    n = Normal3(),
    pError = null,
    wo = new Vector3(),
    // mediumInterface = new MediumInterface(), TODO
) {
    this.p = p // Point3
    this.time = time // Number

    this.n = n // Normal3 - Normal to the surface if interaction is on a surface
    this.pError = pError // Vector3 - Upper bound for floating point error
    this.wo = wo // Vector3 - Incoming ray direction if interaction is on a ray
}

// () => Boolean
Interaction.prototype.isSurfaceInteraction = function () {
    this.n.equals(new Normal3())
}

export default Interaction
