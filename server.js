const express = require('express')

const app = express()
app.use(express.static('dist'))

const port = 3000

app.get('/', (req, res) => {
    res.send(`
        <html>

            <head>
                <link rel="stylesheet" href="styles.css" />
            </head>

            <body>
                <canvas id="canvas" width=1316 height=938></canvas>
                <script src="main.js"></script>
            </body>
        </html>
    `)
})

app.listen(port, () => console.log(`App listening on port ${port}`))
