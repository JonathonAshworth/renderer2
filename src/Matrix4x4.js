// () => Matrix4x4
// Number[4][4] => Matrix4x4
function Matrix4x4 (m) {
    if (m !== undefined) {
        this.m = m
    } else {
        this.m = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]
    }
}

// Matrix4x4 => Boolean
Matrix4x4.prototype.equals = function (m) {
    return this.m.every((row, i) => row.every((cell, j) => cell === m.m[i][j]))
}

// () => Matrix4x4
Matrix4x4.prototype.transpose = function () {
    return new Matrix4x4([
        [this.m[0][0], this.m[1][0], this.m[2][0], this.m[3][0]],
        [this.m[0][1], this.m[1][1], this.m[2][1], this.m[3][1]],
        [this.m[0][2], this.m[1][2], this.m[2][2], this.m[3][2]],
        [this.m[0][3], this.m[1][3], this.m[2][3], this.m[3][3]],
    ])
}

// Matrix4x4 => Matrix4x4
Matrix4x4.prototype.mul = function (m) {
    const r = new Matrix4x4()
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            r.m[i][j] = this.m[i][0] * m.m[0][j] +
                        this.m[i][1] * m.m[1][j] +
                        this.m[i][2] * m.m[2][j] +
                        this.m[i][3] * m.m[3][j]
        }
    }
    return r
}

// () => Matrix4x4
Matrix4x4.prototype.inverse = function () {
    // TODO
    // pbrt implementation not listed in book
    // uses 'numerically stable Gauss-Jordan elimination routine'
    // ...whatever the fuck that is.
}

export default Matrix4x4
