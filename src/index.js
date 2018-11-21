import RenderWorker from './render.worker.js'

// Constants
const RENDER_WIDTH = 1316
const RENDER_HEIGHT = 938

const HFOV = 180
const VFOV = 180

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
