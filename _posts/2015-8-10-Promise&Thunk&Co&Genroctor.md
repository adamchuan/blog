---
layout: templates
title: Co异步回调的原理
category: javascript
tag: javascript
summary: <p>今天终于把Co的原理给想明白了，在此做个记录</p>
---
大约在去年这个时候，我第一次听说了callback hell，和Promise。当时有过一个初步的印象。
而这一年中也不断看到一些新的解决回调的方案出来，尤其对Co非常感兴趣（羊群效应。。）。借最近一个基于Koa的项目的机会，终于详细学习了Co，并弄懂了他的原理。  
浅显说，Co就是利用了generator构造器来解决了callback hell的。但是网上那些文章真的说得太模糊，对于刚开始接触Co的人，造成了很大的困惑（也许就只有我吧。。）。这里把我自己理解写下来，也算一种总结。
先介绍一下generator,为了便于理解，这里只强调一下generator分步执行的特性。

{% highlight javascript %}

function* fn(){
    beforeA();
    yield doA();
    yield doB();
    afterB();
}
var gen = fn(); //生成构造器;
gen.next(); //这里会执行到以第一个yield之前的位置，所以执行beforeA 和 doA 这两行;
gen.next(); //这里会执行到第二个yield的位置，也就是执行 doB() 
gen.next(); //这里会执行到生成器结束的位置，afterB（）;

{% endhighlight %}

简单来说 generator 可以变成一种分步函数，gen成为这gGenerator函数的指针，通过调用gen.next()来执行下一步，这也是异步执行的关键。[generator详细介绍请看这里](http://www.ruanyifeng.com/blog/2015/04/generator.html)
是不是有种感觉可以利用这个next来达到异步的，但是好像又不知道怎么该怎么去做，那先看看下面这个例子。

{% highlight javascript %}
var fs = require("fs");
fs.readFile('path1', function (err, data) {
  if (err) throw err;
  console.log(data);
  fs.readFile('path2', function (err, data) {
    if (err) throw err;
        console.log(data);
  });
});
{% endhighlight %}

这是一个常见的异步回调的例子，现在我们用generator来改写它，下面是第一版。

{% highlight javascript %}

var fs = require("fs");

function* unname(){

    var data1 = yield fs.readFile('path1',function(err,data){

        if(err) gen.throw(err);

        gen.next(data);

    });

    console.log(data1);

    var data2 = yield fs.readFile('path2',function(err,data){

        if(err) gen.throw(err);

        gen.next(data);

    }); 

    console.log(data2);
}

var gen = unname();

{% endhighlight %}

大功告成！可是好像哪里不对，这个本质上还是之前的回调方法。我们期望的方法应该是类似这样的，通过一个yield关键字，来表明这里是异步执行的。这样的写法简洁明了，但直接这样写肯定是不能执行的。
{% highlight javascript %}

var fs = require("fs");

function* unname(){

    var data1 = yield fs.readFile('path1');

    console.log(data1);

    var data2 = yield fs.readFile('path2');

    console.log(data2);
}

{% endhighlight %}

为了达到这个目的，我们必须借助其他工具函数，这个就是Co。 

{% highlight javascript %}

var fs = require("fs");

co(function*(){

    var data1 = yield readFile('path1');

    console.log(data1);

    var data2 = yield readFile('path2');

    console.log(data2);

});

function readFile( path ){
        
    return function(callback){
        
       fs.readFile( path , callback);

    }

}

function co( fn ) {
    
    var gen = fn();

    function next(err,data){
        
        var result = gen.next(data);

        if(!result.done){
                
            result.value(next);
            
        }

    }

    next();
    
}
{% endhighlight %}

上面的代码有两个关键点，一个是readfile函数的thunk化，还有就是co函数了，这里是最简单的实现。  
网上很多教程都忽略了这一点，就是Co中需要流程控制的函数，都必须要Thunk化或者Promise化。因为Promise相对于Thunk要复杂一点，这里只介绍Thunk化。  

所谓Thunk化就是将多参数函数，将其替换成单参数只接受回调函数作为唯一参数的版本 ，上面代码中的readFile就是个例子。  
原生的api是不支持thunk化的，所以就有了thunkify这个库帮我们把一些原生api thunk化。 

为什么要thunk化呢？由之前的分析我们可以知道，利用generator来实现异步回调的实质就是把,gen.next() 放入回调函数中，
thunk化之后，可以得到一个只接受callback的函数，换句话说，函数中除了callback其他都参数都已经传入了，callback里的内容就可以交给Co去决定！  

现在让我们来看下co里面的代码。第一次执行 gen.next() 返回的result.value 就是 fs.readFile thunk化后的函数，就是这样的一个函数

{% highlight javascript %}

function(callback){
        
    fs.readFile( 'path1',callback );

}

{% endhighlight %}

通过result.value(next)中，我们就可以在callback中执行 gen.next()，翻译过来是这样。 

{% highlight javascript %}

function(callback){
        
    fs.readFile( 'path1', next );

}

{% endhighlight %}

这样就达到了我们想要异步执行的效果!

上面代码中的co和thunk都是最简单的实现方式，代码中缺少诸如异常处理，非标准参数，多参数回调等判断，可以参考一下Co和thunkify，来实现。在Co的4.XX版本之后，内部的机制全部改为用Promise的实现，虽然看上去Promise是大势所趋，但是个人来说还是更喜欢Thunk的方式。等更深入学习Promise之后，会介绍Promise的实现方式。