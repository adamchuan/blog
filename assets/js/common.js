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
		type :'get',
		success :callback
	})
}