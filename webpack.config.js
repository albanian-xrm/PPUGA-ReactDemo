const glob = require("glob-promise");
const path = require("path");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const publisherPrefix = "albx_";

module.exports =
    /**
     * @param {{ AnalyzeBundle?: Boolean }} env
     * @return {import('webpack').Configuration}
     */
    async (env) => {
        /**
         * @type {import('webpack').Configuration['entry']}
         */
        const entry = {
            React: {
                import: ["react", "react-dom"],
                filename: publisherPrefix + "/vendor/React.js",
            },
            FluentUI: {
                import: ["@fluentui/react"],
                filename: publisherPrefix + "/vendor/FluentUI.js",
                dependOn: "React",
            },
        };

        /**
         * @type {import('html-webpack-plugin')[]}
         */
        const indexFiles = [];

        const entries = await glob("./src/**/*.Webresource.tsx");

        entries.forEach((element) => {
            const moduleName = path.basename(element, '.Webresource.tsx');
            const filename = element
                .replace(/^.\/src/gi, publisherPrefix)
                .replace(/\.Webresource\.tsx?$/gi, `.js`);
            entry[element] = {
                import: element,
                filename,
                dependOn: ["FluentUI"],
                asyncChunks: true,
            };

            indexFiles.push(new HtmlWebpackPlugin({
                inject: true,
                filename: path.join(path.dirname(filename), `${moduleName}.html`),
                template: path.join(__dirname, 'src', 'index.html'),
                templateParameters: {
                    name: moduleName
                },
                minify: false
            }));
        });

        return {
            devtool: false,
            entry,
            mode: "production",
            module: {
                rules: [
                    {
                        test: /\.[jt]sx?$/,
                        exclude: /node_modules/,
                        use: [
                            "babel-loader",
                            "ts-loader"
                        ]
                    },
                ],
            },
            output: {
                environment: {
                    arrowFunction: false,
                    const: false,
                    destructuring: false,
                    dynamicImport: false,
                    forOf: false,
                    module: false,
                    optionalChaining: false,
                    templateLiteral: false
                },
                path: path.resolve(__dirname, "dist"),
            },
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".jsx"],
                plugins: [new TsconfigPathsPlugin()],
            },
            optimization: {
                minimize: true,
                minimizer: [
                    new TerserPlugin({
                        terserOptions: {
                            sourceMap: true,
                            format: {
                                comments: false,
                            },
                        },
                        extractComments: false,
                    }),
                ],
            },
            plugins: [
                new webpack.ProgressPlugin(),
                new webpack.SourceMapDevToolPlugin({ filename: "[file].map" }),              
                ...indexFiles
            ],
            target: "web"
        };
    };
