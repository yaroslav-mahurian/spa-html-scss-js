const path = require('path');
/* const HtmlWebpackPlugin = require("html-webpack-plugin"); */

module.exports = {
    // entry: './src/js/main.js',
    entry: {
        babelpolyfill: '@babel/polyfill',
        index: './src/js/main.js',
    },
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    devServer: {
        contentBase: './dist',
        writeToDisk: true,
    },
    plugins: [
        /* new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
        }), */
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};