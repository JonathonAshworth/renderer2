import Vector3 from './pbrt/Vector3.js'
import Point3 from './pbrt/Point3.js'
import Ray from './pbrt/Ray.js'
import Transform from './pbrt/Transform.js'
import Colour from './custom/Colour.js'

// Constants
const RENDER_WIDTH = 1316
const RENDER_HEIGHT = 938

const HFOV = 180
const VFOV = 180


// Scene Description

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

const worldToCameraTransform = Transform.lookAt(
    new Point3(0, 0, 0),
    new Point3(0, 0, 1),
    new Vector3(0, 1, 0),
)

// Assumes ray.direction is a unit vector, otherwise it'll be cooked
const skyBoxInteraction = ray => new Colour(0.75 + ray.d.y / 4, 1, 1)



const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const pixelDataIndex = (x, y) => y * (RENDER_WIDTH * 4) + x * 4

let frameTime = 0
let frameStartRenderTime = 0
const renderLoop = () => {
    frameTime = window.performance.now() - frameStartRenderTime
    const fps = 1000 / frameTime

    frameStartRenderTime = window.performance.now()
    const imageData = ctx.createImageData(RENDER_WIDTH, RENDER_HEIGHT)

    for (let i = 0; i < RENDER_WIDTH; i++) {
        for (let j = 0; j < RENDER_HEIGHT; j++) {
            const cameraRay = castRayFromCamera(HFOV, VFOV, RENDER_WIDTH, RENDER_HEIGHT, i, j)
            const worldRay = worldToCameraTransform.inverse().applyR(cameraRay)
            const pixelColour = skyBoxInteraction(worldRay)
            imageData.data.set([...pixelColour.rgb(), 255], pixelDataIndex(i, j))
        }
    }

    ctx.putImageData(imageData, 0, 0)
    ctx.fillText(fps, 500, 500)
    window.requestAnimationFrame(renderLoop)
}

window.requestAnimationFrame(renderLoop)
