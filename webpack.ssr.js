"use strict";

const path = require("path");
const glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin"); // 分离文件

// 设置多页面
const setPWA = () => {
  const entry = {};
  const HtmlWebpackPlugins = [];
  const entryFiles = glob.sync(
    path.join(__dirname, "./src/pages/*/index-server.js")
  );
  console.log("entryFiles", entryFiles);
  Object.keys(entryFiles).map(index => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/pages\/(.*)\/index-server\.js/);
    const pageName = match && match[1];
    if (pageName) {
      entry[pageName] = entryFile;
      HtmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          inlineSource: ".css$",
          template: path.join(__dirname, `src/pages/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: ["vendors", pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false
          }
        })
      );
    }
  });
  return {
    entry,
    HtmlWebpackPlugins
  };
};
const { entry, HtmlWebpackPlugins } = setPWA();
module.exports = {
  entry: entry,
  mode: "none",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `[name]-server.js`,
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          "babel-loader"
          // {
          //   loader: "eslint-loader",
          //   options: {
          //     formatter: require("eslint/lib/cli-engine/formatters/stylish")
          //   }
          // }
        ]
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
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")]
            }
          },
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75, // rem相对px的转换单位。  1rem=75px
              remPrecison: 8 // px转换为rem的小数点位数
            }
          }
        ]
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
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8][ext]"
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
      cssProcessor: require("cssnano"),
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }]
      },
      canPrint: true
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: "react",
          entry: "https://11.url.cn/now/lib/16.2.0/react.min.js",
          global: "React"
        },
        {
          module: "react-dom",
          entry: "https://11.url.cn/now/lib/16.2.0/react-dom.min.js",
          global: "ReactDom"
        }
      ]
    })
  ].concat(HtmlWebpackPlugins)
};
