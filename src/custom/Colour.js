// Number, Number, Number => Colour
function Colour (r = 0, g = 0, b = 0) {
    this.r = r
    this.g = g
    this.b = b
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
