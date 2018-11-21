module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' },
            },
        ],
    },
}
