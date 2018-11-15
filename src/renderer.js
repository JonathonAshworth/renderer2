const RENDER_WIDTH = 1316
const RENDER_HEIGHT = 938

const HFOV = 180
const VFOV = 180


// Scene Description


const vectorAdd = (v, w) => [v[0] + w[0], v[1] + w[1], v[2] + w[2]]
const vectorSubtract = (v, w) => [v[0] - w[0], v[1] - w[1], v[2] - w[2]]
const vectorMultiply = (v, w) => [v[0] * w[0], v[1] * w[1], v[2] * w[2]]
const vectorDivide = (v, w) => [v[0] / w[0], v[1] / w[1], v[2] / w[2]]
const vectorNegate = v => [-v[0], -v[1], -v[2]]
const vectorScale = (v, k) => [v[0]*k, v[1]*k, v[2]*k]
const vectorLength = v => Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2)
const vectorUnit = v => vectorScale(v, 1 / vectorLength(v))
const vectorSum = v => v.reduce((v, prev) => prev + v, 0)
const vectorDot = (v, k) => vectorSum(vectorMultiply(v, w))
const vectorCross = (v, k) => [
    v[1] * w[2] - v[2] * w[1],
    v[2] * w[0] - v[0] * w[2],
    v[0] * w[1] - v[1] * w[0],
]

const ray = (o, d, t) => vectorAdd(o, vectorScale(d, t))

const vecToRgb = c => c.map(val =>
    val <= 0 ? 0 
    : val >= 1 ? 255
    : Math.floor(256 * val)
)

// hfov and vfor in degrees
// Returns a ray tuple in camera space
const cast = (hfov, vfov, width, height, x, y) => {
    const thetaX = (Math.PI / 180) * ((x / width) * hfov - (0.5 * hfov))
    const thetaY = (Math.PI / 180) * ((y / height) * vfov - (0.5 * vfov))

    const dirX = Math.sin(thetaX) * Math.cos(thetaY)
    const dirY = Math.sin(thetaY) * Math.cos(thetaX)

    return [[0, 0, 0], [dirX, dirY, 1 - dirX ** 2 - dirY ** 2]]
}

// ray direction is a unit vector
const colour = ray => [0.75 + ray[1][1] / 4, 1, 1]

const intersectSphere = (centre, radius, [origin, direction]) => {
    const oc = vectorSubtract(origin, centre)
    const a = vectorDot(direction, direction)
    const b = 2 * vectorDot(oc, direction)
    const c = vectorDot(oc, oc) - radius ** 2
    const discriminant = b ** 2 - 4 * a * c
    if discriminant < 0
        return null
    else
        return (-b - Math.sqrt(discriminant)) / (2 * a) // nearest intersection
}





const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const imageData = ctx.createImageData(RENDER_WIDTH, RENDER_HEIGHT);

const index = (x, y) => y * (RENDER_WIDTH * 4) + x * 4

for (let i = 0; i < RENDER_WIDTH ; i++) {
    for (let j = 0; j < RENDER_HEIGHT; j++) {
        const c = vecToRgb(colour(cast(HFOV, VFOV, RENDER_WIDTH, RENDER_HEIGHT, i, j)))
        imageData.data.set([...c, 255], index(i, j))
    }
}

ctx.putImageData(imageData, 0, 0);
