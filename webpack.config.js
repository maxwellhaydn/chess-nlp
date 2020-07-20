const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'chess-nlp.js',
        globalObject: 'this',
        library: 'ChessNLP',
        libraryExport: 'default',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: true
                    }
                }
            },
            {
                test: path.resolve(__dirname, 'src', 'grammar'),
                exclude: (/node_modules/|/\.json$/),
                use: 'raw-loader'
            }
        ]
    }
};
