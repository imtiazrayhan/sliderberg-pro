const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        'admin': path.resolve(__dirname, 'src/admin/index.tsx'),
        'index': path.resolve(__dirname, 'src/main/index.tsx'),
        'blocks/posts-slider': path.resolve(__dirname, 'src/blocks/posts-slider/index.tsx'),
        'posts-slider-frontend': path.resolve(__dirname, 'src/frontend/index.js')
    },
    output: {
        ...defaultConfig.output,
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    },
    resolve: {
        ...defaultConfig.resolve,
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
};