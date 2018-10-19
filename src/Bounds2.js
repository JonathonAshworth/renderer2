import Point2 from './Point2.js'

// () => Bounds2
function Bounds2 () {
    this.pMin = new Point2(-Infinity, -Infinity)
    this.pMax = new Point2(Infinity, Infinity)
}

export default Bounds2
