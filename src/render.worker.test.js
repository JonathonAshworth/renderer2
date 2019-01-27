import { castRayFromCamera } from './render.worker.js'

describe('Cast Ray From Camera', () => {
    it('Test Case 1 - Dead center', () => {
        const ray = castRayFromCamera(100, 100, 1000, 1000, 500, 500)
        expect(ray.d.x).toEqual(0)
        expect(ray.d.y).toEqual(0)
        expect(ray.d.z).toEqual(1) // Straight along z axis
        expect(ray.d.length()).toEqual(1) // Unit vector
    })

    it('Test Case 2 - Straight down', () => {
        const ray = castRayFromCamera(180, 180, 1000, 1000, 500, 1000)
        expect(ray.d.x).toEqual(0)
        expect(ray.d.y).toEqual(1) // Straight along y axis
        expect(ray.d.z).toEqual(0)
        expect(ray.d.length()).toEqual(1) // Unit vector
    })
})
