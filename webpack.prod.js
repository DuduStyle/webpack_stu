"use strict";

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    index: "./src/index.js",
    search: "./src/search.js"
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `[name]_[chunkhash:8].js`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader, 
          "css-loader", 
          "less-loader", 
          {
          loader: 'postcss-loader',
          options: {
            plugins: [
              require('autoprefixer')
            ]
          }
        }, {
          loader: 'px2rem-loader',
          options: {
            remUnit: 75,    // rem相对px的转换单位。  1rem=75px   
            remPrecison: 8   // px转换为rem的小数点位数 
          }
        }]
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name]_[contenthash:8].css"
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.(css)$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    }),
    new HtmlWebpackPlugin({
     template: path.join(__dirname, 'src/index.html'),
     filename: 'index.html',
     chunks: ['index'],
     inject: true,
     minify: {
       html5:true,
       collapseWhitespace:true,
       preserveLineBreaks: false,
       minifyCSS: true,
       minifyJS: true,
       removeComments: false
     }
    }),
  ]
};
