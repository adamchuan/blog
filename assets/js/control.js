~function(){
	var WINDOW_HEIGHT = window.screen.availHeight,
		WINDOW_WIDTH = window.screen.availWidth,
		SCROLLTOP = function(){ return document.body.scrollTop || document.documentElement.scrollTop;}
	var control = {
		init : function(){
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
		},
		backtop : function(){
			if(SCROLLTOP() >= WINDOW_HEIGHT){
				$(".btn-backtotop").classList.remove("hide");
			}else{
				$(".btn-backtotop").classList.add("hide");
			}
		},
		headerFixed : ~function(){
			var threshold = $(".header-nav").offsetTop +  $(".header-nav").offsetHeight;
			return function(){
				if(SCROLLTOP() >= threshold ){
					$(".header-menu").classList.add("fixed");
				}else{
					$(".header-menu").classList.remove("fixed");
				}
			}
		}()
	}
	control.init();
}();