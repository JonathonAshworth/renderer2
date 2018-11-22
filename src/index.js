import RenderWorker from './render.worker.js'

// Constants
const RENDER_WIDTH = 1316
const RENDER_HEIGHT = 938

const HFOV = 90
const VFOV = 60

const FPS = 60


const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')


const sceneLength = 4 // seconds

// Origin, LookAt, Up
const sceneCamera = t => [
    [0, 0, 0],
    [0, Math.sin((t/2) * Math.PI), Math.cos((t/2) * Math.PI)],
    [0, Math.cos((t/2) * Math.PI), -Math.sin((t/2) * Math.PI)],
]

const sceneObjects = t => [
    { type: 'Sphere', c: [5, 3, 0], r: 1.5 },
    { type: 'Sphere', c: [-4, 10, 0], r: 2 },
    { type: 'Sphere', c: [0, 7, -2], r: 0.8 },
    { type: 'Sphere', c: [1, -13, -8], r: 3 },
    { type: 'Sphere', c: [10, 20, 5], r: 3.5 },
    { type: 'Sphere', c: [-2, -2, -12], r: 2 },
]

// Queue up the rendering of frames
const renderWorker = new RenderWorker()
for (let i = 0; i < sceneLength * FPS; i++) {
    renderWorker.postMessage({
        frameNumber: i,
        width: RENDER_WIDTH,
        height: RENDER_HEIGHT,
        hfov: HFOV,
        vfov: VFOV,
        sceneCamera: sceneCamera(i / FPS),
        sceneObjects: sceneObjects(i / FPS),
    })
}

// Collect the frames
const frames = []
let framesRendered = 0
let totalRenderTime = 0
renderWorker.onmessage = function (e) {
    frames[e.data.frameNumber] = ctx.createImageData(RENDER_WIDTH, RENDER_HEIGHT)
    frames[e.data.frameNumber].data.set(e.data.pixels, 0)
    totalRenderTime += e.data.renderTime
    framesRendered++
}


let frameNum = 0
const renderLoop = () => {
    if (framesRendered === sceneLength * FPS) {
        ctx.putImageData(frames[frameNum], 0, 0)
        frameNum = frameNum === frames.length - 1 ? 0 : frameNum + 1
    } else {
        ctx.clearRect(0, 0, RENDER_WIDTH, RENDER_HEIGHT)
        ctx.fillText('Rendering...', 100, 100)
        ctx.fillText(`${framesRendered} / ${sceneLength * FPS} frames rendered`, 100, 200)
        ctx.fillText(`Average frame time: ${totalRenderTime / framesRendered}`, 100, 300)
    }
    window.requestAnimationFrame(renderLoop)
}

window.requestAnimationFrame(renderLoop)
