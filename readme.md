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