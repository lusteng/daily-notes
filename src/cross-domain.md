### 序言
---
某天，和某大大交流技术的时候，被问到能列出多少种解决跨域方式时，心里巴拉巴拉了一顿，除了日常工作中用到的JSONP(早期工作)、CORS、代理，突然发现能说上来的很少呀！于是乎感觉来总结一番。。。

### 何为跨域？
跨域源自早期浏览器的[同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)，即协议 + 域名 + 端口三者相同，不同源之间的的脚本或文档、http请求不能相互访问。只有以下三个标签允许跨域加载资源：
+ \<img src=XXX>
+ \<link href=XXX>
+ \<script src=XXX>

### 跨域解决方案
1. [JSONP](https://github.com/lusteng/daily-notes/blob/master/src/jsonp.md) 利用\<script>标签无跨域限制

2. CORS 
> 利用后端设置Access-Control-Allow-Origin开启CORS

后端配置CORS 的字段

```js
Access-Control-Allow-Origin 允许跨站的域名
Access-Control-Allow-Headers 允许跨域的头
Access-Control-Allow-Methods 允许跨域的请求方式
```
关于预检请求（options请求）：通过预检知道服务端是否允许跨域请求，获知服务器是否支持发送的请求（DELETE等）

3. 后端代理(服务器发送请求无跨域限制)
+ 后端接口代理转发请求
例如现有项目中，先请求php接口 》 php接口再请求提供数据的go程序写的接口

+ nginx反向代理
例如现有的一个vue项目：
```nginx
// proxy服务器
server {
    listen       81;
    server_name  www.domain1.com;
    location / {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}
```
4. [postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)
> 主要用于iframe之间的跨域处理

```html
    // a 页面 port 3000
    <iframe src="http://localhost:4000/b.html" frameborder="0" id="frame"></iframe> 
    <script>
      window.onload = function(){
        let frame = document.getElementById('frame')
        frame.contentWindow.postMessage('are you ok?', 'http://localhost:4000') //发送数据
      }
    </script>
    
    // b 页面 4000
    // 监听message
    window.onmessage = function(e) {
        console.log(e.data) // are you ok?
        e.source.postMessage('ok', e.origin)
    }
```

5. websocket
> WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据。同时，WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 与 server 之间的双向通信就与 HTTP 无关了

```html
// socket.html
<script>
    let socket = new WebSocket('ws://localhost:3000/test');
    socket.onopen = function () {
      socket.send('are you ok? ');//向服务器发送数据
    }
    socket.onmessage = function (e) {
      console.log(e.data);//接收服务器返回的数据
    }
</script>
```
 
```js
// node server.js
const Koa = require('koa'),
    route = require('koa-route'),
    websockify = require('koa-websocket');

const app = websockify(new Koa()); 
app.ws.use(function (ctx, next) {
    return next(ctx);
});

// Using routes
app.ws.use(route.all('/test', function (ctx) {
    ctx.websocket.on('message', function (message) {
        console.log(message);
        ctx.websocket.send('yes');
    });
}));

app.listen(3000);

```
6. window.name + iframe
> 巧妙利用window.name(只能window.name属性)这个属性可以通过iframe切换时保留下来，然后可以通过本域页面访问到window.name 这个变量来绕过跨域机制

```html
<!-- 3000端口下 -->
<!-- a页面 -->
<!-- iframe加载c页面 -->
<iframe src="http://localhost:4000/c.html" onload="load()" frameborder="0" id="iframe"></iframe>

<script>
  let firstLoad = true
  let load = () => {
    if(firstLoad){
      // 初次加载c页面，更换加载b页面
      let iframe = document.getElementById('iframe')
      iframe.src = 'http://localhost:3000/b.html'
      firstLoad = false
    }else{
      // 第二次加载b页面，绕过跨域限制取window.name 值
      console.log(JSON.parse(iframe.contentWindow.name).refer) //c domain
    }
  }
</script>

<!-- b页面 -->
<!-- 空页面，为了获取c页面的window.name -->
```

```html
<!-- 4000 端口下 -->
<!-- c页面 -->
<script>
  //传递信息
  window.name = JSON.stringify({
      "refer":"c domain"
  })
</script> 
```

7. document.domain + iframe
> 通过js将两个子域设置相同的主域，可以访问其他二级域名的变量，适合同一主域下的二级域名的情况，比如a.test.com 和 b.test.com 

```html
<!-- a.html -->
<!-- a.test.com -->
  <!-- 访问b.test.com  -->
  <iframe src="http://b.test.com/b.html" frameborder="0" onload="load()" id="frame"></iframe>
  <script>
    // 设置主域
    document.domain = 'test.com'
    function load() {
      // 访问b.test.com 中的变量
      console.log(frame.contentWindow.bDomain);
    }
  </script>
```
```html
<!-- b.html -->
<!-- b.test.com -->
   <script>
    // 设置主域
    document.domain = 'test.com' 
    let bDomain = 'b.test'
   </script>
```

