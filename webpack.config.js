const path = require('path');

module.exports = {
    entry: './client/main.js',
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/js')
    },
    devServer: {
        contentBase: './public',
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