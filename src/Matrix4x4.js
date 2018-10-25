// () => Matrix4x4
// Number[4][4] => Matrix4x4
function Matrix4x4 (m) {
    if (m !== undefined) {
        this.m = m
    } else {
        this.m = Matrix4x4.identity()
    }
}

Matrix4x4.identity = () => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
]

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
    // Compute via Gauss-Jordan elimination
    // This is going to be hectic...

    const i = Matrix4x4.identity()
    const m = this.m.map((row, index) => [...row.slice(), ...i[index]])

    const swapRows = (a, b) => {
        const c = m[a]
        m[a] = m[b]
        m[b] = c
    }

    const scaleRow = (r, s) => {
        m[r] = m[r].map(n => n * s)
    }

    const addScaledRow = (a, b, s) => {
        m[a] = m[a].map((n, i) => n + m[b][i] * s)
    }

    // Convert to row echelon form and set leading co-efficients to 1
    for (let x = 0; x < 4; x++) {
        // Find the leading co-efficient and set it to 0
        let y = x
        while (m[x][x] === 0 && y < 4) { swapRows(x, y); y++ }
        if (y === 4 && m[x][x] === 0)
            throw new Error('Tried to invert uninvertible matrix')

        scaleRow(x, 1 / m[x][x])

        // Zero out the cells below the leading co-efficient
        for (let z = x + 1; z < 4; z++) {
            addScaledRow(z, x, -m[z][x])
        }
    }

    // Back substitute until we have an identity matrix on the left
    for (let x = 3; x > 0; x--) {
        for (let z = x - 1; z >= 0; z--) {
            addScaledRow(z, x, -m[z][x])
        }
    }

    // Inverse matrix is now on the right
    return m.map(row => row.slice(4, 4))
}

export default Matrix4x4
