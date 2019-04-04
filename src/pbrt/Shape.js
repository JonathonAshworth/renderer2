import Transform from './Transform.js'
import Bounds3 from './Bounds3.js'

// Transform, Transform, Boolean => Shape
function Shape (
  objToWorld = new Transform(),
  worldToObj = new Transform(),
  reverseOrientation = false,
) {
  this.objToWorld = objToWorld // Transform
  this.worldToObj = worldToObj // Transform, inverse of objToWorld

  // Determines which way is 'out'
  this.reverseOrientation = reverseOrientation

  // cached from Transform for performance reasons
  // relates to objToWorld transform (maybe same property always holds on the
  // inverse so it always relates to both?)
  this.transformSwapsHandedness = objToWorld.swapsHandedness()
}

// () => Bounds3
// Returns default bounding box in object space, should be implemented by subtypes
Shape.prototype.objectBound = function () {
  return new Bounds3()
}

// Returns bounding box in world space
Shape.prototype.worldBound = function () {
  return this.objToWorld.applyB(this.objectBound())
}

export default Shape
