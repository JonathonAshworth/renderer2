// Number, Number, Number => Colour
function Colour (r = 0, g = 0, b = 0) {
    this.r = r
    this.g = g
    this.b = b
}

// ...Colour => Colour
Colour.avg = function (...colours) {
    return new Colour(
        colours.map(c => c.r).reduce((p,v) => p + v, 0) / colours.length,
        colours.map(c => c.g).reduce((p,v) => p + v, 0) / colours.length,
        colours.map(c => c.b).reduce((p,v) => p + v, 0) / colours.length,
    )
}

// () => [Number, Number, Number]
Colour.prototype.rgb = function () {
    return [this.r, this.b, this.g].map(val =>
        val <= 0 ? 0
        : val >= 1 ? 255
        : Math.floor(256 * val)
    )
}

export default Colour
