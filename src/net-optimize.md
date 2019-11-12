### 前言
> http加载优化是前端性能优化中的重要一环，有效的优化可以缩短资源加载时间，提升用户体验，那么此处从chrome调试面板的timing切入了解

### network timing (资源加载时序)

如下图列出一个资源加载的时间线

<img src="https://github.com/lusteng/daily-notes/blob/master/images/chrome-timing.png" width="486" height="407"/>

### timing 解析
+ Queuing(排队)

如果一个请求排队，则表明请求被渲染引擎推迟，因为它被认为比关键资源（如脚本/样式）的优先级低。这经常发生在 images（图像） 上

请求排队的原因：

1. 这个请求被搁置，在等待一个即将被释放的不可用的TCP socket。
2. 这个请求被搁置，因为浏览器限制。在HTTP 1协议中，每个源上只能有6个TCP连接
3. 正在生成磁盘缓存条目（通常非常快）。

+ Stalled/Blocking (停止/阻塞)

发送请求之前等待的时间。它可能因为进入队列的任意原因而被阻塞。这个时间包括代理协商的时间。

+ Proxy Negotiation (代理协商)

与代理服务器连接协商花费的时间

+ DNS Lookup (DNS查找)

执行DNS查找所用的时间。 页面上的每个新域都需要完整的往返(roundtrip)才能进行DNS查找。

+ Initial Connection / Connecting (初始连接/连接)

建立连接所需的时间， 包括TCP握手/重试和协商SSL。

+ SSL

完成SSL握手所用的时间。

+ Request Sent / Sending (请求已发送/正在发送)

发出网络请求所花费的时间。 通常是几分之一毫秒。

+ Waiting (TTFB) (等待)

等待初始响应所花费的时间，也称为`Time To First Byte`(接收到第一个字节所花费的时间)。这个时间除了等待服务器传递响应所花费的时间之外，还捕获到服务器发送数据的延迟时间。

+ Content Download / Downloading (内容下载/下载)

接收响应数据所花费的时间，即从第一个字节开始，到下载完最后一个字节结束所花费的时间。 


### 针对timing 产生问题优化

+ Queuing 等待时间过长

同域名下的请求数是否过多？发送的http请求数是否过多？ 

+ Stalled/Blocking 阻塞时间过长

js性能太差，阻塞页面？ 某个请求慢阻塞页面的加载？ 



+ Initial Connection / Connecting 花费时间长


+ Content Download 内容下载时间过长

考虑一些图片、样式资源文件体积过大，考虑优化体积大小

[分析页面加载慢原因](https://www.jianshu.com/p/24b93b13e5a9)
