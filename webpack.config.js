module.exports = {
    entry: "./engine-babel-result/engine.js",

    output: {
        path: __dirname + "/engine",
        filename: "main.js"
    },
    module: {
        loaders: [{
            test: /\.es6?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel', // 'babel-loader' is also a legal name to reference
            query: {
                presets: ['es2015']
            }
        }]
    }
};
