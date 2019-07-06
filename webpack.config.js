const path = require('path');

module.exports = {
    entry: './client/main.js',
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/js')
    },
    devServer: {
        contentBase: './dist',
        publicPath: '/js/',
        watchContentBase: true,
        compress: true,
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};