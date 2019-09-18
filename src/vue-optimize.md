### 优化vue打包文件过大

PS: 摘自早期项目优化记录，由于技术更新，有些不太适用了，适量阅读

#### 1. 采用路由懒加载
> 针对路由组件级组件分片打包,分隔文件大小

优化前
``` 
//路由配置引入组件
import BusinessManage from '@PAGE/Business/BusinessManage'

```
优化后
``` 
// 此处针对() => import封装一层
const BusinessManage = () => import('@PAGE/Business/BusinessManage')
```

输出分块js文件按文件名输出, 需要webpack 2.6.0以上版本

```
const BusinessManage = () => import(/* webpackChunkName: "BusinessManage" */'@PAGE/Business/BusinessManage')
```

[https://webpack.docschina.org/api/module-methods/#import-](https://webpack.docschina.org/api/module-methods/#import-)


#### 2. 引入第三方cdn打包
> 项目中存在较大的第三方库，通过webpack配置将第三方库隔离出打包文件，减少首屏白屏时间

```
// webpack.base.config.js 此处以项目vue-cli2.0为例
module.exports = {
    ... 
    //externals 为 webpack 所依赖的外部资源声明 
    //键名为 webpack 给外部资源所定义的内部别名alias，键值为外部资源所export暴露到全局的对象名称
    externals: { 
        "echarts": "echarts"
    },
    ...
}

// index.html 引入cdn库
<script src="https://cdn.bootcss.com/echarts/3.0.1/echarts.js"></script>

// xx component
// 删除 import echarts from 'echarts'，通过echarts变量名直接使用echarts
```

#### 3.开启文件gzip(后端同学开启下)

#### 4.取消map文件生成(线上map文件用于定位报错文件位置，意义不大，可以采用埋点监控)
```
// config/index.js
productionSourceMap: false
```