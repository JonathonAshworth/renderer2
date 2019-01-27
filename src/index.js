import RenderWorker from './render.worker.js'

// Constants
const RENDER_WIDTH = 1316
const RENDER_HEIGHT = 938

const HFOV = 131.6
const VFOV = 93.8

const FPS = 60
const NUM_THREADS = 6

const SAMPLES_PER_PIXEL = 1


const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')


const sceneLength = 1 // seconds

// Origin, LookAt, Up
const sceneCamera = t => [
    [10 * Math.sin((t/2) * Math.PI), 10, 10 * Math.cos((t/2) * Math.PI)],
    [0, 0, 0],
    [0, -1, 0],
]

const sceneObjects = t => [
    { type: 'Sphere', c: [0, 0, 0], r: 2 },
    { type: 'Sphere', c: [0, 4, 0], r: 1 },
    { type: 'Sphere', c: [0, 6, 0], r: 0.5 },
    { type: 'Sphere', c: [4, 0, 0], r: 1 },
    { type: 'Sphere', c: [-4, 0, 0], r: 1 },
    { type: 'Sphere', c: [0, 0, 4], r: 1 },
    { type: 'Sphere', c: [0, 0, -4], r: 1 },
]

// Queue up the rendering of frames
const renderWorkers = []
for (let i = 0; i < NUM_THREADS; i++)
    renderWorkers.push(new RenderWorker())


// Collect the frames when they come back from the workers
const frames = []
let framesRendered = 0
const renderStartTime = performance.now()

const handleMessage = function (e) {
    frames[e.data.frameNumber] = ctx.createImageData(RENDER_WIDTH, RENDER_HEIGHT)
    frames[e.data.frameNumber].data.set(e.data.pixels, 0)
    framesRendered++
}

renderWorkers.forEach(w => w.onmessage = handleMessage)


// Send the frames off to be rendered
for (let i = 0; i < sceneLength * FPS; i++) {
    renderWorkers[i % NUM_THREADS].postMessage({
        frameNumber: i,
        width: RENDER_WIDTH,
        height: RENDER_HEIGHT,
        hfov: HFOV,
        vfov: VFOV,
        sceneCamera: sceneCamera(i / FPS),
        sceneObjects: sceneObjects(i / FPS),
        samplesPerPixel: SAMPLES_PER_PIXEL,
    })
}




let frameNum = 0
const renderLoop = () => {
    if (framesRendered === sceneLength * FPS) {
        ctx.putImageData(frames[frameNum], 0, 0)
        frameNum = frameNum === frames.length - 1 ? 0 : frameNum + 1
    } else {
        const totalRenderTime = performance.now() - renderStartTime
        ctx.clearRect(0, 0, RENDER_WIDTH, RENDER_HEIGHT)
        ctx.fillText('Rendering...', 100, 100)
        ctx.fillText(`${framesRendered} / ${sceneLength * FPS} frames rendered`, 100, 200)
        ctx.fillText(`Average frame time: ${totalRenderTime / framesRendered}`, 100, 300)
    }
    window.setTimeout(() => window.requestAnimationFrame(renderLoop), 1000 / FPS)
}

window.requestAnimationFrame(renderLoop)
