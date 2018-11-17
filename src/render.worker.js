import Vector3 from './pbrt/Vector3.js'
import Point3 from './pbrt/Point3.js'
import Ray from './pbrt/Ray.js'
import Transform from './pbrt/Transform.js'
import Colour from './custom/Colour.js'

// Casts a unit ray from the camera, in camera space
// (Need to apply transform to turn the ray into world space)
const castRayFromCamera = (hfov, vfov, width, height, x, y) => {
    const thetaX = (Math.PI / 180) * ((x / width) * hfov - (0.5 * hfov))
    const thetaY = (Math.PI / 180) * ((y / height) * vfov - (0.5 * vfov))

    const dirX = Math.sin(thetaX) * Math.cos(thetaY)
    const dirY = Math.sin(thetaY) * Math.cos(thetaX)

    return new Ray(
        new Point3(0, 0, 0),
        new Vector3(dirX, dirY, 1 - dirX **2 - dirY **2),
    )
}

// Assumes ray.direction is a unit vector, otherwise it'll be cooked
const skyBoxInteraction = ray => new Colour(0.75 + ray.d.y / 4, 1, 1)

// Index into the imageData
const pixelDataIndex = (x, y) => y * (RENDER_WIDTH * 4) + x * 4


onmessage = function (e) {
    const {
        frameNumber,
        width,
        height,
        hfov,
        vfov,
        sceneCamera,
    } = e.data

    const startTime = performance.now()
    const pixels = new Uint8ClampedArray(4 * width * height)

    // Rebuild camera transform
    const cameraTransform = Transform.lookAt(
        new Point3(...sceneCamera[0]),
        new Point3(...sceneCamera[1]),
        new Vector3(...sceneCamera[2]),
    )

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const cameraRay = castRayFromCamera(hfov, vfov, width, height, i, j)
            const worldRay = transform.inverse().applyR(cameraRay)
            const pixelColour = skyBoxInteraction(worldRay)
            pixels.set([...pixelColour.rgb(), 255], pixelDataIndex(i, j))
        }
    }

    const renderTime = performance.now() - startTime
    postMessage({ frameNumber, pixels, renderTime })
}
