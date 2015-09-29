---
layout: templates
title: 有关坑，兼容性，经验的一些总结
category: javascript
tag: javascript css3
summary: <p>这是工作一年以来，自己工作中记录的一些东西,内容比较杂乱。</p>
---

1.button 绝对定位时 会把padding算入。 iphone4 ios6  

2.多栏布局 高度计算时会有bug  

3.安卓机 用tab吸顶时，如果position在fixed和absolute间切换会有问题  

4.canvas 的imageData 不会受globalCompositeOperation的影响  

5.所谓的多倍屛的实质，你看到的分辨率是320×480，实际上是640×960，也就是是说会花两个逻辑像素去渲染一个视觉像素，这就是retina屏幕。  

如果你只是在写css，你写下1px时表明，这个1px是最终呈现到视觉上的像素，这里面的转换关系底层渲染会帮助你。  

但是如果遇到图片时，如果你只提供320×480的图，那渲染时会将你扩大到64×960，毫无疑问一些图片肯定会变得模糊。


6.雪碧地图 sprite-map 和直接import图片是有区别的
import会导出所有sprite的样式，我是在做游戏的时候才会用，直接生成一个雪碧图和各个精灵的位置数据的css，然后对应background-position在游戏中使用该雪碧图。  

sprite-map有着更加精细的控制，用得更加多，在css中你需要用哪个精灵单独引用即可，不会有太多的冗余代码。  

另外 关于sprit-map有个小坑，如果你是第一次生成sprite-map，如果没有使用 background-image: $sprite，他会因还未生成雪碧图，还报错，
我现在的做法是import sprite-map之后，统一有一个类引用bakcground-image，来达到在第一时间生成雪碧图的目的,这样就不会报错了。  

{% highlight css %}
@import sprite-map("icon/*.png");
.createImg{
	background-image: $sprite;
}
{% endhighlight %}
7.安卓4.0的机器，touchend不触发的问题,需要在touchmove时使用e.preventDefault，也就时阻止滚动。  


8.三星安卓2.33 2.36 不支持 classList。

9.javascript不存在命名分组。

10.安卓2.3上table-cell的元素设置position:relative无效。

11.白色三星安卓2.36 使用transform:translate(-50%,-50%,0)在手q环境不生效不居中。

12.白色三星安卓2.36 box-shadow缩写支持不完全

13.为了兼容老版本的flexbox，除了申明flex以外还需要指定宽度width。  

父级已经指定了是flexbox，子级为了兼容应该申明display：block，不指定宽度的后果，是如果某一个子元素的文字过长，会挤压其他元素。

14.gulp中插件中的file对象是来自是[vinyl](https://github.com/wearefractal/vinyl) 这个库中的对象

15.gulp-ftp插件会出错。。 很奇怪的问题。 2015.2.6更新 似乎是底层ftp连接的问题

16.mongodb中的时间类型是ISODate 即为 UTC世界时间

17.mongodb是拿空间换效率，这是nosql的精髓，不能用传统的关系型数据库去设计，可能两个集合间的关系要在两个集合中都要存储。

18.mongoose使用连接查询的话  如要连接的字段不是所有数据都存在，会有问题 .populate

19.用 new Date()生成的字符串a1，在到moment中实例化时，会有时区误差，moment会把new Date生成的字符串当做世界时，然后自己加上时差。用new Date().getTime() 或者 new Date().getUTCString()则不会

20.mongoose中如果设置子文档的字段为unique，似乎会一直因为检查到有null无法插入新的？（ 不明白原理）

21.express 4以上的版本的中 中间件都要自己单独下载引入，也许是出于更灵活的考虑。  

常用中间件  
*  multer 文件上传
*  bodyParser格式化post参数
*  cookieParser格式化cookies
*  express-session session插件

22.sae中 channel 服务 
{% highlight php %}
$channel = new SaeChannel();
$url = $channel->createChannel($rd,60);
{% endhighlight %}
$rd 最好不要设置成固定的值，channel中转服务器似乎会有缓存，一旦上一次连接没有断开，之后的连接都无法生效。

23.扇形svg 
{% highlight html %}
<svg width="325px" height="325px">
	<path d="M45 0 A 45 45, 0, 1, 1, 0 45 L 45 45 Z" fill="green"></path>
	<path d="M230 80
	A 45 45, 0, 1, 0, 275 125
	L 275 80 Z" fill="red"/>
	<path d="M80 230
	A 45 45, 0, 0, 1, 125 275
	L 125 230 Z" fill="purple"/>
	<path d="M230 230
	A 45 45, 0, 1, 1, 275 275
	L 275 230 Z" fill="blue"/>
</svg>
{% endhighlight %}
修改svg 属性会引起reflow  

svg 设置 transform-origin iphone4 andrio4.2 上无效  

修改svg中的图形的transform也无效,2015.4.22补充，因为svg属性有种transform一项，所以依靠css中transform修改会有bug。  

svg animation中如果修改opacity也会无效，只能修改fill-opacity或stroken-opacity，如果要修改opacity的话，请使用css中的translation来做动画。

svg里的对象 iphone4 上不支持classList

24.chrome extension扩展文件中引用的 js对象中 是支持chrome 这个全局变量的。

25.transitionEnd animationEnd 是会冒泡的！！

26.iphone4 不支持动态添加svg

27.3d 变化不要一个用百分比 一个用具体单位，某些安卓手机会有问题
{% highlight css %}
@-webkit-keyframes marquee {
	0% {
		-webkit-transform: translate3d(54px, 0, 0)
	}
	100% {
		-webkit-transform: translate3d(-100%), 0, 0)
	}
}
{% endhighlight %}
28.华为,魅蓝note等一些安卓机上不支持 伪类元素上的animation。

29. swicthproxy切换规则网址 http://www.bxl.me/down/proxy/gfwlist.txt

30.Object.observe 不能检测到深层属性的改变如，
{% highlight javascript %}
a = {
    size : {
          width : width ,
           height : height 
     }
}
{% endhighlight %}
如果你监听的是Object.observe(a,function())
改变 a.size.width,不会触发监听事件，猜测Object能够响应的是 object里面的引用地址的改变。 

31.beforeunload在微信上不会执行 （ip6 ios8） 只执行unload。 而pc上刷新页面不会执行 unload，只会执行beforeunload

32.resize事件触发的时候不能立即计算scrollTop 相关的值，因为此时浏览器还未重新渲染 大概延迟1s再执行。

