---
layout: templates
title: CREATEJS使用方法
category: javascript
tag: javascript
summary: <p>最近项目里面用到了CREATEJS，为了方便记忆特此记录下来</p>
---

基础的使用方式这里不做多的介绍，根据官方DEMO和API文档很快就能上手，这里仅分享一下这次做小游戏时的一些思路和总结。

###1.技术选型
游戏规则是通过在限定时间内通过点击火球，来消灭火球来获得更高的分数。参考之前游戏的做法，游戏的主体部分对渲染速度和运行效率要求比较高，所以采用了以CREATEJS为引擎的方案，其他过场动画与选择界面则使用了DOM和CSS3来完成（选择界面中有许多文字，canvas中对文字的排版的表现并不如DOM和CSS3，而且CSS3动画完全可以满足除游戏主体外的需求，维护起来也简单一点）
###2.游戏的适配方案
先固定canvas的width为640，根据设备的高宽比设置对应640宽的高，然后用css将canvas的缩放或拉伸整个屏幕，这种方法可以保证canvas内部的元素的逻辑尺寸大小不发生变化，也能达到适配  
不过该方法也有缺陷，因为内部元素的位置无法确定，当横屏时，某些物件高度超过屏幕，显示不全。  


关于背景的适配
CREATEJS中并没有提供类似cover的方法来铺满背景，我采用的方法是当屏幕的高宽比大于背景图的高宽比时，以高度为标准来缩放，反之则以宽度为标准来缩放。
{% highlight javascript %}
		// 计算元素缩放比
		var imageWidth = imageData.hothead.width ,

			imageHeight = imageData.hothead.height

		if( imageWidth / imageHeight > width / height){ //按高度缩放

			data.percent = height / imageHeight ;

		}else {

			data.percent = width / imageWidth ;

		}
{% endhighlight %}

###3.游戏结构分析
从拿到的视觉稿来分析，游戏简单的分为三层，游戏的要求是，随着得分增高，杯子会慢慢结冰，背景也会发生变化，所以至少应该有三层变化。  

 第一层：背景层  

 第二层：杯子层  
 
 第三层：倒计时层  

 第四层：火焰层  

CREATEJS中各个层的显示顺序是按照添加进父级元素的顺序来显示，即最后添加的DisplayObject会位于最上层，目前没有找到有类似于z-index可以设置层级的方法，我们不能把所有元素直接添加到Stage下面，必须先建立一个Container容器来区分层级，并按显示顺序逐个添加进Stage里面，


###4.游戏内部运行机制

在绑定点击事件时，考虑到火球个数过多，所以选择了事件代理的方式，在Stage上绑定click事件，统一来监听。

{% highlight javascript %}
        Entity.stage.addEventListener("click", _clickEvent);
       
	function _clickEvent(event){

		var fire = event.target;

		if( 0 <= fire.id.toString().indexOf("fire") ){

			_clickFire(fire);

		}


	}
{% endhighlight %}

CREATEJS中，添加删除元素后，Stage上并不会立即就渲染出来，所以对各个元素作出修改后，不会立即更新画面，频繁的更新会导致渲染效率低下，只需要在每一帧中更新。对于胜负的检测，元素的改变，都应该放到每一帧去做计算，然后再更新Stage。
{% highlight javascript %}
createjs.Ticker.addEventListener("tick", handleTick);
{% endhighlight %}
###5 文档上没提到的坑

跨域
CREATEJS中某些方法是建立在getImageData之上的，引用跨域资源的时候这些方法会报错，文档上说设置image对象的crossOrigin可以解决，然而我们的服务器的并不支持相关跨域方案，所以并没有卵用。改成用base64或者传到一个非跨域的目录下吧。

图片响应区域  
点击Bitmap透明的区域不会触发该bitmap的Click事件。你可以使用Shape这个类，来代替Bitmap。  





###Summary
CREATEJS框架的内部一套类似DOM的结构和事件规则，上手非常容易，游戏的骨架一天就能做出，在运营活动的项目里面采用CREATEJS是一个很不错的解决方案。
