### 总结项目中使用mixins场景
> mixins类似对象的继承，n个子类继承公共父类的公共的一些方法，由于vue不像react采用面向对象写法，可以通过es6更好继承父组件的公共方法，vue提供mixins、extends实现多个子类继承公共功能，由于只在项目中使用mixins，这里总结下

****

### 局部使用
> 需要抽象出多个组件的公共功能然后进行封装，很好的避免公共需求改变时，每个组件都要改一遍的尴尬局面

公共文件定义mixins
```
// mixins/common.js
const common = {
    data(){
        return {
            name: "common"
        }
    },
    created() {
        console.log(`${this.name} 混进来了哦`)   
    },
    methods: {
        // 执行多个子组件公共抽象方法，此处仅示例
        sayCommon(){
            // do something
            console.log(`I am ${this.name}`);
        },
          
    },
} 
export default common
```

组件A 引入 
```
  import common from 'yourPath/mixins/common' 
  export default {  
    name: "a",
    mixins: [common], 
    created() { 
        this.say() 
    },
    methods: {
        say(){
            //do mixins thing
            this.sayCommon()
            console.log('I am A');
        },
    }
  }

  // common 混进来了哦
  // I am common
  // I am A
```


组件B 引入 
```
  import common from 'yourPath/mixins/common' 
  export default {  
    name: "b",
    mixins: [common], 
    created() { 
        this.say() 
    },
    methods: {
        say(){
            //do mixins thing
            this.sayCommon()
            console.log('I am B');
        },
    }
  }

  // common 混进来了哦
  // I am common
  // I am B
```

### 全局使用
> 针对不同的路由级组件做不同的事物，不必通过路由钩子来实现

// mixins/globalMixins.js
``` 
const GlobalMixins = {
    created() { 
        const componentName = this.$options.name
        // 判断组件名执行不同的一些事务
        if(componentName === 'A' || componentName === 'B' || componentName === 'C'){ 
            //do something
        }else if(componentName === 'C' || componentName === 'D'){
            //do something
        }
    },
}

export default GlobalMixins
```  
// mian.js
```
import GlobalMixins from 'yourPath/mixins/globalMixins'
Vue.mixin(GlobalMixins)
```




 


