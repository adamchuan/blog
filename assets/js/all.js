var $ = function(selector){
	var dom = document.querySelectorAll(selector);
	if(dom.length === 1){
		return dom[0];
	}else{
		var arr = [];
		Array.prototype.push.apply(arr,dom);
		return arr;
	}
};
$.throttle = function(callback,delay,mustrundealy){
	var timer = null,
		startDate = new Date() ;
	return function(){
		if(timer !== null){
			return ;
		}
		var nowDate = new Date();
		if(nowDate - startDate >= mustrundealy){
			startDate = nowDate;
			clearTimeout(timer);
			timer = null;
			callback();
		}else{
			timer = setTimeout(function(){
				timer = null;
				callback();
			},delay);
		}
	}
}
$.ajax = function(config){
	var url = config.url,
		method = config.method || 'get',
		success = config.success || function(str){console.log(str)},
		error = config.error || function(str){console.log(str)},
		async = typeof config.async === 'boolean' ? config.async : true,
		xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4){
			$.ajax.count -- ;
			if(xhr.status==200){
				success(xhr.responseText);
			}else{
				error(xhr.responseText);
			}
		}
	}
	xhr.open(method,url,true);
	xhr.send();
}
$.get = function(url,callback){
	$.ajax({
		url : url,
		type :'get',
		success :callback
	})
}
~function(){
		WINDOW_WIDTH = window.screen.availWidth,
		SCROLLTOP = function(){ return document.body.scrollTop || document.documentElement.scrollTop;}
	var control = {};
	control.init = function(){
		if( window.onhashchange ){
			window.onhashchange();
		}
		window.onscroll = control.pageScrollListener =  $.throttle(function(){
			control.pageScrollEvents.forEach(function(event,i){
				event();
			});
		},100,200);
		control.pageScrollEvents = [control.backtop,control.headerFixed];
		$(".btn-backtotop").addEventListener('click',function(){
			window.scrollTo(0,0);
		});
	}
	control.backtop = function(){
		if(SCROLLTOP() >= WINDOW_HEIGHT){
			$(".btn-backtotop").classList.remove("hide");
		}else{
			$(".btn-backtotop").classList.add("hide");
		}
	}
	control.headerFixed = (function(){
		var threshold = $(".header-nav").offsetTop +  $(".header-nav").offsetHeight;
		return function(){
			if(SCROLLTOP() >= threshold ){
				$(".header-menu").classList.add("fixed");
			}else{
				$(".header-menu").classList.remove("fixed");
			}
		}
	})();
	control.init();
};
var dom_articles = document.getElementById('articles'),
	dom_loadding = document.querySelector(".loadingLayer");
	
var article = {
	Map : {} , 
	List : [],
	Tags : {},
	loaddingTimer: null,
	loaddingQueue: [],
	loadingCount : 0,
	TempLate : {
		summary : $("#t_summary").innerHTML,
		post : $("#t_post").innerHTML,
		category : $("#t_category").innerHTML,
		tags : $("#t_tags").innerHTML,
		empty : $("#t_empty").innerHTML,
		loadding : $("#t_loadding").innerHTML
	},
	add : function(url,summary,category,tags,date,title){
		var that = this;
		var content =  {
			url: url,
			summary : summary,
			category : category,
			tags : tags.split(" "),
			title : title,
			date : date,
			loaded : false,
			index : that.List.length
		};
		this.Map[content.category] = article.Map[content.category] || [];
		this.Map[content.category].push(content);
		content.tags.forEach(function(tag){
			that.Tags[tag] = that.Tags[tag] || [];
			that.Tags[tag].push(content);
		});
		this.List.push(content);
	},

	showLoading : function(cb){
		if(article.loaddingTimer === null){
			dom_loadding.style.display = 'block';
			article.loaddingTimer = setInterval(function(){
				if(article.loadingCount === 0){
					clearInterval(article.loaddingTimer);
					article.loaddingTimer = null;
					dom_loadding.style.display = 'none';
					if(typeof cb === 'function')
					cb();
				}
			},1000);
		}
	},
	loadContent : function(i,cb){
		var content = this.List[i];
		article.loadingCount ++;
		article.showLoading();
		if(content.loaded){
			cb(content.html);
			article.loadingCount--;
		}else{
			$.get(content.url,function(data){
				content.loaded = true;
				content.html = data;
				article.loadingCount --;
				cb(content.html);
			},'html');
		}
	},
	nextpage:function(){

	},
	prepage:function(){

	}
}

// var BASE_URL = self.location.host,
// 	PAGE_INDEX = 1,
// 	PAGE_SIZE = 5, //每页显示文章数
// 	PAGE_COUNT, //文章总数  ,必须在加载文章后再计算
// 	PAGE_TYPE , //当前页的类型
// 	PAGE_LENGTH; //必须在加载文章后再计算

// var router = function(){
// 	PAGE_COUNT = article.List.length, 
// 	PAGE_LENGTH =  Math.ceil(PAGE_COUNT / PAGE_SIZE); 
// 	try{
// 		var state = location.href.match(/#.*/ig)[0].replace('#','');
// 	}
// 	catch(ex){
// 		state =  "home";
// 	}
// 	var handlerName = state.split('_')[0],
// 		handlerParam = state.split('_')[1] || "";
// 	if(typeof router.handler[handlerName] === 'undefined'){
// 		handlerName = 'empty';
// 	}
// 	$(".btn_wrap").forEach(function(div){
// 		div.classList.add("hide");
// 	});
// 	PAGE_TYPE = handlerName;
// 	router.handler[handlerName](handlerParam);
// 	window.scrollTo(0,0);
// }
// $(".btn_prev").addEventListener('click',function(){
// 	var newIndex = --PAGE_INDEX;
// 	if(PAGE_INDEX <= 0 ){
// 		newIndex = PAGE_LENGTH;
// 	}
// 	PAGE_INDEX = newIndex;
// 	self.location.hash = "#home_" + PAGE_INDEX;
// });
// $(".btn_next").addEventListener('click',function(){
// 	var newIndex = ++PAGE_INDEX;
// 	if(PAGE_INDEX > PAGE_LENGTH ){
// 		newIndex = 1;
// 	}
// 	PAGE_INDEX = newIndex;	
// 	self.location.hash = "#home_" + PAGE_INDEX;
// });
// router.handler = {
// 	'home' : function(pageindex){
// 		var html = "",
// 			content;
// 		if( /^-?\d+$/.test(pageindex) ){ //判断是不是数字
// 			pageindex = parseInt(pageindex); //转化成数字
// 		}else{
// 			pageindex = 1;
// 		}
// 		$(".btn_wrap").forEach(function(div){
// 			div.classList.remove("hide");
// 		});
// 		PAGE_INDEX = pageindex;
// 		for(var i = (PAGE_INDEX - 1) * PAGE_SIZE ; i < PAGE_INDEX  * PAGE_SIZE & i < PAGE_COUNT ; i++){
// 				content = article.List[i];
// 				html  +=  article.TempLate['summary'].replace(/__TITLE__/g,content.title)
// 							.replace(/__HREF__/g,content.url)
// 							.replace(/__DATE__/g," "+content.date)
// 							.replace(/__POSTS__/g,content.summary);
// 		}
// 		dom_articles.innerHTML = html;
// 	},
// 	'category' : function(){
// 		var html = "";
// 		for(var category in article.Map){
// 			html += "<dl class='category-container'><dt>" + category + "</dt>";
// 			article.Map[category].forEach(function(content){
// 				var tagHTML  = "";
// 				content.tags.forEach(function(tag){
// 					tagHTML += article.TempLate['tags'].replace(/__HREF__/g,"#tags_" + tag)
// 								.replace(/__TAGS__/g,tag);
// 				});
// 				html += article.TempLate['category'].replace(/__TITLE__/g,content.title)
// 						.replace(/__HREF__/g,content.url)
// 						.replace(/__DATE__/g," " + content.date)
// 						.replace(/__TAGSCOL__/g,tagHTML);
// 			});
// 			html += "</dl>";
// 		}
// 		dom_articles.innerHTML = html;
// 	},
// 	'work' : function(){
// 		$.get('works.html',function(html){
// 			dom_articles.innerHTML = html;
// 		},'html')
// 	},
// 	'empty' : function(){
// 		dom_articles.innerHTML = article.TempLate['empty'];
// 	},
// 	'tags' : function(tagName){
// 		var html = "<dl class='category-container'><dt>" + tagName + "</dt>"; 
// 		article.Tags[tagName].forEach(function(content){
// 			var tagHTML  = "";
// 			content.tags.forEach(function(tag){
// 				tagHTML += article.TempLate['tags'].replace(/__HREF__/g,"#tags_" + tag)
// 							.replace(/__TAGS__/g,tag);
// 			});
// 			html += article.TempLate['category'].replace(/__TITLE__/g,content.title)
// 					.replace(/__HREF__/g,content.url)
// 					.replace(/__DATE__/g,content.date)
// 					.replace(/__TAGSCOL__/g,tagHTML);
// 		});
// 		dom_articles.innerHTML = html;
// 	},
// 	'about' : function(){
// 		$.get('about.html',function(html){
// 			dom_articles.innerHTML = html;
// 		},'html')
// 	},
// 	'post' : function(postIndex){
// 		postIndex = parseInt(postIndex);
// 		var content = article.List[postIndex];
// 	    showPost = function(){

// 	    	var categorylink = "<a href='#category_" + content.category + "'>" + content.category + "</a>";
// 	    	var nextPost = article.List[(postIndex + 1 >= article.List.length) ? 0 : postIndex + 1];
// 	    	var prevPost = article.List[(postIndex - 1 < 0) ? article.List.length - 1 : postIndex - 1];
// 	    	//var nextlink = "<a href='#post_" + nextPost.index + "'>" + nextPost.title + "</a>";
// 	    	//var prevlink = "<a href='#post_" + prevPost.index + "'>" + prevPost.title + "</a>";
// 	    	var nextlink = "<a href='" + nextPost.url + "'>" + nextPost.title + "</a>";
// 	    	var prevlink = "<a href='" + prevPost.url + "'>" + prevPost.title + "</a>";
// 			var html  =  article.TempLate['post'].replace(/__TITLE__/g,content.title)
// 				.replace(/__HREF__/ig,'#post_' + postIndex)
// 				.replace(/__DATE__/ig,content.date)
// 				.replace(/__NEXTLINK__/ig,nextlink)
// 				.replace(/__PREVLINK__/ig,prevlink)
// 				.replace(/__CATEGORYLINK__/ig,categorylink)
// 				//.replace(/__CONTENTURL__/ig,content.url)
// 				.replace(/__POSTS__/ig,content.summary + content.html);


// 			dom_articles.innerHTML = html;
// 			uyan_config = {
// 			     'title':content.title, 
// 			     'url': "http://" + location.host + content.url
// 			};
// 			// uyan_c_g = null;
// 			// uyan_loaded = null;
// 			// uyan_login_stat_tmp = null;
// 			// uyan_s_g = null;
// 			// uyan_style_loaded = null;
// 			// uyan_style_loaded_over = null;
// 			// var script = document.createElement("script");
// 			// script.src = "http://api.uyan.cc/?url=" + encodeURI(uyan_config.url) +"&title=" + encodeURI(uyan_config.title) + "&du=&su=" + location.host + "&pic=&vid=&tag=&uid=1799216&acl=&lang=zh-cn&5336215710";
// 			// document.head.appendChild(script);
// 			// script.onload = function(){
// 			// 	document.head.removeChild(script);
// 			// 	script = null;
// 			// }
// 			// var iframedocument = $("#comment_iframe").contentWindow.document;
// 			// iframedocument.body.innerHTML = '<div id="uyan_frame"></div>'
// 			// iframedocument.appendChild(script);
// 			prettyPrint();
// 		}
// 		article.loadContent(postIndex,showPost);
// 	}
// };
// window.onhashchange = router;
