const path = require('path');

module.exports = [{
    entry: {
        'main': path.resolve(__dirname, 'src/main.ts'),
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            { test: /\.tsx?$/, use: ['ts-loader'] }
        ]
    }
}];