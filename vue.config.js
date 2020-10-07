// vue.config.js
module.exports = {
    pages: {
        index: {
            entry: 'src/main.ts',
        },
    },
    lintOnSave: true,
    productionSourceMap: false,
    configureWebpack: {
        resolve: {extensions: ['.js', '.vue', '.json', '.css', '.ts']},
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                    },
                },
            ],
        },
    },
};
