### 本方案仅用于预研，无实际应用到项目中
> 多页打包主要的两点
1. entry改为多入口
2. html-webpack-plugin 插件针对不同入口输出不同页面

PS：当然还有那些css，js文件的拆分输入  

### 配置固定多页应用
> 本例中分为front和backend前后两个界面

1. 配置入口
```js
    // 改为多入口
    entry: {
        front: './src/project/front/main.js',
        backend: './src/project/backend/main.js',
    }
```


 