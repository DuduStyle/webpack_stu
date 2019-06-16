"use strict";

const path = require("path");
const webpack = require("webpack");
const glob = require("glob");
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 设置多页面
const setPWA = () => {
  const entry = {};
  const HtmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, './src/pages/*/index.js'));
  console.log('entryFiles', entryFiles)
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/pages\/(.*)\/index\.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;
    HtmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/pages/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false
        }
      }),
    )
  })
  return {
    entry,
    HtmlWebpackPlugins
  }
}
const { entry, HtmlWebpackPlugins } = setPWA()
module.exports = {
  entry: entry,
  mode: "development",
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `[name].js`
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: "babel-loader"
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ].concat(HtmlWebpackPlugins),
  devServer: {
    contentBase: "./dist",
    hot: true
  }
};
