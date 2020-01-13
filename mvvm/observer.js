/*
 * @Demo mvvm/observer.js
 * @Description: 模拟vue mvvm 实现流程
 */

/**
 * @description: 创建个vue实例
 */
class Vue{
    constructor(options){
         if(options.data && typeof options.data === 'function'){
            this._data = options.data.call(this)
            new Observer(this._data)
         }else{
             throw new Error('data must is function')
         } 
    }
    // 绑定数据
    mounted(){
        let vm = this
        new Watcher(vm, this.render)
    }
    // vue render 触发数据get
    render(){ 
        let vm = this
        // 假装访问了该data中属性
        for(let key in vm._data){
            vm._data[key]
        } 
    }
} 
 
/**
 * @description: 观察者 将传入的数据改造为可侦测数据 
 * @param datas vue 数据对象 
 * @return: 
 */
class Observer{
    constructor(datas){
        // 使用Object.defineProperty 转化可监测
        this.defReactive(datas)
    }
    defReactive(datas){
        for(let key in datas){
            let val = datas[key]
            // 每个订阅者数据下面建立一个专有dep，负责收集依赖和通知依赖变化
            let dep = new Dep()
            Object.defineProperty(datas, key, {
                enumerable: true,
                configurable: true,
                get(){
                    // 加入当前依赖到dep
                    dep.depend()
                    return val
                },
                set(newVal){
                    if(newVal === val) return
                    // 当前dep通知变更
                    dep.notify(key, newVal)
                }
            })
        }
    }
}

/**
 * @description: 依赖收集器，分发变更给订阅者
 * @param {type} 
 * @return: 
 */
const dep_id = 0
class Dep{
    constructor(){
        // 订阅者列表
        this.subs = []
        // 假装个id查看下当前对象内存
        this.id = dep_id
        dep_id ++ 
    }
    depend(){
        // 将当前watcher加入订阅者列表 
        if(Dep.target) Dep.target.addSub(this)
    }
    notify(key, val){  
        // 触发当前dep中的订阅者更新 
        this.subs.forEach(sub => {
            sub.update(key, val)
        })
    }
}

/**
 * @description: 订阅者 更新界面  
 * @param vm vue 对象
 * @param fn render 函数 
 */
class Watcher{
    constructor(vm, fn){
        this.vm = vm
        this.fn = fn  
        Dep.target = this
        fn.call(vm) 
        Dep.target = null
    }
    addSub(dep){  
        dep.subs.push(this)
    }
    update(key, val){
        console.log(`data的${key}更新成${val}了~~~`)
        // 触发render函数,在render的过程再次触发了对应key的get
        this.fn.call(this.vm)
    }

}


/**
 * @flow:  
 * 1. Vue 对象初始化阶段(beforeMount之前)，将data数据通过（Observer 观察者对象）Object.defineProperty转化成可检测数据模型
 * 2. Vue 对象挂载数据阶段(beforeMount之后，mounted之前)初始化Watcher对象(界面使用数据的依赖)
 * tips： Watcher初始化在Observer之后，防止数据还没挂载到界面就触发了watcher update,使用Dep.target存储watcher对象
 * 3. get 数据，触发Dep对象(负责收集依赖，管理订阅通知)depend将watcher对象存入subs列表(订阅者列表)
 * 4. 界面操作数据，触发set ，Dep发送notify，触发watcher的update,更新Vue的render函数，同时又一次触发get，再次将
 * 此次的watcher存入Dep的subs列表，以此类推 
 */