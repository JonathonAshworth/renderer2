import Vector3 from './pbrt/Vector3.js'
import Point3 from './pbrt/Point3.js'
import Ray from './pbrt/Ray.js'
import Transform from './pbrt/Transform.js'
import Colour from './custom/Colour.js'
import Sphere from './custom/Sphere.js'

// Casts a unit ray from the camera, in camera space
// (Need to apply transform to turn the ray into world space)
export const castRayFromCamera = (hfov, vfov, width, height, x, y) => {
    const thetaX = (Math.PI / 180) * ((x / width) * hfov - (0.5 * hfov))
    const thetaY = (Math.PI / 180) * ((y / height) * vfov - (0.5 * vfov))

    const dirX = Math.sin(thetaX) * Math.cos(thetaY)
    const dirY = Math.sin(thetaY) * Math.cos(thetaX)
    const dirZ = Math.sqrt(1 - dirX**2 - dirY**2)

    return new Ray(
        new Point3(0, 0, 0),
        new Vector3(dirX, dirY, dirZ),
    )
}



// Assumes ray.direction is a unit vector, otherwise it'll be cooked
const skyBoxInteraction = ray => new Colour(0.75 + ray.d.y / 4, 1, 1)

const rayHit = (ray, objs) => {
    const hits = objs.map(obj => obj.hit(ray))
    if (hits.every(h => h === null)) {
        return null
    } else {
        let mindex = null
        let min = Infinity
        hits.forEach((h, i) => {
            if (h !== null && h < min) {
                mindex = i
                min = h
            }
        })
        return { obj: objs[mindex], point: ray.t(min) }
    }
}

const sampleUnitSphere = () => {
    let point = null
    do {
        point = new Point3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
        )
    } while (point.distance(new Point3(0, 0, 0)) > 1)
    return point
}

const colour = (ray, objs, ttl) => {
    if (ttl === 0) return new Colour(0, 0, 0)
    const hit = rayHit(ray, objs)
    if (hit === null) {
        // console.log('No hit, calling skybox', ray, objs)
        return skyBoxInteraction(ray)
    } else {
        // console.log('Hit, bouncing', ray, objs, hit)
        const normal = hit.obj.normal(hit.point)
        const tangentSphereCenter = hit.point.addV(normal)
        const samplePoint = tangentSphereCenter.addP(sampleUnitSphere())
        const newRay = new Ray(
            hit.point,
            samplePoint.subP(hit.point).normalise(),
        )
        return Colour.avg(colour(newRay, objs, ttl - 1), new Colour(0, 0, 0))
    }
}

// Index into the imageData
const pixelDataIndex = (x, y, width) => y * (width * 4) + x * 4

global.onmessage = function (e) {
    const {
        frameNumber,
        width,
        height,
        hfov,
        vfov,
        sceneCamera,
        sceneObjects,
        samplesPerPixel,
    } = e.data

    const pixels = new Uint8ClampedArray(4 * width * height)

    // Rebuild camera transform
    const cameraTransform = Transform.lookAt(
        new Point3(...sceneCamera[0]),
        new Point3(...sceneCamera[1]),
        new Vector3(...sceneCamera[2]),
    )

    // Rebuild scene objects
    const objs = sceneObjects.map(sObj => {
        switch (sObj.type) {
            case 'Sphere':
                return new Sphere(new Point3(...sObj.c), sObj.r)
            default:
                return new Sphere()
        }
    })

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const samples = []
            for (let k = 0; k < samplesPerPixel; k++) {
                const cameraRay = castRayFromCamera(
                    hfov,
                    vfov,
                    width,
                    height,
                    i - 0.5 + Math.random(),
                    j - 0.5 + Math.random(),
                )
                const worldRay = cameraTransform.inverse().applyR(cameraRay)
                samples.push(colour(worldRay, objs, 20))
            }
            
            const pixelColour = Colour.avg(...samples)
            pixels.set([...pixelColour.rgb(), 255], pixelDataIndex(i, j, width))
        }
    }

    postMessage({ frameNumber, pixels })
}
