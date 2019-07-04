### entry 单入口 多入口
```js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```
```js
module.exports = {
  entry: {
    app: './src/app.js',
    adminApp: './src/adminApp.js'
  }
};
```
### output  输出
这个 output 的参数 path 必须是一个绝对路径，不能是相对路径的

```text
1.多个 entry 的时候，最基本的是输出的 js 数量和 entry 数量相同的，js 文件的名字通常是和 entry 的 key 名字一样。比如：
entry: {
  index: './src/index/index.js',
  search: './src/searc/index.js'
}
对应输出的 js 文件应该是 index.js 和 search.js。

当然了，如果你有做一些代码分割，那么生成的 js 文件会更多，不过页面的主 js 文件数量和 entry 数量是一致的。
2. html 的数量和 entry 的数量也是一致的，如果也是1里面提到的 entry，那么将会生成： index.html 和 search.html。这个可以借助 html-webpack-plugin(https://github.com/jantimon/html-webpack-plugin) 达到效果
```
### loaders
webpack开箱即用只支持js和JSON两种类型，通过loaders去支持其他文件类型，并且把他们转换为有效的模块，并可以添加到依赖图中。
本身是一个函数，接受源文件作为参数，返回转换的结果；


### plugins
插件用于bundle文件的优化，资源管理和环境变量注入   作用于整个构建过程
eg:构建前，删除dist目录；


### mode
设置mode可以使用内置函数
development    
设置process.env.NODE_ENV的值位development，

```process.env 这个会返回用户的环境变量```

### 文件监听

. 启动webpack命令时带上--watch参数  需要手动刷新浏览器
.在配置中修改config.js watch为true

原理：
某个文件发生变化，并不会立刻告诉监听者，而是先缓存起来，等aggregateTimeout
```js
module.export = {
  // 默认false,也就是不开启
  watch:true,
  // 只有开启监听模式时，watchOptions才有意义
  watchOptions: {
    // 默认为空，不监听的文件或者文件夹，支持正则匹配
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行，默认300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次；
    poll: 1000
  }
}
```

### webpack热更新
WDS `webpack-dev-server` 不刷新浏览器
不输出文件，而是放在内存中
一般配合`HotModuleReplacementPlugin`插件

###  文件指纹
Hash 和整个项目的构建相关，只要项目文件有修改，整个项目构建的hash值就回更改
Chunkhash 和webpack打包的chunk有关，不同的entry会生成不同的chunkhash值
Contenthash 根据文件内容来定义hash，文件内容不变，则contenthash不变

### clean-webpack-plugin
清空dist目录
html-webpack-plugin   压缩 html  默认引引擎是ejs
optimize-css-assets-webpack-plugin   同时使用cssnano   压缩css

### 自动补齐前缀

autoprefixer
postcss-loader  放在css-loader之前即可

### rem
浏览器的分辨率
之前需要使用css媒体查询实现响应式布局
rem 相对单位   相对根元素  font-size of the root element
px是绝对单位


-------------------------
px2rem-loader

手淘lib-flexible

``` md 
q: 这样统一转化 rem 是方便，但是有的时候有些样式并不想转化，这个时候就感觉不灵活了
t: 这个问题可以解决的，可以用 /*no*/ 这种注释语法。比如：
.page {
  font-size: 12px; /*no*/
  width: 375px; /*no*/
  height: 40px; 
}

后面有 /*no*/这种注释语法会不进行 rem 的转换
```
### 资源内联
1. 代码层面：
页面框架的吃实话脚本
上报相关打点
css内敛避免页面闪动
2. 请求层面：减少HTTP网络请求数
小图片或者字体的内联（url-loader）

3. raw-loader 内联html    
```html
<script>${require('raw-loader!bable-loader!./meta.html')}</script>
```
raw-loader 内联js
```js
<script>${require('raw-loader!bable-loader!../node_modules/lib-flexible')}</script>
```

css内联
方案1：借助 style-loader
```js
use: [
  {
    loader: 'style-loader',
    options: {
      insertAt: 'top', // 样式插入到<head>
      singleton: true, // 将所有的style标签合并成一个
    }
  }
]
```
方案2： html-inline-css-webpack-plugin


### 多页面应用MPA
每一次页面跳转的时候，后台服务器会返回一个新的html文档；

每一个页面对应一个entry， 一个html-webpack-plugin
缺点：每次新增或删除页面都需要改webpack配置
```js
module.exports = {
  entry: {
    index: './src/index/index.js',
    search: './src/search/index.js'
  }
}
```
解决：
动态获取entry和设置html-webpack-plugin数量
利用 glob.sync 
  entry: glob.sync(path.join(__dirname, './src/*/index.js'))


### source map
作用：通过source map定位到源代码
  科普文，阮一峰
开发环境开启，线上环境关闭  ---- Sentry错误日志上传系统
  线上排查问题的时候可以将sourcemap上传到错误监控系统

### 提取页面公共资源
基础库分离
 思路：将react react-dom基础包通过cdn引入，不打包bundle中
方法：使用html-webpack-externals-plugin 
```js
plugins: [
  new HtmlWebpackExternalsPlugin({
    externals: [
      {
        module: 'react',
        entry: '//11.url/now/lib/15.1.0/react-with-add.......',
        global: 'React',
      } 
    ]
  })
]
```
或者使用webpack4内置的替代CommonsChunkPlugin插件
chunks参数说明：
 async 异步引入的库进行分离（默认）
 initial 同步引入的库进行分离
 all 所有引入的库进行分离（推荐）

 利用splitChunksPlugin分离页面公共文件

 ### tree shaking(摇数优化)
  概念：1个模块可能有多个方法，只要其中的某个方法使用到了，则整个文件都会被打到bundle里面去，tree shaking就是只要用到的方法打入bundle，没用到的方法会在uglify阶段被擦除掉

  使用：webpack默认支持，在.babelrc里设置modules：false即可，
    production mode的情况下默认开启

    要求：必须是ES6语法，CJS的方式不支持
### 代码分割
适用场景：抽离相同贴代码到一个共享块
脚本懒加载，使得初始下载的代码更小
懒加载js脚本的方式
· CommonJS：require.ensure
. ES6:动态import 目前原生还不支持，需要babel转换
`npm i @babel/plugin-syntax-dynamic-import --save-dev`
在.babelrc中加入
```js
"plugins":["@babel/plugin-syntax-dynamic-import"],
```

具体使用
```js
clickImport = () => {
  import(xxx).then((text) => {
    // 这里是逻辑代码；
  })
}
```
### eslint的必须性
行业优秀Eslint的规范实践
Airbnb: eslint-config-airbnb eslint-

制定规范
不重复造轮子，基于eslint：recommend配置并改进
能够帮助发现代码错误的规则，全部开启

帮助保持团队的代码风格统一，而不是限制开发体验

执行落地
1. 和CI/CD系统集成
安装husky 
增加npm script 通过lint-staged增量检查修改的文件
2. 和webpack集成
使用eslint-loader, 构建时检查JS规范
安装 eslint, eslint-plugin-import, eslint-plugin-react eslint-loader 
```js

```
注意：
```cmd
Module build failed (from ./node_modules/eslint-loader/index.js):
Error: Cannot find module 'eslint/lib/formatters/stylish'
```
这个问题是eslint6.x将formatters放在了别的地方
```https://github.com/webpack-contrib/eslint-loader/issues/271```

### webpack打包库和组件
webapck除了可以用来打包应用，也可以用来打包js库（腾讯面试必考题）

实现一个大整数加法库的打包
1. 需要打包压缩版和非压缩版本
2. 支持 AMD/CJS/ESM 模块引入

库的目录结构和打包要求，也可以使用script引入使用

如何将库暴露出去
library:指定库的全局变量
libraryTarget:支持库引入的方式
```js
module.exports = {
  mode: 'production',
  entry: {
    "large-number": "./src/index.js",
    "large-number.min": "./src/index.js"
  },
  output: {
    filename: "[name].js",
    library: "largeNumber",  // 指定库的全局变量
    libraryExport: 'default', 
    libraryTarget:'umd' // 支持库引入的方式
  }
}
```


### webpack ssr 服务端渲染
渲染：html+css+js+data -> 渲染后的HTML
服务端：
  1. 所有模板等资源都存储在服务端
  2. 内网机器拉取数据更快
  3. 一个HTML返回所有数据

浏览器和服务端交互流程
请求开始->server ->HTML template+data -> server 
SSR优势
减少白屏时间
利于SEO

实现思路
服务端：
使用 react-dom/server 的renderTostring方法将React组件渲染成字符串
服务端路由返回对应的模板

客户端
 打包出针对服务端的组件

 ### 增加代码格式化及提交钩子

    
