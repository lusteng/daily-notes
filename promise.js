/**
 * promise 核心处理then 
 * 1.then 触发下一步操作
 * 2.resolve/reject 函数通过setTimeout跳出线程，在then后处理resolve/reject的回调
 */


const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED' 
    
class Promise {
    constructor(handle){
        if(!Promise._isFunc(handle)){
            throw new Error(`the Promise params must is function, but your params is ${Object.prototype.toString(handle)}`)
            return 
        }
        
        // 记录状态机
        this.status = PENDING
        // 记录resolve/reject 传入值 
        this.data = null 
        // 状态为pending是置入的回调函数队列
        this.cbQueen = []  
        
        // 首先调用传入promise函数
        try {
            handle(this.resolve.bind(this), this.reject.bind(this)) 
        } catch (err) {  
            // 执行异常，直接切换失败状态
            this.reject.call(this, err) 
        }
    }

    static _isFunc(fn){ 
        return typeof fn === 'function'
    }

    resolve(val){
        let _this = this 
        if(val && (typeof val === 'object' || typeof val === 'function')){ 
            //返回的是个promise对象 
            _this.then.call(val, _this.resolve.bind(this), _this.reject.bind(this))
            return
        } 
        _this.data = val
        _this.status = FULFILLED 
        _this._deplayRun() 
    }

    reject(val){ 
        let _this = this 
        _this.data = val
        _this.status = REJECTED 
        _this._deplayRun()
    } 
    
    then(resolve, reject){ 
        let _this = this   
        return new Promise((nextResolve, nextReject) => {
            let cb = {
                resolve: resolve ? resolve : (val) => { return val},
                reject: reject ? reject : (val) => { return val },
                nextResolve, 
                nextReject
            }        
            _this.cbQueen.push(cb)
        }) 
    } 

    // 延时：避免promise内部同步代码
    _deplayRun(){  
        let _this = this 
        setTimeout(() => {   
            _this.cbQueen.forEach(cb => {  
                _this._handleCbQueen(cb)
            }) 
        })
    }

    _handleCbQueen(cb){
        let 
            _this = this,
            data = _this.data,
            status = _this.status; 
        if(status === PENDING){ 
            return;
        } 
        let curFn = status === FULFILLED ? cb.resolve : cb.reject  
        let nextFn = status === FULFILLED ? cb.nextResolve : cb.nextReject
        if(!curFn){ 
            //then函数未传递任何东西,直接执行then下一步
            nextFn()
            return
        }  
        try { 
            let rt = curFn(data)  
            cb.nextResolve(rt)
        } catch (error) { 
            cb.nextReject(error)
        } 
    }

    catch(reject){
        return this.then(null, reject)
    } 
}

  

 