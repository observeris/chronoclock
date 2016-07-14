var path = require('path');
// For the file loader URL to get `/engine/` appended to it:
// 1) output.publicPath: "/engine"
// 2) loader: "file?name=/[hash].[ext]",

// Loaders need to be installed: either as a packaga.json dep or manually:
// > npm install --save-dev glslify-loader raw-loader
// > npm install --save-dev babel-loader babel-core babel-preset-es2015
module.exports = {
    context: __dirname,
    module: {
        loaders: [{
            test: /\.scss$/,
            loaders: ["style", "css", "sass"],
        }, {
            test: /\.html$/,
            loader: "file?name=[name].[ext]",
        }, {
            test: /\.(js|es6)$/,
            exclude: [
                path.resolve('./external/three/build/three.js'),
            ],
            loaders: ['babel-loader?presets[]=react,presets[]=es2015'],
        }, {
            test: /\.(jpg|png|gif|hdr)$/,
            loader: "file?name=/[hash].[ext]",
        }, {
            test: /\.(frag|vert|glsl)$/,
            loaders: ["raw", "glslify"]
        }]
    },
    entry: {
        app: [
            "./engine-es6/main.es6"
        ],
    },
    output: {
        path: __dirname + "/engine",
        filename: "./main.js",
        publicPath: "/engine"
    },
    resolve: {
        root: [
            path.resolve('./external/three/build'),
            path.resolve('./external/three/modules'),
            path.resolve('./external/vdc'),
            path.resolve('./external/superagent')
        ],
        extensions: ["", ".webpack.js", ".web.js", ".js", ".es6"]
    }
};
