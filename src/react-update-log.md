### 为什么要升级？
16版React不仅体积缩小了30%，还新增了碎片（fragments）、错误边界、portals、支持自定义 DOM 属性、Hooks、新的生命周期。。。
公司主业务线由于开展比较早，每次迭代新功能却只能用用15版本那些陈旧的功能，为了开上新的React，组内讨论，决定利用一段时间把主业务线React和架构同时做次升级


### --save 与 --save-dev 区别
踩完坑对这俩有了更准确的理解， dev只安装develop环境需要的插件，一般是打包工具，换言之，该部分插件不会出现在生产环境上，而--save则是生产和开发环境都会用到，通常是react这类的功能代码库
 
### 踩坑之路
升级react、react-dom版本连带产生的问题，落后版本库升级，打包工具升级，解决升级后的打包错误


+ #### webpack2 升级到 webpack4
1. 增加webpack4 mode development/production 配置项

2. loaders 改 rules 

3. webpack.dll.js 
 ```
 - new webpack.optimize.OccurenceOrderPlugin()
 + new webpack.optimize.OccurrenceOrderPlugin()

 - new webpack.optimize.UglifyJsPlugin() 

 + optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: false
                }
            })
        ] 
}
 
 ```
 4. CSS文件提取插件
 mini-css-extract-plugin 替代 extract-text-webpack-plugin 

 5. autoprefixer-loader废弃
改为 postcss-loader + autoprefxer
```
// 根目录新增 postcss.config.js
module.exports= {
    plugins: [
      require('autoprefixer')({
        'browsers': [
          'defaults',
          'defaults',
          'last 2 versions',
          '> 1%',
          'iOS 7',
          'last 3 iOS versions'
        ]
      })
    ]
  }

// css loader 增加postcss-loader
``` 

6. 配置更新
```
- resolve: {
    root: [
        path.resolve('node_modules')
    ]
}

+ 
resolve: {
    modules: [ 
        path.resolve('node_modules')
    ]
}
```

+ ### babel工具 升级

babel-loader v6 》 v8

1. 安装[@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)插件
> 去掉旧有babel-preset-es2015的babel-preset-esxxxx需要对es6、es7、es8等需要不停安装插件方案

2. babel-loader版本搭配错误引发的打包错误
babel-loader@^8 搭配 @babel/x babel7版本工具库
babel-loader@^7及以下 搭配 babel-x babel7版本之前工具库 

3. 安装 @babel/plugin babel 7以上版本插件
安装[@babel/plugin-transform-destructuring](https://babeljs.io/docs/en/babel-plugin-transform-destructuring)插件
> 解决 {...this.props} es6解构赋值语法转换

最后改后的.babelrc 配置文件
```
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ], 
    "plugins": [
        "react-hot-loader/babel",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-destructuring",
        "@babel/plugin-transform-modules-commonjs"
    ]
}

```

4. babel打包插件报错
```
Uncaught TypeError: Cannot assign to read only property 'exports' of object '#<Object>'  报错
import 和 module.export不能混用， 安装@babel/plugin-transform-modules-commonjs 插件解决
```

### react-hot-loader 升级
1. 打包报错，原因 react-hot-loader 版本过低
```
Module not found: Error: Cannot resolve module 'react/lib/ReactMount'  
```

### React 关联包升级
1. react 与 react-dom对应版本不一致导致报错
```
lib.js:formatted:52200 Uncaught TypeError: Cannot read property 'hasOwnProperty' of undefined
    at Object.<anonymous> (lib.js:formatted:52200)
```

[stackoverflow解答](https://stackoverflow.com/questions/56003446/uncaught-typeerror-cannot-read-property-hasownproperty-of-undefined-react-dom)

2. react-router 与 react对应不一致 导致报错
```
"export 'hashHistory' was not found in 'react-router'
```
```
"export 'Link' was not found in 'react-router'
```

### React 升级坑解决
1. 新版不支持prop-types
解决方案： 
+ 针对项目代码，引入prop-types第三方包解决
+ 针对第三方在更新维护类库，升级到支持16版本react的库
   以antd为例： 升级到v3版本，再针对图标Icon以及其他组件api调整的地方做出修改
+ 针对第三方已停止更新类库，使用公司github账号fork版本库，在fork库下面做出修改，再依赖fork的库

2. 新版不支持React.createClass
    引入 create-react-class

3. 消除不安全生命周期在开发环境的warning
```
componentWillMount
componentWillReceiveProps
componentWillUpdate
```
批量添加前缀 UNSAFE_

[生命周期更新文档](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html)

[react 16 升级指南](https://reactjs.org/blog/2017/09/26/react-v16.0.html)



### 踩坑之后的收获
> 踩坑之后，整体架构把握更加清晰，加深了对react的一些全局观的认识

---

+ ## react-router v4的变迁
react-router v3与v2本质上区别不大，v4版本开始有了本质的变化 
最直观的体现，v4版本的路由使用更加灵活，不再是v3及之前那种僵硬的用法，可以与其他组件和睦相处，不再排它性
```
import { BrowserRouter, Route } from 'react-router-dom'

const PrimaryLayout = () => (
  <div className="primary-layout">
    <header>
      Our React Router 4 App
    </header>
    <main>
      <Route path="/" exact component={HomePage} />
      <Route path="/users" component={UsersPage} />
    </main>
  </div>
)

const HomePage =() => <div>Home Page</div>
const UsersPage = () => <div>Users Page</div>

const App = () => (
  <BrowserRouter>
    <PrimaryLayout />
  </BrowserRouter>
)

render(<App />, document.getElementById('root'))
```

1. exact 是否精准匹配(v4 路由可以同时匹配多条路由，而v3只能匹配一条)
设置exact： 访问/users 只会匹配/users
不设置exact： 访问/users 只同时匹配/users和/

2. Switch 只能匹配包裹的一条路由
```
// 增加Switch， 访问/users 只渲染第一个UsersPage组件
// 不增加Switch， 访问/users 同时渲染UsersPage, myPage组件

import React from 'react'
import ReactDom from 'react-dom'  
import { 
    BrowserRouter, Route, Link, Switch } from 'react-router-dom'

const PrimaryLayout = () => (
  <div className="primary-layout">
    <header>
      Our React Router 4 App
    </header>
    <main>  
            <Route path="/" exact component={HomePage} />
            <Route path="/users" component={UsersPage} />
            <Route path="/users" component={myPage} />
    </main> 
  </div>
)

const HomePage =() => <div>首页</div>
const UsersPage = () => <div>用户页面1</div>
const myPage = () => <div>我的页面2</div>

const App = () => (
  <BrowserRouter>
    <PrimaryLayout />
  </BrowserRouter>
)

ReactDom.render(<App />, document.getElementById('app'))

```
 
3. 新增props.match，可以轻松获取路由进入匹配路上后传入的参数
```
<Route path="/users/:userId" component={UserProfilePage} />

//UserProfilePage 组件可以通过 this.props.match.params.userId 获取到进入路由的userId

```

4. [借助v4 api 构建具有鉴权的路由](https://css-tricks.com/react-router-4/#article-header-id-8)

5. 新增NavLink，可以增加active选中状态
```
//匹配到/app时增加active class
<NavLink to="/app" exact activeClassName="active">Home</NavLink>
``` 

[react-router v4 变更文档](https://css-tricks.com/react-router-4/)
[react-router api 文档](https://www.jianshu.com/p/e3adc9b5f75c)

+ ## react-router-dom
v4 版本只需引入 react-router-dom即可  
react-router-dom: 基于react-router，加入了在浏览器运行环境下的一些功能，例如：Link组件，会渲染一个a标签，Link组件源码a标签行; BrowserRouter和HashRouter 组件，前者使用pushState和popState事件构建路由，后者使用window.location.hash和hashchange事件构建路由。
react-router: 实现了路由的核心功能
react-router-native: 基于react-router，类似react-router-dom，加入了react-native运行环境下的一些功能。

----

+ ## redux 架构
> reduce的作用，庞大的单页面应用管理数据困难，数据的变化不可预测，不可溯源，兄弟组件间数据影响困难，reduce构建一个树形store,将数据来源单一性，变化可预测性，适用于大型应用的数据管理  

结构： Reducer、Action、Store 三部分构成
Store 管理着数据源state， 每个reduce只有一个树状数据源
Action 是改变数据的唯一外在接口
Reducer 根据Action描述的type来改变的数据state，reducer是定义一系列纯函数

+ ## react-reduce
> 连接react和reduce的桥梁
+ react 连接 reduce (react-redux) 通过容器组件将store传入到react的展示型组件
+ 根组件处 通过的react-redux提供的Provider 高阶组件，将Redux和React绑定在一起
+ 通过mapStateToProps 将redux数据中心store state映射到展示组件的props中
```
const mapStateToProps = state => {
    return {
        todos: state.todos
    }
} 
```
+ 通过mapDispatchToProps 将redux的dispatch方法接入到展示组件的props中
```
const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch(toggleTodo(id))
    }
  }
}
```
+ 使用connect 连接容器组件和展示组件
```

import { connect } from 'react-redux'

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScdnBindWidthTraffic)

```
+ 展示型组件可以通过this.props.dispatch 调用action 改变reduce的state
定义action 处理函数不单要定义action，还要有个专门的字典对应不同action的type

+ 使用createStore让所有容器组件可以访问的store，在根组件操作
```
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

+ 将异步请求变成同步改变action
针对异步请求的三种状态 pedding fulfilled rejected 分别对应三种状态，处理不同的数据流向  XXX_REQUEST XXX_SUCCESS XXX_FAILURE 变成一个同步处理异步改变数据的状态

[react-redux 文档](https://cn.redux.js.org/docs/advanced/UsageWithReactRouter.html)
[redux介绍](https://www.jianshu.com/p/53faad8a152a)

----
+ ## react 16 新特性

[react 更新日志](https://github.com/facebook/react/blob/master/CHANGELOG.md#1600-september-26-2017)

1. render 支持返回数组和字符串
```
// 不需要再将元素作为子元素装载到根元素下面
render() {
  return [
    <li/>1</li>,
    <li/>2</li>,
    <li/>3</li>,
  ];
  // or
  return "render string" 
}

2. 错误边界，不会出现v15版本出现错误导致整个组件树报错 
[错误边界解说](https://zh-hans.reactjs.org/docs/error-boundaries.html)

捕获到子组件错误后使用  static getDerivedStateFromError() 渲染备用UI
 componentDidCatch() 打印错误信息

```
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

// 控制错误边界捕获的父级组件
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>

```
[错误边界使用代码示例](https://codepen.io/gaearon/pen/wqvxGa?editors=0010)

3. createPortal(插槽)  将组件挂载到非根元素的其他dom中，最适合弹窗的场景  

[代码解析](https://zh-hans.reactjs.org/docs/portals.html)

```
render() {
  // React 并*没有*创建一个新的 div。它只是把子元素渲染到 `domNode` 中。
  // `domNode` 是一个可以在任何位置的有效 DOM 节点。
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```
 
4. Fiber(分片)
Fiber 是对 React 核心算法的一次重新实现，将原本的同步更新过程碎片化，避免主线程的长时间阻塞，使应用的渲染更加流畅。

5. Fragment(空标签)
改变15版本的，数组子元素需要用个额外标签包裹
```
  <table>
      <tbody>
          <tr>
              <React.Fragment>
                  <td>aaa</td>
                  <td>bbb</td>
                  <td>ccc</td>
                  <td>ddd</td>
              </React.Fragment>
          </tr>
      </tbody>
  </table>

  <!-- 实际渲染dom：
  <table>
      <tbody>
          <tr> 
              <td>aaa</td>
              <td>bbb</td>
              <td>ccc</td>
              <td>ddd</td> 
          </tr>
      </tbody>
  </table> -->
```

6. createRef / forwardRef (新的定义ref的方式)
```
// before React 16
  componentDidMount() {
    const el = this.refs.myRef
  }

  render() {
    return <div ref="myRef" />
  }

// React 16+
  constructor(props) {
    super(props)

    this.myRef = React.createRef()
  }

  //访问dom this.myRef.current

  render() {
    return <div ref={this.myRef} />
  }
```

forwardRef 多使用在高阶组件或者父组件获取子组件dom元素
```
const FancyButton = React.forwardRef((props, ref) => (
    <button ref={ref} className="FancyButton">
      {props.children}
    </button>
));

class Parent extends React.Component{ 

  constructor(){
    super();
    this.divRef = React.createRef()
  }  

  // this.divRef.current FancyButton组件内容

  render(){ 
    return <div>
        <FancyButton 
            ref={this.divRef}
        >
        aaaaaaaaaaaaaaaaa
        </FancyButton> 
    </div>
  }
}
```
[参考文档](https://zh-hans.reactjs.org/docs/react-api.html#reactcreateref)

7. React.lazy(异步加载组件)
```
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```
[参考文档](https://zh-hans.reactjs.org/docs/code-splitting.html#reactlazy)


8. 新增生命周期
+ getDerivedStateFromProps (从props的值映射state) 
取代 componentWillMount componentWillReceiveProps
一个静态的纯函数生命周期，根据props返回state的映射
```
  //纯函数，不要做什么额外的副作用改变
  static getDerivedStateFromProps(props, state){ 
      if(props.test !== state.testState){
          // 映射改变testState的state值
          return {
              testState: props.tes + 'a'
          }
      }else{
          // 当不做任何改变时，返回null
          return null
      }
  }
```

+ getSnapshotBeforeUpdate(获取变化更新前的快照)
取代 componentWillUpdate 
配合componentDidUpdate使用

```
getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevProps.test < this.props.test) {
      return prevProps.test + 10;
    }
    return null;
}
// snapshot获取到getSnapshotBeforeUpdate的返回值
componentDidUpdate(prevProps, prevState, snapshot) {
  // 此处可以根据snapshot做一些操作
}

```
[参考文档](https://zh-hans.reactjs.org/docs/react-component.html#getsnapshotbeforeupdate)

9. Hook 
替代class 使用函数式书写组件

+ useState  为组件添加state值， 第一个参数为state值，第二个参数为设置state值的函数，相当于setState

```
import React, { useState } from 'react'
const HomePage =(props) => {
    const [count, setCount] = useState(11)
    
    return <div>
        <button  onClick={() => setCount(count + 1)}>修改值</button>
        <p>展示修改的值{count}</p>
    </div>
}
```

+ useEffect 集合了react 生命周期的作用, 每次组件更新会调用useEffect   
class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途

```
const HomePage =(props) => {
    const [count, setCount] = useState(11)
    const [val, setVal] = useState('my val')
    
    useEffect(() => {
        document.title = val + count
    })

    return <div>
        <button  onClick={() => setCount(count + 1)}>修改值</button>
        <p>展示修改的值{count}</p>
    </div>
}
```

+ 自定义Hook
一种官方约定： 函数名以use 开头，并调用其他hook，则认为是一种自定义hook

更多其他hook，参见官方文档
[hook文档](https://zh-hans.reactjs.org/docs/hooks-overview.html)




 

