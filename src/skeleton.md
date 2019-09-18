### 骨架屏原理
> 针对spa项目刷新载入时加载过慢，容易出现白屏，给页面加上一层loading状态，提升用户体验

1. 资源载入下来获取页面大致dom结构
2. 将自定义loading样式(或者图片)写到对应需要展示骨架屏样式的元素上
3. 资源加载下来移除骨架屏


### 骨架屏分类
*****
+ ### 侵入式
> 提前感知要植入骨架的页面，将提前针对性写好的骨架屏代码植入
```
// html 针对已知的页面写好骨架植入
<div class="skeleton">
    <div class="skeleton-head"></div>
    <div class="skeleton-body">
        <div class="skeleton-title"></div>
        <div class="skeleton-content"></div>
    </div>
</div>

// css
.skeleton {
    padding: 10px;
}

.skeleton .skeleton-head,
.skeleton .skeleton-title,
.skeleton .skeleton-content {
    background: rgb(194, 207, 214);
}

.skeleton-head {
    width: 100px;
    height: 100px;
    float: left;
}

.skeleton-body {
    margin-left: 110px;
}

.skeleton-title {
    width: 500px;
    height: 60px;
}

.skeleton-content {
    width: 260px;
    height: 30px;
    margin-top: 10px;
} 
```
> 耦合性过高，可扩展性低，每次改动页面的结构，需要对应于改写骨架代码

#### webpack打包植入(通过SPA框架替换页面根元素的间隙时机，将骨架代码通过webpack植入进去，获得展示骨架屏的机会)

编写webpack插件
// MyPlugin.js
``` 
function MyPlugin(options) {  
    // 个性化定制
    this.options = options; 
}

//webpack 执行插件的apply方法
MyPlugin.prototype.apply = function(compiler) {

    // webpack 提供的 compilation 
    compiler.plugin('compilation', (compilation) => {
        // 监听到html-webpack-plugin事件操作html页面 参见下面链接 
        compilation.plugin('html-webpack-plugin-before-html-processing',(htmlData, callback) => { 
            // 预先替换骨架屏代码
            htmlData.html = htmlData.html.replace('<div id="app"></div>',` 
                <div id="app">
                // ...
                // 写好的骨架html和css
                </div>
                <script>
                      var hash = window.location.hash;
                      var path = window.location.pathname;
                      // 根据不同路由页面显示不同的骨架屏
                      if (path === '/login' || hash === '#/login') { 
                        //...
                      } else if (path === '/user' || hash === '#/user') { 
                        //...
                      } else { 
                        //... 
                      }
                </script>`);
                // 调用回调函数，将处理好的html注入
                callback(null, htmlData);
        });
    });
}
// 导出插件
module.exports = MyPlugin; 
```
webpack配置文件调用
```

//省略n行代码 ...

// 调用插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MyPlugin = require('yourpath/MyPlugin')

//省略n行代码 ...

//在plugins中执行插件
plugins: [
    new HtmlWebpackPlugin({}),
    new MyPlugin(),  // 在html-webpack-plugin插件后调用
]

```

[html-webpack-plugin 封装webpack插件参考](https://www.npmjs.com/package/html-webpack-plugin)

[https://css-tricks.com/building-skeleton-screens-css-custom-properties/](https://css-tricks.com/building-skeleton-screens-css-custom-properties/)

+ ### 非侵入式
> 页面是不可预知，通过webpack植入骨架屏代码，感知页面元素，植入对应的骨架loading页面

+ 非侵入式跟侵入式的webpack植入骨架屏代码类似，最大的区别是能感知html的dom结构，获取dom的宽高，写上dom的加载样式,也就是最核心的实现难点<storage>感知页面结构</storage>
[借鉴饿了么实现骨架屏的原理](https://github.com/ElemeFE/page-skeleton-webpack-plugin)

1. 通过node库[puppeteer](https://github.com/GoogleChrome/puppeteer)获取dom结构，puppeteer会连接到一个Chromium实例，然后通过puppeteer.launch或puppeteer.connect创建一个Browser对象。此时就可以获取当前页面的dom结构
2. 获取到了dom元素，就可以针对需要做骨架屏的元素做样式处理
3. 同上侵入式，触发vue或者react 数据渲染，将根元素替换掉，展示真实的页面元素



