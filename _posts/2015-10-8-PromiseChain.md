---
layout: templates
title: Promise使用总结
category: javascript
tag: promise
summary: <p>promise已经是成为我们解决回调炼狱的常用方案，而且已经得到官方标准支持，如果你刚刚开始使用Promise，本文将帮助你了解几个常见的几个Promise的使用场景</p>
---

如果你还不了解Promise，可以先移步这里了解[Promise API的使用方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。


### Promise.then的链式调用 ###

使用Promise可以让程序的可读性变得更好。如下面这样的代码
{% highlight js %}
var p = Promise.resolve();
      p.then(getUserInfo)
       .then(getGroupInfo)
       .then(getTaskInfo)
       ...

function getUserInfo(){
    
   console.log('getUserInfo start');
   return new Promise((resolve,reject)=>{
       setTimeout(()=>{
            var userInfo = {
                name  'adamchuan'
            };
            resolve(userinfo);
            console.log('getUserInfo end');
       },1000);
   });
}

function getGroupInfo(userinfo){
   console.log('getGroupInfo start');
   return new Promise((resolve,reject)=>{
       setTimeout(()=>{
            console.log('4');
            var groupInfo = {
                name : 'jdc'
            }
            console.log('getGroupInfo end');
            resolve(groupInfo,userinfo);
       },1000);
   });
}

function getTaskInfo(groupInfo,userinfo){
   console.log('getTaskInfo start');
   return new Promise((resolve,reject)=>{
       setTimeout(()=>{
        var taskInfo = {
            name : 'rebuild'
        };
        console.log('getTaskInfo end');
        resolve();
       },1000);
   });
}

/* 输出结果 
 getUserInfo start
 getUserInfo end
 getGroupInfo start
 getGroupInfo end
 getTaskInfo start
 getTaskInfo end
*/
{% endhighlight %}
如上面代码所示，我们可以很清楚的理解到程序执行的顺序是  

1. 得到userinfo
2. 得到groupinfo
3. 得到taskinfo

这样的代码在许多Promise示例中都可见，但这里有一点需要特别注意一下,
每次调用then都会返回一个新的Promise，如果then中的申明的方法没有返回一个Promise，那么会默认返回一个新的
处于fulfilled的Promise,之后添加的then中的方法都会立即执行,
如下面代码所示，如果在上面的代码中没有返回一个promise，输出的结果就变成 1 3 5 2 4 6了。
*当要在使用链式Promise时，请在then传入的方法中返回一个新的Promise。*

{% highlight js %}
var p = Promise.resolve();
      p.then(getUserInfo)
       .then(getGroupInfo)
       .then(getTaskInfo)
       ...

function getUserInfo(){
   console.log('1');
   new Promise((resolve,reject)=>{
       setTimeout(()=>{
        console.log('2');
        resolve();
       },1000);
   });
}

function getGroupInfo(){
   console.log('3');
   new Promise((resolve,reject)=>{
       setTimeout(()=>{
        console.log('4');
        resolve();
       },1000);
   });
}

function getTaskInfo(){
   console.log('5');
   new Promise((resolve,reject)=>{
       setTimeout(()=>{
        console.log('6');
        resolve();
       },1000);
   });
}

/* 输出结果 
 getUserInfo start
 getGroupInfo start
 getTaskInfo start
 getUserInfo end
 getGroupInfo end
 getTaskInfo end
*/
{% endhighlight %}

另外一个需要注意的是，resolve传递给下个then方法的值只能有一个，上面 getTaskInfo方法中是无法获取到userInfo的值，所以如果有多个值需要放在一个数据集合(Array,Object,Map,Set)中传入下个方法）。
{% highlight js %}
function getTaskInfo(groupInfo,userInfo){ /* userInfo为undefined */
   console.log(groupInfo); // { name : 'jdc'}
   console.log(userInfo);  // undefined
}
{% endhighlight %}

### 原生API函数的Promise化 ###
大部分原生的API函数并不支持Promise，还是基于回调来使用的，所以需要把一些方法Promise化，类似trunk化。
下面一个例子把原生中的定时器setTimeout ,进行Promise化。
{% highlight js %}
function timer(fn,time){
    return function(){
        return new Promise( (resolve,reject)=>{
            setTimeout(function(){
                fn();
                resolve();
            },time);
        });
    }
}
Promise.resolve()
    .then(
        timer(function () {
            console.log('1')
        }, 1000)
    )
    .then(() => {
        console.log('2');
    });
{% endhighlight %}
Promise化本质上都属于一种curry化。curry化是指，把需要传递多参数的函数生成一个新的函数，如上代码 先通过执行 timer得到一个新的函数，该函数会返回一个Promise，这样就完成了Promise化。
{% highlight js %}
 timer(function () {
    console.log('1')
 }, 1000) 
{% endhighlight %}


