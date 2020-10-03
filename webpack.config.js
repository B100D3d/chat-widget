const path = require("path")
const webpack = require("webpack")

require("dotenv").config()

module.exports = {
    mode: "production",
    entry: "./widget/index.js",
    output: {
        filename: "chat.js",
        path: path.resolve(__dirname, "build"),
    },
    optimization: {
        minimize: false,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-proposal-class-properties"],
                    },
                },
            },
            {
                test: /\.sass$/i,
                use: [
                    {
                        loader: "style-loader",
                        options: { injectType: "styleTag" },
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                compileType: "module",
                                mode: "local",
                                localIdentName:
                                    "[name]__[local]--[hash:base64:5]",
                            },
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [["postcss-preset-env"]],
                            },
                        },
                    },
                    {
                        loader: "resolve-url-loader",
                        options: { sourceMap: false },
                    },
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.PRODUCTION": JSON.stringify(process.env.PRODUCTION),
        }),
    ],
}
