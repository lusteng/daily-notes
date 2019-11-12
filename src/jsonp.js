/***
 * 
 */

// jsonp 原理 （利用请求script资源没有跨域限制）
// 1.客户端（前端）注册一个callback函数
function callback(data){
    //data 操作获取到的数据
}
// 2.服务端将需要返回的json数据作为入参到callback函数，返回给客户端
// 请求跨域资源返回的内容
callback(data)


/**
 * @param {
 *  url,  // jsonp资源url
 *  data,  // jsonp url search参数
 *  success, // 成功回调
 *  error   // 失败回调
 * } opts 
 */

function jsonp(opts = {}){
    let {
        url = "",
        data = {},
        success = () => {},
        error = () => {}
    } = opts
    if(!url) throw new Error("please pass in url params")
    // 随机名
    let radomName = `id_${+ new Date()}_${Math.random().toString().substr(2)}`
    // script 标签
    let urlParamsMerge = Object.assign({}, data, {callback: radomName}) 
    let scriptEle = document.createElement('script')
    
    for(let u in urlParamsMerge){
        url += url.indexOf('?') > -1 ? `&${u}=${ (urlParamsMerge[u])}` : `?${u}=${encodeURIComponent(urlParamsMerge[u])}`
    }

    scriptEle.id = radomName
    scriptEle.src = url
    
    // 执行callback回调
    window[radomName] = (d) => {
        // 清空执行
        window[radomName] = undefined
        
        // 清空script元素
        removeNode(document.getElementById(radomName))
        
        // 回传数据
        success(d)                
    } 
    // 错误回调
    scriptEle.onerror = error

    // 插入到页面head元素
    document.head.appendChild(scriptEle) 
    
    // 移除节点
    function removeNode(node){
        let parent = node.parentNode 
        if(parent && parent.type !== 11){ 
            parent.removeChild(node)
        }
    }
}


//测试
jsonp({
    url: "https://floor.jd.com/user-v20/hotwords/get",
    data: {
        source: "pc-home",
        pin: "",
        uuid: 154512121,
        _: 1573462343824
    }, 
    success: function(data){
        console.log(data);
    },
    error: function(error){
        console.log(error);
    }
})

//测试
jsonp({
    url: "https://floor.jd.com/user-v20/hotwords/g",
    data: {
        source: "pc-home",
        pin: "",
        uuid: 15451,
        _: 1573462343824
    }, 
    success: function(data){
        console.log(data);
    }, 
    error: function(error){
        console.log(error);
    }
})