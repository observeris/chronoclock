var path = require('path');

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
            exclude: /node_modules|src\/lib\/three.js/,
            loaders: ['babel-loader?presets[]=react,presets[]=es2015'],
        }, {
            test: /\.(jpg|png|gif|hdr)$/,
            loader: "file?name=engine/[name]-[hash].[ext]",
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
        filename: "./main.js"
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
