
/**
 * @desc 防抖函数（某段时间内只能执行一次）与节流函数（两次执行的间隔时间，频率）
 * @diff 防抖函数：初次调用了setTimeout后，若还继续触发则一直不执行fn函数（每次连续触发段内只能执行一次）
 * @diff 节流函数：初次调用了setTimeout后，若还继续触发则再次调用setTimeout（频率）
 * /

/**
 * @desc 防抖
 * @param fn 调用函数
 * @param wait 延迟执行时间  ms
 * @param immediate 是否立即执行 bool true 是 false 否
 */

function debounce(fn, wait = 1000, immediate = false){
    let timeout   
    return function(){ 
        let _context = this,
            arg = arguments
 
        if(!timeout){
            if(immediate){ //立即执行 
                //wait时间后timeout为空，fn可再次执行
                timeout = setTimeout(() => {  
                    timeout = null
                }, wait)
                fn.apply(_context, arg)
            }else{ 
                timeout = setTimeout(() => {
                    fn.apply(_context, arg) 
                    timeout = null
                }, wait)
            } 
        }
    }
} 

// 测试用例
let fun = function(){
    console.log(333333333)
}
let test = debounce(fun, 2000, true)
setInterval(() => {
    test()
}, 100)

/**
 * @desc 节流
 * @param fn 调用函数
 * @param interval 执行间隔时间  ms
 * @param immediate 时间段起始执行还是末位执行 bool true 起始 false 末位
 */

function throttle(fn, interval = 300, immediate = false){
    let 
        timeout,
        st = 0 
        
    return function () {
        let _context = this,
            args = arguments 

        if(immediate){ //时间段开头执行
            let nt = + new Date(); 
            if(nt - st > interval){
                fn.apply(_context, args)
                st = nt
            }            
        }else{ //时间段末位执行
            if(!timeout){
                timeout = setTimeout(() => {
                    fn.apply(_context, args)
                    timeout = null
                }, interval)
            }

        }
    }
} 



//工具包 
// lodash https://github.com/lodash/lodash
// underscore https://github.com/jashkenas/underscore
